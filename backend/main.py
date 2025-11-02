# REASON: Removed unsafe sys.path manipulation for better security
# Add monorepo root through proper Python packaging instead
from dotenv import load_dotenv
load_dotenv()

# --- Logging Setup ---
# It's crucial to set up logging before importing other app components
# so that they can inherit the proper logging configuration.
from app.config.logging import setup_logging
setup_logging()

import structlog
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.middleware import TimeoutMiddleware
from app.api.endpoints import router
from app.config.settings import settings
from app.limiter import limiter
from app.exceptions import http_exception_handler, generic_exception_handler
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
import uvicorn
import os

# Initialize logger after setup
logger = structlog.get_logger("main")

# --- FastAPI App Setup ---
app = FastAPI(
    title="AudioRailRider Backend",
    description="Backend API for AudioRailRider",
    version="0.1.0"
)

# --- Exception Handlers ---
# Register centralized exception handlers to ensure consistent error responses.
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# --- Rate Limiting ---
# Add the rate limiter to the application's state and register the exception handler.
# This ensures that any requests exceeding the defined rate limits are properly handled
# and a 429 Too Many Requests response is returned.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

import re
from urllib.parse import urlparse
from typing import List

# --- CORS Configuration ---
def validate_cors_origins() -> List[str]:
    """Validate and sanitize CORS origins from environment variables."""
    allowed_origins_str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    )

    origins = []
    for origin in allowed_origins_str.split(","):
        origin = origin.strip()
        if not origin:
            continue

        # Validate URL format
        try:
            parsed = urlparse(origin)
            if not parsed.scheme or not parsed.netloc:
                logger.warning(f"Invalid CORS origin format: {origin}")
                continue

            # Only allow http/https
            if parsed.scheme not in ['http', 'https']:
                logger.warning(f"Invalid CORS origin scheme: {origin}")
                continue

            # Reconstruct clean URL
            clean_origin = f"{parsed.scheme}://{parsed.netloc}"
            origins.append(clean_origin)

        except Exception as e:
            logger.error(f"Error parsing CORS origin {origin}: {e}")
            continue

    if not origins:
        raise ValueError("No valid CORS origins configured")

    return origins

# Use in main.py
origins = validate_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

app.add_middleware(TimeoutMiddleware)

# --- Router ---
app.include_router(router)

def validate_environment():
    """Validate all critical environment variables and settings."""
    errors = []
    if not settings.gemini_api_key:
        errors.append("GEMINI_API_KEY is required")
    if settings.MAX_FILE_SIZE <= 0:
        errors.append("MAX_FILE_SIZE must be positive")
    if not settings.ALLOWED_MIME_TYPES:
        errors.append("ALLOWED_MIME_TYPES cannot be empty")
    # Validate CORS origins
    origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
    for origin in origins:
        if origin.strip() and not origin.startswith(('http://', 'https://')):
            errors.append(f"Invalid CORS origin format: {origin}")
    if errors:
        raise ValueError("Configuration errors: " + "; ".join(errors))

# --- Main ---
if __name__ == "__main__":
    try:
        # REASON: Added proper configuration validation before server start
        validate_environment()

        logger.info("Starting application", host="0.0.0.0", port=8000, reload=True)
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except ValueError as e:
        logger.critical("Configuration error, application cannot start.", error=str(e), exc_info=True)