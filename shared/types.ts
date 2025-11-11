export enum AppStatus {
  Idle = 'idle',
  Analyzing = 'analyzing',
  Generating = 'generating',
  Ready = 'ready',
  Riding = 'riding',
  Finished = 'finished',
  Error = 'error'
}

// Small branded type helper for nominal typing where useful
export type Brand<K, T> = K & { readonly __brand: T };

// Use a simple Vector3 shape in shared types to avoid pulling Three.js into the
// shared package, while remaining structurally compatible with THREE.Vector3
// instances (they have x/y/z number fields).
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Seconds as a branded number to reduce unit-mixups (still compatible with number at runtime)
// For now use a plain number for Seconds to avoid brittle branded-type mismatches
// in tests and fixtures during iterative triage. We can reintroduce a branded
// type later once test fixtures and all callsites are aligned.
// Seconds as a branded number to reduce unit-mixups (still compatible with number at runtime)
export type Seconds = Brand<number, 'seconds'>;

export interface FrameAnalysis {
  // timestamp in seconds from start of track
  timestamp: Seconds;
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  bass: number;
  mid: number;
  high: number;
  isBeat?: boolean;
  bpm?: number;
  // REASON: Made critical audio properties required to prevent runtime errors
  sampleRate: number;
  channelCount: number;
  frame?: Float32Array;
}

// REASON: Added type guards for better runtime validation
export function isValidFrameAnalysis(obj: any): obj is FrameAnalysis {
  return obj &&
          typeof obj.timestamp === 'number' &&
         typeof obj.energy === 'number' &&
         typeof obj.sampleRate === 'number' &&
         typeof obj.channelCount === 'number';
}

export interface EnhancedAudioFeatures {
  duration: Seconds;
  tempo: number;
  /** size of the analysis window in samples */
  windowSize: number;
  /** hop size (in samples) between analysis windows */
  hopSize: number;
  /** source sample rate used for extraction */
  sampleRate: number;
  /** log-scaled energy curve (0..?) aligned with hop sequence */
  energy: Float32Array;
  /** spectral centroid per window */
  spectralCentroid: Float32Array;
  /** spectral flux per window */
  spectralFlux: Float32Array;
  /** perceptual sharpness per window */
  perceptualSharpness: Float32Array;
  /** spectral rolloff (Hz) per window */
  spectralRolloff: Float32Array;
  /** zero-crossing rate per window */
  zeroCrossingRate: Float32Array;
  /** flattened chromagram (frame-major, 12 bins per frame by default) */
  chroma: Float32Array;
  /** number of chroma bins stored per frame */
  chromaBins: number;
  /** flattened MFCC matrix (frame-major) */
  mfcc: Float32Array;
  /** number of MFCC coefficients stored per frame */
  mfccCoefficients: number;
  /** detected beat timestamps in seconds */
  beats: number[];
  /** detected structural boundary timestamps in seconds */
  structuralBoundaries: number[];
}

export interface AudioFeatures {
  duration: Seconds;
  bpm: number;
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  frameAnalyses: FrameAnalysis[];
  enhanced?: EnhancedAudioFeatures | null;
}

// REASON: Improved track segment definitions with better type constraints
// Base interface for all track segments, including optional metadata.
export interface BaseSegment {
  // A descriptive name for this segment, e.g., "The Ascent"
  name?: string;
  // Intensity score (0-100) suggested by the AI.
  intensity?: number;
  // Suggested lighting effect, e.g., "warm-pulse", "strobe"
  lightingEffect?: string;
  // Suggested environmental change, e.g., "enter-cave", "starfield"
  environmentChange?: string;
  // The audio timestamp (in seconds) this segment should sync with.
  audioSyncPoint?: Seconds;
}

// Track component identifiers are intentionally permissive (string) so that
// backend-generated values or legacy test fixtures using simple names like
// 'climb'/'turn' continue to type-check without requiring the full enum map.
export type TrackComponentType = string;

// REASON: Strengthened track segment validation with required core properties
// Define specific interfaces for audio properties and visual effects
export interface AudioProperties {
    volume: number;
    pitch: number;
    tempo_multiplier: number;
    spectral_centroid: number;
    mfcc_features: number[];
    harmonic_content: number;
    percussive_content: number;
}

