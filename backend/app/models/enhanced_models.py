from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from enum import Enum

class TrackComponentType(str, Enum):
    # Basic Elements
    STRAIGHT = "straight"
    GENTLE_CURVE = "gentle_curve"
    BANKING_TURN = "banking_turn"
    # Climbs & Hills
    GENTLE_HILL = "gentle_hill"
    STEEP_CLIMB = "steep_climb"
    LAUNCH_HILL = "launch_hill"
    AIRTIME_HILL = "airtime_hill"
    BUNNY_HOP = "bunny_hop"
    # Drops & Descents
    GENTLE_DROP = "gentle_drop"
    STEEP_DROP = "steep_drop"
    VERTICAL_DROP = "vertical_drop"
    SPIRAL_DROP = "spiral_drop"
    CURVED_DROP = "curved_drop"
    # Loops & Inversions
    VERTICAL_LOOP = "vertical_loop"
    HORIZONTAL_LOOP = "horizontal_loop"
    CORKSCREW = "corkscrew"
    COBRA_ROLL = "cobra_roll"
    BARREL_ROLL = "barrel_roll"
    HEARTLINE_ROLL = "heartline_roll"
    # Complex Elements
    DOUBLE_DOWN = "double_down"
    DOUBLE_UP = "double_up"
    S_CURVE = "s_curve"
    HELIX = "helix"
    TWISTED_ELEMENT = "twisted_element"
    # Speed Elements
    LAUNCH_SECTION = "launch_section"
    BRAKE_RUN = "brake_run"
    SPEED_BOOST = "speed_boost"
    # Special Elements
    ZERO_G_ROLL = "zero_g_roll"
    PRETZEL_KNOT = "pretzel_knot"
    FLYING_COASTER_ELEMENT = "flying_element"

class AudioReactiveProperties(BaseModel):
    """Properties that make track elements respond to audio"""
    beat_sync: bool = Field(False, description="Sync element timing to BPM")
    energy_reactive: bool = Field(False, description="React to energy level changes")
    bass_responsive: bool = Field(False, description="Respond to bass frequencies")
    frequency_band: Optional[str] = Field(None, description="Which frequency band drives this element")
    amplitude_multiplier: float = Field(1.0, description="How much audio affects the element")

class VisualEffects(BaseModel):
    """Visual effects for track elements"""
    particle_system: Optional[str] = None
    lighting_type: Literal["static", "pulsing", "strobe", "gradient"] = "static"
    fog_density: float = Field(0.0, ge=0.0, le=1.0)
    speed_lines: bool = False
    camera_shake: bool = False
    color_shift: bool = False
    trail_effect: bool = False

class TrackComponent(BaseModel):
    """Enhanced track component with rich properties"""
    component: TrackComponentType
    length: float = Field(..., ge=10, le=500, description="Length in meters")
    # Physical Properties
    height: Optional[float] = Field(None, ge=-200, le=300, description="Height change in meters")
    banking: float = Field(0, ge=-90, le=90, description="Banking angle in degrees")
    g_force: float = Field(1.0, ge=0.5, le=6.0, description="G-force rating")
    speed_modifier: float = Field(1.0, ge=0.3, le=3.0, description="Speed multiplication factor")
    # Geometric Properties
    radius: Optional[float] = Field(None, ge=5, le=200, description="Turn radius in meters")
    twist_angle: float = Field(0, ge=-720, le=720, description="Twist/rotation in degrees")
    inversions: int = Field(0, ge=0, le=5, description="Number of inversions")
    # Audio Integration
    audio_properties: AudioReactiveProperties = Field(default_factory=AudioReactiveProperties)
    energy_threshold: float = Field(0.5, ge=0.0, le=1.0, description="Energy level that activates this element")
    # Visual Effects
    effects: VisualEffects = Field(default_factory=VisualEffects)
    # Timing & Sync
    duration_override: Optional[float] = Field(None, description="Override calculated duration")
    beat_alignment: bool = Field(False, description="Align element to musical beats")

class EnhancedBlueprint(BaseModel):
    """Complete coaster blueprint with all enhancements"""
    rideName: str
    moodDescription: str
    palette: List[str] = Field(..., min_length=3, max_length=8)
    # Track Definition
    track: List[TrackComponent]
    total_length: float = Field(..., description="Total track length in meters")
    estimated_duration: float = Field(..., description="Estimated ride duration in seconds")
    # Audio Synchronization
    bpm: float
    energy_profile: List[float] = Field(..., description="Energy level for each track segment")
    beat_markers: List[float] = Field(default_factory=list, description="Important beat timestamps")
    # Global Effects
    environment_effects: Dict[str, Any] = Field(default_factory=dict)
    lighting_scheme: Dict[str, Any] = Field(default_factory=dict)
    particle_systems: Dict[str, Any] = Field(default_factory=dict)
    # Technical Properties
    max_speed: float = Field(default=80.0, description="Maximum speed in km/h")
    max_height: float = Field(default=100.0, description="Highest point in meters")
    thrill_rating: int = Field(default=5, ge=1, le=10, description="Thrill intensity rating")
