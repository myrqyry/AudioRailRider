import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { TrackData, FrameAnalysis, SegmentDetail, TimelineEvent, secondsToNumber, SynestheticBlueprintLayer } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';
import { ParticleSystem, FeatureVisualConfig, GPUUpdateParams, ParticleQualityLevel } from './visual-effects/ParticleSystem';
import { Vector3Pool } from './utils/Vector3Pool';
import { AtmosphereController } from './environment/AtmosphereController';
import { geometryPool } from './utils/memory';

// --- Helpers ---
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// --- Constants ---
const BASS_GLOW_MIN = 0.3;
const BASS_GLOW_MAX = 1.8;
const LERP_FACTOR = 0.12;

const HIGH_QUALITY_SEGMENTS = 2;
const LOW_QUALITY_SEGMENTS = 1;
const PERFORMANCE_CHECK_INTERVAL = 2000;
const TARGET_FPS = 50;
const LOW_QUALITY_DEBOUNCE_MS = 3000;

const TRACK_RADIUS = 0.9;
const GHOST_RIBBON_RADIUS = 1.6;

export class VisualEffects {
  private static readonly UP_VECTOR = new THREE.Vector3(0, 1, 0);
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private trackData: TrackData;
  private trackMesh: THREE.Mesh;
  private trackMaterial: THREE.MeshStandardMaterial;
  private pathCurve: THREE.CatmullRomCurve3 | null = null;
  private ghostRibbonMesh: THREE.Mesh | null = null;
  private ghostRibbonMaterial: THREE.ShaderMaterial | null = null;
  private particles: ParticleSystem;
  private targetGlowIntensity: number = BASS_GLOW_MIN;
  private gpuAudioForce: number = 0;
  private rawAudioForce: number = 0;
  private curlStrength: number = 0.12;
  private noiseScale: number = 2.0;
  private noiseSpeed: number = 0.12;
  private audioFeatures: Record<string, number> = { subBass: 0, bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, sparkle: 0 };
  private segmentProgress: number[] = [];
  private timelineEvents: TimelineEvent[] = [];
  private timelineTriggeredUntil: Map<number, number> = new Map();
  private lastAudioTimeSeconds: number = 0;
  private baseRailColor: THREE.Color;
  private baseEmissiveColor: THREE.Color;
  private baseGhostTintA: THREE.Color;
  private baseGhostTintB: THREE.Color;
  private trackTintA: THREE.Color;
  private trackTintB: THREE.Color;
  private trackShaderUniforms: Record<string, THREE.IUniform> | null = null;
  private segmentColorTarget: THREE.Color;
  private segmentIntensityBoost: number = 1;
  private currentSegmentIndex: number = 0;
  private readonly _colorTmp = new THREE.Color();
  private readonly _colorTmp2 = new THREE.Color();
  private readonly _colorTmp3 = new THREE.Color();
  private readonly _forward = new THREE.Vector3();
  private readonly _right = new THREE.Vector3();
  private readonly _up = new THREE.Vector3();
  private highQualityMode: boolean = true;
  private lastPerformanceCheck: number = 0;
  private frameCount: number = 0;
  private lowQualitySince: number | null = null;
  private isWarmedUp: boolean = false;
  private firstUpdateTime: number = 0;
  private lastUpdateSeconds: number = 0;
  private trackPulse: number = 0;
  private synesthetic: SynestheticBlueprintLayer | null = null;
  private atmosphere: AtmosphereController | null = null;
  private passionGain: number = 1;
  private motionParticlePool: THREE.Vector3[] = [];
  private speedStreakGeometry: THREE.BufferGeometry | null = null;
  private speedStreakMaterial: THREE.ShaderMaterial | null = null;
  private speedStreakMesh: THREE.Points | null = null;
  private speedStreakAges: Float32Array | null = null;
  private speedStreakLifetimes: Float32Array | null = null;
  private speedStreakVelocities: Float32Array | null = null;
  private speedStreakCursor: number = 0;
  private speedStreakBufferSize: number = 0;
  private tunnelRushMaterial: THREE.ShaderMaterial | null = null;
  private tunnelRushMesh: THREE.Mesh | null = null;
  private lastMotionPosition: THREE.Vector3 = new THREE.Vector3();
  private hasMotionHistory: boolean = false;
  private previousTrackModelViewMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private rideSpeedSmoothed: number = 0;
  private hasPreviousModelViewMatrix: boolean = false;
  private motionEffectsInitialized: boolean = false;
  private motionUniformsBound: boolean = false;
  private readonly _tmpMatrix = new THREE.Matrix4();
  private trackPathPoints: THREE.Vector3[] = [];
  private usingProceduralTrack: boolean = false;

  // --- Object Pools ---
  private readonly _vectorPool = new Vector3Pool(12);
  private readonly _scopedVectors: THREE.Vector3[] = [];
  private readonly _colorPool = Array.from({length: 4}, () => new THREE.Color());
  private _colorPoolIndex = 0;

  private getTempVector3(): THREE.Vector3 {
    const vector = this._vectorPool.acquire();
    this._scopedVectors.push(vector);
    return vector.set(0, 0, 0);
  }

  private releaseTempVectors(): void {
    while (this._scopedVectors.length > 0) {
      const vector = this._scopedVectors.pop()!;
      this._vectorPool.release(vector);
    }
  }

  private getTempColor(): THREE.Color {
    const color = this._colorPool[this._colorPoolIndex];
    this._colorPoolIndex = (this._colorPoolIndex + 1) % this._colorPool.length;
    return color.setHex(0x000000);
  }

  private acquireMotionVector(): THREE.Vector3 {
    return this.motionParticlePool.pop() ?? new THREE.Vector3();
  }

  private releaseMotionVector(vec: THREE.Vector3): void {
    this.motionParticlePool.push(vec);
  }

  private updateUniformSafe(uniform: THREE.IUniform, newValue: number, epsilon = 1e-3): boolean {
    if (uniform && uniform.value !== undefined && Math.abs(uniform.value - newValue) > epsilon) {
      uniform.value = newValue;
      return true;
    }
    return false;
  }

  private updateColorUniformSafe(uniform: THREE.IUniform, newColor: THREE.Color, epsilon = 1e-3): boolean {
    if (!uniform || !uniform.value) {
      return false;
    }

    const value = uniform.value as THREE.Color | THREE.Vector3 | undefined;

    if (value instanceof THREE.Color) {
      if (!value.equals(newColor)) {
        value.copy(newColor);
        return true;
      }
      return false;
    }

    if (value instanceof THREE.Vector3) {
      const dr = Math.abs(value.x - newColor.r);
      const dg = Math.abs(value.y - newColor.g);
      const db = Math.abs(value.z - newColor.b);
      if (dr > epsilon || dg > epsilon || db > epsilon) {
        value.set(newColor.r, newColor.g, newColor.b);
        return true;
      }
      return false;
    }

    uniform.value = newColor.clone();
    return true;
  }

