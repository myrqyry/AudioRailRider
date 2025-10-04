import librosa
import numpy as np
import io
from typing import Dict, Any, List

def analyze_audio(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Analyzes the given audio bytes to extract key audio features using librosa,
    including frame-by-frame analysis of frequency bands (bass, mid, high).
    """
    try:
        audio_stream = io.BytesIO(audio_bytes)
        y, sr = librosa.load(audio_stream, sr=None)

        # --- Overall Features ---
        duration = librosa.get_duration(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo) if tempo else 120.0

        # --- Frame-by-Frame Analysis ---
        n_fft = 2048
        hop_length = 512

        # Get the short-time Fourier transform (STFT)
        S = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=hop_length))

        # Get the frequencies for each STFT bin
        freqs = librosa.fft_frequencies(sr=sr, n_fft=n_fft)

        # Define frequency band boundaries
        bass_cutoff = 250  # Hz
        mid_cutoff = 4000 # Hz

        # Find the indices corresponding to these cutoffs
        bass_bins = np.where(freqs <= bass_cutoff)[0]
        mid_bins = np.where((freqs > bass_cutoff) & (freqs <= mid_cutoff))[0]
        high_bins = np.where(freqs > mid_cutoff)[0]

        frame_analyses: List[Dict[str, float]] = []

        # Calculate features for each frame
        times = librosa.frames_to_time(range(S.shape[1]), sr=sr, hop_length=hop_length)

        # Pre-calculate RMS energy and spectral centroid for all frames
        rms_frames = librosa.feature.rms(S=S)[0]
        spectral_centroid_frames = librosa.feature.spectral_centroid(S=S, sr=sr, n_fft=n_fft, hop_length=hop_length)[0]

        prev_centroid = 0.0

        for i in range(S.shape[1]):
            frame_spectrum = S[:, i]

            # Calculate bass, mid, and high energy for the frame
            bass_energy = np.mean(frame_spectrum[bass_bins])
            mid_energy = np.mean(frame_spectrum[mid_bins])
            high_energy = np.mean(frame_spectrum[high_bins])

            # Normalize values (simple normalization, can be tuned)
            # These values are relative and used for visualization modulation
            bass = np.clip(bass_energy / (np.max(S) + 1e-6), 0, 1)
            mid = np.clip(mid_energy / (np.max(S) + 1e-6), 0, 1)
            high = np.clip(high_energy / (np.max(S) + 1e-6), 0, 1)

            # Get other per-frame features
            energy = rms_frames[i]
            spectral_centroid = spectral_centroid_frames[i]
            spectral_flux = abs(spectral_centroid - prev_centroid) if i > 0 else 0
            prev_centroid = spectral_centroid

            frame_analyses.append({
                "timestamp": times[i],
                "energy": float(energy),
                "spectralCentroid": float(spectral_centroid),
                "spectralFlux": float(spectral_flux),
                "bass": float(bass),
                "mid": float(mid),
                "high": float(high),
            })

        # Calculate overall averages
        avg_energy = np.mean([f['energy'] for f in frame_analyses])
        normalized_energy = float(np.clip(avg_energy * 5, 0, 1))
        avg_spectral_centroid = np.mean([f['spectralCentroid'] for f in frame_analyses])
        avg_spectral_flux = np.mean([f['spectralFlux'] for f in frame_analyses])

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
        # Provide sensible defaults if analysis fails
        return {
            "duration": 120.0,
            "bpm": 120.0,
            "energy": 0.5,
            "spectralCentroid": 1500.0,
            "spectralFlux": 0.1,
            "frameAnalyses": []
        }