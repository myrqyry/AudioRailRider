import os
import json
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from google.genai.types import HarmCategory, HarmBlockThreshold
from google.genai.errors import APIError, PermissionDenied, InvalidArgument
from dotenv import load_dotenv

load_dotenv()

# --- FastAPI App Setup ---
app = FastAPI(title="AudioRailRider Backend", description="Backend API for AudioRailRider", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gemini Configuration ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found. API calls will fail.")
    client = genai.Client(api_key=api_key) if api_key else None
except Exception as e:
    print(f"Error configuring Gemini: {e}")
    client = None

# --- Prompt Engineering ---
def generate_prompt_text(duration: float, bpm: float, energy: float,
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

# --- Pydantic Models ---
class SkyboxRequest(BaseModel):
    prompt: str

# --- API Endpoints ---
@app.get("/")
async def root():
    return {"message": "AudioRailRider Backend is running!", "status": "healthy"}

@app.post("/api/generate-blueprint")
async def generate_blueprint(
    duration: float = Form(...),
    bpm: float = Form(...),
    energy: float = Form(...),
    spectralCentroid: float = Form(...),
    spectralFlux: float = Form(...),
    audio_file: UploadFile = File(...)
):
    if not client:
        raise HTTPException(status_code=500, detail="The server is not configured with a GEMINI_API_KEY.")

    try:
        prompt = generate_prompt_text(duration, bpm, energy, spectralCentroid, spectralFlux)

        # The new SDK requires files to be uploaded first
        audio_bytes = await audio_file.read()
        uploaded_file = await client.aio.files.upload(
            file=audio_bytes,
            mime_type=audio_file.content_type
        )

        response = await client.aio.models.generate_content(
            model='gemini-1.5-flash', # Or a more advanced model
            contents=[prompt, uploaded_file],
            generation_config=types.GenerationConfig(
                response_mime_type='application/json',
                temperature=0.8
            ),
            system_instruction=SYSTEM_INSTRUCTION,
        )

        blueprint = json.loads(response.text)
        return blueprint

    except PermissionDenied:
        raise HTTPException(status_code=401, detail="Authentication failed. Please check the API key.")
    except InvalidArgument as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")
    except json.JSONDecodeError:
        print(f"Blueprint Generation - JSON Decode Error. Raw text: {response.text}")
        raise HTTPException(status_code=500, detail="The AI returned a response that was not valid JSON.")
    except Exception as e:
        print(f"Unexpected error during blueprint generation: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during blueprint generation.")

@app.post("/api/generate-skybox")
async def generate_skybox(request: SkyboxRequest):
    if not client:
        raise HTTPException(status_code=500, detail="The server is not configured with a GEMINI_API_KEY.")

    try:
        prompt = f"Generate a photorealistic, equirectangular 360-degree panorama of: {request.prompt}"

        # The new SDK uses a different model for image generation and response structure
        response = await client.aio.models.generate_content(
            model='gemini-1.5-flash-preview-0514', # A model that supports image generation
            contents=prompt,
            generation_config=types.GenerationConfig(
                response_mime_type="image/jpeg"
            )
        )

        # Extract image data from the new response structure
        image_part = response.candidates[0].content.parts[0]
        image_bytes = image_part.blob.data

        import base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')

        return {
            "imageUrl": f"data:image/jpeg;base64,{base64_image}"
        }

    except PermissionDenied:
        raise HTTPException(status_code=401, detail="Authentication failed. Please check the API key.")
    except InvalidArgument as e:
        raise HTTPException(status_code=400, detail=f"Invalid request for skybox generation: {str(e)}")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"API error during skybox generation: {str(e)}")
    except Exception as e:
        print(f"Error during skybox generation: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during image generation.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)