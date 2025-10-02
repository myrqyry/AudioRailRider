import os
import base64
import json
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from dotenv import load_dotenv

# --- Constants from frontend ---
SYSTEM_INSTRUCTION = """
You are a synesthetic architect, a digital-alchemist. Your purpose is to translate a song's audio data directly into a rollercoaster blueprint.
Track components: 'climb', 'drop', 'turn', 'loop', 'barrelRoll'.
- 'climb': angle (10-30), length (100-300).
- 'drop': angle (-35 to -70), length (100-300).
- 'turn': direction ('left'/'right'), radius (80-150), angle (90-180).
- 'loop': radius (40-80).
- 'barrelRoll': rotations (1-2), length (100-200).
"""

PROMPT_TEXT = (duration: float, bpm: float, energy: float, spectralCentroid: float, spectralFlux: float) -> str:
    return f"""
Audio analysis: {duration:.0f}s, {bpm:.0f} BPM, Energy {energy:.2f}, Spectral Centroid {spectralCentroid:.0f}Hz, Spectral Flux {spectralFlux:.3f}.
Create a rollercoaster blueprint (12-20 segments) from this audio.
- rideName: Creative name reflecting the music.
- moodDescription: Short, evocative theme.
- palette: 3 hex colors [rail, glow, sky] matching the mood.
- track: Design a track where intensity mirrors the music's dynamics. Use high-excitement components ('drop', 'loop', 'barrelRoll') for energetic parts.
"""

# --- FastAPI App Setup ---
load_dotenv()

app = FastAPI(title="AudioRailRider Backend", description="Backend API for AudioRailRider", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gemini Configuration ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found. API calls will fail.")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Error configuring Gemini: {e}")

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
    if not genai.api_key:
        raise HTTPException(status_code=500, detail="The server is not configured with a GEMINI_API_KEY.")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = PROMPT_TEXT(duration, bpm, energy, spectralCentroid, spectralFlux)
        audio_bytes = await audio_file.read()

        response = model.generate_content([prompt, {"mime_type": audio_file.content_type, "data": audio_bytes}])

        blueprint = json.loads(response.text)
        return blueprint

    except google_exceptions.PermissionDenied as e:
        print(f"Blueprint Generation - Permission Denied: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed. Please check the server's API key.")
    except google_exceptions.InvalidArgument as e:
        print(f"Blueprint Generation - Invalid Argument: {e}")
        raise HTTPException(status_code=400, detail="The request to the AI was invalid. The audio file may be unsupported or corrupted.")
    except json.JSONDecodeError:
        print(f"Blueprint Generation - JSON Decode Error. Raw text: {response.text}")
        raise HTTPException(status_code=500, detail="The AI returned a response that was not valid JSON.")
    except Exception as e:
        print(f"Error during blueprint generation: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during blueprint generation.")

@app.post("/api/generate-skybox")
async def generate_skybox(request: SkyboxRequest):
    if not genai.api_key:
        raise HTTPException(status_code=500, detail="The server is not configured with a GEMINI_API_KEY.")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash-image-preview")
        full_prompt = f"Generate a photorealistic, equirectangular 360-degree panorama of: {request.prompt}"

        response = model.generate_content(full_prompt)

        candidate = response.candidates[0]
        image_part = next((part for part in candidate.content.parts if hasattr(part, 'inline_data')), None)

        if not image_part:
            raise HTTPException(status_code=500, detail="Image generation failed, no image data in response from AI.")

        return {
            "imageUrl": f"data:{image_part.inline_data.mime_type};base64,{image_part.inline_data.data}"
        }

    except google_exceptions.PermissionDenied as e:
        print(f"Skybox Generation - Permission Denied: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed. Please check the server's API key.")
    except google_exceptions.InvalidArgument as e:
        print(f"Skybox Generation - Invalid Argument: {e}")
        raise HTTPException(status_code=400, detail="The request to the AI was invalid. Your prompt may have been rejected.")
    except Exception as e:
        print(f"Error during skybox generation: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during image generation.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)