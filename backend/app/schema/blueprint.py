from typing import List, Literal, Optional, Union

from pydantic import BaseModel, Field, conlist, constr

# --- Stricter Track Segment Definitions ---

class BaseSegment(BaseModel):
    """
    A base model for a track segment, containing common optional metadata.

    Attributes:
        name: A descriptive name for the segment.
        intensity: An intensity score (0-100) suggested by the AI.
        lightingEffect: A suggested lighting effect for the segment.
        environmentChange: A suggested environmental change for the segment.
        audioSyncPoint: The audio timestamp (in seconds) this segment should sync with.
    """
    name: Optional[str] = Field(None, description="A descriptive name for this segment, e.g., 'The Ascent'")
    intensity: Optional[float] = Field(None, ge=0, le=100, description="Intensity score (0-100) suggested by the AI.")
    lightingEffect: Optional[str] = Field(None, description="Suggested lighting effect, e.g., 'warm-pulse', 'strobe'")
    environmentChange: Optional[str] = Field(None, description="Suggested environmental change, e.g., 'enter-cave', 'starfield'")
    audioSyncPoint: Optional[float] = Field(None, ge=0, description="The audio timestamp (in seconds) this segment should sync with.")

class ClimbSegment(BaseSegment):
    """A segment representing a climb."""
    component: Literal['climb']
    length: float = Field(..., ge=0.1, description="Length must be at least 0.1")
    angle: Optional[float] = Field(None, ge=-90, le=90)

class DropSegment(BaseSegment):
    """A segment representing a drop."""
    component: Literal['drop']
    length: float = Field(..., ge=0.1, description="Length must be at least 0.1")
    angle: Optional[float] = Field(None, ge=-90, le=90)

class TurnSegment(BaseSegment):
    """A segment representing a turn."""
    component: Literal['turn']
    length: float = Field(..., ge=0.1, description="Length must be at least 0.1")
    direction: Literal['left', 'right']
    angle: float = Field(..., ge=-720, le=720)
    radius: Optional[float] = Field(None, ge=0.1, description="Radius must be at least 0.1")

class LoopSegment(BaseSegment):
    """A segment representing a loop."""
    component: Literal['loop']
    radius: float = Field(..., ge=0.1, description="Radius must be at least 0.1")
    rotations: Optional[int] = Field(1, ge=1)

class BarrelRollSegment(BaseSegment):
    """A segment representing a barrel roll."""
    component: Literal['barrelRoll']
    rotations: int = Field(..., ge=1, description="Rotations must be at least 1")
    length: Optional[float] = Field(None, ge=0.1, description="Length must be at least 0.1")

# A discriminated union to validate incoming track segments
TrackSegment = Union[ClimbSegment, DropSegment, TurnSegment, LoopSegment, BarrelRollSegment]


class SynestheticGeometry(BaseModel):
    """Defines parameters for synesthetic geometry effects."""
    wireframeDensity: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    impossiblePhysics: Optional[bool] = None
    organicBreathing: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    breathingDriver: Optional[Literal['energy', 'spectralFlux', 'spectralCentroid']] = None


class SynestheticParticleConsciousness(BaseModel):
    """Defines parameters for synesthetic particle system effects."""
    connectionDensity: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    resonanceThreshold: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    lifespanSeconds: Optional[float] = Field(default=None, ge=0.0)
    persistence: Optional[float] = Field(default=None, ge=0.0, le=1.0)


class SynestheticAtmosphere(BaseModel):
    """Defines parameters for synesthetic atmospheric effects."""
    skyMood: Optional[str] = None
    turbulenceBias: Optional[float] = None
    passionIntensity: Optional[float] = Field(default=None, ge=0.0)
    tint: Optional[str] = None


class SynestheticLayer(BaseModel):
    """A container for all synesthetic effect layers."""
    geometry: Optional[SynestheticGeometry] = None
    particles: Optional[SynestheticParticleConsciousness] = None
    atmosphere: Optional[SynestheticAtmosphere] = None


class Blueprint(BaseModel):
    """
    The root object describing a generated rollercoaster ride.
    This serves as the schema for the AI's output and is validated
    on the backend.
    """
    rideName: constr(min_length=3, max_length=50) = Field(..., description="A creative and fitting name for the ride.")
    moodDescription: constr(min_length=10, max_length=500) = Field(..., description="A detailed, evocative description of the ride's mood and atmosphere.")
    palette: conlist(str, min_length=3, max_length=5) = Field(..., description="An array of 3 to 5 hex color codes.")
    track: conlist(TrackSegment, min_length=12, max_length=40) = Field(..., description="An array of 12 to 40 track segments.")
    synesthetic: Optional[SynestheticLayer] = Field(None, description="Optional synesthetic metadata that informs advanced visuals.")
