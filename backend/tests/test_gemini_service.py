import asyncio
import pytest
from types import SimpleNamespace

from app.services.gemini_service import GeminiService


class DummyResponse:
    def __init__(self, text=None, parsed=None):
        self.text = text
        self.parsed = parsed


def test_generate_blueprint_inline(monkeypatch):
    svc = GeminiService()

    # mock analyze_audio to produce small features
    async def fake_analyze_audio(b):
        return {
            'duration': 60.0, 'bpm': 120.0, 'energy': 0.5, 'spectralCentroid': 1500.0, 'spectralFlux': 0.02
        }
    monkeypatch.setattr('app.services.gemini_service.analyze_audio', fake_analyze_audio)

    # Mock client.aio.models.generate_content to return parsed blueprint
    async def fake_generate_content(model, contents, config):
        parsed = {
            'rideName': 'Unit Test Ride',
            'moodDescription': 'Test',
            'palette': ['#000', '#111', '#222'],
            'track': [],
            'synesthetic': {
                'geometry': {'wireframeDensity': 0.5, 'impossiblePhysics': False, 'organicBreathing': 0.4, 'breathingDriver': 'energy'},
                'particles': {'connectionDensity': 0.4, 'resonanceThreshold': 0.3, 'lifespanSeconds': 3.0, 'persistence': 0.5},
                'atmosphere': {'skyMood': 'test', 'turbulenceBias': 1.0, 'passionIntensity': 1.2, 'tint': '#333333'}
            }
        }
        return DummyResponse(text='{}', parsed=parsed)

    svc.client = SimpleNamespace(aio=SimpleNamespace(models=SimpleNamespace(generate_content=fake_generate_content), files=SimpleNamespace(upload=lambda *a, **k: None)))

    res = asyncio.run(svc.generate_blueprint(b'FAKE', 'audio/mpeg'))
    assert 'blueprint' in res and 'features' in res


def test_generate_blueprint_fallback(monkeypatch):
    svc = GeminiService()

    # force analyze_audio to succeed
    async def fake_analyze_audio_success(b):
        return {
            'duration': 120.0, 'bpm': 100.0, 'energy': 0.3, 'spectralCentroid': 800.0, 'spectralFlux': 0.01
        }
    monkeypatch.setattr('app.services.gemini_service.analyze_audio', fake_analyze_audio_success)

    # force generate_content to raise APIError
    async def fake_generate_content_error(*a, **k):
        raise Exception('api failure')

    svc.client = SimpleNamespace(aio=SimpleNamespace(models=SimpleNamespace(generate_content=fake_generate_content_error), files=SimpleNamespace(upload=lambda *a, **k: None)))

    res = asyncio.run(svc.generate_blueprint(b'FAKE', 'audio/mpeg'))
    assert 'blueprint' in res and 'features' in res
    # blueprint should be a Blueprint instance or dict
    b = res['blueprint']
    assert hasattr(b, 'rideName') or isinstance(b, dict)

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
