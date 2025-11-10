import pytest
from unittest.mock import patch

import librosa
import numpy as np

from app.config.settings import settings
from app.services.audio_analysis_service import _analyze_audio_sync, AudioAnalysisError, analyze_audio

def test_analyze_audio_sync_raises_audio_analysis_error_on_value_error():
    """
    Test that a non-librosa error is wrapped in AudioAnalysisError.
    """
    with patch('librosa.load', side_effect=ValueError("A simulated unexpected error")):
        with pytest.raises(AudioAnalysisError, match="Failed to decode audio: A simulated unexpected error"):
            _analyze_audio_sync(b"fake_audio_data")

def test_analyze_audio_sync_raises_audio_analysis_error_on_librosa_error():
    """
    Test that a librosa error is wrapped in AudioAnalysisError.
    """
    with patch('librosa.load', side_effect=librosa.LibrosaError("A simulated librosa error")):
        with pytest.raises(AudioAnalysisError, match="Failed to decode audio: A simulated librosa error"):
            _analyze_audio_sync(b"fake_audio_data")


def test_frame_analysis_uses_configured_fft_and_hop(monkeypatch):
    """Ensure frame-level spectral features reuse configured FFT parameters."""
    sr = 22050
    n_fft_cfg = settings.audio_analysis.n_fft
    hop_cfg = settings.audio_analysis.hop_length
    frame_count = 6

    audio = np.ones(sr, dtype=np.float32)
    spectrogram = np.ones((n_fft_cfg // 2 + 1, frame_count), dtype=np.float32)

    monkeypatch.setattr(librosa, 'load', lambda *args, **kwargs: (audio, sr))
    monkeypatch.setattr(librosa.beat, 'beat_track', lambda *args, **kwargs: (120.0, np.array([])))

    def fake_stft(y, n_fft, hop_length):
        assert n_fft == n_fft_cfg
        assert hop_length == hop_cfg
        return spectrogram

    monkeypatch.setattr(librosa, 'stft', fake_stft)
    monkeypatch.setattr(librosa, 'fft_frequencies', lambda sr, n_fft: np.linspace(0, sr / 2, spectrogram.shape[0]))
    monkeypatch.setattr(librosa, 'frames_to_time', lambda frames, sr, hop_length: np.asarray(frames) * hop_cfg / sr)

    rms_calls: list[tuple[int, int]] = []

    def fake_rms(*, S, frame_length, hop_length, **kwargs):
        rms_calls.append((frame_length, hop_length))
        return np.ones((1, S.shape[1]), dtype=np.float32)

    monkeypatch.setattr(librosa.feature, 'rms', fake_rms)

    def fake_centroid(*, S, sr, n_fft, hop_length, **kwargs):
        assert n_fft == n_fft_cfg
        assert hop_length == hop_cfg
        return np.ones((1, S.shape[1]), dtype=np.float32)

    monkeypatch.setattr(librosa.feature, 'spectral_centroid', fake_centroid)

    monkeypatch.setattr(
        'app.services.audio_analysis_service._extract_emotional_fingerprint',
        lambda y, sr: {
            'tonal_tension': 0.0,
            'valence_curve': 0.0,
            'rhythmic_complexity': 0.0,
            'textural_separation': {'harmonic_dominance': 0.0, 'percussive_energy': 0.0}
        }
    )

    features = _analyze_audio_sync(b"pretend-audio")

    assert rms_calls == [(n_fft_cfg, hop_cfg)]
    assert features['frameAnalyses'], "Frame analyses should be generated when spectrogram is available."
    assert len(features['frameAnalyses']) == frame_count

@pytest.mark.anyio
async def test_analyze_audio_raises_http_exception_on_analysis_error():
    """
    Test that the async wrapper raises HTTPException when the executor surfaces AudioAnalysisError.
    """
    from fastapi import HTTPException

    async def raise_error(*_args, **_kwargs):
        raise AudioAnalysisError("Test error")

    with patch('app.services.audio_analysis_service.audio_analysis_executor.submit_bounded', new=raise_error):
        with pytest.raises(HTTPException) as exc_info:
            await analyze_audio(b"fake_audio_data")

    assert exc_info.value.status_code == 400
    assert "Test error" in exc_info.value.detail