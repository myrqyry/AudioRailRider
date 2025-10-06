from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Request
from ..services.gemini_service import GeminiService, gemini_service
from ..models.models import SkyboxRequest
from ..limiter import limiter

router = APIRouter()

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB
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
    if audio_file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type.")

    audio_bytes = await audio_file.read()
    if len(audio_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds limit.")

    # This single call now handles analysis and generation, returning both.
    return await service.generate_blueprint(audio_bytes, audio_file.content_type)

@router.post("/api/generate-skybox")
@limiter.limit("10/minute")
async def generate_skybox(
    request: Request,
    req_body: SkyboxRequest,
    service: GeminiService = Depends(lambda: gemini_service)
):
    return await service.generate_skybox(req_body.prompt, req_body.blueprint)