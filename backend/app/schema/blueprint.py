from pydantic import BaseModel, Field
from typing import List, Optional

class TrackSegment(BaseModel):
    component: str
    length: float
    intensity: Optional[float] = None
    lightingEffect: Optional[str] = None
    environmentChange: Optional[str] = None
    audioSyncPoint: Optional[float] = None

class Blueprint(BaseModel):
    rideName: str
    moodDescription: str
    palette: List[str]
    track: List[TrackSegment]

class BlueprintOptions(BaseModel):
    pass