  constructor(scene: THREE.Scene, trackData: TrackData, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.trackData = trackData;
    this.synesthetic = trackData.synesthetic ?? null;

    const sanitized = this.analyzeAndSanitizePath(trackData.path);
    console.log('[VisualEffects] Track diagnostics', {
      hasPath: Array.isArray(trackData.path),
      receivedCount: Array.isArray(trackData.path) ? trackData.path.length : 0,
      validCount: sanitized.points.length,
      issues: sanitized.issues,
      sample: sanitized.points.slice(0, 3).map((v) => ({ x: v.x, y: v.y, z: v.z })),
    });
    if (sanitized.issues.length) {
      console.warn('[VisualEffects] Track path issues detected', sanitized.issues);
    }

    this.trackPathPoints = sanitized.points;
    if (this.trackPathPoints.length < 2) {
      console.warn('[VisualEffects] Track path invalid or too short, generating procedural fallback');
      this.trackPathPoints = this.generateProceduralTrack(trackData);
      this.usingProceduralTrack = true;
    } else {
      this.usingProceduralTrack = false;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.highQualityMode = !isMobile;

    this.baseRailColor = new THREE.Color(trackData.railColor || '#ffffff');
    this.baseEmissiveColor = new THREE.Color(trackData.glowColor || '#00ffff');
    const pastelBase = new THREE.Color('#e6f3ff');
    const pastelGlow = new THREE.Color('#ffe5ff');
    this.baseRailColor.lerp(pastelBase, 0.35);
    this.baseEmissiveColor.lerp(pastelGlow, 0.4);
    this.segmentColorTarget = this.baseEmissiveColor.clone();
    this.baseGhostTintA = new THREE.Color('#cfe9ff');
    this.baseGhostTintB = new THREE.Color('#ffdff9');
    this.trackTintA = this.baseRailColor.clone().lerp(this.baseGhostTintA, 0.5);
    this.trackTintB = this.baseEmissiveColor.clone().lerp(this.baseGhostTintB, 0.6);

    const n = trackData.segmentDetails?.length ?? 0;
    this.segmentProgress = this.ensureSegmentMidpoints(
      trackData.segmentProgress,
      trackData.segmentDetails,
      n
    );

    try {
      this.timelineEvents = Array.isArray((trackData as any).events) ? (trackData as any).events.slice() : [];

      this.atmosphere = new AtmosphereController(this.scene, trackData.skyColor1 || '#0d0a1f', this.synesthetic?.atmosphere ?? null);
      for (const ev of this.timelineEvents) {
        if (ev && ev.timestamp === undefined && ev.params && ev.params.audioSyncPoint) {
          ev.timestamp = ev.params.audioSyncPoint as any;
        }
      }
      this.timelineEvents.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } catch (e) {
      this.timelineEvents = [];
    }

    this.trackMaterial = new THREE.MeshStandardMaterial({
      color: this.baseRailColor.clone(),
      emissive: this.baseEmissiveColor.clone(),
      emissiveIntensity: BASS_GLOW_MIN,
      metalness: 0.15,
      roughness: 0.65,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    this.trackMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.trackTime = { value: 0 };
      shader.uniforms.pulseIntensity = { value: 0 };
      shader.uniforms.segmentBoost = { value: 1 };
      shader.uniforms.audioFlow = { value: 0 };
      shader.uniforms.ghostTintA = { value: this.trackTintA };
      shader.uniforms.ghostTintB = { value: this.trackTintB };
      shader.uniforms.distortionStrength = { value: 0 };
      shader.uniforms.bassIntensity = { value: 0 };
      shader.uniforms.trebleIntensity = { value: 0 };
      shader.uniforms.rideSpeed = { value: 0 };
      shader.uniforms.motionBlur = { value: 0 };
      shader.uniforms.cameraDirection = { value: new THREE.Vector3() };
      shader.uniforms.previousModelViewMatrix = { value: new THREE.Matrix4() };

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vVelocity;
uniform float trackTime;
uniform float pulseIntensity;
uniform float segmentBoost;
uniform float audioFlow;
uniform vec3 ghostTintA;
uniform vec3 ghostTintB;
uniform float rideSpeed;
uniform float motionBlur;
uniform vec3 cameraDirection;
`
        )
        .replace(
          'vec3 totalEmissiveRadiance = emissive;',
          `float pathV = clamp(vUv.y, 0.0, 1.0);
float railCenterLine = abs(vUv.x - 0.5) * 2.0;
float railShine = smoothstep(0.35, 0.85, 1.0 - railCenterLine);
float loopWave = sin(pathV * 24.0 - trackTime * 5.5);
float traveler = smoothstep(0.05, 0.95, fract(pathV - trackTime * 0.35));
float spirit = pulseIntensity + audioFlow * 0.35 + segmentBoost * 0.2;
float speedTrailBase = rideSpeed * smoothstep(0.1, 0.9, railShine);
vec3 energyColorBase = mix(ghostTintA, ghostTintB, clamp(pathV + sin(trackTime * 3.0) * 0.08, 0.0, 1.0));

float speedLines = 0.0;
for (int i = 0; i < 5; i++) {
  float lineOffset = float(i) * 0.2;
  float speedLine = sin((pathV + lineOffset) * 50.0 - trackTime * rideSpeed * 2.0);
  speedLines += smoothstep(0.8, 1.0, speedLine) * (1.0 - lineOffset);
}
speedLines *= rideSpeed * 0.3;

float velocityMag = length(vVelocity);
vec3 velocityDir = velocityMag > 1e-6 ? vVelocity / velocityMag : vec3(0.0);
float camDirMag = length(cameraDirection);
vec3 camDir = camDirMag > 1e-6 ? cameraDirection / camDirMag : vec3(0.0, 0.0, -1.0);
float velocityDot = dot(velocityDir, camDir);
vec3 dopplerShift = velocityDot > 0.0 ? vec3(0.0, 0.0, 0.3) * velocityDot : vec3(0.3, 0.0, 0.0) * abs(velocityDot);

vec2 motionVector = vUv - vec2(0.5, pathV - trackTime * 0.1);
float motionTrail = exp(-length(motionVector * 10.0)) * motionBlur;

float energyFlow = sin(pathV * 20.0 - trackTime * 8.0) * 0.5 + 0.5;
energyFlow = pow(energyFlow, 3.0);
float flowIntensity = audioFlow + rideSpeed * 0.1;

float perspectiveBlur = smoothstep(0.0, 1.0, abs(vUv.x - 0.5) * 2.0);
perspectiveBlur *= rideSpeed * 0.2;

vec3 motionColor = mix(ghostTintA, ghostTintB, clamp(pathV + sin(trackTime * 4.0) * 0.1, 0.0, 1.0));
vec3 speedGlowDynamic = motionColor * (speedLines + energyFlow * flowIntensity);
vec3 trailGlow = motionColor * motionTrail * 0.8;
vec3 blurGlow = motionColor * perspectiveBlur;
vec3 dreamTint = energyColorBase * (0.35 + 0.25 * traveler + 0.2 * max(loopWave, 0.0));
vec3 speedGlowBase = energyColorBase * speedTrailBase * 0.5;

vec3 totalEmissiveRadiance = emissive + dreamTint * spirit + speedGlowBase + speedGlowDynamic + trailGlow + blurGlow + dopplerShift;
`
        );

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vVelocity;
uniform float trackTime;
uniform float distortionStrength;
uniform float bassIntensity;
uniform float trebleIntensity;
uniform float rideSpeed;
uniform mat4 previousModelViewMatrix;
`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
vUv = uv;
vec4 currentPosition = modelViewMatrix * vec4(position, 1.0);
vec4 previousPosition = previousModelViewMatrix * vec4(position, 1.0);
vVelocity = (currentPosition - previousPosition).xyz;
float vPath = clamp(uv.y, 0.0, 1.0);
float speedWarp = sin(vPath * 30.0 - trackTime * rideSpeed) * rideSpeed * 0.05;
transformed += normal * speedWarp;
transformed += normal * bassIntensity * (1.5 + rideSpeed * 0.1);
float trebleWarp = sin(vPath * 60.0 - trackTime * 4.0) * trebleIntensity * (0.4 + rideSpeed * 0.02);
transformed += normal * trebleWarp;
float motionRibbon = sin(vPath * 18.0 + trackTime * (2.0 + rideSpeed * 0.5));
float ribbonIntensity = distortionStrength * (0.2 + 0.3 * motionRibbon);
transformed += normal * ribbonIntensity;
float speedVibration = sin(vPath * 100.0 + trackTime * 20.0) * rideSpeed * 0.02;
transformed += normal * speedVibration;
vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
`
        );

      this.trackShaderUniforms = shader.uniforms as Record<string, THREE.IUniform>;
      this.motionUniformsBound = false;
      this.configureMotionUniforms();
      this.initializeMotionEffects();
      this.hasPreviousModelViewMatrix = false;
    };

  const segments = this.highQualityMode ? this.trackPathPoints.length * HIGH_QUALITY_SEGMENTS : this.trackPathPoints.length * LOW_QUALITY_SEGMENTS;
  const curve = new THREE.CatmullRomCurve3(this.trackPathPoints.map((p) => p.clone()));
    this.pathCurve = curve;
    const geometry = new THREE.TubeGeometry(curve, segments, TRACK_RADIUS, 8, false);

    // Generate the BVH for the track geometry to accelerate raycasting
    (geometry as any).boundsTree = new MeshBVH(geometry);

    this.trackMesh = new THREE.Mesh(geometry, this.trackMaterial);
    this.trackMesh.frustumCulled = true;
    this.scene.add(this.trackMesh);

    if (this.usingProceduralTrack) {
      this.trackMaterial.color.setHex(0xff6b6b);
    }

    this.ghostRibbonMaterial = this.createGhostRibbonMaterial();
    this.rebuildGhostRibbon(curve, segments);

    this.particles = new ParticleSystem(this.scene);
    const initialProfile: ParticleQualityLevel = this.highQualityMode ? 'high' : 'medium';
    this.particles.setQualityProfile(initialProfile);
    this.particles.setConsciousnessSettings(this.synesthetic?.particles ?? null);
    this.seedAmbientParticles();

    this.initializeMotionEffects();

    try {
      const listenerRig = new THREE.Object3D();
      this.camera.add(listenerRig);
      const audioGlow = new THREE.PointLight(this.baseEmissiveColor.clone(), 0.0, 48, 2);
      audioGlow.name = 'audioGlow';
      listenerRig.add(audioGlow);
    } catch (e) {}

    this.createTunnelRushEffect();

    if (this.pathCurve) {
      this.lastMotionPosition.copy(this.pathCurve.getPointAt(0));
      this.hasMotionHistory = true;
    }
  }

  private static normalizePathPoint(point: any): THREE.Vector3 | null {
    if (!point) return null;
    if (point instanceof THREE.Vector3) {
      if (Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z)) {
        return point.clone();
      }
      return null;
    }
    if (typeof point === 'object') {
      const { x, y, z } = point as { x?: number; y?: number; z?: number };
      if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
        return new THREE.Vector3(x, y, z);
      }
    }
    return null;
  }

  private static removeDuplicatePoints(points: THREE.Vector3[], epsilon = 1e-2): THREE.Vector3[] {
    if (points.length <= 1) {
      return points;
    }
    const unique: THREE.Vector3[] = [points[0].clone()];
    for (let i = 1; i < points.length; i++) {
      const candidate = points[i];
      const previous = unique[unique.length - 1];
      if (candidate.distanceTo(previous) > epsilon) {
        unique.push(candidate.clone());
      }
    }
    return unique;
  }

  private analyzeAndSanitizePath(rawPath: unknown): { points: THREE.Vector3[]; issues: string[] } {
    const issues: string[] = [];
    if (!Array.isArray(rawPath)) {
      issues.push('Path is not an array');
      return { points: [], issues };
    }

    const normalized: THREE.Vector3[] = [];
    rawPath.forEach((entry, index) => {
      const vec = VisualEffects.normalizePathPoint(entry);
      if (!vec) {
        issues.push(`Invalid point at index ${index}`);
      } else {
        normalized.push(vec);
      }
    });

    const deduped = VisualEffects.removeDuplicatePoints(normalized);
    if (deduped.length === 0) {
      issues.push('No valid points after sanitization');
    } else if (deduped.length === 1) {
      issues.push('Only one unique point provided');
    }

    return { points: deduped, issues };
  }

  public static validateTrackData(data: any): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    if (!data) {
      issues.push('TrackData is null or undefined');
      return { valid: false, issues };
    }
    if (!Array.isArray(data.path)) {
      issues.push('TrackData.path must be an array');
    } else if (data.path.length < 2) {
      issues.push(`TrackData.path must contain at least 2 points (received ${data.path.length})`);
    }
    if (Array.isArray(data.path)) {
      data.path.forEach((point: any, index: number) => {
        const vec = VisualEffects.normalizePathPoint(point);
        if (!vec) {
          issues.push(`TrackData.path[${index}] is not a valid Vector3-like point`);
        }
      });
    }
    const valid = issues.length === 0;
    return { valid, issues };
  }

  private generateProceduralTrack(trackData: TrackData): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const audio = trackData.audioFeatures || {};
    const duration = typeof audio.duration === 'number' ? audio.duration : secondsToNumber(audio.duration ?? 120);
    const energy = typeof audio.energy === 'number' ? THREE.MathUtils.clamp(audio.energy, 0, 1) : 0.5;
    const bpm = typeof audio.bpm === 'number' ? Math.max(60, Math.min(240, audio.bpm)) : 120;
    const segmentCount = Math.max(24, Math.round(32 + (duration / 30) * 12 + energy * 24));
    const radius = 28 + energy * 12;
    const height = 12 + energy * 10;

    for (let i = 0; i <= segmentCount; i++) {
      const t = i / segmentCount;
      const energyMod = 1 + Math.sin(t * Math.PI * 4) * 0.25 * energy;
      const angle = t * Math.PI * 4 * energyMod + (bpm / 180) * t;
      const spiral = 1 + Math.sin(t * Math.PI * 6) * 0.18;
      const x = Math.cos(angle) * radius * spiral;
      const z = Math.sin(angle) * radius * spiral;
      const y = Math.sin(t * Math.PI * 3) * height * energy + Math.sin(t * Math.PI * 9) * height * 0.25;
      points.push(new THREE.Vector3(x, y, z));
    }

    console.log('[VisualEffects] Procedural track generated', {
      pointCount: points.length,
      duration,
      energy,
      bpm,
    });

    return points;
  }

  private seedAmbientParticles(): void {
    if (!this.pathCurve) return;
    const sampleCount = Math.min(48, Math.max(18, Math.floor(this.trackPathPoints.length / 4)));
    const nowSeconds = performance.now() / 1000;
    const spread = GHOST_RIBBON_RADIUS * 4.2;
    this.particles.seedAmbientField(this.pathCurve, sampleCount, spread, nowSeconds, this.audioFeatures, 0.9);
  }

  public async initGPU(renderer: THREE.WebGLRenderer) {
    await this.particles.initGPU(renderer, {
      curlStrength: this.curlStrength,
      noiseScale: this.noiseScale,
      noiseSpeed: this.noiseSpeed,
    });
  }

  private updateGPU(deltaSeconds: number) {
    this.particles.updateGPU(deltaSeconds, {
      audioFeatures: this.audioFeatures,
      segmentIntensityBoost: this.segmentIntensityBoost,
      gpuAudioForce: this.gpuAudioForce,
      curlStrength: this.curlStrength,
      noiseScale: this.noiseScale,
      noiseSpeed: this.noiseSpeed,
    });
  }

  public setAudioFeatures(features: Record<string, number> | null | undefined) {
    if (!features || typeof features !== 'object') return;
    try {
      for (const k of Object.keys(features)) {
        const v = (features as Record<string, unknown>)[k];
        if (typeof v === 'number') this.audioFeatures[k] = Math.max(0, Math.min(1, v));
      }
    } catch (e) {
      console.warn('[VisualEffects] setAudioFeatures received invalid data', e);
    }
  }

  private makeEqualSpacedMidpoints(n: number): number[] {
    if (n <= 0) return [];
    if (n === 1) return [0.5];
    const out = new Array<number>(n);
    for (let i = 0; i < n; i++) out[i] = (i + 0.5) / n;
    return out;
  }

  private buildMidpointsFromSegmentDetails(details: SegmentDetail[]): number[] {
    const n = details?.length ?? 0;
    if (n === 0) return [];
    const t0 = details[0].start;
    const t1 = details[n - 1].end ?? details[n - 1].start;
    const total = Math.max(1e-6, t1 - t0);
    const out = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      const mid = 0.5 * ((details[i].start ?? t0) + (details[i].end ?? details[i].start ?? t0));
      out[i] = clamp01((mid - t0) / total);
    }
    return out;
  }

  private ensureSegmentMidpoints(
    derivedProgress: number[] | undefined,
    details: SegmentDetail[] | undefined,
    expectedCount: number
  ): number[] {
    const isValid =
      Array.isArray(derivedProgress) &&
      derivedProgress.length === expectedCount &&
      derivedProgress.every((v) => Number.isFinite(v) && v >= 0 && v <= 1);

    if (isValid) return derivedProgress as number[];

    if (details && details.length === expectedCount) {
      return this.buildMidpointsFromSegmentDetails(details);
    }
    return this.makeEqualSpacedMidpoints(expectedCount);
  }

  private configureMotionUniforms(): void {
    if (!this.trackShaderUniforms || this.motionUniformsBound) {
      return;
    }

    const uniforms = this.trackShaderUniforms;

    if (!uniforms.cameraDirection) {
      uniforms.cameraDirection = { value: new THREE.Vector3(0, 0, -1) };
    } else if (!(uniforms.cameraDirection.value instanceof THREE.Vector3)) {
      const raw = uniforms.cameraDirection.value as THREE.Vector3 | { x?: number; y?: number; z?: number } | undefined;
      const next = new THREE.Vector3();
      if (raw && typeof raw === 'object') {
        next.set(raw.x ?? 0, raw.y ?? 0, raw.z ?? -1);
      } else {
        next.set(0, 0, -1);
      }
      uniforms.cameraDirection.value = next;
    }

    if (!uniforms.previousModelViewMatrix) {
      uniforms.previousModelViewMatrix = { value: this.previousTrackModelViewMatrix.clone() };
    } else if (!(uniforms.previousModelViewMatrix.value instanceof THREE.Matrix4)) {
      uniforms.previousModelViewMatrix.value = this.previousTrackModelViewMatrix.clone();
    }

    const prevMatrix = uniforms.previousModelViewMatrix.value as THREE.Matrix4;
    prevMatrix.copy(this.previousTrackModelViewMatrix);

    this.motionUniformsBound = true;
  }

  private initializeMotionEffects(): void {
    if (this.motionEffectsInitialized || !this.particles) {
      this.configureMotionUniforms();
      return;
    }

    this.configureMotionUniforms();

    this.particles.registerFeatureVisual('speed', {
      color: [0.65, 0.9, 1.0],
      sensitivity: 0.8,
      size: this.highQualityMode ? 1.4 : 1.0,
      lifetime: 1.8,
      behavior: 'trail',
    });

    this.createSpeedStreakSystem();

    this.motionEffectsInitialized = true;
  }

  private getTargetSpeedStreakCount(): number {
    return this.highQualityMode ? 640 : 220;
  }

  private teardownSpeedStreakSystem(): void {
    if (this.speedStreakMesh) {
      try { this.scene.remove(this.speedStreakMesh); } catch (e) {}
      this.speedStreakMesh = null;
    }
    if (this.speedStreakMaterial) {
      try { this.speedStreakMaterial.dispose(); } catch (e) {}
      this.speedStreakMaterial = null;
    }
    if (this.speedStreakGeometry) {
      try { this.speedStreakGeometry.dispose(); } catch (e) {}
      this.speedStreakGeometry = null;
    }
    this.speedStreakAges = null;
    this.speedStreakLifetimes = null;
    this.speedStreakVelocities = null;
    this.speedStreakCursor = 0;
    this.speedStreakBufferSize = 0;
  }

  private createSpeedStreakSystem(targetCount?: number): void {
    const streakCount = Math.max(32, targetCount ?? this.getTargetSpeedStreakCount());
    if (this.speedStreakGeometry && this.speedStreakBufferSize === streakCount) {
      return;
    }

    this.teardownSpeedStreakSystem();

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(streakCount * 3);
    const velocities = new Float32Array(streakCount * 3);
    const ages = new Float32Array(streakCount);
    const lifetimes = new Float32Array(streakCount);
    lifetimes.fill(0.6);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('age', new THREE.BufferAttribute(ages, 1).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1).setUsage(THREE.DynamicDrawUsage));

  geometry.setDrawRange(0, streakCount);
  geometry.computeBoundingSphere();

  const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        rideSpeed: { value: 0 },
        streakIntensity: { value: 0 },
        cameraDir: { value: new THREE.Vector3(0, 0, -1) },
        colorA: { value: this.trackTintA.clone() },
        colorB: { value: this.trackTintB.clone() },
      },
      vertexShader: `
attribute float age;
attribute float lifetime;
attribute vec3 velocity;
varying float vLife;
varying float vProgress;
uniform float rideSpeed;
uniform float streakIntensity;
uniform vec3 cameraDir;
void main() {
  float life = max(lifetime, 1e-4);
  float progress = clamp(age / life, 0.0, 1.0);
  vec3 forward = normalize(velocity + cameraDir * 0.35);
  float stretch = mix(0.55, 1.65, clamp(rideSpeed * 0.08, 0.0, 1.0));
  vec3 displaced = position - forward * progress * stretch;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float baseSize = mix(6.0, 18.0, clamp(rideSpeed * 0.1, 0.0, 1.0));
  baseSize *= streakIntensity;
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = baseSize * (1.0 - progress) * clamp(1.0 / max(-mvPosition.z, 0.1), 0.0, 2.0);
  vLife = 1.0 - progress;
  vProgress = progress;
}
      `,
      fragmentShader: `
varying float vLife;
varying float vProgress;
uniform float rideSpeed;
uniform float streakIntensity;
uniform vec3 colorA;
uniform vec3 colorB;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv * vec2(1.0, 2.6));
  float alpha = smoothstep(0.6, 0.0, dist);
  vec3 color = mix(colorA, colorB, clamp(vProgress + rideSpeed * 0.05, 0.0, 1.0));
  color += vec3(0.1, 0.02, 0.15) * rideSpeed * 0.08;
  alpha *= vLife * streakIntensity;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);
}
      `,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    points.renderOrder = 2;
    this.scene.add(points);

    this.speedStreakGeometry = geometry;
    this.speedStreakMaterial = material;
    this.speedStreakMesh = points;
    this.speedStreakAges = ages;
    this.speedStreakLifetimes = lifetimes;
    this.speedStreakVelocities = velocities;
    this.speedStreakCursor = 0;
    this.speedStreakBufferSize = streakCount;
  }

  private spawnMotionParticles(origin: THREE.Vector3, direction: THREE.Vector3, rideSpeed: number): void {
    if (!this.speedStreakGeometry || !this.speedStreakAges || !this.speedStreakLifetimes || !this.speedStreakVelocities) {
      return;
    }

    const count = this.speedStreakAges.length;
    if (count === 0) return;

    if (rideSpeed < 4.5) {
      return;
    }

    const qualitySpawnBias = this.highQualityMode ? 6 : 3;
    const spawnFactor = this.highQualityMode ? 0.65 : 0.35;
    const spawnBudget = Math.min(count, qualitySpawnBias + Math.floor(rideSpeed * spawnFactor));
    const right = this._right;
    const up = this._up;
    const positions = this.speedStreakGeometry.getAttribute('position') as THREE.BufferAttribute;
    const velocitiesAttr = this.speedStreakGeometry.getAttribute('velocity') as THREE.BufferAttribute;
    const agesAttr = this.speedStreakGeometry.getAttribute('age') as THREE.BufferAttribute;
    const lifetimeAttr = this.speedStreakGeometry.getAttribute('lifetime') as THREE.BufferAttribute;

    for (let i = 0; i < spawnBudget; i++) {
      const index = this.speedStreakCursor++ % count;
      const jitterForward = (Math.random() - 0.5) * 4.0;
      const jitterRight = (Math.random() - 0.5) * 1.2;
      const jitterUp = (Math.random() - 0.5) * 1.0;
      const spawnPosX = origin.x + direction.x * jitterForward + right.x * jitterRight + up.x * jitterUp;
      const spawnPosY = origin.y + direction.y * jitterForward + right.y * jitterRight + up.y * jitterUp;
      const spawnPosZ = origin.z + direction.z * jitterForward + right.z * jitterRight + up.z * jitterUp;

      positions.setXYZ(index, spawnPosX, spawnPosY, spawnPosZ);
      const streakVelocity = this.acquireMotionVector()
        .copy(direction)
        .addScaledVector(right, (Math.random() - 0.5) * 0.6)
        .addScaledVector(up, (Math.random() - 0.5) * 0.6)
        .multiplyScalar(Math.max(4.5, rideSpeed * 1.6));

      velocitiesAttr.setXYZ(index, streakVelocity.x, streakVelocity.y, streakVelocity.z);
      this.releaseMotionVector(streakVelocity);
      const lifetime = THREE.MathUtils.lerp(0.45, 1.1, Math.random());
      this.speedStreakAges[index] = 0;
      this.speedStreakLifetimes[index] = lifetime;
      agesAttr.setX(index, 0);
      lifetimeAttr.setX(index, lifetime);
    }

    positions.needsUpdate = true;
    velocitiesAttr.needsUpdate = true;
    agesAttr.needsUpdate = true;
    lifetimeAttr.needsUpdate = true;
  }

  private updateMotionEffects(deltaSeconds: number, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3, rideProgress: number): number {
    if (deltaSeconds <= 0) {
      return this.rideSpeedSmoothed;
    }

    if (!this.trackShaderUniforms) {
      this.configureMotionUniforms();
    }

    this._forward.subVectors(lookAtPosition, cameraPosition);
    if (this._forward.lengthSq() < 1e-6) {
      this._forward.set(0, 0, -1);
    } else {
      this._forward.normalize();
    }

    this._right.copy(this._forward).cross(VisualEffects.UP_VECTOR);
    if (this._right.lengthSq() < 1e-6) {
      this._right.set(1, 0, 0);
    } else {
      this._right.normalize();
    }

    this._up.copy(this._right).cross(this._forward);
    if (this._up.lengthSq() < 1e-6) {
      this._up.set(0, 1, 0);
    } else {
      this._up.normalize();
    }

    let rideSpeed = this.rideSpeedSmoothed;
    if (this.pathCurve) {
      const targetPoint = this.getTempVector3();
      this.pathCurve.getPointAt(THREE.MathUtils.clamp(rideProgress, 0, 1), targetPoint);
      if (this.hasMotionHistory) {
  const deltaVector = this.getTempVector3().subVectors(targetPoint, this.lastMotionPosition);
  rideSpeed = THREE.MathUtils.clamp(deltaVector.length() / Math.max(deltaSeconds, 1e-4), 0, 160);
      } else {
        rideSpeed = 0;
        this.hasMotionHistory = true;
      }
      this.lastMotionPosition.copy(targetPoint);
    }

    this.rideSpeedSmoothed = THREE.MathUtils.lerp(this.rideSpeedSmoothed, rideSpeed, 0.18);

    this.configureMotionUniforms();
    if (this.trackShaderUniforms?.cameraDirection?.value instanceof THREE.Vector3) {
      (this.trackShaderUniforms.cameraDirection.value as THREE.Vector3).copy(this._forward);
    }

    if (!this.speedStreakGeometry) {
      this.createSpeedStreakSystem();
    }

    if (this.speedStreakGeometry && this.speedStreakAges && this.speedStreakLifetimes && this.speedStreakVelocities) {
      const positions = this.speedStreakGeometry.getAttribute('position') as THREE.BufferAttribute;
      const velocitiesAttr = this.speedStreakGeometry.getAttribute('velocity') as THREE.BufferAttribute;
      const agesAttr = this.speedStreakGeometry.getAttribute('age') as THREE.BufferAttribute;
      const lifetimeAttr = this.speedStreakGeometry.getAttribute('lifetime') as THREE.BufferAttribute;
      const count = this.speedStreakAges.length;
      const velArray = this.speedStreakVelocities;
      const delta = deltaSeconds;
      const posArray = positions.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const lifetime = this.speedStreakLifetimes[i];
        if (lifetime <= 0) continue;
        const age = Math.min(lifetime, this.speedStreakAges[i] + delta);
        this.speedStreakAges[i] = age;
        agesAttr.setX(i, age);
        if (age < lifetime) {
          const offset = i * 3;
          posArray[offset] += velArray[offset] * delta;
          posArray[offset + 1] += velArray[offset + 1] * delta;
          posArray[offset + 2] += velArray[offset + 2] * delta;
        }
      }
      positions.needsUpdate = true;
      agesAttr.needsUpdate = true;
    }

    const motionOrigin = this.getTempVector3().copy(cameraPosition).addScaledVector(this._forward, 6.0);
    if (this.rideSpeedSmoothed > 6.0) {
      this.spawnMotionParticles(motionOrigin, this._forward, this.rideSpeedSmoothed);
    }

    if (this.speedStreakMaterial) {
      const uniforms = this.speedStreakMaterial.uniforms;
      uniforms.time.value += deltaSeconds;
      uniforms.rideSpeed.value = THREE.MathUtils.lerp(uniforms.rideSpeed.value, this.rideSpeedSmoothed, 0.12);
      uniforms.streakIntensity.value = THREE.MathUtils.lerp(uniforms.streakIntensity.value, Math.min(1.0, this.rideSpeedSmoothed * 0.12), 0.18);
      (uniforms.colorA.value as THREE.Color).copy(this.trackTintA);
      (uniforms.colorB.value as THREE.Color).copy(this.trackTintB);
      (uniforms.cameraDir.value as THREE.Vector3).copy(this._forward);
    }

    if (this.tunnelRushMaterial) {
      const uniforms = this.tunnelRushMaterial.uniforms;
      uniforms.time.value += deltaSeconds;
      uniforms.speedFactor.value = THREE.MathUtils.lerp(uniforms.speedFactor.value, Math.min(1.2, this.rideSpeedSmoothed * 0.08), 0.12);
      uniforms.intensity.value = THREE.MathUtils.lerp(uniforms.intensity.value, Math.min(1.0, this.gpuAudioForce * 0.12 + this.rideSpeedSmoothed * 0.04), 0.08);
      (uniforms.colorA.value as THREE.Color).copy(this.trackTintA);
      (uniforms.colorB.value as THREE.Color).copy(this.trackTintB);
    }

    this.updateTrackMotionMatrices();

    return this.rideSpeedSmoothed;
  }

  private createTunnelRushEffect(): void {
    if (this.tunnelRushMesh) {
      return;
    }

    const geometry = new THREE.SphereGeometry(65, 32, 24);
    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0 },
        speedFactor: { value: 0 },
        colorA: { value: this.trackTintA.clone() },
        colorB: { value: this.trackTintB.clone() },
      },
      vertexShader: `
varying vec3 vNormalDir;
void main() {
  vNormalDir = normalize(normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
      `,
      fragmentShader: `
varying vec3 vNormalDir;
uniform float time;
uniform float intensity;
uniform float speedFactor;
uniform vec3 colorA;
uniform vec3 colorB;
void main() {
  float lane = sin(vNormalDir.z * 16.0 - time * (4.0 + speedFactor * 6.0));
  float radial = sin(vNormalDir.x * 12.0 + time * 5.0) * 0.5 + 0.5;
  float pulse = sin(time * 3.0 + vNormalDir.y * 8.0) * 0.5 + 0.5;
  float mixFactor = clamp(radial + speedFactor * 0.3, 0.0, 1.0);
  vec3 color = mix(colorA, colorB, mixFactor);
  color += vec3(0.2, 0.15, 0.3) * speedFactor;
  float opacity = clamp(intensity * (0.35 + pulse * 0.4) + abs(lane) * 0.25, 0.0, 1.0);
  if (opacity < 0.02) discard;
  gl_FragColor = vec4(color, opacity);
}
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'tunnelRush';
    mesh.renderOrder = 1;
    this.camera.add(mesh);

    this.tunnelRushMesh = mesh;
    this.tunnelRushMaterial = material;
  }

  private updateTrackMotionMatrices(): void {
    if (!this.trackShaderUniforms || !this.trackMesh) {
      return;
    }

  this.camera.updateMatrixWorld();
  const current = this._tmpMatrix.multiplyMatrices(this.camera.matrixWorldInverse, this.trackMesh.matrixWorld);

    if (!this.hasPreviousModelViewMatrix) {
      this.previousTrackModelViewMatrix.copy(current);
      this.hasPreviousModelViewMatrix = true;
    }

    const uniform = this.trackShaderUniforms.previousModelViewMatrix;
    if (uniform && uniform.value instanceof THREE.Matrix4) {
      uniform.value.copy(this.previousTrackModelViewMatrix);
    }

    this.previousTrackModelViewMatrix.copy(current);
  }

  private deriveSegmentColor(detail?: SegmentDetail): THREE.Color {
    if (!detail) return this.baseEmissiveColor;
    const env = detail.environmentChange;
    if (typeof env === 'string' && env.trim().length > 0 && env.trim().toLowerCase() !== 'none') {
      try {
        const tempColor = this.getTempColor().set(env);
        this._colorTmp.copy(tempColor);
        return this._colorTmp;
      } catch (e) {}
    }
    const effect = detail.lightingEffect?.toLowerCase() || '';
    if (effect.includes('warm') || effect.includes('ember') || effect.includes('sun') || effect.includes('fire')) {
      return this.getTempColor().set('#ff8a3d');
    }
    if (effect.includes('cool') || effect.includes('ice') || effect.includes('aqua') || effect.includes('ocean')) {
      return this.getTempColor().set('#4bb3ff');
    }
    if (effect.includes('storm') || effect.includes('night') || effect.includes('void') || effect.includes('nebula')) {
      return this.getTempColor().set('#6a5bff');
    }
    if (effect.includes('forest') || effect.includes('nature') || effect.includes('lush') || effect.includes('earth')) {
      return this.getTempColor().set('#4caf50');
    }
    return this.baseEmissiveColor;
  }

  private applySegmentMood(progress: number): number {
    if (!this.trackData.segmentDetails.length) {
      this.segmentIntensityBoost = 1;
      this.segmentColorTarget.copy(this.baseEmissiveColor);
      return this.segmentIntensityBoost;
    }
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    let idx = this.segmentProgress.findIndex((marker) => clamped <= marker + 1e-6);
    if (idx === -1) idx = this.segmentProgress.length - 1;
    idx = Math.min(idx, this.trackData.segmentDetails.length - 1);
    this.currentSegmentIndex = idx;
    const detail = this.trackData.segmentDetails[idx];
    const rawIntensity = typeof detail?.intensity === 'number' ? detail!.intensity : 0;
    this.segmentIntensityBoost = 1 + Math.max(0, rawIntensity) / 100;
    const moodColor = this.deriveSegmentColor(detail);
    this.segmentColorTarget.copy(moodColor);
    return this.segmentIntensityBoost;
  }

  public registerFeatureVisual(featureName: string, cfg: Partial<FeatureVisualConfig>) {
    this.particles.registerFeatureVisual(featureName, cfg);
  }

  public update(elapsedTime: number, currentFrame: FrameAnalysis | null, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3, rideProgress: number) {
    try {
      const now = performance.now();
      const nowSeconds = now / 1000;
      const deltaSeconds = this.lastUpdateSeconds === 0 ? 1 / 60 : Math.min(0.25, Math.max(1 / 240, nowSeconds - this.lastUpdateSeconds));
      this.lastUpdateSeconds = nowSeconds;

  const clampedProgress = THREE.MathUtils.clamp(rideProgress ?? 0, 0, 1);
  const rideSpeed = this.updateMotionEffects(deltaSeconds, cameraPosition, lookAtPosition, clampedProgress);
  const baseSegmentBoost = this.applySegmentMood(clampedProgress);
      this.trackMaterial.emissive.lerp(this.segmentColorTarget, 0.05);
      this._colorTmp.copy(this.segmentColorTarget).lerp(this.baseRailColor, 0.4);
      this.trackMaterial.color.lerp(this._colorTmp, 0.05);

      const tintA = this._colorTmp2.copy(this.baseGhostTintA).lerp(this.segmentColorTarget, 0.3);
      const tintB = this._colorTmp3.copy(this.baseGhostTintB).lerp(this.segmentColorTarget, 0.6);
      this.trackTintA.copy(tintA);
      this.trackTintB.copy(tintB);

      const passionBoost = this.atmosphere
        ? this.atmosphere.update({
            deltaSeconds,
            frame: currentFrame,
            audioFeatures: this.audioFeatures,
            segmentColor: this.segmentColorTarget,
            segmentIntensity: baseSegmentBoost,
          })
        : 1;
      this.passionGain = passionBoost;
      this.segmentIntensityBoost = baseSegmentBoost * passionBoost;

      this.frameCount++;

      if (this.firstUpdateTime === 0) {
        this.firstUpdateTime = now;
        this.lastPerformanceCheck = now;
      }

      const WARMUP_PERIOD = 5000;
      if (!this.isWarmedUp && now - this.firstUpdateTime > WARMUP_PERIOD) {
        this.isWarmedUp = true;
        this.lastPerformanceCheck = now;
        this.frameCount = 0;
      }

      if (this.isWarmedUp && now - this.lastPerformanceCheck > PERFORMANCE_CHECK_INTERVAL) {
        const fps = (this.frameCount * 1000) / (now - this.lastPerformanceCheck);
        this.lastPerformanceCheck = now;
        this.frameCount = 0;

        if (fps < TARGET_FPS && this.highQualityMode) {
          if (this.lowQualitySince === null) {
            this.lowQualitySince = now;
            console.log(`[VisualEffects] Low perf detected: ${fps.toFixed(1)} FPS`);
          }
          if (this.lowQualitySince !== null && now - this.lowQualitySince >= LOW_QUALITY_DEBOUNCE_MS) {
            console.log(`[VisualEffects] Performance: ${fps.toFixed(1)} FPS - Switching to low quality mode`);
            this.switchToLowQuality();
            this.lowQualitySince = null;
          }
        } else {
          this.lowQualitySince = null;
        }
      }

      const baseMinGlow = BASS_GLOW_MIN * this.segmentIntensityBoost;
      const baseMaxGlow = BASS_GLOW_MAX * this.segmentIntensityBoost;
      const glowCeiling = BASS_GLOW_MAX * Math.max(1, this.segmentIntensityBoost);
      const fallbackBass = this.audioFeatures.bass || 0;

      if (currentFrame) {
        const bassValue = THREE.MathUtils.clamp(currentFrame.bass, 0, 1);
        this.targetGlowIntensity = THREE.MathUtils.clamp(baseMinGlow + bassValue * (baseMaxGlow - baseMinGlow), BASS_GLOW_MIN, glowCeiling);
      } else {
        this.targetGlowIntensity = THREE.MathUtils.clamp(baseMinGlow + fallbackBass * (baseMaxGlow - baseMinGlow), BASS_GLOW_MIN, glowCeiling);
      }

      const baseForce = currentFrame ? currentFrame.energy * 2.0 + currentFrame.spectralFlux * 1.5 : this.rawAudioForce;
      this.gpuAudioForce = Math.max(0, baseForce) * this.segmentIntensityBoost;

      this.trackMaterial.emissiveIntensity = THREE.MathUtils.lerp(this.trackMaterial.emissiveIntensity, this.targetGlowIntensity, LERP_FACTOR);

      try {
        const lodHint = (this.scene as any).userData?.lodHint as string | undefined;
        this.applyLOD(lodHint === 'low' ? 'low' : 'high');
      } catch (e) {}

      this.trackPulse = Math.max(0, this.trackPulse - deltaSeconds * 1.4);

      this.trackPulse = this.particles.driveReactiveParticles(
        {
          nowSeconds,
          deltaSeconds,
          cameraPosition,
          lookAtPosition,
          audioFeatures: this.audioFeatures,
          segmentIntensityBoost: this.segmentIntensityBoost,
          currentLOD: this.highQualityMode ? 'high' : 'low',
          gpuAudioForce: this.gpuAudioForce,
        },
        this.trackPulse
      );

      try {
        const durationNum = this.trackData && this.trackData.audioFeatures && typeof this.trackData.audioFeatures.duration === 'number' ? secondsToNumber(this.trackData.audioFeatures.duration) : 0;
        const currentAudioTime = durationNum > 0 ? clampedProgress * durationNum : 0;
        this.handleTimelineEvents(currentAudioTime, deltaSeconds, cameraPosition, lookAtPosition);
        this.lastAudioTimeSeconds = currentAudioTime;
      } catch (e) {}

      if (this.trackShaderUniforms) {
        const uniforms = this.trackShaderUniforms;
        this.updateUniformSafe(uniforms.trackTime, elapsedTime, 1e-2);
        this.updateUniformSafe(uniforms.pulseIntensity, this.trackPulse);
        this.updateUniformSafe(uniforms.segmentBoost, this.segmentIntensityBoost, 1e-3);
        this.updateUniformSafe(uniforms.audioFlow, Math.min(1.2, this.gpuAudioForce * 0.25));
        this.updateUniformSafe(uniforms.distortionStrength, Math.min(0.6, 0.2 + this.trackPulse * 0.5 + this.segmentIntensityBoost * 0.1));
        this.updateUniformSafe(uniforms.bassIntensity, this.audioFeatures.bass || 0);
        this.updateUniformSafe(uniforms.trebleIntensity, this.audioFeatures.treble || 0);
        this.updateUniformSafe(uniforms.rideSpeed, rideSpeed, 1e-3);
        this.updateUniformSafe(uniforms.motionBlur, Math.min(1.0, rideSpeed * 0.12), 1e-3);
      }

      if (this.ghostRibbonMaterial) {
        const uniforms = this.ghostRibbonMaterial.uniforms;
        this.updateUniformSafe(uniforms.time, elapsedTime, 1e-2);
        this.updateUniformSafe(uniforms.audioPulse, Math.min(1.8, this.trackPulse * 1.1 + this.gpuAudioForce * 0.1));
        this.updateColorUniformSafe(uniforms.colorInner, this.trackTintA);
        this.updateColorUniformSafe(uniforms.colorOuter, this.trackTintB);
      }

      this.particles.reclaimExpired(nowSeconds);

      if (this.particles.isGPUEnabled()) {
        this.updateGPU(deltaSeconds);
      }

      try {
        const glow = this.camera.getObjectByName('audioGlow') as THREE.PointLight | undefined;
        if (glow) {
          const bass = this.audioFeatures.bass || 0;
          const targetIntensity = 0.12 + this.gpuAudioForce * 1.6 + bass * 1.5 * this.segmentIntensityBoost;
          if (Math.abs(glow.intensity - targetIntensity) > 1e-3) {
            glow.intensity = THREE.MathUtils.lerp(glow.intensity || 0, Math.max(0, targetIntensity), 0.08);
          }
          glow.color.lerp(this.segmentColorTarget, 0.06);
        }
      } catch (e) {}

  this.particles.updatePointsMaterial(this.audioFeatures, this.segmentIntensityBoost, this.segmentColorTarget, this.baseRailColor);
    } finally {
      this.releaseTempVectors();
    }
  }

  public setAudioForce(value: number) {
    const clamped = Math.max(0, value);
    this.rawAudioForce = clamped;
    this.gpuAudioForce = clamped * this.segmentIntensityBoost;
  }

  public setCurlParams({ curlStrength, noiseScale, noiseSpeed }: { curlStrength?: number; noiseScale?: number; noiseSpeed?: number; }) {
    if (typeof curlStrength === 'number') this.curlStrength = curlStrength;
    if (typeof noiseScale === 'number') this.noiseScale = noiseScale;
    if (typeof noiseSpeed === 'number') this.noiseSpeed = noiseSpeed;
  }

  public applyShaderUniform(name: string, value: any) {
    if (name === 'curlStrength') {
      this.curlStrength = value;
    } else if (name === 'noiseScale') {
      this.noiseScale = value;
    } else if (name === 'noiseSpeed') {
      this.noiseSpeed = value;
    }
    this.particles.applyShaderUniform(name, value);
  }

  public setShaderUniformsFromManifest(manifest: Record<string, any>) {
    if (!manifest || typeof manifest !== 'object') return;
    for (const [name, entry] of Object.entries(manifest)) {
      if (!entry) continue;
      const value = (entry as any).value ?? (entry as any).defaultValue;
      if (value !== undefined) {
        this.applyShaderUniform(name, value);
      }
    }
  }

  private applyLOD(mode: 'low' | 'high') {
    if ((mode === 'low' && this.highQualityMode) || (mode === 'high' && !this.highQualityMode)) {
      if (mode === 'low') {
        this.switchToLowQuality();
      } else {
        this.switchToHighQuality();
      }
    }
  }

  public spawnParticles(count: number, origin: THREE.Vector3, feature?: string) {
    this.particles.spawnParticles(count, {
      origin,
      feature,
      audioFeatures: this.audioFeatures,
      segmentIntensityBoost: this.segmentIntensityBoost,
      nowSeconds: performance.now() / 1000,
    });
  }

  public spawnFeatureBurst(featureName: string, intensity: number, origin: THREE.Vector3) {
    this.particles.spawnFeatureBurst(featureName, intensity, origin, this.audioFeatures, this.segmentIntensityBoost, performance.now() / 1000);
  }

  private handleTimelineEvents(currentAudioTime: number, deltaSeconds: number, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3) {
    if (!this.timelineEvents || !this.timelineEvents.length) return;
    const now = currentAudioTime;
    this._forward.subVectors(lookAtPosition, cameraPosition);
    if (this._forward.lengthSq() < 1e-6) return;
    this._forward.normalize();
    this._right.copy(this._forward).cross(VisualEffects.UP_VECTOR);
    if (this._right.lengthSq() < 1e-6) this._right.set(1, 0, 0);
    else this._right.normalize();
    this._up.copy(this._right).cross(this._forward);
    if (this._up.lengthSq() < 1e-6) this._up.set(0, 1, 0);
    else this._up.normalize();
    for (let i = 0; i < this.timelineEvents.length; i++) {
      const ev = this.timelineEvents[i];
      if (!ev || typeof ev.timestamp !== 'number') continue;
      const triggeredUntil = this.timelineTriggeredUntil.get(i) || 0;
      if (now <= triggeredUntil) continue;
      const lookahead = Math.max(0.05, deltaSeconds * 1.5);
      if (now + lookahead >= ev.timestamp) {
        const intensity = Math.max(0, Math.min(1, (ev.intensity ?? 0.6) * (this.segmentIntensityBoost || 1)));
        try {
          const spawnPos = this.getTempVector3().copy(cameraPosition).addScaledVector(this._forward, 8).addScaledVector(this._up, 1.5);
          this.spawnEvent(ev, intensity, spawnPos);
        } catch (e) {}
        const duration = ev.duration ? (typeof ev.duration === 'number' ? ev.duration : Number(ev.duration)) : 2.0;
        this.timelineTriggeredUntil.set(i, ev.timestamp + duration + 0.5);
      }
    }
  }

  private spawnEvent(ev: TimelineEvent, intensity: number, origin: THREE.Vector3) {
    const t = ev.type;
    const inten = Math.max(0.02, Math.min(1, intensity));
    switch (t) {
      case 'fireworks': {
        const bursts = 3 + Math.round(inten * 5);
        for (let i = 0; i < bursts; i++) {
          const jitter = this.getTempVector3().set((Math.random() - 0.5) * 6, 6 + Math.random() * 6, (Math.random() - 0.5) * 6);
          const pos = this.getTempVector3().copy(origin).add(jitter);
          this.spawnFeatureBurst('sparkle', inten * (0.8 + Math.random() * 0.6), pos);
        }
        try {
          const flash = new THREE.PointLight(this.segmentColorTarget.clone(), 0.0, 40, 2);
          flash.position.copy(origin).add(this.getTempVector3().set(0, 6, 0));
          this.scene.add(flash);
          const start = performance.now() / 1000;
          const fade = () => {
            const now = performance.now() / 1000;
            const dt = now - start;
            flash.intensity = Math.max(0, 6.0 * inten * (1.0 - dt / 0.6));
            if (flash.intensity <= 0.01) {
              try { this.scene.remove(flash); } catch (e) {}
            } else {
              requestAnimationFrame(fade);
            }
          };
          requestAnimationFrame(fade);
        } catch (e) {}
        break;
      }
      case 'fog': {
        try {
          if (this.scene.fog instanceof THREE.FogExp2) {
            const base = this.scene.fog.density || 0.001;
            const target = base + 0.0025 * (0.5 + inten);
            const start = performance.now() / 1000;
            const dur = Math.max(3.0, (ev.duration as number) || 6.0);
            const anim = () => {
              const now = performance.now() / 1000;
              const tNorm = Math.min(1, (now - start) / 0.6);
              this.scene.fog.density = THREE.MathUtils.lerp(base, target, tNorm);
              if (now - start < dur) {
                requestAnimationFrame(anim);
              } else {
                const fadeStart = performance.now() / 1000;
                const fade = () => {
                  const then = performance.now() / 1000;
                  const ft = Math.min(1, (then - fadeStart) / 2.0);
                  this.scene.fog.density = THREE.MathUtils.lerp(target, base, ft);
                  if (ft < 1) requestAnimationFrame(fade);
                };
                requestAnimationFrame(fade);
              }
            };
            requestAnimationFrame(anim);
          }
        } catch (e) {}
        for (let i = 0; i < Math.max(2, Math.round(4 * inten)); i++) {
          const p = this.getTempVector3().copy(origin).add(this.getTempVector3().set((Math.random() - 0.5) * 6, (Math.random() - 0.2) * 2, (Math.random() - 0.5) * 6));
          this.spawnFeatureBurst('sparkle', 0.25 + Math.random() * 0.4, p);
        }
        break;
      }
      case 'starshow': {
        const total = 30 + Math.round(inten * 80);
        for (let i = 0; i < total; i++) {
          const p = this.getTempVector3().copy(origin).add(this.getTempVector3().set((Math.random() - 0.5) * 40, 8 + Math.random() * 20, (Math.random() - 0.5) * 40));
          this.spawnFeatureBurst('sparkle', 0.25 + Math.random() * inten * 0.6, p);
        }
        break;
      }
      case 'lightBurst': {
        try {
          const glow = this.scene.getObjectByName('audioGlow') as THREE.PointLight | undefined;
          if (glow) {
            glow.intensity = Math.max(glow.intensity || 0, 2.0 * inten + (this.gpuAudioForce || 0));
          }
        } catch (e) {}
        break;
      }
      case 'sparkRing': {
        const ringCount = 10 + Math.round(inten * 30);
        for (let r = 0; r < ringCount; r++) {
          const ang = (r / ringCount) * Math.PI * 2;
          const off = this.getTempVector3().set(Math.cos(ang) * (3 + Math.random() * 2), -1 + Math.random() * 3, Math.sin(ang) * (3 + Math.random() * 2));
          this.spawnFeatureBurst('sparkle', 0.5 * inten, this.getTempVector3().copy(origin).add(off));
        }
        break;
      }
      case 'confetti': {
        const confettiCount = 30 + Math.round(inten * 60);
        for (let k = 0; k < confettiCount; k++) {
          const p = this.getTempVector3().copy(origin).add(this.getTempVector3().set((Math.random() - 0.5) * 6, Math.random() * 6, (Math.random() - 0.5) * 6));
          this.spawnParticles(2, p, 'sparkle');
        }
        break;
      }
      default: {
        this.spawnFeatureBurst('sparkle', inten, origin);
      }
    }
  }

  private createGhostRibbonMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        audioPulse: { value: 0 },
        colorInner: { value: this.trackTintA },
        colorOuter: { value: this.trackTintB },
      },
      vertexShader: `varying float vPath;
varying float vRadial;
uniform float time;
uniform float audioPulse;
void main() {
  vPath = clamp(uv.y, 0.0, 1.0);
  vRadial = uv.x;
  float shimmer = sin(vPath * 20.0 + time * 2.4) * 0.35;
  float lift = 0.6 + audioPulse * 1.2 + shimmer;
  vec3 displaced = position + normal * lift;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}`,
      fragmentShader: `varying float vPath;
varying float vRadial;
uniform vec3 colorInner;
uniform vec3 colorOuter;
uniform float audioPulse;
void main() {
  float fade = smoothstep(0.0, 1.0, vPath);
  vec3 tint = mix(colorInner, colorOuter, fade);
  float radial = 1.0 - abs(vRadial * 2.0 - 1.0);
  float softness = pow(radial, 1.6);
  float alpha = clamp((0.35 + audioPulse * 0.65) * softness, 0.0, 1.0);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(tint, alpha);
}`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }

