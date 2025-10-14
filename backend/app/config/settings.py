from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Gemini API Key with validation
    GEMINI_API_KEY: str = Field(..., min_length=10) # Basic check for presence and reasonable length

    # Max file size for audio uploads (in bytes)
    MAX_FILE_SIZE: int = Field(default=20 * 1024 * 1024, gt=0, description="Maximum audio file size in bytes (default 20MB)")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

    @validator('GEMINI_API_KEY')
    def validate_api_key_format(cls, v: str) -> str:
        """
        Validates that the Gemini API key has a plausible format.
        This is not a foolproof check but prevents common mistakes.
        """
        # Basic length check for plausibility
        if len(v) < 30:
            raise ValueError("Gemini API key seems too short.")
        return v

settings = Settings()