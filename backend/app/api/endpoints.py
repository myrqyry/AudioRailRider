from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Request, Form
from ..services.gemini_service import GeminiService, gemini_service
from ..models.models import SkyboxRequest
from ..limiter import limiter

router = APIRouter()

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB
ALLOWED_MIME_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"]

@router.get("/")
async def root():
    """Root endpoint to check if the backend is running."""
    return {"message": "AudioRailRider Backend is running!", "status": "healthy"}

@router.post("/api/generate-blueprint")
@limiter.limit("5/minute")
async def generate_blueprint(
    request: Request,
    audio_file: UploadFile = File(...),
    options: str | None = Form(None),
    service: GeminiService = Depends(lambda: gemini_service)
):
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
    if not audio_file.content_type or audio_file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {audio_file.content_type}. Must be one of {ALLOWED_MIME_TYPES}")

    audio_bytes = await audio_file.read()
    if len(audio_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds limit.")

    # Parse options JSON if provided and pass through to the service
    parsed_options = None
    if options:
        try:
            import json
            parsed_options = json.loads(options)
        except Exception:
            raise HTTPException(status_code=400, detail='Invalid JSON in options field')

    # This single call now handles analysis and generation, returning both.
    return await service.generate_blueprint(audio_bytes, audio_file.content_type, parsed_options)

@router.post("/api/generate-skybox")
@limiter.limit("10/minute")
async def generate_skybox(
    request: Request,
    req_body: SkyboxRequest,
    service: GeminiService = Depends(lambda: gemini_service)
):
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
async def generation_presets(request: Request):
    """
    Provides the frontend with a list of available generation presets.

    Args:
        request: The incoming request object.

    Returns:
        A JSON object containing lists of presets for different categories.
    """
    # Mirror shared/types GenerationOptions presets so the frontend can present choices
    presets = {
        'trackStyles': ['classic', 'extreme', 'flowing', 'technical', 'experimental'],
        'worldThemes': ['fantasy', 'cyberpunk', 'aurora', 'desert', 'space', 'underwater', 'noir'],
        'visualStyles': ['photorealistic', 'stylized', 'painterly', 'lowpoly', 'retro'],
        'detailLevels': ['low', 'medium', 'high'],
        'cameraPresets': ['epic', 'immersive', 'first_person', 'wide_angle'],
        'eventPresets': ['fog', 'fireworks', 'starshow', 'lightBurst', 'sparkRing', 'confetti']
    }
    return presets