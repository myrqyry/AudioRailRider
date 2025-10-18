import pytest
from unittest.mock import patch
from app.services.audio_analysis_service import _analyze_audio_sync
import librosa

def test_analyze_audio_sync_unexpected_error():
    """
    Test that a non-librosa error is not caught and re-raised as an HTTPException.
    """
    with patch('librosa.load', side_effect=ValueError("A simulated unexpected error")):
        with pytest.raises(ValueError, match="A simulated unexpected error"):
            _analyze_audio_sync(b"fake_audio_data")

def test_analyze_audio_sync_librosa_error():
    """
    Test that a librosa error is caught and re-raised as an HTTPException.
    """
    with patch('librosa.load', side_effect=librosa.LibrosaError("A simulated librosa error")):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc_info:
            _analyze_audio_sync(b"fake_audio_data")
        assert exc_info.value.status_code == 400
        assert "Audio processing failed" in exc_info.value.detail