import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.gemini_service import TrackGeneratorService, GeminiService

@pytest.fixture
def mock_gemini_service():
    """Mocks the GeminiService."""
    mock = MagicMock(spec=GeminiService)
    mock.generate_layout = AsyncMock(return_value={
        "ride_name": "Test Ride",
        "mood_description": "A test ride.",
        "palette": ["#ffffff", "#000000", "#ff0000"],
        "segments": [
            {"segment_type": "climb", "duration_percentage": 50, "intensity": 50},
            {"segment_type": "drop", "duration_percentage": 50, "intensity": 75},
        ]
    })
    mock.generate_detailed_segment = AsyncMock(side_effect=[
        {"component": "climb", "length": 100, "angle": 10},
        {"component": "drop", "length": 100, "angle": -45},
    ])
    return mock

@pytest.mark.anyio
async def test_generate_full_blueprint(mock_gemini_service, monkeypatch):
    """
    Tests that the TrackGeneratorService correctly orchestrates the blueprint generation.
    """
    # Mock analyze_audio to prevent it from actually running
    async def fake_analyze_audio(b):
        return {
            "duration": 120, "bpm": 120, "energy": 0.5,
            "spectralCentroid": 1500, "spectralFlux": 0.5, "frameAnalyses": []
        }
    monkeypatch.setattr('app.services.gemini_service.analyze_audio', fake_analyze_audio)

    track_generator = TrackGeneratorService(mock_gemini_service)
    audio_bytes = b"fake audio data"
    content_type = "audio/mpeg"
    options = {"worldTheme": "fantasy"}

    result = await track_generator.generate_full_blueprint(audio_bytes, content_type, options)

    assert "blueprint" in result
    assert "features" in result
    assert result["blueprint"]["rideName"] == "Test Ride"
    assert len(result["blueprint"]["track"]) == 2
    assert result["blueprint"]["track"][0]["component"] == "climb"
    assert result["blueprint"]["track"][1]["component"] == "drop"

    mock_gemini_service.generate_layout.assert_called_once()
    assert mock_gemini_service.generate_detailed_segment.call_count == 2