export interface VisualEffect {
    type: 'particle' | 'lighting' | 'fog' | 'distortion';
    intensity: number;
    duration: number;
    parameters: Record<string, number | string | boolean>;
}

export interface TrackSegment extends BaseSegment {
    component: TrackComponentType;
    length: number; // Always required
    height?: number;
    banking?: number;
    g_force?: number;
    speed_modifier?: number;
    radius?: number;
    twist_angle?: number;
    inversions?: number;
    audio_properties?: AudioProperties;
    effects?: VisualEffect[];
    energy_threshold?: number;
    beat_alignment?: boolean;
    angle?: number;
    direction?: 'left' | 'right';
    rotations?: number;
}

// Backwards-compatible alias used by some frontend modules/tests
export type TrackSegmentWithMeta = TrackSegment;

// REASON: Added validation functions for runtime type checking
export function validateAudioProperties(props: any): props is AudioProperties {
    return (
        typeof props === 'object' &&
        props !== null &&
        typeof props.volume === 'number' &&
        typeof props.pitch === 'number' &&
        typeof props.tempo_multiplier === 'number' &&
        typeof props.spectral_centroid === 'number' &&
        Array.isArray(props.mfcc_features) &&
        props.mfcc_features.every((f: any) => typeof f === 'number') &&
        typeof props.harmonic_content === 'number' &&
        typeof props.percussive_content === 'number'
    );
}

export function isValidTrackSegment(obj: any): obj is TrackSegment {
  return (
    obj &&
    typeof obj.component === 'string' &&
    obj.component.length > 0 &&
    typeof obj.length === 'number' &&
    obj.length > 0 &&
    (!obj.audio_properties || validateAudioProperties(obj.audio_properties)) &&
    (!obj.effects || (Array.isArray(obj.effects) && obj.effects.every((e: any) => typeof e.type === 'string')))
  );
}

// Rest of interfaces remain the same...
export interface SynestheticGeometry {
  /** Relative density of fine-grained wireframe ripples (0-1). */
  wireframeDensity?: number;
  /** Configuration for impossible physics oscillations along the path. */
  impossiblePhysics?: {
    /** Whether impossible physics is enabled. */
    enabled?: boolean;
    /** Intensity of the impossible physics effect (0-1). */
    intensity?: number;
    /** Frequency of the impossible loops (0-1). */
    frequency?: number;
  };
  /** Strength of breathing modulation driven by audio analysis (0-1). */
  organicBreathing?: number;
  /** Selects which feature drives the breathing pulse. */
  breathingDriver?: 'energy' | 'spectralFlux' | 'spectralCentroid';
}

export interface SynestheticParticleConsciousness {
  /** Scales how many neural links are attempted per update (0-1). */
  connectionDensity?: number;
  /** Minimum harmonic resonance required before linking particles (0-1). */
  resonanceThreshold?: number;
  /** Lifespan in seconds for conscious particles before fading. */
  lifespanSeconds?: number;
  /** Persistence factor for links (0-1). Higher values decay more slowly. */
  persistence?: number;
}

export interface SynestheticAtmosphere {
  /** Named mood that can bias the sky palette transitions. */
  skyMood?: string;
  /** Baseline turbulence multiplier applied to volumetric elements. */
  turbulenceBias?: number;
  /** Multiplier for rail emission when vocals surge (0-2). */
  passionIntensity?: number;
  /** Optional explicit sky tint override (hex). */
  tint?: string;
}

export interface SynestheticBlueprintLayer {
  geometry?: SynestheticGeometry | null;
  particles?: SynestheticParticleConsciousness | null;
  atmosphere?: SynestheticAtmosphere | null;
}

/**
 * The root object describing a generated rollercoaster ride.
 * This serves as the schema for the AI's output and is validated
 * on the backend.
 */
export interface Blueprint {
  // A creative and fitting name for the ride, e.g., "The Timewarp".
  rideName: string;
  // A detailed, evocative description of the ride's mood and atmosphere.
  moodDescription: string;
  // An array of 3 to 5 hex color codes for the ride's color scheme.
  palette: [string, string, string] | [string, string, string, string] | [string, string, string, string, string];
  // An array of 12 to 30 track segments defining the rollercoaster's path.
  track: TrackSegment[];
  // Optional generation options that were used to produce this blueprint.
  generationOptions?: GenerationOptions;
  // Optional timeline of small visual events (type + timestamp + params).
  events?: TimelineEvent[];
  // Optional synesthetic metadata that informs advanced visuals.
  synesthetic?: SynestheticBlueprintLayer | null;
}

