import pytest
from fastapi.testclient import TestClient
from main import app  # Assuming your FastAPI app is in main.py
from unittest.mock import patch, MagicMock

client = TestClient(app)

@pytest.fixture
def mock_gemini_service():
    # This fixture mocks the gemini_service instance used by the endpoint
    with patch('app.api.endpoints.gemini_service') as mock:
        async def async_return(value):
            return value
        mock.generate_blueprint.return_value = async_return({"blueprint": "mock", "features": {}})
        yield mock

def test_generate_blueprint_valid_mime_type_uppercase(mock_gemini_service):
    """
    Tests that the endpoint accepts a valid MIME type with uppercase characters.
    This verifies the case-insensitive fix.
    """
    audio_content = b"fake audio data"
    files = {'audio_file': ('test.mp3', audio_content, 'audio/MPEG')}
    response = client.post("/api/generate-blueprint", files=files)
    assert response.status_code == 200
    assert response.json() == {"blueprint": "mock", "features": {}}

def test_generate_blueprint_invalid_mime_type(mock_gemini_service):
    """
    Tests that the endpoint rejects an unsupported MIME type.
    """
    audio_content = b"fake audio data"
    files = {'audio_file': ('test.txt', audio_content, 'text/plain')}
    response = client.post("/api/generate-blueprint", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]

def test_generate_blueprint_file_too_large(mock_gemini_service):
    """
    Tests that the endpoint rejects a file that exceeds the maximum size limit.
    """
    # Create a file larger than 20MB
    large_content = b"a" * (20 * 1024 * 1024 + 1)
    files = {'audio_file': ('large_file.mp3', large_content, 'audio/mpeg')}
    response = client.post("/api/generate-blueprint", files=files)
    assert response.status_code == 413
    assert "File size exceeds limit" in response.json()["detail"]

def test_generate_blueprint_no_file(mock_gemini_service):
    """
    Tests that the endpoint returns a 422 Unprocessable Entity error if no file is provided.
    """
    response = client.post("/api/generate-blueprint")
    assert response.status_code == 422 # FastAPI's handling of missing File(...)

def test_generate_blueprint_removed_mp3_mimetype(mock_gemini_service):
    """
    Tests that the endpoint now rejects the non-standard 'audio/mp3' MIME type.
    """
    audio_content = b"fake audio data"
    files = {'audio_file': ('test.mp3', audio_content, 'audio/mp3')}
    response = client.post("/api/generate-blueprint", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]