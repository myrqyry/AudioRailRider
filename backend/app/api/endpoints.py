from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Request, Form
from typing import Dict, Any
from ..services.gemini_service import GeminiService, gemini_service
from ..models.models import SkyboxRequest
from ..limiter import limiter
from ..config.settings import settings
from ..schema.blueprint import BlueprintOptions
from shared.constants import (
    TRACK_STYLES,
    WORLD_THEMES,
    VISUAL_STYLES,
    DETAIL_LEVELS,
    CAMERA_PRESETS,
    EVENT_PRESETS,
)

router = APIRouter()

@router.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint to check if the backend is running."""
    return {"message": "AudioRailRider Backend is running!", "status": "healthy"}

import tempfile
import os
from pathlib import Path
import magic
import librosa

async def validate_audio_file(audio_file: UploadFile, max_size: int) -> bytes:
    """Comprehensive audio file validation with security checks."""
    # Validate content type
    if not audio_file.content_type or audio_file.content_type.lower() not in settings.ALLOWED_MIME_TYPES:
        supported_formats = ", ".join([mime.split('/')[-1].upper() for mime in settings.ALLOWED_MIME_TYPES])
        raise HTTPException(status_code=400, detail=f"Unsupported file format. Please upload one of the following: {supported_formats}")

    # Stream validation with size limits
    audio_bytes = bytearray()
    chunk_size = 8192
    total_size = 0

    while chunk := await audio_file.read(chunk_size):
        total_size += len(chunk)
        if total_size > max_size:
            raise HTTPException(status_code=413, detail="File size exceeds limit during streaming")
        audio_bytes.extend(chunk)

    # Verify magic numbers match content type
    detected_mime = magic.from_buffer(bytes(audio_bytes[:2048]), mime=True)
    if detected_mime not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"File content mismatch. Expected audio, got: {detected_mime}")

    # Additional audio-specific validation using librosa
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name

        # Quick librosa validation to ensure it's actually processable audio
        y, sr = librosa.load(temp_path, duration=1.0)  # Load only 1 second for validation
        if len(y) == 0 or sr <= 0:
            raise ValueError("Invalid audio data")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid audio file: {str(e)}")
    finally:
        if 'temp_path' in locals():
            os.unlink(temp_path)

    return bytes(audio_bytes)

@router.post("/api/generate-blueprint")
@limiter.limit("5/minute")
async def generate_blueprint(
    request: Request,
    audio_file: UploadFile = File(...),
    options: str | None = Form(None),
    service: GeminiService = Depends(lambda: gemini_service)
) -> Dict[str, Any]:
    """
    Generates a ride blueprint from an audio file.

    Args:
        request: The incoming request object.
        audio_file: The uploaded audio file.
        options: Optional JSON string with generation parameters.
        service: The GeminiService dependency.

    Returns:
        A JSON object containing the generated blueprint and audio features.

    Raises:
        HTTPException: If the file type is invalid, file size exceeds the limit,
                       or the options JSON is malformed.
    """
    audio_bytes = await validate_audio_file(audio_file, settings.MAX_FILE_SIZE)

    # Parse options JSON if provided and pass through to the service
    parsed_options = None
    if options:
        try:
            parsed_model = BlueprintOptions.model_validate_json(options)
            # Convert Pydantic model to a plain dict before passing downstream
            parsed_options = parsed_model.model_dump()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f'Invalid JSON in options field: {str(e)}')

    # This single call now handles analysis and generation, returning both.
    import json
    MAX_RESPONSE_SIZE = 50 * 1024 * 1024  # 50MB
    result = await service.generate_blueprint(audio_bytes, audio_file.content_type, parsed_options)
    response_size = len(json.dumps(result).encode('utf-8'))
    if response_size > MAX_RESPONSE_SIZE:
        raise HTTPException(status_code=413, detail="Response too large")
    return result

@router.post("/api/generate-skybox")
@limiter.limit("10/minute")
async def generate_skybox(
    request: Request,
    req_body: SkyboxRequest,
    service: GeminiService = Depends(lambda: gemini_service)
) -> Dict[str, Any]:
    """
    Generates a skybox image based on a prompt and blueprint context.

    Args:
        request: The incoming request object.
        req_body: The request body containing the prompt and blueprint.
        service: The GeminiService dependency.

    Returns:
        A JSON object with the URL of the generated skybox image.
    """
    return await service.generate_skybox(req_body.prompt, req_body.blueprint, req_body.options)


@router.get('/api/generation-presets')
@limiter.limit('60/minute')
async def generation_presets(request: Request) -> Dict[str, Any]:
    """
    Provides the frontend with a list of available generation presets.

    Args:
        request: The incoming request object.

    Returns:
        A JSON object containing lists of presets for different categories.
    """
    # Mirror shared/types GenerationOptions presets so the frontend can present choices
    presets = {
        'trackStyles': TRACK_STYLES,
        'worldThemes': WORLD_THEMES,
        'visualStyles': VISUAL_STYLES,
        'detailLevels': DETAIL_LEVELS,
        'cameraPresets': CAMERA_PRESETS,
        'eventPresets': EVENT_PRESETS,
    }
    return presets