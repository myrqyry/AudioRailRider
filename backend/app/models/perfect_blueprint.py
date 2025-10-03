from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union
from enum import Enum
import uuid

class ComponentType(str, Enum):
    CLIMB = "climb"
    DROP = "drop"
    TURN = "turn"
    LOOP = "loop"
    BARREL_ROLL = "barrelRoll"
    PAUSE = "pause"
    SPIRAL = "spiral"

class LightingEffect(str, Enum):
    STROBE = "strobe"
    FADE = "fade"
    PULSE = "pulse"
    RAINBOW = "rainbow"
    LASER = "laser"
    AMBIENT = "ambient"

class ParticleType(str, Enum):
    SPARKS = "sparks"
    SMOKE = "smoke"
    CONFETTI = "confetti"
    ENERGY = "energy"
    STARS = "stars"
    FIRE = "fire"

class CameraMovement(str, Enum):
    STATIC = "static"
    FOLLOW = "follow"
    ORBIT = "orbit"
    ZOOM = "zoom"
    SHAKE = "shake"
    SWEEP = "sweep"

# Core track component with enhanced properties
class TrackComponent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: ComponentType
    start_time: float = Field(ge=0, description="Start time in seconds")
    duration: float = Field(gt=0, description="Duration in seconds")
    intensity: float = Field(ge=0, le=1, description="Intensity level 0-1")

    # Physical properties
    angle: Optional[float] = Field(None, ge=-90, le=90, description="Track angle in degrees")
    length: Optional[float] = Field(None, gt=0, description="Track length in meters")
    radius: Optional[float] = Field(None, gt=0, description="Turn/loop radius in meters")
    direction: Optional[str] = Field(None, description="Direction for turns")
    rotations: Optional[int] = Field(None, ge=1, le=3, description="Number of rotations for barrel rolls")

# Visual effects layer
class VisualEffect(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start_time: float = Field(ge=0)
    duration: float = Field(gt=0)
    layer_priority: int = Field(ge=0, le=10, description="Higher numbers render on top")

class LightingLayer(VisualEffect):
    effect_type: LightingEffect
    color: str = Field(pattern=r'^#[0-9A-Fa-f]{6}$', description="Hex color code")
    intensity: float = Field(ge=0, le=1)
    fade_in: float = Field(ge=0, le=5, default=0)
    fade_out: float = Field(ge=0, le=5, default=0)
    sync_to_beat: bool = Field(default=False)

class ParticleLayer(VisualEffect):
    particle_type: ParticleType
    density: float = Field(ge=0, le=1, description="Particle density 0-1")
    velocity: float = Field(ge=0, le=10, description="Particle velocity")
    color_palette: List[str] = Field(min_items=1, max_items=5)
    physics_enabled: bool = Field(default=True)

class CameraLayer(VisualEffect):
    movement_type: CameraMovement
    target_component_id: Optional[str] = Field(None, description="ID of track component to focus on")
    smooth_factor: float = Field(ge=0, le=1, default=0.8)
    distance: float = Field(gt=0, default=50)
    height_offset: float = Field(default=10)

# Audio enhancement layer
class AudioLayer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start_time: float = Field(ge=0)
    duration: float = Field(gt=0)

class SpatialAudio(AudioLayer):
    position_3d: List[float] = Field(min_items=3, max_items=3, description="X,Y,Z coordinates")
    volume: float = Field(ge=0, le=1)
    reverb: float = Field(ge=0, le=1, default=0)
    doppler_effect: bool = Field(default=True)

class AmbientSound(AudioLayer):
    sound_type: str = Field(description="Type of ambient sound")
    volume: float = Field(ge=0, le=1)
    loop: bool = Field(default=True)

# Environment and world-building
class EnvironmentLayer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str

class SkyboxConfig(EnvironmentLayer):
    texture_url: Optional[str] = None
    color_gradient: List[str] = Field(min_items=2, max_items=4)
    time_of_day: str = Field(default="dynamic")
    weather: str = Field(default="clear")

class TerrainConfig(EnvironmentLayer):
    height_map: Optional[str] = None
    texture: str
    scale: float = Field(gt=0, default=1.0)
    vegetation_density: float = Field(ge=0, le=1, default=0.3)

# Interaction and user engagement
class InteractionTrigger(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trigger_time: float = Field(ge=0)
    trigger_type: str = Field(description="Type of interaction")
    description: str
    optional: bool = Field(default=True)

class UserChoice(InteractionTrigger):
    choices: List[str] = Field(min_items=2, max_items=4)
    consequences: Dict[str, str] = Field(description="Choice -> outcome mapping")
    default_choice: str

class TimedEvent(InteractionTrigger):
    auto_trigger: bool = Field(default=True)
    visual_cue: bool = Field(default=True)
    audio_cue: bool = Field(default=False)

# The master blueprint structure
class PerfectBlueprint(BaseModel):
    # Metadata
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(description="Creative name for the experience")
    description: str = Field(description="Detailed description of the experience")
    created_at: str = Field(description="ISO timestamp")
    duration: float = Field(gt=0, description="Total experience duration in seconds")

    # Audio analysis metadata
    audio_metadata: Dict[str, Union[float, str]] = Field(
        description="Original audio analysis data"
    )

    # Core track structure
    track_components: List[TrackComponent] = Field(
        min_items=8, max_items=25,
        description="Sequential track components"
    )

    # Visual layers (rendered in priority order)
    lighting_layers: List[LightingLayer] = Field(default=[])
    particle_layers: List[ParticleLayer] = Field(default=[])
    camera_layers: List[CameraLayer] = Field(default=[])

    # Audio enhancement
    spatial_audio: List[SpatialAudio] = Field(default=[])
    ambient_sounds: List[AmbientSound] = Field(default=[])

    # Environment
    environment: Dict[str, EnvironmentLayer] = Field(default={})
    skybox: Optional[SkyboxConfig] = None
    terrain: Optional[TerrainConfig] = None

    # Interactivity
    interaction_triggers: List[InteractionTrigger] = Field(default=[])
    user_choices: List[UserChoice] = Field(default=[])
    timed_events: List[TimedEvent] = Field(default=[])

    # Color palette and theming
    primary_palette: List[str] = Field(
        min_items=3, max_items=3,
        description="[rail_color, glow_color, sky_color]"
    )
    secondary_palette: List[str] = Field(default=[])
    mood_tags: List[str] = Field(default=[])

    # Export configurations
    platform_configs: Dict[str, Dict] = Field(
        default={},
        description="Platform-specific export settings"
    )

    # Validation and quality metrics
    complexity_score: float = Field(ge=0, le=1, description="Complexity rating")
    estimated_render_time: float = Field(gt=0, description="Estimated render time in seconds")
    quality_metrics: Dict[str, float] = Field(default={})