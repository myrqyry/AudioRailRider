from pydantic import BaseModel
from typing import Optional

class BlueprintOptions(BaseModel):
    trackStyle: Optional[str] = None
    worldTheme: Optional[str] = None
    visualStyle: Optional[str] = None
    detailLevel: Optional[str] = None
    cameraPreset: Optional[str] = None
    eventPreset: Optional[str] = None