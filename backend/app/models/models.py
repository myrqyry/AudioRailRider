from pydantic import BaseModel
from typing import Optional

class SkyboxRequest(BaseModel):
    """
    Defines the request model for generating a skybox image.

    Attributes:
        prompt: The text prompt to guide the image generation.
        blueprint: Optional dictionary containing the ride blueprint for additional context.
        options: Optional dictionary with generation options from the frontend.
    """
    prompt: str
    blueprint: Optional[dict] = None
    # Optional generation options forwarded from the frontend to influence visual style
    options: Optional[dict] = None