import json
import logging
import pathlib
import tempfile
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
        """Context manager for uploading and cleaning up temporary files.

        Strategy:
        1. Try to upload the bytes stream directly (most SDKs accept file-like objects).
        2. If stream upload fails, fall back to writing a temporary file and uploading by path.
        3. Ensure remote file is deleted after use and local temp file is removed.
        """
        if not self.client or not File:
            raise HTTPException(status_code=503, detail="Gemini client not available for file upload.")

        tmp_path: str | None = None
        uploaded_file = None
        try:
            logger.info(f"Uploading {len(audio_bytes) / 1024:.1f} KB file to Gemini (attempt stream upload).")
            # First try stream upload using an in-memory buffer.
            try:
                buffer = BytesIO(audio_bytes)
                # Some SDK versions accept a mime_type kwarg; others accept an UploadFileConfig.
                if types and hasattr(types, 'UploadFileConfig') and content_type:
                    try:
                        upload_config = types.UploadFileConfig(mime_type=content_type)
                        uploaded_file = await self.client.aio.files.upload(file=buffer, config=upload_config)
                    except Exception:
                        uploaded_file = await self.client.aio.files.upload(file=buffer, mime_type=content_type or "audio/mpeg")
                else:
                    uploaded_file = await self.client.aio.files.upload(file=buffer, mime_type=content_type or "audio/mpeg")
                yield uploaded_file
                return
            except Exception:
                logger.debug("Stream upload failed, falling back to tempfile-based upload.", exc_info=True)

            # Fallback: persist to a temporary file and upload by path
            mime_map = {
                'audio/mpeg': '.mp3',
                'audio/mp3': '.mp3',
                'audio/wav': '.wav',
                'audio/x-wav': '.wav',
                'audio/flac': '.flac',
                'audio/aac': '.aac',
                'audio/ogg': '.ogg',
            }
            suffix = mime_map.get((content_type or '').lower(), '.mp3')
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            upload_kwargs: dict[str, object] = {'file': tmp_path}
            if types and hasattr(types, 'UploadFileConfig') and content_type:
                try:
                    upload_kwargs['config'] = types.UploadFileConfig(mime_type=content_type)
                except Exception:
                    # Some SDK versions may not expose UploadFileConfig; continue without it.
                    pass

            uploaded_file = await self.client.aio.files.upload(**upload_kwargs)
            yield uploaded_file
        finally:
            # Attempt to delete the uploaded remote file if present
            if uploaded_file:
                try:
                    if hasattr(uploaded_file, 'name'):
                        await self.client.aio.files.delete(uploaded_file.name)
                except Exception:
                    logger.warning("Failed to delete uploaded remote file", exc_info=True)

            # Remove local temporary file if we created one
            if tmp_path:
                try:
                    pathlib.Path(tmp_path).unlink(missing_ok=True)  # type: ignore[arg-type]
                except Exception:
                    logger.debug("Failed to remove temporary file", exc_info=True)

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

            # Choose an upload strategy based on payload size:
            # - Inline Part for small payloads (keeps everything in one request)
            # - Files API upload for larger payloads (persist to disk for streaming)
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
        """
        Generate a skybox image using Gemini 2.5 Flash Image Preview model.
        This model excels at creative image generation with rich context understanding.

        Args:
            prompt: The mood/theme description from the blueprint
            blueprint_data: Optional full blueprint for additional context
            options: Optional hints that further constrain the skybox aesthetics
        """
        try:
            # Build a rich, contextual prompt using blueprint data if available
            if blueprint_data:
                ride_name = blueprint_data.get('rideName', 'Unknown Ride')
                mood = blueprint_data.get('moodDescription', prompt)
                palette = blueprint_data.get('palette', [])
                
                # Extract palette description
                palette_desc = ""
                if palette and len(palette) >= 3:
                    palette_desc = f" with colors {palette[0]} (rail), {palette[1]} (glow), and {palette[2]} (sky)"
                
                # Integrate generation options if provided
                opt_lines = []
                if options:
                    if options.get('worldTheme'):
                        opt_lines.append(f"Theme: {options.get('worldTheme')}")
                    if options.get('visualStyle'):
                        opt_lines.append(f"Visual style: {options.get('visualStyle')}")
                    if options.get('paletteHint') and isinstance(options.get('paletteHint'), list):
                        opt_lines.append(f"Palette hint: {', '.join(options.get('paletteHint')[:3])}")

                options_block = ('\n'.join(opt_lines) + '\n') if opt_lines else ''

                full_prompt = f"""Create a breathtaking, cinematic wide-angle sky scene for a rollercoaster experience called "{ride_name}".

Mood: {mood}
{options_block}Visual Style: Photorealistic, epic, atmospheric, with dynamic lighting and volumetric effects{palette_desc}.

Requirements:
- Seamless, tileable 360° equirectangular image suitable for a skybox
- No people, characters, silhouettes, signage, or text overlays
- Focus entirely on sky, clouds, light, and atmospheric elements

The sky should evoke the emotional journey of the ride - make it vast, immersive, and visually stunning. Think of this as the backdrop for an unforgettable thrill ride experience. Include dramatic clouds, atmospheric perspective, and a sense of infinite space."""
            else:
                full_prompt = f"""Create a breathtaking, cinematic wide-angle sky scene with the following mood: {prompt}

Make it photorealistic, epic, and atmospheric with dramatic lighting, volumetric clouds, and a sense of vast infinite space. The output must be a seamless, tileable 360° equirectangular skybox image with no people, characters, silhouettes, signage, or text. Focus purely on sky and atmospheric detail for use as an immersive rollercoaster backdrop."""

            # Use Gemini 2.5 Flash Image Preview with chat mode for best results
            # This model supports direct image generation without needing a base image
            chat = self.client.aio.chats.create(model='gemini-2.5-flash-image-preview')
            
            response = await chat.send_message(full_prompt)

            # Extract the generated image from response parts
            image_bytes = None
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_bytes = part.inline_data.data
                    break
            
            if not image_bytes:
                raise Exception("No image generated in response")

            import base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')

            return {"imageUrl": f"data:image/jpeg;base64,{base64_image}"}
            
        except APIError as e:
            if hasattr(e, 'status'):
                if e.status == 401:
                    raise HTTPException(status_code=401, detail="Authentication failed. Please check the API key.")
                elif e.status == 400:
                    raise HTTPException(status_code=400, detail=f"Invalid request for skybox generation: {str(e)}")
            raise HTTPException(status_code=500, detail=f"API error during skybox generation: {str(e)}")
        except Exception as e:
            import traceback
            print(f"[GeminiService] Skybox generation error: {e}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred during image generation: {e}")

gemini_service = GeminiService()