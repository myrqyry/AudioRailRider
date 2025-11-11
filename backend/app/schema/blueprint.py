from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class TrackSegment(BaseModel):
    component: str
    length: float
    intensity: Optional[float] = None
    lightingEffect: Optional[str] = None
    environmentChange: Optional[str] = None
    audioSyncPoint: Optional[float] = None


class GenerationOptions(BaseModel):
    # High-level stylistic presets (mirror shared/types GenerationOptions)
    trackStyle: Optional[str] = None
    worldTheme: Optional[str] = None
    visualStyle: Optional[str] = None
    paletteHint: Optional[List[str]] = None
    detailLevel: Optional[str] = None
    cameraPreset: Optional[str] = None

    # Audio feature utilization toggles
    useTempoMap: Optional[bool] = None
    useEnergyCurve: Optional[bool] = None
    useBrightnessCurve: Optional[bool] = None
    useBeatsAndSections: Optional[bool] = None

    # Physical/layout constraints
    maxGrade: Optional[float] = None
    maxLateralG: Optional[float] = None
    allowInversions: Optional[bool] = None

    # Skybox and timeline-aware visual generation
    enableSkyboxTimeline: Optional[bool] = None
    skyboxFrames: Optional[int] = None
    skyboxAspectRatio: Optional[Literal['1:1','2:3','3:2','3:4','4:3','4:5','5:4','9:16','16:9','21:9']] = None

    # Narrative control for ride theming
    narrativeMode: Optional[Literal['none','abstract','story']] = None

    # Optional small visual event presets that should be favored when generating
    preferredEventPresets: Optional[List[str]] = None


class Blueprint(BaseModel):
    rideName: str
    moodDescription: str
    palette: List[str]
    track: List[TrackSegment]
    generationOptions: Optional[GenerationOptions] = None


class BlueprintOptions(BaseModel):
    generationOptions: Optional[GenerationOptions] = None
