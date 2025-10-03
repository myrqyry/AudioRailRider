from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Request
from ..services.gemini_service import GeminiService, gemini_service
from ..models.models import SkyboxRequest
from ..limiter import limiter

router = APIRouter()

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
    return await service.generate_blueprint(audio_bytes, audio_file.content_type)


@router.post("/api/generate-skybox")
@limiter.limit("10/minute")
async def generate_skybox(
    request: Request,
    req_body: SkyboxRequest,
    service: GeminiService = Depends(lambda: gemini_service)
):
    return await service.generate_skybox(req_body.prompt)