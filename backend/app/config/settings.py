from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Defines application settings, loading them from environment variables or a .env file.
    Uses Pydantic for validation and type casting.

    Attributes:
        GEMINI_API_KEY: The API key for the Gemini service.
        MAX_FILE_SIZE: The maximum allowed file size for audio uploads in bytes.
    """
    # Gemini API Key with validation
    GEMINI_API_KEY: str = Field(..., min_length=10) # Basic check for presence and reasonable length

    # Max file size for audio uploads (in bytes)
    MAX_FILE_SIZE: int = Field(default=20 * 1024 * 1024, gt=0, description="Maximum audio file size in bytes (default 20MB)")

    # Allowed MIME types for audio uploads
    ALLOWED_MIME_TYPES: list[str] = Field(default=["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"])

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

    @validator('GEMINI_API_KEY')
    def validate_api_key_format(cls, v: str) -> str:
        """
        Validates that the Gemini API key has a plausible format.
        This is not a foolproof check but prevents common mistakes.

        Args:
            v: The value of the GEMINI_API_KEY.

        Returns:
            The validated API key.

        Raises:
            ValueError: If the API key seems too short.
        """
        # Basic length check for plausibility
        if len(v) < 30:
            raise ValueError("Gemini API key seems too short.")
        return v

settings = Settings()