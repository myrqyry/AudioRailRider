"""
Environment configuration for the backend application
Provides environment detection and validation for configuration values
"""

import os
from typing import List, Optional
from pydantic import BaseSettings, validator
from functools import lru_cache


class EnvironmentSettings(BaseSettings):
    """Environment configuration settings with validation"""

    # Application settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-in-production"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True

    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # API settings
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "AudioRailRider Backend"
    PROJECT_DESCRIPTION: str = "Backend API for AudioRailRider"
    PROJECT_VERSION: str = "0.1.0"

    # Gemini API settings
    GEMINI_API_KEY: Optional[str] = None

    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds

    # File upload settings
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_AUDIO_EXTENSIONS: List[str] = [".mp3", ".wav", ".flac", ".m4a"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    class Config:
        """Pydantic configuration"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Validate environment value"""
        valid_environments = ["development", "production", "test"]
        if v not in valid_environments:
            raise ValueError(f"Environment must be one of: {valid_environments}")
        return v

    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        """Parse CORS origins from environment variable or use defaults"""
        if isinstance(v, str):
            # Split comma-separated string
            return [origin.strip() for origin in v.split(",")]
        return v

    @validator("DEBUG")
    def validate_debug(cls, v, values):
        """Set debug based on environment if not explicitly set"""
        if "ENVIRONMENT" in values and values["ENVIRONMENT"] == "production":
            return False
        return v

    @validator("RELOAD")
    def validate_reload(cls, v, values):
        """Disable reload in production"""
        if "ENVIRONMENT" in values and values["ENVIRONMENT"] == "production":
            return False
        return v

    @validator("GEMINI_API_KEY")
    def validate_gemini_api_key(cls, v):
        """Validate Gemini API key is present"""
        if not v:
            raise ValueError(
                "GEMINI_API_KEY is required. Please set it in your environment variables."
            )
        return v


@lru_cache()
def get_settings() -> EnvironmentSettings:
    """Get cached settings instance"""
    return EnvironmentSettings()


# Global settings instance
settings = get_settings()


def is_development() -> bool:
    """Check if running in development environment"""
    return settings.ENVIRONMENT == "development"


def is_production() -> bool:
    """Check if running in production environment"""
    return settings.ENVIRONMENT == "production"


def is_test() -> bool:
    """Check if running in test environment"""
    return settings.ENVIRONMENT == "test"


def get_cors_origins() -> List[str]:
    """Get CORS origins for the current environment"""
    return settings.CORS_ORIGINS


def get_server_config() -> dict:
    """Get server configuration for uvicorn"""
    return {
        "host": settings.HOST,
        "port": settings.PORT,
        "reload": settings.RELOAD,
        "log_level": settings.LOG_LEVEL.lower(),
    }


def validate_environment_variables() -> None:
    """Validate all required environment variables are present"""
    missing_vars = []

    # Check for required variables
    if not settings.GEMINI_API_KEY:
        missing_vars.append("GEMINI_API_KEY")

    if missing_vars:
        raise ValueError(
            f"Missing required environment variables: {', '.join(missing_vars)}. "
            "Please check your .env file."
        )


def print_environment_info() -> None:
    """Print environment information for debugging"""
    if is_development():
        print("🔧 Development Environment Configuration:")
        print(f"   Environment: {settings.ENVIRONMENT}")
        print(f"   Debug: {settings.DEBUG}")
        print(f"   Host: {settings.HOST}")
        print(f"   Port: {settings.PORT}")
        print(f"   Reload: {settings.RELOAD}")
        print(f"   CORS Origins: {settings.CORS_ORIGINS}")
        print(f"   API Prefix: {settings.API_V1_PREFIX}")
        print(f"   Log Level: {settings.LOG_LEVEL}")
        print(f"   Max Upload Size: {settings.MAX_UPLOAD_SIZE} bytes")
        print()


# Validate environment on import
try:
    validate_environment_variables()
    if is_development():
        print_environment_info()
except ValueError as e:
    print(f"❌ Configuration Error: {e}")
    raise