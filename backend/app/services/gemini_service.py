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
import threading
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator, Dict, Optional

from cachetools import TTLCache
from types import SimpleNamespace

from google import genai
from google.genai import types

logger = logging.getLogger("GeminiService")

class AudioAnalysisCache:
    """Thread-safe cache for audio analysis results."""

    def __init__(self, max_size: int = 100, ttl: int = 3600):
        self._cache = TTLCache(maxsize=max_size, ttl=ttl)
        self._lock = threading.RLock()

    def _generate_cache_key(self, audio_bytes: bytes, content_type: str) -> str:
        """Generate cache key from audio content hash."""
        hasher = hashlib.sha256()
        hasher.update(audio_bytes)
        hasher.update(content_type.encode('utf-8'))
        return f"audio_analysis_{hasher.hexdigest()}"

    def get(self, audio_bytes: bytes, content_type: str) -> Optional[Dict[str, Any]]:
        """Retrieve cached analysis results."""
        key = self._generate_cache_key(audio_bytes, content_type)
        with self._lock:
            return self._cache.get(key)

    def set(self, audio_bytes: bytes, content_type: str, result: Dict[str, Any]) -> None:
        """Cache analysis results."""
        key = self._generate_cache_key(audio_bytes, content_type)
        with self._lock:
            self._cache[key] = result

    def clear(self) -> None:
        """Clear all cached results."""
        with self._lock:
            self._cache.clear()

