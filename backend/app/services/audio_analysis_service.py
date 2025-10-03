import librosa
import numpy as np
import io
from typing import Dict, Any

def analyze_audio(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Analyzes the given audio bytes to extract key audio features using librosa.
    """
    try:
        # Use a BytesIO object to allow librosa to read the in-memory audio data
        audio_stream = io.BytesIO(audio_bytes)

        # Load the audio data with librosa. `sr=None` preserves the original sample rate.
        y, sr = librosa.load(audio_stream, sr=None)

        # 1. Duration
        duration = librosa.get_duration(y=y, sr=sr)

        # 2. BPM (Tempo)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo)

        # 3. Energy (Root-Mean-Square Energy)
        rms = librosa.feature.rms(y=y)
        avg_energy = np.mean(rms)
        # Normalize energy to a 0-1 scale. This is a simple approach and may need tuning.
        normalized_energy = float(np.clip(avg_energy * 5, 0, 1))

        # 4. Spectral Centroid
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        avg_spectral_centroid = float(np.mean(spectral_centroid))

        # 5. Spectral Flux (calculated from onset strength)
        onset_env = librosa.onset.onset_detect(y=y, sr=sr, wait=1, pre_avg=1, post_avg=1, pre_max=1, post_max=1)
        # Using the mean of the onset detection function as a proxy for spectral flux
        spectral_flux = float(np.mean(onset_env))

        # Placeholder for frame-by-frame analysis, to be implemented if needed
        # by the frontend visualizer in the future.
        frame_analyses = []

        return {
            "duration": duration,
            "bpm": bpm,
            "energy": normalized_energy,
            "spectralCentroid": avg_spectral_centroid,
            "spectralFlux": spectral_flux,
            "frameAnalyses": frame_analyses
        }

    except Exception as e:
        print(f"Error during audio analysis: {e}")
        # Provide sensible defaults if analysis fails to ensure the application doesn't crash.
        return {
            "duration": 120.0,
            "bpm": 120.0,
            "energy": 0.5,
            "spectralCentroid": 1500.0,
            "spectralFlux": 0.1,
            "frameAnalyses": []
        }