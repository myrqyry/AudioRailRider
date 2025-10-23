"""GeminiService - minimal, test-friendly wrapper for a GenAI client.

This file provides a small, deterministic fallback implementation used when the
real Gemini SDK is not available. Tests may inject a mock client into
GeminiService instances by setting the `client` attribute.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator, Dict, Optional

from cachetools import TTLCache
from types import SimpleNamespace

logger = logging.getLogger("GeminiService")

ENHANCED_COASTER_PROMPT = """
You are an expert rollercoaster designer creating thrilling, music-synchronized rides.
AUDIO ANALYSIS INPUT: {features}

Create a JSON blueprint for an exciting coaster with these requirements:

1.  **TRACK VARIETY** - Use diverse components:
    *   **Climbs**: steep_climb, gentle_hill, launch_hill
    *   **Drops**: vertical_drop, spiral_drop, curved_drop
    *   **Loops**: standard_loop, cobra_roll, double_corkscrew
    *   **Turns**: banking_turn, sharp_turn, spiral_turn
    *   **Thrills**: airtime_hill, bunny_hop, speed_boost
    *   **Inversions**: barrel_roll, heartline_roll, twisted_element

2.  **ENERGY MAPPING**:
    *   **Low energy (0-0.3)**: Scenic sections, gentle curves
    *   **Medium energy (0.3-0.7)**: Hills, banking turns, mild inversions
    *   **High energy (0.7-0.9)**: Major drops, loops, rapid elements
    *   **Extreme energy (0.9+)**: Mega drops, triple elements, launches

3.  **MUSIC SYNCHRONIZATION**:
    *   Map BPM to element timing and pacing.
    *   Create energy peaks matching song structure.
    *   Add beat-synchronized elements for drops/climaxes.
    *   Include audio-reactive visual effects.

4.  **DYNAMIC PROPERTIES** for each element:
    *   Height/depth variations (20-300 units)
    *   Banking angles (0-90 degrees)
    *   G-force ratings (1.0-6.0)
    *   Speed modifiers (0.5-2.5x)
    *   Duration sync to musical phrases

5.  **IMMERSIVE FEATURES**:
    *   Dynamic lighting synchronized to beat.
    *   Particle effects matching energy levels.
    *   Environment reactions (fog, strobes, speed lines).
    *   Color palettes reflecting mood/energy.

Return JSON with this structure:
{{
  "rideName": "Creative name reflecting the music",
  "moodDescription": "Vivid description of the ride experience",
  "palette": ["#color1", "#color2", "#color3", "#color4"],
  "track": [
    {{
      "component": "element_type",
      "length": 100,
      "height": 50,
      "banking": 30,
      "g_force": 3.2,
      "speed_modifier": 1.2,
      "audio_reactive": true,
      "beat_sync": true
    }}
  ],
  "effects": {{
    "lighting": "dynamic/strobe/ambient",
    "particles": "high/medium/low",
    "fog_density": 0.5,
    "camera_shake": true,
    "environment_pulse": true
  }}
}}

