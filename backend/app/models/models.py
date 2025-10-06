from pydantic import BaseModel
from typing import Optional

class SkyboxRequest(BaseModel):
    prompt: str
    blueprint: Optional[dict] = None