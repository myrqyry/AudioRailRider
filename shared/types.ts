export enum AppStatus {
  Idle = 'idle',
  Analyzing = 'analyzing',
  Generating = 'generating',
  Ready = 'ready',
  Riding = 'riding',
  Finished = 'finished',
  Error = 'error'
}

export interface FrameAnalysis {
  timestamp: number;
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  bass: number;
  mid: number;
  high: number;
}

export interface AudioFeatures {
  duration: number;
  bpm: number;
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  frameAnalyses: FrameAnalysis[];
}

export interface TrackSegment {
  component: 'climb' | 'drop' | 'turn' | 'loop' | 'barrelRoll';
  angle?: number;
  length?: number;
  direction?: 'left' | 'right';
  radius?: number;
  rotations?: number;
}

export interface RideBlueprint {
  palette: string[];
  track: TrackSegment[];
  rideName: string;
  moodDescription: string;
}

export interface TrackData {
  path: any[]; // Using any for THREE.Vector3 to avoid Three.js dependency in shared types
  upVectors: any[];
  railColor: string;
  glowColor: string;
  skyColor1: string;
  skyColor2: string;
  segmentDetails: {
    intensity?: number;
    lightingEffect?: string;
    environmentChange?: string;
    audioSyncPoint?: number;
  }[];
  rideName: string;
  moodDescription: string;
  frameAnalyses: FrameAnalysis[];
  audioFeatures: AudioFeatures;
}