import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { TrackData, FrameAnalysis, SegmentDetail, TimelineEvent, secondsToNumber, SynestheticBlueprintLayer } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';
import { ParticleSystem, FeatureVisualConfig, GPUUpdateParams, ParticleQualityLevel } from './visual-effects/ParticleSystem';
import { Vector3Pool } from './utils/Vector3Pool';
import { AtmosphereController } from './environment/AtmosphereController';

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
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec2 vUv;
uniform float trackTime;
uniform float pulseIntensity;
uniform float segmentBoost;
uniform float audioFlow;
uniform vec3 ghostTintA;
uniform vec3 ghostTintB;
`
        )
        .replace(
          'vec3 totalEmissiveRadiance = emissive;',
          `float pathV = clamp(vUv.y, 0.0, 1.0);
float loopWave = sin(pathV * 24.0 - trackTime * 5.5);
float traveler = smoothstep(0.05, 0.95, fract(pathV - trackTime * 0.35));
float spirit = pulseIntensity + audioFlow * 0.35 + segmentBoost * 0.2;
vec3 dreamTint = mix(ghostTintA, ghostTintB, pathV) * (0.35 + 0.25 * traveler + 0.2 * max(loopWave, 0.0));
vec3 totalEmissiveRadiance = emissive + dreamTint * spirit;`
        );
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec2 vUv;
uniform float trackTime;
uniform float distortionStrength;
uniform float bassIntensity;
uniform float trebleIntensity;
`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
vUv = uv;
float vPath = clamp(uv.y, 0.0, 1.0);
transformed += normal * bassIntensity * 1.5;
float trebleWarp = sin(vPath * 60.0 - trackTime * 4.0) * trebleIntensity * 0.4;
transformed += normal * trebleWarp;
float ribbon = sin(vPath * 18.0 + trackTime * 2.0);
transformed += normal * distortionStrength * (0.2 + 0.3 * ribbon);
`
        );
      this.trackShaderUniforms = shader.uniforms as Record<string, THREE.IUniform>;
    };

    const segments = this.highQualityMode ? this.trackData.path.length * HIGH_QUALITY_SEGMENTS : this.trackData.path.length * LOW_QUALITY_SEGMENTS;
  const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
  this.pathCurve = curve;
    const geometry = new THREE.TubeGeometry(curve, segments, TRACK_RADIUS, 8, false);

    // Generate the BVH for the track geometry to accelerate raycasting
    (geometry as any).boundsTree = new MeshBVH(geometry);

    this.trackMesh = new THREE.Mesh(geometry, this.trackMaterial);
    this.trackMesh.frustumCulled = true;
    this.scene.add(this.trackMesh);

    this.ghostRibbonMaterial = this.createGhostRibbonMaterial();
    this.rebuildGhostRibbon(curve, segments);

    this.particles = new ParticleSystem(this.scene);
    const initialProfile: ParticleQualityLevel = this.highQualityMode ? 'high' : 'medium';
    this.particles.setQualityProfile(initialProfile);
    this.particles.setConsciousnessSettings(this.synesthetic?.particles ?? null);
    this.seedAmbientParticles();
  this.seedAmbientParticles();

    try {
      const listenerRig = new THREE.Object3D();
      this.camera.add(listenerRig);
      const audioGlow = new THREE.PointLight(this.baseEmissiveColor.clone(), 0.0, 48, 2);
      audioGlow.name = 'audioGlow';
      listenerRig.add(audioGlow);
    } catch (e) {}
  }

  private seedAmbientParticles(): void {
    if (!this.pathCurve) return;
    const sampleCount = Math.min(48, Math.max(18, Math.floor(this.trackData.path.length / 4)));
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
    const newGeometry = new THREE.TubeGeometry(curve, tubularSegments, GHOST_RIBBON_RADIUS, 6, false);
    if (!this.ghostRibbonMesh) {
      this.ghostRibbonMesh = new THREE.Mesh(newGeometry, this.ghostRibbonMaterial);
      this.ghostRibbonMesh.frustumCulled = true;
      this.ghostRibbonMesh.renderOrder = 9;
      this.scene.add(this.ghostRibbonMesh);
    } else {
      const old = this.ghostRibbonMesh.geometry;
      this.ghostRibbonMesh.geometry = newGeometry;
      old.dispose();
    }
  }

  private switchToLowQuality() {
    if (!this.highQualityMode) return;
  this.highQualityMode = false;
  this.particles.setQualityProfile('low');
    
    const oldGeometry = this.trackMesh.geometry;
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const newGeometry = new THREE.TubeGeometry(
      curve, 
      this.trackData.path.length * LOW_QUALITY_SEGMENTS,
      TRACK_RADIUS,
      6,
      false
    );
    
    (newGeometry as any).boundsTree = new MeshBVH(newGeometry);
    this.trackMesh.geometry = newGeometry;
    oldGeometry.dispose();
    this.rebuildGhostRibbon(curve, this.trackData.path.length * LOW_QUALITY_SEGMENTS);
  }

  public switchToHighQuality() {
    if (this.highQualityMode) return;
  this.highQualityMode = true;
  this.particles.setQualityProfile('high');

    const oldGeometry = this.trackMesh.geometry;
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const newGeometry = new THREE.TubeGeometry(
      curve,
      this.trackData.path.length * HIGH_QUALITY_SEGMENTS,
      TRACK_RADIUS,
      8,
      false
    );

    (newGeometry as any).boundsTree = new MeshBVH(newGeometry);
    this.trackMesh.geometry = newGeometry;
    oldGeometry.dispose();
    this.rebuildGhostRibbon(curve, this.trackData.path.length * HIGH_QUALITY_SEGMENTS);
  }

  public dispose() {
    if (this.trackMesh) {
      this.scene.remove(this.trackMesh);
      try { this.trackMesh.geometry.dispose(); } catch (e) {}
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