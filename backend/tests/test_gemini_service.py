import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from types import SimpleNamespace
from app.services.gemini_service import GeminiService, APIError, audio_cache
from app.schema.blueprint import Blueprint

@pytest.fixture(autouse=True)
def clear_audio_cache():
    audio_cache.clear()
    yield

@pytest.fixture
def mock_gemini_client():
    """Mocks the google.genai client."""
    mock_client = MagicMock()
    mock_client.aio = MagicMock()
    mock_client.aio.models = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock()
    mock_client.aio.files = MagicMock()
    mock_client.aio.files.upload = AsyncMock()
    mock_client.aio.files.delete = AsyncMock()
    return mock_client

@pytest.fixture
def mock_adapter():
    """Mocks the GenAIAdapter."""
    mock_adapter = MagicMock()
    mock_adapter.generate_content = AsyncMock()
    mock_adapter.upload_file = AsyncMock()
    return mock_adapter

@patch('app.services.gemini_service.analyze_audio', new_callable=AsyncMock)
@patch('app.services.genai_adapter.GenAIAdapter')
class TestGeminiService:

    @pytest.mark.anyio
    async def test_generate_blueprint_success(self, mock_adapter_class, mock_analyze_audio, mock_gemini_client):
        """
        Tests the successful generation of a blueprint.
        """
        # Arrange
        mock_adapter_instance = MagicMock()
        mock_adapter_instance.generate_content = AsyncMock()
        mock_adapter_instance.upload_file = AsyncMock()
        mock_adapter_class.return_value = mock_adapter_instance
        
        svc = GeminiService()

        audio_bytes = b"test_audio"
        content_type = "audio/mpeg"
        options = {"worldTheme": "cyberpunk"}

        mock_analyze_audio.return_value = {
            "duration": 60.0, "bpm": 120.0, "energy": 0.5,
            "spectralCentroid": 1500.0, "spectralFlux": 0.2
        }

        # Helper to create a valid track
        def make_track(n=12):
            return [{"component": "climb", "length": 100} for _ in range(n)]

        # Mock the Pydantic model object that would be returned
        mock_blueprint_model = Blueprint(
            rideName="Test Ride",
            moodDescription="A test ride that is long enough.",
            palette=["#ff0000", "#00ff00", "#0000ff"],
            track=make_track()
        )

        mock_response = SimpleNamespace(
            parsed=mock_blueprint_model,
            text=mock_blueprint_model.model_dump_json()
        )
        mock_adapter_instance.generate_content.return_value = mock_response

        # Act
        result = await svc.generate_blueprint(audio_bytes, content_type, options)

        # Assert
        assert "blueprint" in result
        assert "features" in result
        assert result["blueprint"].rideName == "Test Ride"
        assert result["features"]["bpm"] == 120.0
        mock_adapter_instance.generate_content.assert_called_once()
        mock_analyze_audio.assert_called_once_with(audio_bytes)

    @pytest.mark.anyio
    async def test_generate_blueprint_api_error_fallback(self, mock_adapter_class, mock_analyze_audio, mock_gemini_client):
        """
        Tests that the service falls back to procedural generation on APIError.
        """
        # Arrange
        mock_adapter_instance = MagicMock()
        mock_adapter_instance.generate_content = AsyncMock()
        mock_adapter_instance.upload_file = AsyncMock()
        mock_adapter_class.return_value = mock_adapter_instance
        
        svc = GeminiService()

        audio_bytes = b"test_audio_fallback"
        content_type = "audio/mpeg"

        mock_analyze_audio.return_value = {
            "duration": 120.0, "bpm": 140.0, "energy": 0.8
        }

        # Simulate an API error
        mock_adapter_instance.generate_content.side_effect = APIError("Test API Error", response_json={})

        # Act
        result = await svc.generate_blueprint(audio_bytes, content_type)

        # Assert
        assert "blueprint" in result
        assert "features" in result
        assert "Procedural Ride" in result["blueprint"]["rideName"]
        assert result["blueprint"]["moodDescription"] == "A fallback, procedurally generated ride for development."
        assert len(result["blueprint"]["track"]) > 0

    @pytest.mark.anyio
    async def test_generate_blueprint_caching(self, mock_adapter_class, mock_analyze_audio, mock_gemini_client):
        """
        Tests that blueprint generation results are cached.
        """
        # Arrange
        mock_adapter_instance = MagicMock()
        mock_adapter_instance.generate_content = AsyncMock()
        mock_adapter_instance.upload_file = AsyncMock()
        mock_adapter_class.return_value = mock_adapter_instance
        
        svc = GeminiService()

        audio_bytes = b"test_audio_caching"
        content_type = "audio/mpeg"
        options = {"trackStyle": "extreme"}

        mock_analyze_audio.return_value = {
            "duration": 10.0, "bpm": 100.0, "energy": 0.4,
            "spectralCentroid": 1200.0, "spectralFlux": 0.3
        }

        def make_track(n=12):
            return [{"component": "climb", "length": 100} for _ in range(n)]

        mock_blueprint_model = Blueprint(
            rideName="Cached Ride",
            moodDescription="A cached ride that is long enough.",
            palette=["#111", "#222", "#333"],
            track=make_track()
        )
        mock_response = SimpleNamespace(parsed=mock_blueprint_model)
        mock_adapter_instance.generate_content.return_value = mock_response

        # Act
        # First call - should miss cache and call API
        result1 = await svc.generate_blueprint(audio_bytes, content_type, options)

        # Second call with same params - should hit cache
        result2 = await svc.generate_blueprint(audio_bytes, content_type, options)

        # Assert
        assert result1["blueprint"].rideName == "Cached Ride"
        assert result2 == result1 # Should be the exact same object from cache
        mock_adapter_instance.generate_content.assert_called_once() # API should only be called once
        mock_analyze_audio.assert_called_once() # Audio analysis should also only be called once

        # Verify that audio analysis is not called on cache hit
        assert mock_analyze_audio.call_count == 1