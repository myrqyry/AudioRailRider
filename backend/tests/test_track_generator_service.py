import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.gemini_service import TrackGeneratorService, GeminiService

@pytest.fixture
def mock_gemini_service():
    """Mocks the GeminiService."""
    return MagicMock(spec=GeminiService)

@pytest.mark.anyio
async def test_generate_full_blueprint_high_energy(mock_gemini_service, monkeypatch):
    """
    Tests that the behavior tree selects the 'drop' generator for high-energy audio.
    """
    async def fake_analyze_audio(b):
        return {"duration": 120, "bpm": 150, "energy": 0.7, "spectralCentroid": 2000, "spectralFlux": 0.8, "frameAnalyses": []}
    monkeypatch.setattr('app.services.gemini_service.analyze_audio', fake_analyze_audio)

    mock_gemini_service.generate_layout = AsyncMock(return_value={
        "ride_name": "Test Ride", "mood_description": "A test ride.", "palette": ["#ffffff", "#000000", "#ff0000"],
        "segments": [{"segment_type": "climb", "duration_percentage": 100, "intensity": 75}]
    })
    mock_gemini_service.generate_detailed_segment = AsyncMock(return_value={"component": "drop", "length": 100, "angle": -45})

    track_generator = TrackGeneratorService(mock_gemini_service)
    audio_bytes = b"fake high energy audio data"
    content_type = "audio/mpeg"
    options = {"worldTheme": "fantasy"}

    result = await track_generator.generate_full_blueprint(audio_bytes, content_type, options)

    assert result["blueprint"]["track"][0]["component"] == "drop"
    mock_gemini_service.generate_detailed_segment.assert_called_once()

@pytest.mark.anyio
async def test_generate_full_blueprint_low_energy(mock_gemini_service, monkeypatch):
    """
    Tests that the behavior tree selects the 'climb' generator for low-energy audio.
    """
    async def fake_analyze_audio(b):
        return {"duration": 120, "bpm": 80, "energy": 0.3, "spectralCentroid": 1000, "spectralFlux": 0.2, "frameAnalyses": []}
    monkeypatch.setattr('app.services.gemini_service.analyze_audio', fake_analyze_audio)

    mock_gemini_service.generate_layout = AsyncMock(return_value={
        "ride_name": "Test Ride", "mood_description": "A test ride.", "palette": ["#ffffff", "#000000", "#ff0000"],
        "segments": [{"segment_type": "climb", "duration_percentage": 100, "intensity": 30}]
    })
    mock_gemini_service.generate_detailed_segment = AsyncMock(return_value={"component": "climb", "length": 100, "angle": 10})

    track_generator = TrackGeneratorService(mock_gemini_service)
    audio_bytes = b"fake low energy audio data"
    content_type = "audio/mpeg"
    options = {"worldTheme": "fantasy"}

    result = await track_generator.generate_full_blueprint(audio_bytes, content_type, options)

    assert result["blueprint"]["track"][0]["component"] == "climb"
    mock_gemini_service.generate_detailed_segment.assert_called_once()