from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class TrackSegment(BaseModel):
    type: Literal["climb", "drop", "turn", "loop", "barrelRoll"]
    angle: Optional[float] = None
    length: Optional[float] = None
    direction: Optional[str] = None
    radius: Optional[float] = None
    rotations: Optional[int] = None


class Blueprint(BaseModel):
    rideName: str
    moodDescription: str
    palette: List[str] = Field(min_items=3, max_items=3)
    track: List[TrackSegment]
