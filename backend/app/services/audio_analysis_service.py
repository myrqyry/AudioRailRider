import asyncio
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
WORKERS = max(1, (os.cpu_count() or 4))
audio_analysis_executor = ThreadPoolExecutor(max_workers=WORKERS)

# Register atexit shutdown to avoid dangling threads in some environments
try:
    from atexit import register as _register_atexit

    def _shutdown_executor():
        try:
            audio_analysis_executor.shutdown(wait=False)
        except Exception:
            pass

    _register_atexit(_shutdown_executor)
except Exception:
    # atexit isn't critical; ignore registration failures
    pass


def _extract_emotional_fingerprint(y: 'numpy.ndarray', sr: float) -> Dict[str, Any]:
    """
    Extracts a deeper emotional fingerprint from the audio.
    """
    import librosa
    import numpy as np

    # Harmonic-percussive separation
    harmonic, percussive = librosa.effects.hpss(y)

    # Tonal tension analysis (simplified)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    tonal_tension_curve = np.std(chroma, axis=0)

    # Emotional valence (simplified)
    tonnetz = librosa.feature.tonnetz(y=harmonic, sr=sr)
    valence_curve = np.mean(tonnetz, axis=0)

    # Rhythmic complexity
    onset_strength = librosa.onset.onset_strength(y=y, sr=sr)

    y_mean_squared = np.mean(y**2)
    # Avoid division by zero for silent audio
    harmonic_dominance = np.mean(harmonic**2) / y_mean_squared if y_mean_squared > 1e-10 else 0.0
    percussive_energy = np.mean(percussive**2) / y_mean_squared if y_mean_squared > 1e-10 else 0.0

    return {
        'tonal_tension': float(np.mean(tonal_tension_curve)),
        'valence_curve': float(np.mean(valence_curve)),
        'rhythmic_complexity': float(np.mean(onset_strength)),
        'textural_separation': {
            'harmonic_dominance': float(harmonic_dominance),
            'percussive_energy': float(percussive_energy)
        }
    }


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
        # Lazy import heavy dependencies to avoid import-time failures
        import librosa
        import numpy as np

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

        # --- Frame-by-Frame Analysis (vectorized) ---
        # Use smaller FFT to reduce cost
        n_fft = 1024
        hop_length = 512

        S = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=hop_length))
        freqs = librosa.fft_frequencies(sr=sr, n_fft=n_fft)

        # Guard against empty-frame result (very short or silent audio)
        num_frames = S.shape[1] if S.ndim >= 2 else 0
        if num_frames == 0:
            # Return safe defaults
            return {
                "duration": duration,
                "bpm": float(120.0),
                "energy": 0.0,
                "spectralCentroid": 0.0,
                "spectralFlux": 0.0,
                "frameAnalyses": []
            }

        bass_cutoff = 250
        mid_cutoff = 4000

        bass_bins = np.where(freqs <= bass_cutoff)[0]
        mid_bins = np.where((freqs > bass_cutoff) & (freqs <= mid_cutoff))[0]
        high_bins = np.where(freqs > mid_cutoff)[0]

        # Vectorized band energy per frame
        # handle empty bin cases defensively
        max_s = max(np.max(S), 1e-10) if S.size > 0 else 1e-10
        bass_energy = S[bass_bins, :].mean(axis=0) if bass_bins.size > 0 else np.zeros(S.shape[1])
        mid_energy = S[mid_bins, :].mean(axis=0) if mid_bins.size > 0 else np.zeros(S.shape[1])
        high_energy = S[high_bins, :].mean(axis=0) if high_bins.size > 0 else np.zeros(S.shape[1])

        bass = np.clip(bass_energy / max_s, 0, 1)
        mid = np.clip(mid_energy / max_s, 0, 1)
        high = np.clip(high_energy / max_s, 0, 1)

        times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop_length)
        rms_frames = librosa.feature.rms(S=S, frame_length=n_fft, hop_length=hop_length)[0]
        spectral_centroid_frames = librosa.feature.spectral_centroid(S=S, sr=sr, n_fft=n_fft, hop_length=hop_length)[0]
        spectral_flux = np.abs(np.diff(spectral_centroid_frames, prepend=spectral_centroid_frames[0]))

        # Build frame analyses list (convert to Python types)
        frame_analyses: List[Dict[str, float]] = []
        for i in range(S.shape[1]):
            frame_analyses.append({
                "timestamp": float(times[i]),
                "energy": float(rms_frames[i]) if i < len(rms_frames) else 0.0,
                "spectralCentroid": float(spectral_centroid_frames[i]) if i < len(spectral_centroid_frames) else 0.0,
                "spectralFlux": float(spectral_flux[i]) if i < len(spectral_flux) else 0.0,
                "bass": float(bass[i]) if i < len(bass) else 0.0,
                "mid": float(mid[i]) if i < len(mid) else 0.0,
                "high": float(high[i]) if i < len(high) else 0.0,
            })

        avg_energy = np.mean([f['energy'] for f in frame_analyses]) if frame_analyses else 0
        normalized_energy = float(np.clip(avg_energy * 5, 0, 1))
        avg_spectral_centroid = float(np.mean([f['spectralCentroid'] for f in frame_analyses])) if frame_analyses else 0
        avg_spectral_flux = float(np.mean([f['spectralFlux'] for f in frame_analyses])) if frame_analyses else 0

        # Extract emotional fingerprint
        emotional_fingerprint = _extract_emotional_fingerprint(y, sr)

        logger.info(
            "Audio analysis complete",
            duration_s=round(duration, 1),
            frame_count=len(frame_analyses),
            bpm=round(bpm, 1)
        )

        features = {
            "duration": duration,
            "bpm": bpm,
            "energy": normalized_energy,
            "spectralCentroid": avg_spectral_centroid,
            "spectralFlux": avg_spectral_flux,
            "frameAnalyses": frame_analyses,
            "emotional_fingerprint": emotional_fingerprint
        }

        return features
    # Catch specific, expected errors from audio processing
    except librosa.LibrosaError as e:
        logger.error("Librosa error during audio analysis", error=str(e), exc_info=True)
        # Re-raise as HTTPException so the API can return a 400 Bad Request
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {e}")
    except Exception as e:
        logger.error("Unexpected error during audio analysis", error=str(e), exc_info=True)
        # For unexpected errors, it's better to return a 500 Internal Server Error
        raise

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
    loop = asyncio.get_running_loop()
    # Use a specific, bounded executor to prevent resource exhaustion
    return await loop.run_in_executor(audio_analysis_executor, _analyze_audio_sync, audio_bytes)
