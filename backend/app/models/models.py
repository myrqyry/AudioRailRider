from pydantic import BaseModel
from typing import Optional

class SkyboxRequest(BaseModel):
    prompt: str
    blueprint: Optional[dict] = None
    # Optional generation options forwarded from the frontend to influence visual style
    options: Optional[dict] = None