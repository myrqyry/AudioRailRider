import librosa
import numpy as np
import io
from typing import Dict, Any, List

def analyze_audio(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Analyze audio with a faster, safer path that resamples and caps very
    long files to avoid excessive CPU/time during analysis.
    """
    try:
        audio_stream = io.BytesIO(audio_bytes)
        # Resample to a lower sample rate to speed up STFT and feature extraction.
        target_sr = 22050
        y, sr = librosa.load(audio_stream, sr=target_sr, mono=True)

        # Cap analysis length to avoid long processing times (seconds)
        MAX_ANALYZE_SECONDS = 120
        duration = float(librosa.get_duration(y=y, sr=sr))
        if duration > MAX_ANALYZE_SECONDS:
            max_samples = int(MAX_ANALYZE_SECONDS * sr)
            y = y[:max_samples]
            duration = float(librosa.get_duration(y=y, sr=sr))

        # BPM estimation (fast path)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo) if tempo else 120.0

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
        maxS = np.max(S) if S.size > 0 else 1.0
        bass_energy = S[bass_bins, :].mean(axis=0) if bass_bins.size > 0 else np.zeros(S.shape[1])
        mid_energy = S[mid_bins, :].mean(axis=0) if mid_bins.size > 0 else np.zeros(S.shape[1])
        high_energy = S[high_bins, :].mean(axis=0) if high_bins.size > 0 else np.zeros(S.shape[1])

        bass = np.clip(bass_energy / (maxS + 1e-6), 0, 1)
        mid = np.clip(mid_energy / (maxS + 1e-6), 0, 1)
        high = np.clip(high_energy / (maxS + 1e-6), 0, 1)

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

        print(f"[audio_analysis] analyzed duration={duration:.1f}s frames={len(frame_analyses)} sr={sr} n_fft={n_fft} hop={hop_length}")

        return {
            "duration": duration,
            "bpm": bpm,
            "energy": normalized_energy,
            "spectralCentroid": avg_spectral_centroid,
            "spectralFlux": avg_spectral_flux,
            "frameAnalyses": frame_analyses
        }

    except Exception as e:
        print(f"Error during audio analysis: {e}")
        return {
            "duration": 120.0, "bpm": 120.0, "energy": 0.5,
            "spectralCentroid": 1500.0, "spectralFlux": 0.1, "frameAnalyses": []
        }