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
}

export interface AudioFeatures {
  duration: Seconds;
  bpm: number;
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  frameAnalyses: FrameAnalysis[];
}

// Discriminated union for track segments so each variant has its own required params
export type TrackSegment =
  | { component: 'climb'; length: number; angle?: number }
  | { component: 'drop'; length: number; angle?: number }
  | { component: 'turn'; length: number; direction: 'left' | 'right'; angle: number; radius?: number }
  | { component: 'loop'; radius: number; rotations?: number }
  | { component: 'barrelRoll'; rotations: number; length?: number };

// Optional metadata that may be attached to segments by AI or processing steps.
export interface SegmentMeta {
  intensity?: number;
  lightingEffect?: string;
  environmentChange?: string;
  audioSyncPoint?: Seconds;
}

// Allow TrackSegment variants to optionally include SegmentMeta fields without
// losing discriminated union behavior.
export type TrackSegmentWithMeta = TrackSegment & Partial<SegmentMeta>;

export interface RideBlueprint {
  palette: string[];
  track: TrackSegment[];
  rideName: string;
  moodDescription: string;
}

export interface SegmentDetail {
  intensity?: number;
  lightingEffect?: string;
  environmentChange?: string;
  audioSyncPoint?: Seconds;
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
}

// Helper to create a Seconds branded value from a plain number. This is a no-op at runtime
// but improves ergonomics when assigning numeric durations/timestamps across the codebase.
export const seconds = (n: number): Seconds => n as Seconds;

// Helper to convert Seconds back to number explicitly when needed.
export const secondsToNumber = (s: Seconds): number => s as unknown as number;