// Enumerated presets for track and world generation. These inform the AI
// prompt and allow the user to select a preferred stylistic direction.
export type TrackStyle = 'classic' | 'extreme' | 'flowing' | 'technical' | 'experimental';
export type WorldTheme = 'fantasy' | 'cyberpunk' | 'aurora' | 'desert' | 'space' | 'underwater' | 'noir';
export type VisualStyle = 'photorealistic' | 'stylized' | 'painterly' | 'lowpoly' | 'retro';
export type DetailLevel = 'low' | 'medium' | 'high';
export type CameraPreset = 'epic' | 'immersive' | 'first_person' | 'wide_angle';

export interface GenerationOptions {
  // High-level stylistic presets
  trackStyle?: TrackStyle;
  worldTheme?: WorldTheme;
  visualStyle?: VisualStyle;
  paletteHint?: string[]; // optional array of preferred hex colors
  detailLevel?: DetailLevel;
  cameraPreset?: CameraPreset;

  // Audio feature utilization toggles for Gemini prompts
  useTempoMap?: boolean;
  useEnergyCurve?: boolean;
  useBrightnessCurve?: boolean;
  useBeatsAndSections?: boolean;

  // Physical/layout constraints for safer, tailored tracks
  maxGrade?: number;
  maxLateralG?: number;
  allowInversions?: boolean;

  // Skybox and timeline-aware visual generation
  enableSkyboxTimeline?: boolean;
  skyboxFrames?: number; // recommended: small (e.g., 3-6)
  skyboxAspectRatio?: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';

  // Narrative control for ride theming
  narrativeMode?: 'none' | 'abstract' | 'story';

  // Optional small visual event presets that should be favored when generating
  // timeline events (e.g., fireworks, fog, starshow). If omitted, the AI may
  // choose sensible defaults based on the music.
  preferredEventPresets?: EventPreset[];
}

// Small timeline events that can be spawned during the ride and be audio-reactive
export type EventPreset = 'fog' | 'fireworks' | 'starshow' | 'lightBurst' | 'sparkRing' | 'confetti';

export interface TimelineEvent {
  // Named preset describing the visual event type
  type: EventPreset;
  // Time (seconds) from start of track; may be provided as an absolute timestamp
  timestamp?: Seconds;
  // Relative intensity (0..1) the generator thinks is appropriate
  intensity?: number;
  // Optional duration in seconds for events that span time (fog, starshow)
  duration?: Seconds;
  // Whether the event should be audio-reactive (default true)
  audioReactive?: boolean;
  // Free-form parameters specific to the event type (e.g., color overrides)
  params?: Record<string, any> | null;
}

export interface SegmentDetail {
  intensity?: number;
  lightingEffect?: string;
  environmentChange?: string;
  audioSyncPoint?: Seconds;
  start?: Seconds;
  end?: Seconds;
}

export interface TrackData {
  path: Vector3[]; // serialized positions (structurally compatible with THREE.Vector3)
  upVectors: Vector3[];
  railColor: string;
  glowColor: string;
  skyColor1: string;
  skyColor2: string;
  segmentDetails: SegmentDetail[];
  /**
   * Cumulative progress markers (0-1, monotonic) aligned with segmentDetails.
   * Each value represents the normalized completion ratio when that segment ends.
   */
  segmentProgress?: number[];
  rideName: string;
  moodDescription: string;
  frameAnalyses: FrameAnalysis[];
  audioFeatures: AudioFeatures;
  // Runtime timeline events materialized from the blueprint (optional)
  events?: TimelineEvent[];
  synesthetic?: SynestheticBlueprintLayer | null;
}

// Helper to create a Seconds branded value from a plain number. This is a no-op at runtime
// but improves ergonomics when assigning numeric durations/timestamps across the codebase.
export const seconds = (n: number): Seconds => n as Seconds;

// Helper to convert Seconds back to number explicitly when needed.
export const secondsToNumber = (s: Seconds): number => s as unknown as number;