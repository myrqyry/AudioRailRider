import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, AsyncMock

client = TestClient(app)

@pytest.fixture
def mock_gemini_service():
    """Mocks the GeminiService for blueprint generation tests."""
    with patch('app.api.endpoints.gemini_service', new_callable=AsyncMock) as mock_service:
        mock_service.generate_blueprint.return_value = {
            "blueprint": {"rideName": "Test Ride"},
            "features": {"bpm": 120}
        }
        yield mock_service

@pytest.mark.anyio
async def test_generate_blueprint_success(mock_gemini_service):
    """
    Test successful blueprint generation.
    """
    from create_wav import create_silent_wav
    import os
    wav_filename = "test.wav"
    create_silent_wav(wav_filename)
    with open(wav_filename, "rb") as f:
        audio_content = f.read()
    os.remove(wav_filename)
    files = {'audio_file': ('test.wav', audio_content, 'audio/wav')}
    response = client.post("/api/generate-blueprint", files=files)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["blueprint"]["rideName"] == "Test Ride"
    assert json_response["features"]["bpm"] == 120

@pytest.mark.anyio
async def test_generate_blueprint_invalid_mime_type(mock_gemini_service):
    """
    Test blueprint generation with an invalid MIME type.
    """
    audio_content = b"fake_audio_data"
    files = {'audio_file': ('test.txt', audio_content, 'text/plain')}
    response = client.post("/api/generate-blueprint", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]

@pytest.mark.anyio
async def test_generate_blueprint_file_too_large(mock_gemini_service):
    """
    Test blueprint generation with a file that is too large.
    """
    # Assuming MAX_FILE_SIZE is set in settings, we can patch it for the test
    with patch('app.api.endpoints.settings.MAX_FILE_SIZE', 10):
        audio_content = b"a" * 20  # 20 bytes, larger than the mocked 10
        files = {'audio_file': ('large.mp3', audio_content, 'audio/mpeg')}
        response = client.post("/api/generate-blueprint", files=files)
        assert response.status_code == 413
        assert "File size exceeds limit" in response.json()["detail"]

def test_generate_blueprint_no_file():
    """
    Tests that the endpoint returns a 422 Unprocessable Entity if no file is provided.
    """
    response = client.post("/api/generate-blueprint")
    assert response.status_code == 422  # FastAPI's standard response for a missing required file