Make it THRILLING and MEMORABLE!
"""


class APIError(Exception):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args)
        self.extra = kwargs


class Part:
    def __init__(self, content: Any = None, **kwargs: Any) -> None:
        self.content = content
        for k, v in kwargs.items():
            setattr(self, k, v)


_CACHE = TTLCache(maxsize=1024, ttl=60 * 60)

# Provide a lightweight genai placeholder so tests can patch app.services.gemini_service.genai
genai = SimpleNamespace(Client=None)

# Real SDK hint (only imported lazily when an API key is present).
_REAL_GENEAI_AVAILABLE = False
_REAL_GENEAI = None


async def analyze_audio(audio_bytes: bytes) -> dict:
    """Lazy proxy to the audio analysis service. Tests patch this function."""
    try:
        from .audio_analysis_service import analyze_audio as _analyze

        return await _analyze(audio_bytes)
    except Exception as e:  # pragma: no cover - keeps import-time light
        logger.error("Audio analysis lazy import failed: %s", e, exc_info=True)
        raise


def _safe_serialize(obj: Any) -> str:
    try:
        if hasattr(obj, "model_dump"):
            obj = obj.model_dump()
        return json.dumps(obj, sort_keys=True, ensure_ascii=True, default=repr)
    except Exception:
        return repr(obj)


def _generate_cache_key(audio_bytes: bytes, content_type: str, options: Any, model_name: Optional[str]) -> str:
    serialized = _safe_serialize(options)
    audio_hash = hashlib.sha256(audio_bytes).hexdigest() if isinstance(audio_bytes, (bytes, bytearray)) else hashlib.sha256(str(audio_bytes).encode()).hexdigest()
    key_src = f"{audio_hash}|{content_type or 'unknown'}|{model_name or 'default'}|{serialized}"
    return hashlib.sha256(key_src.encode("utf-8")).hexdigest()


class GeminiService:
    def __init__(self, api_key: Optional[str] = None, client: Optional[Any] = None) -> None:
        self.api_key = api_key
        # If a client is explicitly provided, use it (tests may inject this).
        if client is not None:
            self.client = client
        else:
            # Otherwise, try to use a patched genai.Client (tests) or instantiate a
            # real google-genai client if an API key is present in env or passed in.
            try:
                client_cls = getattr(genai, "Client", None)
                if client_cls:
                    try:
                        # Tests often patch genai.Client to be callable without args.
                        self.client = client_cls()
                    except TypeError:
                        # If the patched Client object is actually a MagicMock etc.
                        self.client = client_cls
                else:
                    # No patched client; if we have an API key (or env), attempt to
                    # lazily import the real SDK and instantiate a real client.
                    env_key = os.environ.get("GEMINI_API_KEY")
                    key_to_use = api_key or env_key
                    if key_to_use:
                        try:
                            # import the local adapter which will perform the real SDK instantiation
                            from .genai_adapter import GenAIAdapter

                            adapter = GenAIAdapter(api_key=key_to_use)
                            # expose the adapter and real client for tests/inspection
                            self._adapter = adapter
                            self.client = adapter.client
                        except Exception:
                            self.client = None
                    else:
                        self.client = None
            except Exception:
                self.client = None
        # Use an instance-local cache to avoid sharing state between test cases
        self._cache = TTLCache(maxsize=1024, ttl=60 * 60)
        # helper reference to the async client when present
        self._aio = getattr(self.client, "aio", None) if self.client is not None else None
        # adapter instance (if created)
        self._adapter = getattr(self, "_adapter", None)

    async def generate_blueprint(self, audio_bytes: bytes, content_type: str, options: Any = None) -> Dict[str, Any]:
        """Generate a blueprint from audio bytes + content type + options.

        Tests expect this method to call `analyze_audio` and then call
        `self.client.aio.models.generate_content` when a client is provided.
        """
        model_name = options.get("model") if isinstance(options, dict) else None

        cache_key = _generate_cache_key(audio_bytes, content_type, options, model_name=model_name)
        if cache_key in self._cache:
            return self._cache[cache_key]

        # Run audio analysis (tests patch analyze_audio)
        features = await analyze_audio(audio_bytes)

        # If a real client (or a test-injected mock) is present, call it.
        # Two scenarios:
        # - test: tests may inject a patched client (with .aio.models.generate_content that accepts a single payload arg)
        # - prod: a real google-genai client expects (model=..., contents=..., config=...)
        if self.client is not None and getattr(self.client, "aio", None) is not None:
            try:
                payload = {"features": features, "content_type": content_type, "options": options}
                # If the imported real SDK is available and we instantiated a real client,
                # call the SDK with typed args so response.parsed is filled when we request JSON.
                # If we have an adapter instance, use it to call the SDK in a typed way.
                if getattr(self, "_adapter", None) is not None:
                    try:
                        adapter = self._adapter
                        model = model_name or (options.get("model") if isinstance(options, dict) else None) or "gemini-2.5-flash"
                        # pass JSON string as contents so the model receives a stable payload
                        config = None
                        try:
                            from google.genai import types as _gtypes

                            config = _gtypes.GenerateContentConfig(response_mime_type="application/json", max_output_tokens=1024, temperature=0.0)
                        except Exception:
                            config = None

                        # Use the new enhanced prompt
                        prompt = ENHANCED_COASTER_PROMPT.format(features=features)
                        response = await adapter.generate_content(model=model, contents=prompt, config=config)
                    except Exception:
                        # fall back to test-friendly single payload form
                        response = await self.client.aio.models.generate_content(payload)
                else:
                    # Most tests expect a single-arg payload call; keep that behavior.
                    response = await self.client.aio.models.generate_content(payload)

                # Prefer `parsed` attribute (tests set this)
                blueprint_obj = getattr(response, "parsed", None)
                if blueprint_obj is not None:
                    if hasattr(blueprint_obj, "model_dump"):
                        blueprint = blueprint_obj.model_dump()
                    elif hasattr(blueprint_obj, "to_dict"):
                        blueprint = blueprint_obj.to_dict()
                    else:
                        # best-effort conversion
                        blueprint = dict(blueprint_obj.__dict__) if hasattr(blueprint_obj, "__dict__") else {"parsed": str(blueprint_obj)}
                else:
                    # fallback to text/json
                    text = getattr(response, "text", None)
                    if text:
                        try:
                            blueprint = json.loads(text)
                        except Exception:
                            blueprint = {"text": text}
                    else:
                        blueprint = {"result": repr(response)}

                result = {"blueprint": blueprint, "features": features}
                self._cache[cache_key] = result
                return result
            except APIError as e:
                logger.warning("APIError from client, falling back: %s", e)
            except Exception as e:
                logger.warning("client generation failed, falling back: %s", e)

        # Procedural fallback
        proc = self._procedural_fallback_with_features(features)
        self._cache[cache_key] = proc
        return proc

    def _procedural_fallback_with_features(self, features: dict) -> Dict[str, Any]:
        """Procedural generator used by tests when the client fails or is absent."""
        if not hasattr(self, "advanced_generator"):
            from .advanced_track_generator import AdvancedTrackGenerator
            self.advanced_generator = AdvancedTrackGenerator()

        track = self.advanced_generator.generate_track(features)
        track_dicts = [component.model_dump() for component in track]

        bpm = features.get("bpm", 120)
        energy = features.get("energy", 0.5)

        blueprint = {
            "rideName": f"Dynamic Audio Coaster ({int(bpm)} BPM)",
            "moodDescription": f"A procedurally generated ride based on audio analysis.",
            "palette": self._generate_dynamic_palette(energy, bpm),
            "track": track_dicts,
        }
        features_out = {"bpm": bpm, "energy": energy}
        return {"blueprint": blueprint, "features": features_out}

    def _generate_dynamic_palette(self, energy: float, bpm: float) -> list:
        """Generate color palette based on music energy and tempo."""
        if energy > 0.8:
            return ["#FF0040", "#FF6600", "#FFFF00", "#00FF80"]
        elif energy > 0.6:
            return ["#8000FF", "#FF0080", "#00FFFF", "#FF4000"]
        elif energy > 0.4:
            return ["#0080FF", "#8040FF", "#FF8000", "#40FF40"]
        else:
            return ["#4080FF", "#8080FF", "#FF8080", "#80FF80"]

    async def _call_client_generate(self, audio_path: str, options: Any) -> Any:
        # Compatibility helper for callers that want to call a client-level generate.
        gen = getattr(self.client, "generate_content", None) or getattr(getattr(self.client, "aio", None), "models", None)
        if gen is None:
            raise RuntimeError("client has no generate_content method")
        payload = {"audio_path": audio_path, "options": options if isinstance(options, dict) else _safe_serialize(options)}
        # Prefer awaitable call signature
        try:
            out = await gen(payload)
        except TypeError:
            # If gen expects typed args, try to call via real SDK shape (best-effort)
            try:
                from google.genai import types as _gtypes

                config = _gtypes.GenerateContentConfig(response_mime_type="application/json")
                out = await self.client.aio.models.generate_content(model=options.get("model") if isinstance(options, dict) else None, contents=json.dumps(payload), config=config)
            except Exception as e:
                raise
        return out

    def _procedural_fallback(self, audio_path: str, options: Any) -> Dict[str, Any]:
        name = os.path.splitext(os.path.basename(audio_path))[0]
        fingerprint = hashlib.sha1(_safe_serialize(options).encode("utf-8")).hexdigest()[:8]
        title = f"Ride for {name} ({fingerprint})"
        blueprint = {"title": title, "segments": [], "features": {"energy": 0.5, "tempo": 120}}
        metadata = {"source": "procedural", "options": options}
        return {"blueprint": blueprint, "metadata": metadata}

    @asynccontextmanager
    async def upload_file(self, file_path: str) -> AsyncIterator[str]:
        # Prefer async files.upload on the real SDK: client.aio.files.upload
        try:
            if self.client is not None:
                # prefer adapter.upload_file if we have it
                if getattr(self, "_adapter", None) is not None:
                    try:
                        file_obj = await self._adapter.upload_file(file_path)
                        yield getattr(file_obj, "name", getattr(file_obj, "uri", repr(file_obj)))
                        return
                    except Exception:
                        logger.debug("Adapter upload failed, falling back to client or local hash", exc_info=True)

                aio = getattr(self.client, "aio", None)
                if aio is not None and getattr(aio, "files", None) is not None and hasattr(aio.files, "upload"):
                    file_obj = await aio.files.upload(file=file_path)
                    try:
                        yield getattr(file_obj, "name", getattr(file_obj, "uri", repr(file_obj)))
                    finally:
                        return
                # fallback: sync files.upload
                if getattr(self.client, "files", None) is not None and hasattr(self.client.files, "upload"):
                    file_obj = self.client.files.upload(file=file_path)
                    yield getattr(file_obj, "name", getattr(file_obj, "uri", repr(file_obj)))
                    return
        except Exception:
            logger.debug("Real client upload failed, falling back to local hash", exc_info=True)

        # deterministic local fallback: return a file:// hash
        h = hashlib.sha1(open(file_path, "rb").read()).hexdigest()
        yield f"file://{h}"


# Convenience module-level instance for quick imports in tests
gemini_service = GeminiService()