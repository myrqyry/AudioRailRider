import os
import json
from io import BytesIO
import tempfile
import pathlib

# Avoid hard failures at import time for optional / heavy dependencies (fastapi, google-genai, librosa)
try:
    from fastapi import HTTPException
except Exception:
    # Minimal fallback so unit tests can import this module without fastapi installed.
    class HTTPException(Exception):
        def __init__(self, status_code: int = 500, detail: str | None = None):
            super().__init__(detail)
            self.status_code = status_code
            self.detail = detail

try:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError
except Exception:
    genai = None
    types = None
    APIError = Exception

from ..config.settings import settings
from ..schema.blueprint import Blueprint

# Lazily import the audio analysis implementation to avoid importing librosa at module import time.
def analyze_audio(audio_bytes: bytes):
    """Lazy proxy to the real audio analysis implementation.

    Tests can monkeypatch `backend.app.services.gemini_service.analyze_audio` easily.
    """
    try:
        from .audio_analysis_service import analyze_audio as _analyze
        return _analyze(audio_bytes)
    except Exception as e:
        # Re-raise so callers see the original error if analysis is invoked in real runs.
        raise

class GeminiService:
    def __init__(self):
        # Create client only if genai is available. Unit tests typically set `svc.client` to a
        # SimpleNamespace stub after construction, so failing to create a real client here
        # should not be fatal for tests.
        if genai is not None:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                # Keep the attribute so tests can replace it.
                self.client = None
        else:
            self.client = None

    def generate_prompt_text(self, duration: float, bpm: float, energy: float,
                             spectral_centroid: float, spectral_flux: float) -> str:
        return f"""
Audio analysis: {duration:.0f}s, {bpm:.0f} BPM, Energy {energy:.2f}, Spectral Centroid {spectral_centroid:.0f}Hz, Spectral Flux {spectral_flux:.3f}.
Create a rollercoaster blueprint (12-20 segments) from this audio.
- rideName: Creative name reflecting the music.
- moodDescription: Short, evocative theme.
- palette: 3 hex colors [rail, glow, sky] matching the mood.
- track: Design a track where intensity mirrors the music's dynamics. Use high-excitement components ('drop', 'loop', 'barrelRoll') for energetic parts.
"""

    SYSTEM_INSTRUCTION = """
You are a synesthetic architect, a digital-alchemist. Your purpose is to translate a song's audio data directly into a rollercoaster blueprint.
Track components: 'climb', 'drop', 'turn', 'loop', 'barrelRoll'.
- 'climb': angle (10-30), length (100-300).
- 'drop': angle (-35 to -70), length (100-300).
- 'turn': direction ('left'/'right'), radius (80-150), angle (90-180).
- 'loop': radius (40-80).
- 'barrelRoll': rotations (1-2), length (100-200).
"""

    async def generate_blueprint(self, audio_bytes: bytes, content_type: str):
        try:
            # Server-side audio analysis
            audio_features = analyze_audio(audio_bytes)

            prompt = self.generate_prompt_text(
                audio_features["duration"],
                audio_features["bpm"],
                audio_features["energy"],
                audio_features["spectralCentroid"],
                audio_features["spectralFlux"]
            )

            # Choose an upload strategy based on payload size:
            # - Inline Part for small payloads (keeps everything in one request)
            # - Files API upload for larger payloads (stream via BytesIO)
            contents = None
            SIZE_THRESHOLD = 2 * 1024 * 1024  # 2 MB

            if len(audio_bytes) <= SIZE_THRESHOLD:
                # Inline the bytes as a Part (recommended/explicit mime type)
                part = types.Part.from_bytes(data=audio_bytes, mime_type=content_type or "audio/mpeg")
                contents = [part, prompt]
            else:
                # For larger files: write to a temp file and upload by path.
                # This is the most robust approach across SDK versions.
                tmp_path = None
                try:
                    # infer suffix from content_type when available
                    mime_to_ext = {
                        'audio/mpeg': '.mp3',
                        'audio/mp3': '.mp3',
                        'audio/wav': '.wav',
                        'audio/x-wav': '.wav',
                        'audio/flac': '.flac',
                        'audio/aac': '.aac',
                        'audio/ogg': '.ogg',
                    }
                    suffix = mime_to_ext.get((content_type or '').lower(), '.mp3')
                    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tf:
                        tf.write(audio_bytes)
                        tmp_path = tf.name
                    uploaded_file = await self.client.aio.files.upload(file=tmp_path)
                    contents = [uploaded_file, prompt]
                finally:
                    try:
                        if tmp_path and pathlib.Path(tmp_path).exists():
                            pathlib.Path(tmp_path).unlink()
                    except Exception:
                        pass

            # Request structured JSON output using the Blueprint Pydantic model.
            # The SDK will convert Pydantic -> Schema automatically.
            # Put system instructions inside the config so SDK variations accept it
            config_dict = {'response_mime_type': 'application/json', 'response_schema': Blueprint, 'system_instruction': self.SYSTEM_INSTRUCTION, 'temperature': 0.8}
            try:
                response = await self.client.aio.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=contents,
                    config=config_dict,
                )
            except TypeError:
                # Try using types.GenerateContentConfig if the SDK expects that type
                gen_cfg = types.GenerateContentConfig(response_mime_type='application/json', system_instruction=self.SYSTEM_INSTRUCTION, temperature=0.8)
                response = await self.client.aio.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=contents,
                    config=gen_cfg,
                )

            # Prefer SDK-parsed pydantic object if available
            try:
                blueprint = response.parsed
            except Exception:
                # Fallback: parse raw JSON text
                blueprint = json.loads(response.text)

            # Return both the blueprint and the audio features
            return {"blueprint": blueprint, "features": audio_features}

        except APIError as e:
            # For API errors, log and fall through to fallback blueprint generation
            print(f"Gemini APIError during blueprint generation: {e}")
        except json.JSONDecodeError:
            print("Gemini returned invalid JSON; falling back to procedural generator.")
        except Exception as e:
            # Log unexpected errors and fall back rather than returning HTTP 500
            print(f"Unexpected error during blueprint generation: {e}")

        # Fallback: if anything in the AI path failed, create a simple procedural
        # blueprint based on extracted audio features so the frontend can continue.
        try:
            fb = self._procedural_fallback(audio_features)
            return {"blueprint": fb, "features": audio_features}
        except Exception as e:
            # If fallback also fails, raise an HTTP error as last resort
            raise HTTPException(status_code=500, detail=f"Failed to generate fallback blueprint: {e}")

    def _procedural_fallback(self, features: dict) -> dict:
        # Build a minimal, deterministic blueprint using audio features
        dur = float(features.get('duration', 120.0))
        energy = float(features.get('energy', 0.5))
        bpm = float(features.get('bpm', 120.0))

        # Determine segment count from duration and energy
        segs = max(8, min(24, int(8 + (dur / 30) + energy * 8)))

        track = []
        for i in range(segs):
            intensity = (i / max(1, segs - 1)) * energy
            if intensity > 0.7:
                track.append({"type": "drop", "angle": -40 - int(10 * intensity), "length": 120 + int(80 * intensity)})
            elif intensity > 0.4:
                track.append({"type": "turn", "direction": "left" if i % 2 == 0 else "right", "radius": 100, "angle": 120})
            else:
                track.append({"type": "climb", "angle": 15, "length": 100})

        # Build a simple deterministic rideName and palette from features
        name_seed = int((dur + energy * 100 + bpm) % 10000)
        ride_name = f"Fallback Ride {name_seed}"
        # deterministic palette: vary hue by bpm and energy
        base1 = '#{:02x}{:02x}{:02x}'.format(80, int(80 + energy * 100) % 256, 200)
        base2 = '#{:02x}{:02x}{:02x}'.format(200, int(120 + bpm) % 256, 120)
        base3 = '#{:02x}{:02x}{:02x}'.format(120, 160, int(160 + energy * 80) % 256)

        blueprint_dict = {
            "rideName": ride_name,
            "moodDescription": "Procedurally generated fallback based on audio features.",
            "palette": [base1, base2, base3],
            "track": track
        }

        # Return a Pydantic Blueprint instance for consistency with response_schema
        try:
            return Blueprint(**blueprint_dict)
        except Exception:
            return blueprint_dict

    async def generate_skybox(self, prompt: str):
        try:
            full_prompt = f"Generate a photorealistic, equirectangular 360-degree panorama of: {prompt}"

            response = await self.client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="image/jpeg"
                )
            )

            image_part = response.candidates[0].content.parts[0]
            image_bytes = image_part.blob.data

            import base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')

            return {"imageUrl": f"data:image/jpeg;base64,{base64_image}"}
        except APIError as e:
            if e.status == 401:
                raise HTTPException(status_code=401, detail="Authentication failed. Please check the API key.")
            elif e.status == 400:
                raise HTTPException(status_code=400, detail=f"Invalid request for skybox generation: {str(e)}")
            else:
                raise HTTPException(status_code=500, detail=f"API error during skybox generation: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred during image generation: {e}")

gemini_service = GeminiService()