  private rebuildGhostRibbon(curve: THREE.CatmullRomCurve3, segments: number) {
    if (!this.ghostRibbonMaterial) return;
    const tubularSegments = Math.max(6, Math.floor(segments));
    const newGeom = new THREE.TubeGeometry(curve, tubularSegments, GHOST_RIBBON_RADIUS, 6, false);

    if (!this.ghostRibbonMesh) {
      const geometry = geometryPool.acquire();
      geometry.copy(newGeom);
      this.ghostRibbonMesh = new THREE.Mesh(geometry, this.ghostRibbonMaterial);
      this.ghostRibbonMesh.frustumCulled = true;
      this.ghostRibbonMesh.renderOrder = 9;
      this.scene.add(this.ghostRibbonMesh);
    } else {
      const old = this.ghostRibbonMesh.geometry as THREE.BufferGeometry;
      geometryPool.release(old);
      const geometry = geometryPool.acquire();
      geometry.copy(newGeom);
      this.ghostRibbonMesh.geometry = geometry;
    }
    newGeom.dispose();
  }

  private switchToLowQuality() {
    if (!this.highQualityMode) return;
    this.highQualityMode = false;
    this.particles.setQualityProfile('low');
    this.particles.registerFeatureVisual('speed', {
      size: 1.0,
      lifetime: 1.2,
      sensitivity: 0.7,
    });
    
    const oldGeometry = this.trackMesh.geometry as THREE.BufferGeometry;
    geometryPool.release(oldGeometry);

    const curve = new THREE.CatmullRomCurve3(this.trackPathPoints.map((p) => p.clone()));
    const newGeom = new THREE.TubeGeometry(curve, this.trackPathPoints.length * LOW_QUALITY_SEGMENTS, TRACK_RADIUS, 6, false);
    const geometry = geometryPool.acquire();
    geometry.copy(newGeom);
    newGeom.dispose();
    
    (geometry as any).boundsTree = new MeshBVH(geometry);
    this.trackMesh.geometry = geometry;
    this.rebuildGhostRibbon(curve, this.trackPathPoints.length * LOW_QUALITY_SEGMENTS);
    this.createSpeedStreakSystem();
  }

