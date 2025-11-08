from pydantic import BaseModel, Field
from typing import List, Optional

class TrackSegment(BaseModel):
    component: str
    length: float
    intensity: Optional[float] = None
    lightingEffect: Optional[str] = None
    environmentChange: Optional[str] = None
    audioSyncPoint: Optional[float] = None

class ImpossiblePhysics(BaseModel):
    enabled: bool
    intensity: float = Field(ge=0, le=1)
    frequency: float = Field(ge=0, le=1)

class Geometry(BaseModel):
    wireframeDensity: Optional[float] = Field(None, ge=0, le=1)
    organicBreathing: Optional[float] = Field(None, ge=0, le=1)
    impossiblePhysics: ImpossiblePhysics

class Particles(BaseModel):
    connectionDensity: Optional[float] = Field(None, ge=0, le=1)
    resonanceThreshold: Optional[float] = Field(None, ge=0, le=1)

class Atmosphere(BaseModel):
    skyMood: Optional[str] = None

class Synesthetic(BaseModel):
    geometry: Geometry
    particles: Particles
    atmosphere: Atmosphere

class Blueprint(BaseModel):
    rideName: str
    moodDescription: str
    palette: List[str]
    track: List[TrackSegment]
    synesthetic: Synesthetic

class BlueprintOptions(BaseModel):
    pass
