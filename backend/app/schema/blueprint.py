from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class TrackSegment(BaseModel):
    type: Literal["climb", "drop", "turn", "loop", "barrelRoll"]
    angle: Optional[float] = None
    length: Optional[float] = None
    direction: Optional[str] = None
    radius: Optional[float] = None
    rotations: Optional[int] = None


class SynestheticGeometry(BaseModel):
    wireframeDensity: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    impossiblePhysics: Optional[bool] = None
    organicBreathing: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    breathingDriver: Optional[Literal['energy', 'spectralFlux', 'spectralCentroid']] = None


class SynestheticParticleConsciousness(BaseModel):
    connectionDensity: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    resonanceThreshold: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    lifespanSeconds: Optional[float] = Field(default=None, ge=0.0)
    persistence: Optional[float] = Field(default=None, ge=0.0, le=1.0)


class SynestheticAtmosphere(BaseModel):
    skyMood: Optional[str] = None
    turbulenceBias: Optional[float] = None
    passionIntensity: Optional[float] = Field(default=None, ge=0.0)
    tint: Optional[str] = None


class SynestheticLayer(BaseModel):
    geometry: Optional[SynestheticGeometry] = None
    particles: Optional[SynestheticParticleConsciousness] = None
    atmosphere: Optional[SynestheticAtmosphere] = None


class Blueprint(BaseModel):
    rideName: str
    moodDescription: str
    palette: List[str] = Field(min_items=3, max_items=3)
    track: List[TrackSegment]
    events: Optional[List[dict]] = None
    generationOptions: Optional[dict] = None
    synesthetic: Optional[SynestheticLayer] = None
