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
    # GEMINI_API_KEY is optional to allow local/dev/test runs without a key.
    GEMINI_API_KEY: str | None = Field(default=None, min_length=10)

    # Max file size for audio uploads (in bytes)
    MAX_FILE_SIZE: int = Field(default=20 * 1024 * 1024, gt=0, description="Maximum audio file size in bytes (default 20MB)")

    # Allowed MIME types for audio uploads
    ALLOWED_MIME_TYPES: list[str] = Field(default=["audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg", "audio/flac"])

    # Request timeout for middleware
    REQUEST_TIMEOUT: int = Field(default=120, gt=0, description="Request timeout in seconds")

    # --- Audio Analysis Settings ---
    ANALYSIS_MAX_SECONDS: int = Field(default=120, gt=0, description="Maximum audio duration to analyze in seconds")
    ANALYSIS_N_FFT: int = Field(default=1024, gt=0, description="FFT window size for audio analysis")
    ANALYSIS_HOP_LENGTH: int = Field(default=512, gt=0, description="Hop length for audio analysis")
    ANALYSIS_BASS_CUTOFF: int = Field(default=250, gt=0, description="Frequency cutoff for bass in Hz")
    ANALYSIS_MID_CUTOFF: int = Field(default=4000, gt=0, description="Frequency cutoff for mid-range in Hz")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

    @validator('GEMINI_API_KEY')
    def validate_api_key_format(cls, v: str | None) -> str | None:
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
        # Allow None (no key provided). Only validate when a value exists.
        if v is None:
            return v
        # Basic plausibility check
        if len(v) < 30:
            raise ValueError("Gemini API key seems too short.")
        return v

settings = Settings()