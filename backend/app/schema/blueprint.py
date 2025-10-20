from pydantic import BaseModel
from typing import Optional, List, Any


class BlueprintOptions(BaseModel):
    trackStyle: Optional[str] = None
    worldTheme: Optional[str] = None
    visualStyle: Optional[str] = None
    detailLevel: Optional[str] = None
    cameraPreset: Optional[str] = None
    eventPreset: Optional[str] = None


class Blueprint(BaseModel):
    """Simple Pydantic model representing the expected Blueprint schema used in tests.

    Contains just the fields tests construct: rideName, moodDescription, palette and track.
    """
    rideName: str
    moodDescription: Optional[str] = None
    palette: Optional[List[str]] = None
    track: Optional[List[Any]] = None