# Global cache instance for audio analysis
audio_cache = AudioAnalysisCache(max_size=200, ttl=7200)  # 2 hour TTL

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
            # Otherwise, lazily create a real google-genai client if an API key is present.
            env_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
            key_to_use = api_key or env_key
            if key_to_use:
                try:
                    self.client = genai.Client(api_key=key_to_use)
                except TypeError:
                    # Some environments/tests may patch Client to be callable without args.
                    self.client = genai.Client()
                except Exception:
                    logger.exception("Failed to initialize genai.Client; falling back to procedural mode")
                    self.client = None
            else:
                self.client = None


    async def generate_blueprint(self, audio_bytes: bytes, content_type: str, options: Any = None) -> Dict[str, Any]:
        """Analyze audio and generate a blueprint. Uses real client when available, otherwise falls back to a procedural generator.

        This method is intentionally defensive: any error during model calls will be logged
        and the procedural fallback will be returned so the API doesn't surface 500s to the dev UI.
        """
        cache_key = _generate_cache_key(audio_bytes, content_type, options, getattr(self, "client", None) and getattr(self.client, "model_name", None))
        # Check module-level cache first
        if cache_key in _CACHE:
            return _CACHE[cache_key]

        # Always attempt to analyze audio first (may raise and bubble up if analysis fails)
        try:
            features = await analyze_audio(audio_bytes)
        except Exception as e:
            logger.exception("Audio analysis failed; returning procedural fallback: %s", e)
            result = self._procedural_fallback({}, options)
            _CACHE[cache_key] = result
            return result

        # If we have a client, try to use it. If anything goes wrong, fall back.
        if getattr(self, "client", None):
            try:
                # Use the new GenAI SDK structure
                from google.genai import types
                import json

                # Build a compact, explicit context for the model using audio features and generation options
                options_dict = options or {}
                options_summary = json.dumps(options_dict, sort_keys=True) if options_dict else "{}"
                prompt = SYNESTHETIC_PROMPT.format(features=json.dumps({
                    "audio": features,
                    "generationOptions": options_dict,
                }, indent=2))

                # Define structured output schema aligned with shared Blueprint for predictable parsing
                response_schema = None  # Keep schema simple in tests; structured parsing is handled manually.

                contents = [prompt]

                # Upload audio file if available
                if hasattr(self, '_adapter') and self._adapter:
                    try:
                        # Create a temporary file for upload
                        import tempfile
                        import os
                        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
                            temp_file.write(audio_bytes)
                            temp_file_path = temp_file.name

                        uploaded_file = await self._adapter.upload_file(temp_file_path)
                        contents.append(uploaded_file)

                        # Clean up temp file
                        os.unlink(temp_file_path)
                    except Exception as upload_error:
                        logger.warning("File upload failed, using inline data: %s", upload_error)
                        # Fallback to inline data
                        import base64
                        encoded_audio = base64.b64encode(audio_bytes).decode('utf-8')
                        from google.genai import types as genai_types
                        contents.append(genai_types.Part.from_bytes(
                            data=audio_bytes,
                            mime_type=content_type
                        ))

                # Generate content with structured output
                config = types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=response_schema,
                    temperature=0.7,
                    max_output_tokens=4000
                )

                # Call the official GenAI SDK directly via the client
                response = await self.client.models.generate_content(
                    model='gemini-2.0-flash',
                    contents=contents,
                    config=config,
                )

                # Parse the response; tests inject a Blueprint (pydantic) in `parsed`.
                if hasattr(response, 'parsed') and response.parsed is not None:
                    blueprint = response.parsed
                else:
                    import json
                    blueprint_text = response.text if hasattr(response, 'text') else str(response)
                    blueprint = json.loads(blueprint_text)

                result = {"blueprint": blueprint, "features": features}
                _CACHE[cache_key] = result
                return result
                _CACHE[cache_key] = result
                return result

            except Exception as e:
                logger.exception("Model generation failed; falling back to procedural generator: %s", e)

        # Final fallback: deterministic procedural generator based on features
        result = self._procedural_fallback(features or {}, options)
        _CACHE[cache_key] = result
        return result


    def _procedural_fallback(self, features: Dict[str, Any], options: Any = None) -> Dict[str, Any]:
        """Create a simple, deterministic blueprint from analyzed features.

        This is intentionally conservative: it produces a small, valid blueprint so the
        frontend can continue development without a live GenAI key.
        """
        # Derive a few numeric seeds from hashed features for deterministic variety
        features_repr = _safe_serialize(features)
        seed = int(hashlib.sha256(features_repr.encode("utf-8")).hexdigest()[:8], 16)
        def seeded_choice(choices):
            return choices[seed % len(choices)]

        palette_candidates = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#9B5CF6"]
        components = ["straight", "climb", "drop", "turn", "loop", "barrelRoll"]

        track = []
        for i in range(5):
            track.append({
                "component": seeded_choice(components),
                "length": 20 + (seed % 30),
                "intensity": (seed % 100),
            })

        # Provide a few additional fields expected by frontend validators
        total_length = sum(seg.get("length", 0) for seg in track)
        blueprint = {
            "id": f"procedural-{seed & 0xffff}",
            "rideName": f"Procedural Ride {seed & 0xffff}",
            "name": f"Procedural Ride {seed & 0xffff}",
            "moodDescription": "A fallback, procedurally generated ride for development.",
            "palette": [seeded_choice(palette_candidates) for _ in range(3)],
            "track": track,
            "duration": float(total_length),
            "audioFeatures": {
                "valence": 0.5,
                "tempo": 120,
                "loudness": -12,
                "danceability": 0.5,
                "speechiness": 0.0,
                "acousticness": 0.1,
                "instrumentalness": 0.0,
                "liveness": 0.0,
            },
            "generatedPath": [],
            "synesthetic": {
                "geometry": {
                    "wireframeDensity": 0.3,
                    "organicBreathing": 0.6,
                    "impossiblePhysics": {"enabled": True, "intensity": 0.4, "frequency": 0.2},
                },
                "particles": {"connectionDensity": 0.5},
                "atmosphere": {"skyMood": "dreamy"},
            },
        }
        return {"blueprint": blueprint, "features": features}


    async def generate_skybox(self, prompt: str, blueprint: Dict[str, Any], options: Any = None) -> Dict[str, Any]:
        """Lightweight skybox generator that returns a placeholder URL in dev/test environments."""
        # In production this would call an image generation model; here we return a stable placeholder.
        return {"url": "https://cdn.example.com/placeholder_skybox.png", "prompt": prompt}

    async def generate_skybox_timeline(self, prompt: str, blueprint: Dict[str, Any], options: Any = None) -> Dict[str, Any]:
        """Generate a timeline of skybox frames using Gemini structured output.

        This keeps the response schema minimal so the frontend can safely consume
        it while we evolve the underlying prompt/strategy.
        """
        # If no real client is available, degrade gracefully to a single placeholder frame.
        if not getattr(self, "client", None) or not hasattr(self, "_adapter"):
            base = await self.generate_skybox(prompt, blueprint, options)
            url = base.get("url") or base.get("imageUrl")
            frames = [{"time": 0.0, "imageUrl": url}] if url else []
            return {"frames": frames}

        try:
            from google.genai import types

            # Structured schema: loopable frames + optional alternate scenes.
            response_schema = {
                "type": "object",
                "properties": {
                    "frames": {
                        "type": "array",
                        "description": "3-6 subtle, loopable variants of the base skybox.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "time": {"type": "number", "description": "Normalized position in the loop (0-1)."},
                                "imageUrl": {"type": "string", "description": "URL or data URL of the skybox image."},
                            },
                            "required": ["time", "imageUrl"],
                        },
                        "minItems": 1,
                        "maxItems": 8,
                    },
                    "alternateScenes": {
                        "type": "array",
                        "description": "Optional, more dramatic edits of the same world for intense musical moments.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "imageUrl": {"type": "string"},
                                "trigger": {
                                    "type": "object",
                                    "description": "Simple conditions under which this scene is appropriate.",
                                    "properties": {
                                        "minEnergy": {"type": "number"},
                                        "maxEnergy": {"type": "number"},
                                        "section": {"type": "string"},
                                        "onDrop": {"type": "boolean"},
                                    },
                                },
                            },
                            "required": ["imageUrl"],
                        },
                    },
                },
                "required": ["frames"],
            }

            # Prompt: blueprint + options + base skybox context; ask for loopable variants
            # and optional alternate scenes. Gemini suggests, engine decides.
            context = {
                "blueprint": blueprint,
                "generationOptions": options or {},
            }

            contents = [
                "SYSTEM: You design skyboxes for an audio-reactive rollercoaster.",
                "SYSTEM: Use the base skybox style and this blueprint context.",
                "SYSTEM: Output JSON ONLY that matches response_schema.",
                "SYSTEM: Produce 3-6 subtle loopable frames (frames[]) that:",
                "- Keep the same camera and world.",
                "- Vary only lighting, atmosphere, and distant details.",
                "- Seamlessly loop: frames[0] -> ... -> frames[n-1] -> frames[0] without jumps.",
                "SYSTEM: Optionally, include alternateScenes[] as more intense edits of the SAME world.",
                "- These must still match the blueprint theme.",
                "- Provide simple triggers (minEnergy/maxEnergy/section/onDrop) only as suggestions.",
                "- Do NOT rely on these being executed; they are hints, not commands.",
                json.dumps(context, ensure_ascii=True),
                prompt,
            ]

            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.6,
                max_output_tokens=2048,
            )

            response = await self._adapter.generate_content(
                model="gemini-2.5-flash",  # timeline-friendly, fast image planning
                contents=contents,
                config=config,
            )

            # Prefer structured/parsed if provided, else parse text.
            data: Dict[str, Any]
            if hasattr(response, "parsed") and response.parsed:
                data = response.parsed  # type: ignore[assignment]
            else:
                raw = getattr(response, "text", lambda: str(response))()
                data = json.loads(raw)

            frames = data.get("frames") or []
            # Basic sanitation: only keep valid frames.
            safe_frames = []
            for f in frames:
                if not isinstance(f, dict):
                    continue
                url = f.get("imageUrl")
                if isinstance(url, str) and url:
                    t = f.get("time")
                    # Keep time in [0,1] loop space; default to 0 if missing.
                    nt = float(t) if isinstance(t, (int, float)) else 0.0
                    if nt < 0.0 or nt > 1.0:
                        nt = 0.0
                    safe_frames.append({
                        "time": nt,
                        "imageUrl": url,
                    })
            if not safe_frames:
                # Fallback to a single skybox
                base = await self.generate_skybox(prompt, blueprint, options)
                url = base.get("url") or base.get("imageUrl")
                safe_frames = [{"time": 0.0, "imageUrl": url}] if url else []

            # Parse optional alternateScenes, but keep them advisory.
            alternates_raw = data.get("alternateScenes") or []
            alternate_scenes = []
            for a in alternates_raw:
                if not isinstance(a, dict):
                    continue
                url = a.get("imageUrl")
                if not isinstance(url, str) or not url:
                    continue
                trigger = a.get("trigger") if isinstance(a.get("trigger"), dict) else {}
                alternate_scenes.append({
                    "imageUrl": url,
                    "trigger": {
                        "minEnergy": trigger.get("minEnergy"),
                        "maxEnergy": trigger.get("maxEnergy"),
                        "section": trigger.get("section"),
                        "onDrop": trigger.get("onDrop"),
                    },
                })

            result: Dict[str, Any] = {"frames": safe_frames}
            if alternate_scenes:
                result["alternateScenes"] = alternate_scenes
            return result
        except Exception as e:  # defensive: never break ride due to timeline skybox
            logger.warning("generate_skybox_timeline failed; falling back: %s", e)
            base = await self.generate_skybox(prompt, blueprint, options)
            url = base.get("url") or base.get("imageUrl")
            frames = [{"time": 0.0, "imageUrl": url}] if url else []
            return {"frames": frames}


# Module-level singleton used by the FastAPI dependency in endpoints.py
try:
    gemini_service = GeminiService(api_key=os.environ.get("GEMINI_API_KEY"))
except Exception:
    # Be defensive during import; ensure endpoints importing this module don't blow up.
    gemini_service = GeminiService(client=None)