  public switchToHighQuality() {
    if (this.highQualityMode) return;
    this.highQualityMode = true;
    this.particles.setQualityProfile('high');
    this.particles.registerFeatureVisual('speed', {
      size: 1.4,
      lifetime: 1.8,
      sensitivity: 0.8,
    });

    const oldGeometry = this.trackMesh.geometry as THREE.BufferGeometry;
    geometryPool.release(oldGeometry);

    const curve = new THREE.CatmullRomCurve3(this.trackPathPoints.map((p) => p.clone()));
    const newGeom = new THREE.TubeGeometry(curve, this.trackPathPoints.length * HIGH_QUALITY_SEGMENTS, TRACK_RADIUS, 8, false);
    const geometry = geometryPool.acquire();
    geometry.copy(newGeom);
    newGeom.dispose();

    (geometry as any).boundsTree = new MeshBVH(geometry);
    this.trackMesh.geometry = geometry;
    this.rebuildGhostRibbon(curve, this.trackPathPoints.length * HIGH_QUALITY_SEGMENTS);
    this.createSpeedStreakSystem();
  }

  public dispose() {
    if (this.trackMesh) {
      this.scene.remove(this.trackMesh);
      geometryPool.release(this.trackMesh.geometry as THREE.BufferGeometry);
    }
    if (this.trackMaterial) {
      try { this.trackMaterial.dispose(); } catch (e) {}
    }

    if (this.ghostRibbonMesh) {
      try {
        this.scene.remove(this.ghostRibbonMesh);
        this.ghostRibbonMesh.geometry.dispose();
      } catch (e) {}
      this.ghostRibbonMesh = null;
    }
    if (this.ghostRibbonMaterial) {
      try { this.ghostRibbonMaterial.dispose(); } catch (e) {}
      this.ghostRibbonMaterial = null;
    }

    this.teardownSpeedStreakSystem();

    if (this.tunnelRushMesh) {
      try {
        this.camera.remove(this.tunnelRushMesh);
        this.tunnelRushMesh.geometry.dispose();
      } catch (e) {}
      this.tunnelRushMesh = null;
    }
    if (this.tunnelRushMaterial) {
      try { this.tunnelRushMaterial.dispose(); } catch (e) {}
      this.tunnelRushMaterial = null;
    }

    this.particles.dispose();

    const audioGlow = this.camera.getObjectByName('audioGlow');
    if (audioGlow) {
      try {
        const parent = audioGlow.parent;
        if (parent) {
          parent.remove(audioGlow);
        }
      } catch(e) {}
    }
  }
}