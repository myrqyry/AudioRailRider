import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from types import SimpleNamespace
from app.services.gemini_service import GeminiService, APIError, audio_cache, _CACHE
from app.schema.blueprint import Blueprint

@pytest.fixture(autouse=True)
def clear_caches():
    """Clear all module-level caches before each test."""
    audio_cache.clear()
    _CACHE.clear()
    yield

@pytest.fixture
def mock_gemini_client_instance():
    """Mocks a google.genai client *instance*."""
    mock_client = MagicMock()
    mock_client.generate_content = AsyncMock()
    return mock_client

def create_mock_blueprint():
    """Creates a valid Blueprint object for mocking."""
    return Blueprint(
        rideName="Test Ride",
        moodDescription="A test ride.",
        palette=["#ff0000", "#00ff00", "#0000ff"],
        track=[{"component": "climb", "length": 100}],
        synesthetic={
            "geometry": {
                "wireframeDensity": 0.5,
                "organicBreathing": 0.5,
                "impossiblePhysics": {"enabled": True, "intensity": 0.5, "frequency": 0.5}
            },
            "particles": {
                "connectionDensity": 0.5,
                "resonanceThreshold": 0.5
            },
            "atmosphere": {
                "skyMood": "serene"
            }
        }
    )

@patch('app.services.gemini_service.analyze_audio', new_callable=AsyncMock)
@patch('app.services.gemini_service.genai.Client') # Mocks the genai.Client *class*
class TestGeminiService:

    @pytest.mark.anyio
    async def test_generate_blueprint_success(self, mock_genai_client_class, mock_analyze_audio, mock_gemini_client_instance):
        """
        Tests the successful generation of a blueprint.
        """
        # Arrange
        mock_genai_client_class.return_value = mock_gemini_client_instance
        svc = GeminiService()

        audio_bytes = b"test_audio"
        content_type = "audio/mpeg"
        options = {"worldTheme": "cyberpunk"}

        mock_analyze_audio.return_value = {
            "duration": 60.0, "bpm": 120.0, "energy": 0.5,
        }

        mock_blueprint_model = create_mock_blueprint()
        mock_response = SimpleNamespace(text=mock_blueprint_model.model_dump_json())
        svc.client.generate_content.return_value = mock_response

        # Act
        result = await svc.generate_blueprint(audio_bytes, content_type, options)

        # Assert
        assert "blueprint" in result
        assert "features" in result
        assert result["blueprint"]["rideName"] == "Test Ride"
        assert result["features"]["bpm"] == 120.0
        svc.client.generate_content.assert_called_once()
        mock_analyze_audio.assert_called_once_with(audio_bytes)

    @pytest.mark.anyio
    async def test_generate_blueprint_api_error_fallback(self, mock_genai_client_class, mock_analyze_audio, mock_gemini_client_instance):
        """
        Tests that the service falls back to procedural generation on APIError.
        """
        # Arrange
        mock_genai_client_class.return_value = mock_gemini_client_instance
        svc = GeminiService()

        audio_bytes = b"test_audio_fallback"
        content_type = "audio/mpeg"

        mock_analyze_audio.return_value = {"duration": 120.0, "bpm": 140.0, "energy": 0.8}
        svc.client.generate_content.side_effect = APIError("Test API Error")

        # Act
        result = await svc.generate_blueprint(audio_bytes, content_type)

        # Assert
        assert "procedural" in result["blueprint"]["rideName"].lower()
        assert "procedurally generated" in result["blueprint"]["moodDescription"]
        assert len(result["blueprint"]["track"]) > 0

    @pytest.mark.anyio
    async def test_generate_blueprint_caching(self, mock_genai_client_class, mock_analyze_audio, mock_gemini_client_instance):
        """
        Tests that blueprint generation results are cached.
        """
        # Arrange
        mock_genai_client_class.return_value = mock_gemini_client_instance
        svc = GeminiService()

        audio_bytes = b"test_audio_caching"
        content_type = "audio/mpeg"
        options = {"trackStyle": "extreme"}

        mock_analyze_audio.return_value = {"duration": 10.0, "bpm": 100.0, "energy": 0.4}

        mock_blueprint_model = create_mock_blueprint()
        mock_blueprint_model.rideName = "Cached Ride"
        mock_response = SimpleNamespace(text=mock_blueprint_model.model_dump_json())
        svc.client.generate_content.return_value = mock_response

        # Act
        result1 = await svc.generate_blueprint(audio_bytes, content_type, options)
        result2 = await svc.generate_blueprint(audio_bytes, content_type, options)

        # Assert
        assert result1["blueprint"]["rideName"] == "Cached Ride"
        assert result2 == result1
        svc.client.generate_content.assert_called_once()
        mock_analyze_audio.assert_called_once()
