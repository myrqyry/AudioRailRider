from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Request
from ..services.gemini_service import GeminiService, gemini_service
from ..services.advanced_blueprint_service import AdvancedBlueprintService
from ..models.models import SkyboxRequest
from ..models.perfect_blueprint import PerfectBlueprint
from ..limiter import limiter

router = APIRouter()

# --- Dependency Injector for AdvancedBlueprintService ---
def get_advanced_service() -> AdvancedBlueprintService:
    # This function creates and returns an instance of the AdvancedBlueprintService.
    # It depends on the singleton `gemini_service` to get the initialized Gemini client.
    # This approach avoids re-initializing the client for every request.
    return AdvancedBlueprintService(gemini_service.client)

# --- Constants for Input Validation ---
# Define a maximum file size to prevent resource exhaustion from large uploads.
# Set to 20 MB, which is a reasonable limit for most audio files.
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

# Define a list of allowed MIME types for audio files to ensure only supported formats are processed.
ALLOWED_MIME_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac", "audio/mp3"]

@router.get("/")
async def root():
    return {"message": "AudioRailRider Backend is running!", "status": "healthy"}

@router.post("/api/generate-blueprint")
@limiter.limit("5/minute")
async def generate_blueprint(
    request: Request,
    duration: float = Form(...),
    bpm: float = Form(...),
    energy: float = Form(...),
    spectralCentroid: float = Form(...),
    spectralFlux: float = Form(...),
    audio_file: UploadFile = File(...),
    service: GeminiService = Depends(lambda: gemini_service)
):
    # --- Input Validation ---
    # 1. Validate file type (MIME type)
    if audio_file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types are: {', '.join(ALLOWED_MIME_TYPES)}"
        )

    # 2. Validate file size
    # We read the file into memory to check its size. This is acceptable for moderate file sizes.
    # For very large files, a streaming approach would be more memory-efficient.
    audio_bytes = await audio_file.read()
    if len(audio_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, # Payload Too Large
            detail=f"File size exceeds the limit of {MAX_FILE_SIZE // (1024*1024)}MB."
        )

    # Pass the validated data to the service layer for processing.
    return await service.generate_blueprint(
        duration, bpm, energy, spectralCentroid, spectralFlux, audio_bytes, audio_file.content_type
    )

@router.post("/api/generate-perfect-blueprint", response_model=PerfectBlueprint)
@limiter.limit("3/minute")  # Lower limit for complex generation
async def generate_perfect_blueprint(
    request: Request,
    duration: float = Form(...),
    bpm: float = Form(...),
    energy: float = Form(...),
    spectralCentroid: float = Form(...),
    spectralFlux: float = Form(...),
    complexity_level: str = Form("advanced"),
    style_preferences: str = Form(""),  # Comma-separated preferences
    target_platform: str = Form("web"),
    audio_file: UploadFile = File(...),
    service: AdvancedBlueprintService = Depends(get_advanced_service)
):
    # Validate inputs
    if complexity_level not in ["simple", "moderate", "advanced", "extreme"]:
        raise HTTPException(400, "Invalid complexity level")

    # Parse style preferences
    preferences = [p.strip() for p in style_preferences.split(",") if p.strip()] if style_preferences else []

    # Process audio
    audio_bytes = await audio_file.read()

    metadata = {
        "duration": duration,
        "bpm": bpm,
        "energy": energy,
        "spectralCentroid": spectralCentroid,
        "spectralFlux": spectralFlux
    }

    # Generate the perfect blueprint
    blueprint = await service.generate_perfect_blueprint(
        audio_bytes, metadata, complexity_level, preferences, target_platform
    )

    return blueprint

@router.post("/api/generate-skybox")
@limiter.limit("10/minute")
async def generate_skybox(
    request: Request,
    req_body: SkyboxRequest,
    service: GeminiService = Depends(lambda: gemini_service)
):
    return await service.generate_skybox(req_body.prompt)