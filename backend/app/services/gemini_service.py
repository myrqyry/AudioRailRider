import os
import json
from fastapi import HTTPException
from google import genai
from google.genai import types
from google.genai.errors import APIError
from ..config.settings import settings
from .audio_analysis_service import analyze_audio

class GeminiService:
    def __init__(self):
        try:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        except Exception as e:
            # Using a more specific exception might be better if the library provides one
            raise RuntimeError(f"Failed to initialize Gemini client: {e}")

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

            uploaded_file = await self.client.aio.files.upload(
                file=audio_bytes,
                mime_type=content_type
            )

            response = await self.client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=[prompt, uploaded_file],
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.8
                ),
                system_instruction=self.SYSTEM_INSTRUCTION,
            )

            blueprint = json.loads(response.text)

            # Return both the blueprint and the audio features
            return {"blueprint": blueprint, "features": audio_features}

        except APIError as e:
            if e.status == 401:
                raise HTTPException(status_code=401, detail="Authentication failed. Please check the API key.")
            elif e.status == 400:
                raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
            else:
                raise HTTPException(status_code=500, detail=f"API error: {str(e)}")
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="The AI returned a response that was not valid JSON.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred during blueprint generation: {e}")

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