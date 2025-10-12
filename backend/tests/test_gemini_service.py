import asyncio
import pytest
from types import SimpleNamespace

from backend.app.services.gemini_service import GeminiService


class DummyResponse:
    def __init__(self, text=None, parsed=None):
        self.text = text
        self.parsed = parsed


def test_generate_blueprint_inline(monkeypatch):
    svc = GeminiService()

    # mock analyze_audio to produce small features
    monkeypatch.setattr('backend.app.services.gemini_service.analyze_audio', lambda b: {
        'duration': 60.0, 'bpm': 120.0, 'energy': 0.5, 'spectralCentroid': 1500.0, 'spectralFlux': 0.02
    })

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
    monkeypatch.setattr('backend.app.services.gemini_service.analyze_audio', lambda b: {
        'duration': 120.0, 'bpm': 100.0, 'energy': 0.3, 'spectralCentroid': 800.0, 'spectralFlux': 0.01
    })

    # force generate_content to raise APIError
    async def fake_generate_content_error(*a, **k):
        raise Exception('api failure')

    svc.client = SimpleNamespace(aio=SimpleNamespace(models=SimpleNamespace(generate_content=fake_generate_content_error), files=SimpleNamespace(upload=lambda *a, **k: None)))

    res = asyncio.run(svc.generate_blueprint(b'FAKE', 'audio/mpeg'))
    assert 'blueprint' in res and 'features' in res
    # blueprint should be a Blueprint instance or dict
    b = res['blueprint']
    assert hasattr(b, 'rideName') or isinstance(b, dict)
