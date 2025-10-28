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

SYNESTHETIC_PROMPT = """
You are not designing a rollercoaster - you are translating a song's soul into a navigable dreamscape.
AUDIO SOUL ANALYSIS: {features}

Create a JSON blueprint for a synesthetic experience with impossible physics:

**DREAM-LOGIC ELEMENTS:**
- gravity_defying_spirals: Rails that twist through negative space
- temporal_loops: Segments where time dilates with the music's rhythm
- chromatic_tunnels: Passages that shift color with harmonic changes
- resonance_bridges: Structures that vibrate and reshape with frequencies
- void_drops: Falls through pure darkness synchronized to bass drops

**SYNESTHETIC MAPPINGS:**
- Low frequencies (20-250Hz) → Heavy, grounding elements, earthen colors
- Mid frequencies (250-4000Hz) → Flowing curves, warm hues, organic shapes
- High frequencies (4000Hz+) → Sharp crystalline structures, cool colors, light
- Harmonic tension → Track banking and inversion complexity
- Rhythmic patterns → Segment timing and repetition cycles

**CELESTIAL AESTHETICS:**
- Wireframe sections that pulse with the beat
- Particle trails that follow melodic lines
- Environmental breathing that matches song dynamics
- Colors that exist between normal spectrum (impossible hues)
- Geometry that morphs between 2D and 3D based on musical texture

Return a blueprint that makes the rider feel like "the needle on the record."

Output must be valid JSON with this exact schema:
{{
  "rideName": "string (creative name for the ride)",
  "moodDescription": "string (evocative description of the ride's mood)",
  "palette": ["#hexcolor1", "#hexcolor2", "#hexcolor3"] (array of 3-5 hex color strings),
  "track": [
    {{
      "component": "straight|climb|drop|turn|loop|barrelRoll",
      "length": number (segment length in meters),
      "intensity": number (optional, 0-100),
      "lightingEffect": "string (optional)",
      "environmentChange": "string (optional)",
      "audioSyncPoint": number (optional, seconds)
    }},
    ... (at least 5 segments)
  ],
  "synesthetic": {{
    "geometry": {{
      "wireframeDensity": number (0-1, optional),
      "organicBreathing": number (0-1, optional),
      "impossiblePhysics": {{
        "enabled": boolean,
        "intensity": number (0-1),
        "frequency": number (0-1)
      }}
    }},
    "particles": {{
      "connectionDensity": number (0-1, optional),
      "resonanceThreshold": number (0-1, optional)
    }},
    "atmosphere": {{
      "skyMood": "string (optional)"
    }}
  }}
}}
Return only the JSON, no extra text.
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

        # --- Synesthetic Prompt Engineering ---
        # Build a rich prompt for Gemini, including advanced keys
        synesthetic_keys = {}
        if options:
            # Extract advanced options if present
            synesthetic_keys["aestheticMood"] = options.get("aestheticMood")
            synesthetic_keys["impossiblePhysics"] = options.get("impossiblePhysics")
            synesthetic_keys["breathingIntensity"] = options.get("breathingIntensity")
            synesthetic_keys["organicBreathing"] = options.get("organicBreathing")
            synesthetic_keys["connectionDensity"] = options.get("connectionDensity")
            synesthetic_keys["resonanceThreshold"] = options.get("resonanceThreshold")
            synesthetic_keys["lifespanSeconds"] = options.get("lifespanSeconds")
            synesthetic_keys["skyMood"] = options.get("skyMood")
            synesthetic_keys["turbulenceBias"] = options.get("turbulenceBias")
            synesthetic_keys["passionIntensity"] = options.get("passionIntensity")
            synesthetic_keys["paletteHint"] = options.get("paletteHint")

        # Compose a detailed prompt string for Gemini
        prompt = (
            f"You are a synesthetic translation engine. "
            f"Given the following audio features and user options, generate a JSON blueprint for an immersive ride. "
            f"Audio features: {json.dumps(features)}. "
            f"User options: {json.dumps(options)}. "
            f"Advanced synesthetic keys: {json.dumps(synesthetic_keys)}. "
            f"Output must strictly follow the Blueprint schema with these exact fields: "
            f"rideName (string), moodDescription (string), palette (array of 3-5 hex color strings), "
            f"track (array of at least 5 track segments, each with component, length, and other properties), "
            f"generationOptions (optional object), events (optional array), synesthetic (optional object). "
            f"Include synesthetic fields for geometry, particles, and atmosphere. "
            f"Make use of aestheticMood, impossiblePhysics, breathingIntensity, and any advanced keys provided. "
            f"Return only valid JSON with all required fields."
        )

        # If a real client (or a test-injected mock) is present, call it.
        if self.client is not None and getattr(self.client, "aio", None) is not None:
            try:
                payload = {
                    "prompt": prompt,
                    "features": features,
                    "content_type": content_type,
                    "options": options,
                    "synesthetic_keys": synesthetic_keys
                }
                # If the imported real SDK is available and we instantiated a real client,
                # call the SDK with typed args so response.parsed is filled when we request JSON.
                # If we have an adapter instance, use it to call the SDK in a typed way.
                if getattr(self, "_adapter", None) is not None:
                    try:
                        adapter = self._adapter
                        model = model_name or (options.get("model") if isinstance(options, dict) else None) or "gemini-2.5-flash"
                        content_data = {
                            "prompt": prompt,
                            "features": features,
                            "content_type": content_type,
                            "options": options,
                            "synesthetic_keys": synesthetic_keys
                        }
                        if content_type.startswith('audio/'):
                            content_data["audio_data"] = {
                                "inlineData": {
                                    "content": audio_bytes,
                                    "mimeType": content_type
                                }
                            }
                        config = None
                        try:
                            from google.genai import types as _gtypes
                            # Define the response schema for Blueprint
                            track_segment_schema = _gtypes.Schema(
                                type=_gtypes.Type.OBJECT,
                                properties={
                                    "component": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "length": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "intensity": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "lightingEffect": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "environmentChange": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "audioSyncPoint": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "angle": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "radius": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "direction": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "rotations": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "height": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "banking": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "g_force": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "speed_modifier": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "twist_angle": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "inversions": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                },
                                required=["component", "length"]
                            )
                            synesthetic_geometry_schema = _gtypes.Schema(
                                type=_gtypes.Type.OBJECT,
                                properties={
                                    "wireframeDensity": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "organicBreathing": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "impossiblePhysics": _gtypes.Schema(
                                        type=_gtypes.Type.OBJECT,
                                        properties={
                                            "enabled": _gtypes.Schema(type=_gtypes.Type.BOOLEAN),
                                            "intensity": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                            "frequency": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                        }
                                    ),
                                    "breathingDriver": _gtypes.Schema(type=_gtypes.Type.STRING),
                                }
                            )
                            synesthetic_particles_schema = _gtypes.Schema(
                                type=_gtypes.Type.OBJECT,
                                properties={
                                    "connectionDensity": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "resonanceThreshold": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "lifespanSeconds": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "persistence": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                }
                            )
                            synesthetic_atmosphere_schema = _gtypes.Schema(
                                type=_gtypes.Type.OBJECT,
                                properties={
                                    "skyMood": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "turbulenceBias": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "passionIntensity": _gtypes.Schema(type=_gtypes.Type.NUMBER),
                                    "tint": _gtypes.Schema(type=_gtypes.Type.STRING),
                                }
                            )
                            synesthetic_schema = _gtypes.Schema(
                                type=_gtypes.Type.OBJECT,
                                properties={
                                    "geometry": synesthetic_geometry_schema,
                                    "particles": synesthetic_particles_schema,
                                    "atmosphere": synesthetic_atmosphere_schema,
                                }
                            )
                            blueprint_schema = _gtypes.Schema(
                                type=_gtypes.Type.OBJECT,
                                properties={
                                    "rideName": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "moodDescription": _gtypes.Schema(type=_gtypes.Type.STRING),
                                    "palette": _gtypes.Schema(
                                        type=_gtypes.Type.ARRAY,
                                        items=_gtypes.Schema(type=_gtypes.Type.STRING)
                                    ),
                                    "track": _gtypes.Schema(
                                        type=_gtypes.Type.ARRAY,
                                        items=track_segment_schema
                                    ),
                                    "generationOptions": _gtypes.Schema(type=_gtypes.Type.OBJECT),
                                    "events": _gtypes.Schema(
                                        type=_gtypes.Type.ARRAY,
                                        items=_gtypes.Schema(type=_gtypes.Type.OBJECT)
                                    ),
                                    "synesthetic": synesthetic_schema,
                                },
                                required=["rideName", "moodDescription", "palette", "track"]
                            )
                            config = _gtypes.GenerateContentConfig(
                                response_mime_type="application/json",
                                response_schema=blueprint_schema,
                                max_output_tokens=4096,
                                temperature=0.7
                            )
                        except Exception:
                            config = None

                        # Use the new enhanced prompt
                        prompt = SYNESTHETIC_PROMPT.format(features=features)
                        response = await adapter.generate_content(model=model, contents=prompt, config=config)
                    except Exception:
                        response = await self.client.aio.models.generate_content(payload)
                else:
                    response = await self.client.aio.models.generate_content(payload)

                blueprint_obj = getattr(response, "parsed", None)
                if blueprint_obj is not None:
                    if hasattr(blueprint_obj, "model_dump"):
                        blueprint = blueprint_obj.model_dump()
                    elif hasattr(blueprint_obj, "to_dict"):
                        blueprint = blueprint_obj.to_dict()
                    else:
                        blueprint = dict(blueprint_obj.__dict__) if hasattr(blueprint_obj, "__dict__") else {"parsed": str(blueprint_obj)}
                else:
                    text = getattr(response, "text", None)
                    if text:
                        from pydantic import ValidationError
                        from ..schema.blueprint import Blueprint
                        try:
                            raw_data = json.loads(text)
                            # Validate against schema to prevent malformed data
                            blueprint = Blueprint.model_validate(raw_data).model_dump()
                        except (json.JSONDecodeError, ValidationError) as e:
                            logger.warning("Invalid blueprint from Gemini API", error=str(e))
                            blueprint = self._procedural_fallback_with_features(features)
                    else:
                        blueprint = {"result": repr(response)}

                blueprint = self._ensure_blueprint_has_track(blueprint, features)
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
        if not track_dicts:
            track_dicts = [{"component": "straight", "length": 10}]

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

    def _ensure_blueprint_has_track(self, blueprint: dict, features: dict) -> dict:
        """Ensure the blueprint has a valid track array, generating one if missing."""
        if isinstance(blueprint.get("track"), list) and len(blueprint["track"]) > 0:
            return blueprint
        
        logger.warning("Blueprint missing or invalid track, generating procedural track")
        if not hasattr(self, "advanced_generator"):
            from .advanced_track_generator import AdvancedTrackGenerator
            self.advanced_generator = AdvancedTrackGenerator()

        track = self.advanced_generator.generate_track(features)
        track_dicts = [component.model_dump() for component in track]
        if not track_dicts:
            track_dicts = [{"component": "straight", "length": 10}]

        blueprint["track"] = track_dicts
        return blueprint

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

    async def generate_skybox(self, prompt: str, blueprint: dict, options: Any = None) -> Dict[str, Any]:
        """Generate a skybox image based on prompt and blueprint."""
        # For now, return a placeholder URL since skybox generation is optional
        logger.info("Skybox generation requested but not implemented, returning placeholder")
        return {"skybox_url": "/default_skybox.jpg"}

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