import pytest
from unittest.mock import patch
from app.services.audio_analysis_service import _analyze_audio_sync, AudioAnalysisError, analyze_audio
import librosa

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

@pytest.mark.anyio
async def test_analyze_audio_raises_http_exception_on_analysis_error():
    """
    Test that the async wrapper raises HTTPException when AudioAnalysisError is caught.
    """
    with patch('app.services.audio_analysis_service._analyze_audio_sync', side_effect=AudioAnalysisError("Test error")):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc_info:
            await analyze_audio(b"fake_audio_data")
        assert exc_info.value.status_code == 400
        assert "Test error" in exc_info.value.detail