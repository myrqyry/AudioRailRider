from pydantic import BaseModel

class SkyboxRequest(BaseModel):
    prompt: str