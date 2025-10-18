import asyncio
import librosa
import numpy as np
import io
import os
import structlog
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, List
from fastapi import HTTPException

# Configure logging
logger = structlog.get_logger(__name__)

# Create a bounded thread pool executor for CPU-bound audio analysis tasks.
# Using os.cpu_count() is a good practice for CPU-bound tasks.
# Default to 4 if cpu_count() is not available or to have a baseline.
WORKERS = os.cpu_count() or 4
audio_analysis_executor = ThreadPoolExecutor(max_workers=WORKERS)


def _analyze_audio_sync(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Performs synchronous audio analysis on a byte stream.

    This function uses librosa to extract features like duration, BPM, and a
    series of frame-by-frame analyses. It's designed to be run in a separate
    thread to avoid blocking the main asyncio event loop.

    Args:
        audio_bytes: The raw bytes of the audio file.

    Returns:
        A dictionary containing the extracted audio features.

    Raises:
        HTTPException: If audio processing fails due to a known `librosa`
                       error (400) or an unexpected error (500).
    """
    try:
        audio_stream = io.BytesIO(audio_bytes)
        # Resample to a lower sample rate to speed up STFT and feature extraction.
        target_sr = 22050
        y, sr = librosa.load(audio_stream, sr=target_sr, mono=True)
        duration = float(librosa.get_duration(y=y, sr=sr))

        # Cap analysis length to avoid long processing times (seconds)
        MAX_ANALYZE_SECONDS = 120
        if duration > MAX_ANALYZE_SECONDS:
            max_samples = int(MAX_ANALYZE_SECONDS * sr)
            y = y[:max_samples]
            duration = MAX_ANALYZE_SECONDS  # Use the limit directly

        # BPM estimation (fast path)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo) if tempo else 120.0

        # Harmonic/Percussive Separation
        y_harmonic, y_percussive = librosa.effects.hpss(y)

        # --- Frame-by-Frame Analysis (vectorized) ---
        # Use smaller FFT to reduce cost
        n_fft = 1024
        hop_length = 512

        S = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=hop_length))
        freqs = librosa.fft_frequencies(sr=sr, n_fft=n_fft)

        bass_cutoff = 250
        mid_cutoff = 4000

        bass_bins = np.where(freqs <= bass_cutoff)[0]
        mid_bins = np.where((freqs > bass_cutoff) & (freqs <= mid_cutoff))[0]
        high_bins = np.where(freqs > mid_cutoff)[0]

        # Vectorized band energy per frame
        # handle empty bin cases defensively
        maxS = max(np.max(S), 1e-10) if S.size > 0 else 1e-10
        bass_energy = S[bass_bins, :].mean(axis=0) if bass_bins.size > 0 else np.zeros(S.shape[1])
        mid_energy = S[mid_bins, :].mean(axis=0) if mid_bins.size > 0 else np.zeros(S.shape[1])
        high_energy = S[high_bins, :].mean(axis=0) if high_bins.size > 0 else np.zeros(S.shape[1])

        bass = np.clip(bass_energy / maxS, 0, 1)
        mid = np.clip(mid_energy / maxS, 0, 1)
        high = np.clip(high_energy / maxS, 0, 1)

        times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop_length)
        rms_frames = librosa.feature.rms(S=S, frame_length=n_fft, hop_length=hop_length)[0]
        spectral_centroid_frames = librosa.feature.spectral_centroid(S=S, sr=sr, n_fft=n_fft, hop_length=hop_length)[0]
        spectral_rolloff_frames = librosa.feature.spectral_rolloff(S=S, sr=sr, n_fft=n_fft, hop_length=hop_length)[0]
        spectral_flatness_frames = librosa.feature.spectral_flatness(S=S)[0]
        spectral_flux = np.abs(np.diff(spectral_centroid_frames, prepend=spectral_centroid_frames[0]))

        # Analyze harmonic and percussive components
        S_harmonic = np.abs(librosa.stft(y_harmonic, n_fft=n_fft, hop_length=hop_length))
        S_percussive = np.abs(librosa.stft(y_percussive, n_fft=n_fft, hop_length=hop_length))
        harmonic_energy_frames = librosa.feature.rms(S=S_harmonic, frame_length=n_fft, hop_length=hop_length)[0]
        percussive_energy_frames = librosa.feature.rms(S=S_percussive, frame_length=n_fft, hop_length=hop_length)[0]


        # Build frame analyses list (convert to Python types)
        frame_analyses: List[Dict[str, float]] = []
        for i in range(S.shape[1]):
            frame_analyses.append({
                "timestamp": float(times[i]),
                "energy": float(rms_frames[i]) if i < len(rms_frames) else 0.0,
                "harmonicEnergy": float(harmonic_energy_frames[i]) if i < len(harmonic_energy_frames) else 0.0,
                "percussiveEnergy": float(percussive_energy_frames[i]) if i < len(percussive_energy_frames) else 0.0,
                "spectralCentroid": float(spectral_centroid_frames[i]) if i < len(spectral_centroid_frames) else 0.0,
                "spectralRolloff": float(spectral_rolloff_frames[i]) if i < len(spectral_rolloff_frames) else 0.0,
                "spectralFlatness": float(spectral_flatness_frames[i]) if i < len(spectral_flatness_frames) else 0.0,
                "spectralFlux": float(spectral_flux[i]) if i < len(spectral_flux) else 0.0,
                "bass": float(bass[i]) if i < len(bass) else 0.0,
                "mid": float(mid[i]) if i < len(mid) else 0.0,
                "high": float(high[i]) if i < len(high) else 0.0,
            })

        avg_energy = np.mean([f['energy'] for f in frame_analyses]) if frame_analyses else 0
        normalized_energy = float(np.clip(avg_energy * 5, 0, 1))
        avg_harmonic_energy = float(np.mean([f['harmonicEnergy'] for f in frame_analyses])) if frame_analyses else 0
        avg_percussive_energy = float(np.mean([f['percussiveEnergy'] for f in frame_analyses])) if frame_analyses else 0
        avg_spectral_centroid = float(np.mean([f['spectralCentroid'] for f in frame_analyses])) if frame_analyses else 0
        avg_spectral_rolloff = float(np.mean([f['spectralRolloff'] for f in frame_analyses])) if frame_analyses else 0
        avg_spectral_flatness = float(np.mean([f['spectralFlatness'] for f in frame_analyses])) if frame_analyses else 0
        avg_spectral_flux = float(np.mean([f['spectralFlux'] for f in frame_analyses])) if frame_analyses else 0

        # --- Pitch and Key Detection ---
        # NOTE: This is a simplified key detection algorithm based on template matching
        # (Krumhansl-Schmuckler). It is fast but may not be accurate for all genres
        # or songs with complex harmonic structures.
        chroma = librosa.feature.chroma_stft(S=S, sr=sr)
        # Use a key detection algorithm (e.g., Krumhansl-Schmuckler)
        # Sum chroma features across time for a global estimate
        chroma_sum = np.sum(chroma, axis=1)
        # Simple correlation-based key detection
        major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
        minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])

        major_correlations = np.array([np.corrcoef(chroma_sum, np.roll(major_profile, i))[0, 1] for i in range(12)])
        minor_correlations = np.array([np.corrcoef(chroma_sum, np.roll(minor_profile, i))[0, 1] for i in range(12)])

        best_major_key_idx = np.argmax(major_correlations)
        best_minor_key_idx = np.argmax(minor_correlations)

        if major_correlations[best_major_key_idx] > minor_correlations[best_minor_key_idx]:
            key = librosa.midi_to_note(best_major_key_idx, octave=False) + " Major"
        else:
            key = librosa.midi_to_note(best_minor_key_idx, octave=False) + " Minor"

        # --- Temporal Analysis ---
        onset_frames = librosa.onset.onset_detect(y=y, sr=sr, wait=1, pre_avg=1, post_avg=1, post_max=1, delta=0.2)
        onset_times = librosa.frames_to_time(onset_frames, sr=sr).tolist()

        # Time-varying tempo
        tempogram = librosa.feature.tempogram(y=y, sr=sr, hop_length=hop_length)
        tempo_curve = librosa.feature.tempo(y=y, sr=sr, hop_length=hop_length, aggregate=None)

        tempo_analyses: List[Dict[str, float]] = []
        for i, tempo_value in enumerate(tempo_curve):
            tempo_analyses.append({
                "timestamp": float(times[i]) if i < len(times) else 0.0,
                "tempo": float(tempo_value),
            })

        # Structural segmentation
        chroma_for_segmentation = librosa.feature.chroma_cqt(y=y, sr=sr)
        segment_boundaries = librosa.segment.agglomerative(chroma_for_segmentation, k=10) # k is a target number of segments
        segment_times = librosa.frames_to_time(segment_boundaries, sr=sr).tolist()


        logger.info(
            "Audio analysis complete",
            duration_s=round(duration, 1),
            frame_count=len(frame_analyses),
            bpm=round(bpm, 1)
        )

        return {
            "duration": duration,
            "bpm": bpm,
            "key": key,
            "energy": normalized_energy,
            "harmonicEnergy": avg_harmonic_energy,
            "percussiveEnergy": avg_percussive_energy,
            "spectralCentroid": avg_spectral_centroid,
            "spectralRolloff": avg_spectral_rolloff,
            "spectralFlatness": avg_spectral_flatness,
            "spectralFlux": avg_spectral_flux,
            "onsetTimes": onset_times,
            "tempoCurve": tempo_analyses,
            "structuralSegments": segment_times,
            "frameAnalyses": frame_analyses
        }
    # Catch specific, expected errors from audio processing
    except librosa.LibrosaError as e:
        logger.error("Librosa error during audio analysis", error=str(e), exc_info=True)
        # Re-raise as HTTPException so the API can return a 400 Bad Request
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {e}")
    except Exception as e:
        logger.error("Unexpected error during audio analysis", error=str(e), exc_info=True)
        # For unexpected errors, it's better to return a 500 Internal Server Error
        raise HTTPException(status_code=500, detail="An unexpected error occurred during audio analysis.")

async def analyze_audio(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Asynchronously analyzes an audio byte stream.

    This function offloads the CPU-bound `_analyze_audio_sync` function to a
    separate thread pool to avoid blocking the main asyncio event loop, ensuring
    the server remains responsive.

    Args:
        audio_bytes: The raw bytes of the audio file.

    Returns:
        A dictionary containing the extracted audio features.
    """
    loop = asyncio.get_event_loop()
    # Use a specific, bounded executor to prevent resource exhaustion
    return await loop.run_in_executor(audio_analysis_executor, _analyze_audio_sync, audio_bytes)
