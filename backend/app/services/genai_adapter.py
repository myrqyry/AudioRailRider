"""genai_adapter — a small wrapper around the google-genai SDK.

This module performs lazy imports and exposes simple async helpers used by
`GeminiService`. The adapter is safe to import in test/dev environments and
only imports the real SDK when an API key is configured.
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Optional

logger = logging.getLogger("genai_adapter")


class GenAIAdapter:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key
        self._client = None
        self._initialized = False

    def _ensure_client(self) -> None:
        if self._initialized:
            return
        self._initialized = True
        try:
            from google import genai as _genai

            # instantiate the client with the provided key (or default env)
            try:
                self._client = _genai.Client(api_key=self.api_key)
            except TypeError:
                # some environments may expect different args; try no-arg constructor
                self._client = _genai.Client()
        except Exception as e:  # pragma: no cover - exercised only when SDK is present
            logger.exception("Failed to import google-genai: %s", e)
            self._client = None

    @property
    def client(self) -> Optional[Any]:
        self._ensure_client()
        return self._client

    async def generate_content(self, model: str, contents: Any, config: Optional[Any] = None) -> Any:
        """Call the SDK generate_content in an async-safe manner.

        - If the SDK client exposes `aio.models.generate_content`, prefer that.
        - Otherwise, run the sync client method in the default loop executor.
        """
        self._ensure_client()
        if self._client is None:
            raise RuntimeError("GenAI SDK client is not available")

        # Parse the contents if it's a JSON string
        content_data = contents
        if isinstance(contents, str):
            try:
                content_data = json.loads(contents)
            except:
                content_data = {"text": contents}

        # Build the synesthetic prompt for AudioRailRider
        prompt = self._build_synesthetic_prompt(content_data)

        # Prepare the content parts
        content_parts = [{"text": prompt}]
        
        # Add audio part if present
        if isinstance(content_data, dict) and 'audio_data' in content_data:
            audio_part = content_data['audio_data']
            if isinstance(audio_part, dict) and 'inlineData' in audio_part:
                # Convert bytes to base64 for inline data
                import base64
                audio_bytes = audio_part['inlineData']['content']
                if isinstance(audio_bytes, bytes):
                    encoded = base64.b64encode(audio_bytes).decode('utf-8')
                    content_parts.append({
                        "inlineData": {
                            "data": encoded,
                            "mimeType": audio_part['inlineData']['mimeType']
                        }
                    })

        # If async client available
        aio = getattr(self._client, "aio", None)
        if aio is not None and getattr(aio, "models", None) is not None and hasattr(aio.models, "generate_content"):
            return await aio.models.generate_content(model=model, contents=content_parts, config=config)

        # fallback to sync call in executor
        def _sync_call():
            return self._client.models.generate_content(model=model, contents=content_parts, config=config)

        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, _sync_call)

    def _build_synesthetic_prompt(self, contents: Any) -> str:
        """Build the advanced synesthetic prompt for AudioRailRider."""
        if not isinstance(contents, dict):
            return "Generate a ride blueprint from the provided audio."

        features = contents.get('features', {})
        options = contents.get('options', {})

        # Extract audio features
        duration = features.get('duration', 180)
        bpm = features.get('bpm', 120)
        energy = features.get('energy', 0.5)
        spectral_centroid = features.get('spectralCentroid', 1000)
        spectral_flux = features.get('spectralFlux', 0.1)

        # Build the synesthetic prompt
        prompt = f"""You are a synesthetic architect, tasked with translating the soul of music into rideable sculpture.

Given this musical soulprint:
- Duration: {duration} seconds
- BPM: {bpm}
- Energy: {energy}
- Spectral Centroid: {spectral_centroid}
- Spectral Flux: {spectral_flux}

Respond with a JSON blueprint that embodies the song's dream of itself:
{{
  "rideName": "Creative ride name",
  "moodDescription": "Evocative description of the ride's atmosphere",
  "palette": ["#color1", "#color2", "#color3"],
  "track": [
    {{
      "component": "climb|drop|turn|loop|barrelRoll",
      "length": number,
      "angle": number (for climb/drop),
      "direction": "left|right" (for turn),
      "radius": number (for loop/turn),
      "rotations": number (for loop/barrelRoll)
    }}
  ],
  "synesthetic": {{
    "geometry": {{
      "wireframeDensity": 0.0-1.0,
      "impossiblePhysics": true|false,
      "organicBreathing": 0.0-1.0,
      "breathingDriver": "energy|spectralFlux|spectralCentroid"
    }},
    "particles": {{
      "connectionDensity": 0.0-1.0,
      "resonanceThreshold": 0.0-1.0,
      "lifespanSeconds": 1.0-10.0,
      "persistence": 0.0-1.0
    }},
    "atmosphere": {{
      "skyMood": "celestial|dreamy|chaotic|serene",
      "turbulenceBias": 0.0-2.0,
      "passionIntensity": 0.0-2.0,
      "tint": "#hexcolor"
    }}
  }}
}}

Create a track that feels like the music's physical manifestation - where impossible loops defy gravity, breathing geometry pulses with the rhythm, and particles form neural networks based on harmonic relationships."""

        return prompt

    async def upload_file(self, file_path: str) -> Any:
        self._ensure_client()
        if self._client is None:
            raise RuntimeError("GenAI SDK client is not available")

        aio = getattr(self._client, "aio", None)
        if aio is not None and getattr(aio, "files", None) is not None and hasattr(aio.files, "upload"):
            return await aio.files.upload(file=file_path)

        # sync fallback
        def _sync_upload():
            return self._client.files.upload(file=file_path)

        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, _sync_upload)


__all__ = ["GenAIAdapter"]
