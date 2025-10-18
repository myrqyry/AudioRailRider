import asyncio
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock

from app.services.gemini_service import GeminiService


@pytest.fixture
def mock_gemini_client():
    """Mocks the Gemini client."""
    client = SimpleNamespace(
        aio=SimpleNamespace(
            models=SimpleNamespace(generate_content=AsyncMock()),
            files=SimpleNamespace(upload=AsyncMock())
        )
    )
    return client

@pytest.mark.anyio
async def test_generate_layout(mock_gemini_client):
    """Tests the generate_layout method."""
    svc = GeminiService()
    svc.client = mock_gemini_client

    audio_features = {'duration': 60.0, 'bpm': 120.0, 'energy': 0.5}
    options = {'worldTheme': 'cyberpunk'}

    mock_gemini_client.aio.models.generate_content.return_value = SimpleNamespace(
        parsed={"ride_name": "Test Ride", "segments": []}
    )

    layout = await svc.generate_layout(audio_features, options)

    assert layout['ride_name'] == "Test Ride"
    mock_gemini_client.aio.models.generate_content.assert_called_once()

@pytest.mark.anyio
async def test_generate_detailed_segment(mock_gemini_client):
    """Tests the generate_detailed_segment method."""
    svc = GeminiService()
    svc.client = mock_gemini_client

    segment_def = {'segment_type': 'climb', 'intensity': 75}

    mock_gemini_client.aio.models.generate_content.return_value = SimpleNamespace(
        parsed={"component": "climb", "length": 100, "angle": 20}
    )

    segment = await svc.generate_detailed_segment(segment_def)

    assert segment['component'] == "climb"
    mock_gemini_client.aio.models.generate_content.assert_called_once()

def test_generate_skybox_prompt_with_partial_palette():
    """
    Tests that the skybox prompt generation handles a partial palette correctly.
    """
    service = GeminiService()
    prompt = "A test prompt"
    blueprint_data = {
        "rideName": "Test Ride",
        "moodDescription": "A test mood",
        "palette": ["#FF0000", "#00FF00"]  # Only two colors
    }

    # We only need to check the generated prompt, not the full skybox generation
    full_prompt = service.generate_skybox_prompt(prompt, blueprint_data)

    # Assert that the palette description is NOT in the prompt
    assert "Color Palette" not in full_prompt
    assert "A harmonious blend of" not in full_prompt

def test_generate_skybox_prompt_with_full_palette():
    """
    Tests that the skybox prompt generation includes the palette description
    when a full palette is provided.
    """
    service = GeminiService()
    prompt = "A test prompt"
    blueprint_data = {
        "rideName": "Test Ride",
        "moodDescription": "A test mood",
        "palette": ["#FF0000", "#00FF00", "#0000FF"]
    }

    full_prompt = service.generate_skybox_prompt(prompt, blueprint_data)

    # Assert that the palette description IS in the prompt
    assert "Color Palette" in full_prompt
    assert "A harmonious blend of #FF0000 (dominant), #00FF00 (accent), and #0000FF (ambient)." in full_prompt