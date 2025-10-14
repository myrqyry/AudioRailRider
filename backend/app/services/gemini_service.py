import json
import logging
from io import BytesIO
from contextlib import asynccontextmanager

# Configure logging
logger = logging.getLogger(__name__)

# Avoid hard failures at import time for optional / heavy dependencies
try:
    from fastapi import HTTPException
except ImportError:
    class HTTPException(Exception):
        def __init__(self, status_code: int = 500, detail: str | None = None):
            super().__init__(detail)
            self.status_code = status_code
            self.detail = detail

try:
    from google import genai
    from google.genai import types
    from google.genai.client import File, Client
    from google.generative_ai.errors import APIError, BadResponseError
except ImportError:
    genai = None
    types = None
    File = None
    Client = None
    APIError = Exception
    BadResponseError = Exception

from ..config.settings import settings
from ..schema.blueprint import Blueprint

# Lazily import the audio analysis implementation to avoid importing librosa at module import time.
async def analyze_audio(audio_bytes: bytes):
    """Lazy proxy to the real audio analysis implementation."""
    try:
        from .audio_analysis_service import analyze_audio as _analyze
        return await _analyze(audio_bytes)
    except Exception as e:
        logger.error(f"Audio analysis lazy import/call failed: {e}", exc_info=True)
        raise

class GeminiService:
    def __init__(self):
        if genai and settings.GEMINI_API_KEY:
            try:
                self.client: Client | None = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}", exc_info=True)
                self.client = None
        else:
            self.client = None

    @asynccontextmanager
    async def _managed_file_upload(self, audio_bytes: bytes, content_type: str):
        """Context manager for uploading and cleaning up temporary files."""
        if not self.client or not File:
            raise HTTPException(status_code=503, detail="Gemini client not available for file upload.")

        uploaded_file = None
        try:
            logger.info(f"Uploading {len(audio_bytes) / 1024:.1f} KB file to Gemini.")
            buffer = BytesIO(audio_bytes)
            uploaded_file = await self.client.aio.files.upload(
                file=buffer,
                mime_type=content_type or "audio/mpeg",
            )
            yield uploaded_file
        finally:
            if uploaded_file:
                logger.info(f"Deleting temporary file: {uploaded_file.name}")
                await self.client.aio.files.delete(uploaded_file.name)

    def generate_prompt_text(self, duration: float, bpm: float, energy: float,
                             spectral_centroid: float, spectral_flux: float,
                             options: dict | None = None) -> str:
        opt_lines = []
        if options:
            # ... (omitting for brevity, no changes here) ...
            pass
        option_block = ('\n'.join(opt_lines) + '\n') if opt_lines else ''

        return f"""
Audio analysis: {duration:.0f}s, {bpm:.0f} BPM, Energy {energy:.2f}, Spectral Centroid {spectral_centroid:.0f}Hz, Spectral Flux {spectral_flux:.3f}.
{option_block}
Create a rollercoaster blueprint (12-20 segments) from this audio...
""" # (omitting rest of prompt for brevity)

    SYSTEM_INSTRUCTION = """
You are a synesthetic architect...
""" # (omitting for brevity)

    async def generate_blueprint(self, audio_bytes: bytes, content_type: str, options: dict | None = None):
        audio_features = {}
        try:
            # Asynchronously analyze audio first. If this fails, we can't proceed.
            audio_features = await analyze_audio(audio_bytes)

            prompt = self.generate_prompt_text(
                audio_features["duration"], audio_features["bpm"], audio_features["energy"],
                audio_features["spectralCentroid"], audio_features["spectralFlux"], options
            )

            if not self.client or not types:
                raise RuntimeError("Gemini SDK is not configured. Install google-genai and set GEMINI_API_KEY.")

            SIZE_THRESHOLD = 2 * 1024 * 1024  # 2 MB
            if len(audio_bytes) <= SIZE_THRESHOLD:
                audio_part = types.Part.from_bytes(data=audio_bytes, mime_type=content_type or "audio/mpeg")
                contents = [prompt, audio_part]
            else:
                async with self._managed_file_upload(audio_bytes, content_type) as uploaded_file:
                    contents = [prompt, uploaded_file]

            generation_config = types.GenerateContentConfig(
                response_mime_type='application/json', response_schema=Blueprint,
                system_instruction=self.SYSTEM_INSTRUCTION, temperature=0.8,
            )

            response = await self.client.aio.models.generate_content(
                model='gemini-2.5-flash', contents=contents, config=generation_config,
            )

            blueprint = response.parsed if hasattr(response, 'parsed') else json.loads(response.text)
            if blueprint:
                if isinstance(blueprint, dict):
                    blueprint['generationOptions'] = options
                else:
                    setattr(blueprint, 'generationOptions', options)

            return {"blueprint": blueprint, "features": audio_features}

        except (APIError, BadResponseError) as e:
            logger.error(f"Gemini API error during blueprint generation: {e}", exc_info=True)
            # Fall through to procedural fallback
        except json.JSONDecodeError as e:
            logger.error(f"Gemini returned invalid JSON: {e}", exc_info=True)
            # Fall through to procedural fallback
        except Exception as e:
            # Catch other exceptions (e.g., from audio analysis) and attempt fallback
            logger.error(f"Unexpected error during blueprint generation: {e}", exc_info=True)
            # If audio features are missing, we cannot run fallback.
            if not audio_features:
                raise HTTPException(status_code=500, detail=f"Failed to generate blueprint due to an initial error: {e}")

        # Fallback path
        try:
            logger.warning("Falling back to procedural blueprint generation.")
            fb = self._procedural_fallback(audio_features)
            return {"blueprint": fb, "features": audio_features}
        except Exception as e:
            logger.error(f"Procedural fallback also failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to generate fallback blueprint: {e}")

    def _procedural_fallback(self, features: dict) -> dict:
        # ... (omitting for brevity, no changes here) ...
        return {}

    async def generate_skybox(self, prompt: str, blueprint_data: dict | None = None, options: dict | None = None):
        # ... (omitting for brevity, no changes here) ...
        pass

gemini_service = GeminiService()