import * as THREE from 'three';
import { RIDE_CONFIG } from 'shared/constants';
import { SynestheticParticleConsciousness } from 'shared/types';
import { getCachedShader, getCachedLygiaResolver } from '../preloader';

export interface FeatureVisualConfig {
  color: [number, number, number];
  sensitivity: number;
  size: number;
  lifetime: number;
  behavior: 'burst' | 'trail' | 'flow';
}

export interface DriveReactiveParticlesParams {
  nowSeconds: number;
  deltaSeconds: number;
  cameraPosition: THREE.Vector3;
  lookAtPosition: THREE.Vector3;
  audioFeatures: Record<string, number>;
  segmentIntensityBoost: number;
  currentLOD: 'low' | 'high';
  gpuAudioForce: number;
}

export interface SpawnContext {
  origin: THREE.Vector3;
  feature?: string;
  intensity?: number;
  audioFeatures: Record<string, number>;
  segmentIntensityBoost: number;
  nowSeconds: number;
}

export interface GPUUpdateParams {
  audioFeatures: Record<string, number>;
  segmentIntensityBoost: number;
  gpuAudioForce: number;
  curlStrength: number;
  noiseScale: number;
  noiseSpeed: number;
}

export type ParticleQualityLevel = 'low' | 'medium' | 'high';

interface QualityProfile {
  particleBudget: number;
  spawnBatch: number;
  gpuUpdateInterval: number;
}

interface ConsciousParticle {
  id: number;
  featureKey: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  resonance: number;
  createdAt: number;
  lifespan: number;
}

const QUALITY_PROFILES: Record<ParticleQualityLevel, QualityProfile> = {
  low: {
    particleBudget: Math.floor(RIDE_CONFIG.PARTICLE_COUNT * 0.45),
    spawnBatch: Math.max(20, Math.floor(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * 0.55)),
    gpuUpdateInterval: 1 / 35,
  },
  medium: {
    particleBudget: Math.floor(RIDE_CONFIG.PARTICLE_COUNT * 0.7),
    spawnBatch: Math.max(40, Math.floor(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * 0.8)),
    gpuUpdateInterval: 1 / 50,
  },
  high: {
    particleBudget: RIDE_CONFIG.PARTICLE_COUNT,
    spawnBatch: RIDE_CONFIG.PARTICLE_SPAWN_COUNT,
    gpuUpdateInterval: 0,
  },
};

export class ParticleSystem {
  private readonly _dummy = new THREE.Object3D();
  private readonly _tempColor = new THREE.Color();
  private particleSystem: THREE.Points | null = null;
  private particleInstancedMesh: THREE.InstancedMesh | null = null;
  private particleCursor = 0;
  private instanceFreeStack: number[] = [];
  private instanceStartTimes: Float32Array | null = null;
  private instanceLifetimes: Float32Array | null = null;
  private featureVisuals: Map<string, FeatureVisualConfig>;
  private featureCooldowns: Record<string, number> = {};
  private ambientAccumulator = 0;
  private readonly spawnOrigin = new THREE.Vector3();
  private readonly spawnForward = new THREE.Vector3();
  private readonly spawnRight = new THREE.Vector3();
  private readonly spawnUp = new THREE.Vector3();
  private readonly worldUp = new THREE.Vector3(0, 1, 0);
  private readonly spawnWork = new THREE.Vector3();
  public readonly texSize: number;
  private synestheticSettings: SynestheticParticleConsciousness | null = null;
  private consciousParticles: ConsciousParticle[] = [];
  private consciousIdCounter = 0;
  private synapticGeometry: THREE.BufferGeometry | null = null;
  private synapticMaterial: THREE.LineBasicMaterial | null = null;
  private synapticLines: THREE.LineSegments | null = null;
  private readonly maxSynapticLinks = 128;
  private readonly synapticColorA = new THREE.Color('#7adfff');
  private readonly synapticColorB = new THREE.Color('#ff9efc');
  private readonly synapticTemp = new THREE.Vector3();
  private synestheticUniforms: { neuralGain: number; resonanceFloor: number; persistence: number } = {
    neuralGain: 0.65,
    resonanceFloor: 0.35,
    persistence: 0.6,
  };
  private consciousnessIntensity = 0.9;

  private gpuEnabled: boolean = false;
  private gpuRenderer: THREE.WebGLRenderer | null = null;
  private gpuPosRTA: THREE.WebGLRenderTarget | null = null;
  private gpuPosRTB: THREE.WebGLRenderTarget | null = null;
  private gpuVelRTA: THREE.WebGLRenderTarget | null = null;
  private gpuVelRTB: THREE.WebGLRenderTarget | null = null;
  private gpuQuadScene: THREE.Scene | null = null;
  private gpuQuadCamera: THREE.OrthographicCamera | null = null;
  private gpuVelMaterial: THREE.ShaderMaterial | null = null;
  private gpuPosMaterial: THREE.ShaderMaterial | null = null;
  private gpuVelQuad: THREE.Mesh | null = null;
  private gpuPosQuad: THREE.Mesh | null = null;
  private gpuSwap = false;
  private rendererInfo: { ok: boolean; renderer: string; vendor: string } | null = null;
  private qualityLevel: ParticleQualityLevel = 'high';
  private particleBudget: number = QUALITY_PROFILES.high.particleBudget;
  private spawnBatchSize: number = QUALITY_PROFILES.high.spawnBatch;
  private gpuUpdateInterval: number = QUALITY_PROFILES.high.gpuUpdateInterval;
  private gpuUpdateAccumulator = 0;
  private readonly pendingUniforms = new Map<string, unknown>();

  constructor(private readonly scene: THREE.Scene) {
    this.texSize = Math.ceil(Math.sqrt(RIDE_CONFIG.PARTICLE_COUNT));
    this.featureVisuals = new Map([
      ['subBass', { color: [1.0, 0.2, 0.1], sensitivity: 1.2, size: 2.5, lifetime: 3.5, behavior: 'flow' }],
      ['bass', { color: [1.0, 0.4, 0.2], sensitivity: 1.0, size: 2.0, lifetime: 3.0, behavior: 'flow' }],
      ['lowMid', { color: [0.2, 0.8, 1.0], sensitivity: 0.9, size: 1.2, lifetime: 2.5, behavior: 'burst' }],
      ['mid', { color: [0.5, 1.0, 0.8], sensitivity: 0.8, size: 1.0, lifetime: 2.0, behavior: 'burst' }],
      ['highMid', { color: [0.8, 1.0, 0.6], sensitivity: 0.7, size: 0.8, lifetime: 1.8, behavior: 'trail' }],
      ['treble', { color: [1.0, 0.8, 0.8], sensitivity: 0.6, size: 0.6, lifetime: 1.5, behavior: 'trail' }],
      ['sparkle', { color: [1.0, 1.0, 1.0], sensitivity: 0.65, size: 0.7, lifetime: 1.2, behavior: 'trail' }],
    ]);

    this.buildParticleMeshes();
    this.setQualityProfile(this.qualityLevel);
    this.applyConsciousUniforms();
    this.setConsciousnessIntensity(this.consciousnessIntensity);
  }

  public get instancedMesh(): THREE.InstancedMesh | null {
    return this.particleInstancedMesh;
  }

  public get points(): THREE.Points | null {
    return this.particleSystem;
  }

  public registerFeatureVisual(featureName: string, cfg: Partial<FeatureVisualConfig>) {
    const existing = this.featureVisuals.get(featureName);
    if (existing) {
      this.featureVisuals.set(featureName, { ...existing, ...cfg });
      return;
    }
    const defaultConfig: FeatureVisualConfig = {
      color: [1, 1, 1],
      sensitivity: 1,
      size: 1,
      lifetime: 2,
      behavior: 'burst',
      ...cfg,
    };
    this.featureVisuals.set(featureName, defaultConfig);
  }

  private applyConsciousUniforms(): void {
    this.applyShaderUniform('neuralGain', this.synestheticUniforms.neuralGain);
    this.applyShaderUniform('resonanceFloor', this.synestheticUniforms.resonanceFloor);
    this.applyShaderUniform('consciousnessPersistence', this.synestheticUniforms.persistence);
  }

  private syncInstancedConsciousUniform(overrideValue?: number): void {
    if (!this.particleInstancedMesh) return;
    const mat = this.particleInstancedMesh.material as THREE.ShaderMaterial | undefined;
    if (!mat || !mat.uniforms) return;
    const value = overrideValue ?? this.consciousnessIntensity;
    this.updateScalarUniform(mat.uniforms.consciousnessIntensity, value, 1e-3);
  }

  private setConsciousnessIntensity(next: number): void {
    const clamped = THREE.MathUtils.clamp(next, 0.2, 3.0);
    if (Math.abs(clamped - this.consciousnessIntensity) > 1e-3) {
      this.consciousnessIntensity = clamped;
    } else {
      this.consciousnessIntensity = clamped;
    }
    this.applyShaderUniform('consciousnessDrive', this.consciousnessIntensity);
    this.syncInstancedConsciousUniform();
  }

  private updateScalarUniform(uniform: { value: unknown } | undefined, next: number, epsilon = 1e-3): void {
    if (!uniform) return;
    const current = typeof uniform.value === 'number' ? uniform.value : Number(uniform.value);
    if (!Number.isFinite(current) || Math.abs((current as number) - next) > epsilon) {
      (uniform as THREE.IUniform).value = next;
    }
  }

  public setQualityProfile(level: ParticleQualityLevel): void {
    const profile = QUALITY_PROFILES[level];
    if (!profile) return;

    const nextBudget = Math.max(1, Math.min(profile.particleBudget, RIDE_CONFIG.PARTICLE_COUNT));
    const nextSpawnBatch = Math.max(1, Math.min(profile.spawnBatch, nextBudget));
    const nextUpdateInterval = Math.max(0, profile.gpuUpdateInterval);

    const unchanged =
      this.qualityLevel === level &&
      this.particleBudget === nextBudget &&
      this.spawnBatchSize === nextSpawnBatch &&
      Math.abs(this.gpuUpdateInterval - nextUpdateInterval) < 1e-6;
    if (unchanged) return;

    this.qualityLevel = level;
    this.particleBudget = nextBudget;
    this.spawnBatchSize = nextSpawnBatch;
    this.gpuUpdateInterval = nextUpdateInterval;
    this.gpuUpdateAccumulator = 0;

    if (this.particleCursor >= this.particleBudget) {
      this.particleCursor = this.particleBudget > 0 ? this.particleCursor % this.particleBudget : 0;
    }

    if (this.particleInstancedMesh) {
      this.particleInstancedMesh.count = this.particleBudget;
      this.particleInstancedMesh.instanceMatrix.needsUpdate = true;
      this.hideInstancesBeyondBudget();
    }

    this.rebuildFreeStackForBudget();
    this.enforceBudgetOnPointsGeometry();
  }

  public setConsciousnessSettings(settings: SynestheticParticleConsciousness | null | undefined): void {
    if (!settings) {
      this.synestheticSettings = null;
      this.consciousParticles = [];
      this.fadeSynapticNetwork(true);
      this.synestheticUniforms = {
        neuralGain: 0.6,
        resonanceFloor: 0.3,
        persistence: 0.55,
      };
      this.applyConsciousUniforms();
      this.setConsciousnessIntensity(0.8);
      return;
    }

    const clamp = (value: number | undefined, fallback: number, min = 0, max = 1) => {
      if (!Number.isFinite(value as number)) return THREE.MathUtils.clamp(fallback, min, max);
      return THREE.MathUtils.clamp(value as number, min, max);
    };

    const connectionDensity = clamp(settings.connectionDensity ?? 0.45, 0.45);
    const resonanceThreshold = clamp(settings.resonanceThreshold ?? 0.4, 0.2);
    const persistence = clamp(settings.persistence ?? 0.55, 0, 1);

    this.synestheticSettings = {
      connectionDensity,
      resonanceThreshold,
      lifespanSeconds: Math.max(0.5, settings.lifespanSeconds ?? 4.0),
      persistence,
    };

    this.synestheticUniforms = {
      neuralGain: THREE.MathUtils.clamp(0.55 + connectionDensity * 0.85, 0.4, 1.6),
      resonanceFloor: THREE.MathUtils.clamp(resonanceThreshold, 0.05, 0.95),
      persistence,
    };

    this.applyConsciousUniforms();
    this.setConsciousnessIntensity(0.95 + connectionDensity * 0.4);
  }

  public applyShaderUniform(name: string, value: unknown) {
    this.pendingUniforms.set(name, value);
    if (!this.gpuEnabled) return;

    const materials = [this.gpuVelMaterial, this.gpuPosMaterial];
    for (const material of materials) {
      const uniform = material?.uniforms?.[name];
      if (!uniform) continue;
      if (typeof value === 'number') {
        this.updateScalarUniform(uniform, value);
      } else {
        (uniform as THREE.IUniform).value = value as never;
      }
    }
  }

  private rebuildFreeStackForBudget(): void {
    if (!this.instanceLifetimes || !this.instanceStartTimes) {
      this.instanceFreeStack = [];
      return;
    }

    const total = this.instanceLifetimes.length;
    for (let i = this.particleBudget; i < total; i++) {
      this.instanceLifetimes[i] = 0;
      this.instanceStartTimes[i] = 0;
    }

    const newStack: number[] = [];
    const cap = Math.min(this.particleBudget, total);
    for (let i = cap - 1; i >= 0; i--) {
      if (this.instanceLifetimes[i] <= 0) {
        newStack.push(i);
      }
    }
    this.instanceFreeStack = newStack;
  }

  private hideInstancesBeyondBudget(): void {
    if (!this.particleInstancedMesh) return;
    if (this.particleBudget >= RIDE_CONFIG.PARTICLE_COUNT) return;

    const dummy = this._dummy;
    for (let i = this.particleBudget; i < RIDE_CONFIG.PARTICLE_COUNT; i++) {
      dummy.position.set(0, -9999, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      this.particleInstancedMesh.setMatrixAt(i, dummy.matrix);
    }
    this.particleInstancedMesh.instanceMatrix.needsUpdate = true;
  }

  private enforceBudgetOnPointsGeometry(): void {
    if (!this.particleSystem) return;
    const geom = this.particleSystem.geometry as THREE.BufferGeometry;
    const positions = geom.getAttribute('position') as THREE.BufferAttribute | undefined;
    const velocities = geom.getAttribute('velocity') as THREE.BufferAttribute | undefined;
    const startTimes = geom.getAttribute('startTime') as THREE.BufferAttribute | undefined;
    if (!positions) return;

    const limit = Math.min(this.particleBudget, positions.count);
    if (limit < positions.count) {
      for (let i = limit; i < positions.count; i++) {
        const base = i * 3;
        positions.array[base + 0] = 0;
        positions.array[base + 1] = -9999;
        positions.array[base + 2] = 0;
        if (velocities) {
          velocities.array[base + 0] = 0;
          velocities.array[base + 1] = 0;
          velocities.array[base + 2] = 0;
        }
        if (startTimes) {
          startTimes.array[i] = 0;
        }
      }
      (positions as any).updateRange = { offset: limit * 3, count: (positions.count - limit) * 3 };
      positions.needsUpdate = true;
      if (velocities) {
        (velocities as any).updateRange = { offset: limit * 3, count: (velocities.count - limit) * 3 };
        velocities.needsUpdate = true;
      }
      if (startTimes) {
        (startTimes as any).updateRange = { offset: limit, count: startTimes.count - limit };
        startTimes.needsUpdate = true;
      }
    }
  }

  private applyPendingUniforms(): void {
    if (!this.gpuEnabled) return;
    if (!this.pendingUniforms.size) return;

    const materials = [this.gpuVelMaterial, this.gpuPosMaterial];
    for (const [name, value] of this.pendingUniforms.entries()) {
      for (const material of materials) {
        const uniform = material?.uniforms?.[name];
        if (!uniform) continue;
        if (typeof value === 'number') {
          this.updateScalarUniform(uniform, value);
        } else {
          (uniform as THREE.IUniform).value = value as never;
        }
      }
    }
  }

  public updateConsciousness(params: { nowSeconds: number; audioFeatures: Record<string, number>; segmentIntensityBoost: number }): void {
    if (!this.synestheticSettings) {
      this.fadeSynapticNetwork(false);
      this.setConsciousnessIntensity(THREE.MathUtils.lerp(this.consciousnessIntensity, 0.75, 0.12));
      return;
    }

    this.ensureSynapticNetwork();
    if (!this.synapticGeometry || !this.synapticMaterial) return;

    const settings = this.synestheticSettings;
    const maxLifetime = Math.max(0.5, settings.lifespanSeconds ?? 4.0);
    const persistence = THREE.MathUtils.clamp(settings.persistence ?? 0.55, 0, 1);

    // Remove expired particles while updating resonance and gentle drift.
    const surviving: ConsciousParticle[] = [];
    let resonanceSum = 0;
    for (const particle of this.consciousParticles) {
      const age = params.nowSeconds - particle.createdAt;
      if (age > particle.lifespan || age > maxLifetime) {
        continue;
      }
      const target = Math.max(0, Math.min(1, (params.audioFeatures[particle.featureKey] || 0) * params.segmentIntensityBoost));
      particle.resonance = THREE.MathUtils.lerp(particle.resonance, target, 0.18);
      resonanceSum += particle.resonance;

      particle.velocity.multiplyScalar(0.92);
      particle.velocity.addScaledVector(this.worldUp, (target - 0.45) * 0.05);
      this.synapticTemp.set((Math.random() - 0.5) * 0.025, 0, (Math.random() - 0.5) * 0.025);
      particle.velocity.add(this.synapticTemp);
      particle.position.add(particle.velocity);
      surviving.push(particle);
    }
    this.consciousParticles = surviving;

    const geometry = this.synapticGeometry;
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    const colors = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
    if (!positions || !colors) return;

    const connectionDensity = THREE.MathUtils.clamp(settings.connectionDensity ?? 0.45, 0, 1);
    const resonanceThreshold = THREE.MathUtils.clamp(settings.resonanceThreshold ?? 0.4, 0, 1);
    const maxLinks = Math.max(0, Math.min(this.maxSynapticLinks, Math.round(this.maxSynapticLinks * connectionDensity)));
    const count = this.consciousParticles.length;
    let linkCount = 0;

    const rA = this.synapticColorA.r;
    const gA = this.synapticColorA.g;
    const bA = this.synapticColorA.b;
    const rB = this.synapticColorB.r;
    const gB = this.synapticColorB.g;
    const bB = this.synapticColorB.b;

    if (maxLinks > 0 && count >= 2) {
      for (let i = 0; i < count && linkCount < maxLinks; i++) {
        const a = this.consciousParticles[i];
        for (let j = i + 1; j < count && linkCount < maxLinks; j++) {
          const b = this.consciousParticles[j];
          const resonance = (a.resonance + b.resonance) * 0.5;
          if (resonance < resonanceThreshold) continue;
          const dist = a.position.distanceTo(b.position);
          if (dist > 28) continue;

          const base = linkCount * 6;
          positions.array[base + 0] = a.position.x;
          positions.array[base + 1] = a.position.y;
          positions.array[base + 2] = a.position.z;
          positions.array[base + 3] = b.position.x;
          positions.array[base + 4] = b.position.y;
          positions.array[base + 5] = b.position.z;

          const r = THREE.MathUtils.lerp(rA, rB, resonance);
          const g = THREE.MathUtils.lerp(gA, gB, resonance);
          const bl = THREE.MathUtils.lerp(bA, bB, resonance);
          colors.array[base + 0] = r;
          colors.array[base + 1] = g;
          colors.array[base + 2] = bl;
          colors.array[base + 3] = r;
          colors.array[base + 4] = g;
          colors.array[base + 5] = bl;

          linkCount++;
        }
      }
    }

    geometry.setDrawRange(0, linkCount * 2);
    positions.needsUpdate = linkCount > 0;
    colors.needsUpdate = linkCount > 0;

    if (this.synapticMaterial && this.synapticLines) {
      const baseOpacity = linkCount > 0 ? Math.min(1, 0.25 + (linkCount / Math.max(1, maxLinks)) * 0.75) : 0;
      this.synapticMaterial.opacity = THREE.MathUtils.lerp(this.synapticMaterial.opacity, baseOpacity, linkCount > 0 ? 0.18 : (1 - persistence) * 0.12 + 0.02);
      this.synapticLines.visible = this.synapticMaterial.opacity > 0.02;
    }

    const avgResonance = count > 0 ? resonanceSum / count : 0;
    const linkRatio = maxLinks > 0 ? linkCount / maxLinks : 0;
    const densityBias = connectionDensity;
    const intensityTarget = THREE.MathUtils.clamp(0.45 + avgResonance * 1.2 + linkRatio * 0.9 + densityBias * 0.6, 0.3, 2.5);
    const eased = THREE.MathUtils.lerp(this.consciousnessIntensity, intensityTarget, linkCount > 0 ? 0.25 : 0.12 * (1 - persistence));
    this.setConsciousnessIntensity(eased);
  }

  private ensureSynapticNetwork(): void {
    if (this.synapticLines && this.synapticGeometry && this.synapticMaterial) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxSynapticLinks * 2 * 3);
    const colors = new Float32Array(this.maxSynapticLinks * 2 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    lines.renderOrder = 11;
    this.scene.add(lines);

    this.synapticGeometry = geometry;
    this.synapticMaterial = material;
    this.synapticLines = lines;
  }

  private fadeSynapticNetwork(forceClear: boolean): void {
    if (!this.synapticMaterial || !this.synapticGeometry || !this.synapticLines) return;

    if (forceClear) {
      this.synapticMaterial.opacity = 0;
      this.synapticLines.visible = false;
      this.synapticGeometry.setDrawRange(0, 0);
      return;
    }

    this.synapticMaterial.opacity = THREE.MathUtils.lerp(this.synapticMaterial.opacity, 0, 0.12);
    if (this.synapticMaterial.opacity < 0.02) {
      this.synapticLines.visible = false;
      this.synapticGeometry.setDrawRange(0, 0);
    }
  }

  public driveReactiveParticles(params: DriveReactiveParticlesParams, trackPulse: number): number {
    if (params.currentLOD === 'low' || (!this.particleInstancedMesh && !this.particleSystem)) {
      this.updateConsciousness({
        nowSeconds: params.nowSeconds,
        audioFeatures: params.audioFeatures,
        segmentIntensityBoost: params.segmentIntensityBoost,
      });
      return trackPulse;
    }

    const { nowSeconds, deltaSeconds, cameraPosition, lookAtPosition, audioFeatures, segmentIntensityBoost } = params;

    this.spawnForward.subVectors(lookAtPosition, cameraPosition);
    if (this.spawnForward.lengthSq() < 1e-6) return trackPulse;
    this.spawnForward.normalize();

    this.spawnRight.copy(this.spawnForward).cross(this.worldUp);
    if (this.spawnRight.lengthSq() < 1e-6) {
      this.spawnRight.set(1, 0, 0);
    } else {
      this.spawnRight.normalize();
    }

    this.spawnUp.copy(this.spawnRight).cross(this.spawnForward);
    if (this.spawnUp.lengthSq() < 1e-6) {
      this.spawnUp.copy(this.worldUp);
    } else {
      this.spawnUp.normalize();
    }

    this.spawnOrigin.copy(cameraPosition)
      .addScaledVector(this.spawnForward, 8)
      .addScaledVector(this.spawnUp, 2);

  const triggers: Array<{ feature: string; threshold: number; cooldown: number; lateral: number; forward: number }> = [
      { feature: 'bass', threshold: 0.35, cooldown: 0.16, lateral: -2.8, forward: 0.5 },
      { feature: 'mid', threshold: 0.32, cooldown: 0.22, lateral: 2.8, forward: 1.8 },
      { feature: 'treble', threshold: 0.28, cooldown: 0.28, lateral: 0.4, forward: 3.8 },
      { feature: 'sparkle', threshold: 0.3, cooldown: 0.18, lateral: 0, forward: 0 },
    ];

    for (const trigger of triggers) {
      const baseIntensity = audioFeatures[trigger.feature] ?? 0;
      if (baseIntensity <= 0) continue;
      const visualConfig = this.featureVisuals.get(trigger.feature);
      if (!visualConfig) continue;

      const sensitivity = visualConfig.sensitivity;
      const scaled = Math.min(1, baseIntensity * sensitivity * segmentIntensityBoost);
      if (scaled < trigger.threshold) continue;
      const last = this.featureCooldowns[trigger.feature] ?? 0;
      if (nowSeconds - last < trigger.cooldown) continue;

      this.spawnWork.copy(this.spawnOrigin)
        .addScaledVector(this.spawnRight, trigger.lateral + (Math.random() - 0.5) * 1.5)
        .addScaledVector(this.spawnForward, trigger.forward + (Math.random() - 0.5) * 1.0);
      this.spawnFeatureBurst(trigger.feature, scaled, this.spawnWork, audioFeatures, segmentIntensityBoost, nowSeconds);
      this.featureCooldowns[trigger.feature] = nowSeconds;

      const boost = trigger.feature === 'bass' || trigger.feature === 'subBass'
        ? scaled * 0.9
        : scaled * 0.45;
      trackPulse = Math.min(1.5, trackPulse + boost);
    }

  this.ambientAccumulator += deltaSeconds * (1.1 + params.gpuAudioForce * 0.8);
    if (this.ambientAccumulator >= 0.45) {
      const cycles = Math.max(1, Math.floor(this.ambientAccumulator / 0.45));
      this.ambientAccumulator -= cycles * 0.45;
      for (let i = 0; i < cycles; i++) {
        this.spawnWork.copy(this.spawnOrigin)
          .addScaledVector(this.spawnForward, 1.2 + (Math.random() - 0.5) * 1.5)
          .addScaledVector(this.spawnRight, (Math.random() - 0.5) * 3.5);
        this.spawnFeatureBurst('sparkle', 0.45 + Math.random() * 0.4, this.spawnWork, audioFeatures, segmentIntensityBoost, nowSeconds);
        trackPulse = Math.min(1.5, trackPulse + 0.25);
      }
    }

    this.updateConsciousness({
      nowSeconds,
      audioFeatures,
      segmentIntensityBoost,
    });

    return trackPulse;
  }

  public spawnParticles(count: number, context: SpawnContext) {
    if (!this.particleSystem) return;

    const { origin, feature, audioFeatures, segmentIntensityBoost, nowSeconds } = context;
    const baseBatch = this.spawnBatchSize;
    const spawnCount = count > 0
      ? Math.min(count, baseBatch)
      : baseBatch;

    if (this.particleInstancedMesh) {
      this.spawnInstanceBatch(spawnCount, context, nowSeconds);
      return;
    }

    this.spawnPointsBatch(spawnCount, origin, feature, audioFeatures, segmentIntensityBoost, nowSeconds);
  }

  public spawnFeatureBurst(featureName: string, intensity: number, origin: THREE.Vector3, audioFeatures: Record<string, number>, segmentIntensityBoost: number, nowSeconds: number) {
    const scaled = Math.max(0, Math.min(1, intensity));
    const baseBatch = this.spawnBatchSize;
    const count = Math.max(1, Math.round(baseBatch * (0.5 + scaled * 2.0)));
    this.spawnParticles(count, {
      origin,
      feature: featureName,
      audioFeatures,
      segmentIntensityBoost,
      nowSeconds,
    });
    this.registerConsciousParticle(featureName, origin, scaled, segmentIntensityBoost, nowSeconds);
  }

  public seedAmbientField(curve: THREE.Curve<THREE.Vector3>, sampleCount: number, spread: number, nowSeconds: number, audioFeatures: Record<string, number>, segmentIntensityBoost: number) {
    if (!curve || sampleCount <= 0 || spread <= 0) return;
    const total = Math.max(1, sampleCount);
    const featureKeys = ['sparkle', 'highMid', 'mid', 'lowMid', 'treble'];
    const tangent = this.spawnForward;
    const lateral = this.spawnRight;
    const vertical = this.spawnUp;
    const work = this.spawnWork;

    for (let i = 0; i < total; i++) {
      const u = (i + Math.random() * 0.35) / total;
      curve.getPointAt(u % 1, work);
      curve.getTangentAt(u % 1, tangent);
      if (tangent.lengthSq() < 1e-6) tangent.set(0, 0, 1);
      lateral.copy(this.worldUp).cross(tangent).normalize();
      if (lateral.lengthSq() < 1e-6) lateral.set(1, 0, 0);
      vertical.copy(tangent).cross(lateral).normalize();

      const radius = spread * (0.4 + Math.random() * 0.8);
      const sway = (Math.random() - 0.5) * radius;
      const lift = (Math.random() - 0.5) * radius * 0.6;
      const drift = (Math.random() - 0.5) * radius * 0.45;
      work.addScaledVector(lateral, sway);
      work.addScaledVector(vertical, lift);
      work.addScaledVector(tangent, drift);

      const feature = featureKeys[i % featureKeys.length];
      const intensity = 0.45 + Math.random() * 0.55;
      this.spawnFeatureBurst(feature, intensity, work, audioFeatures, segmentIntensityBoost, nowSeconds - Math.random() * 2.5);
    }
  }

  public reclaimExpired(nowSeconds: number) {
    if (!this.particleInstancedMesh || !this.instanceStartTimes || !this.instanceLifetimes) return;
    const dummy = this._dummy;
    const count = this.particleInstancedMesh.count;
    let reclaimed = 0;
    for (let i = 0; i < count; i++) {
      const start = this.instanceStartTimes[i];
      const life = this.instanceLifetimes[i];
      if (life > 0 && nowSeconds - start >= life) {
        this.freeInstance(i);
        dummy.position.set(0, 0, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        this.particleInstancedMesh.setMatrixAt(i, dummy.matrix);
        reclaimed++;
      }
    }
    if (reclaimed > 0) this.particleInstancedMesh.instanceMatrix.needsUpdate = true;
  }

  public updatePointsMaterial(audioFeatures: Record<string, number>, segmentIntensityBoost: number, segmentColorTarget: THREE.Color, baseRailColor: THREE.Color) {
    if (!this.particleSystem) return;
    try {
      const mat = this.particleSystem.material as THREE.PointsMaterial;
      const bass = audioFeatures.bass || 0;
      const consciousnessLift = 0.7 + this.consciousnessIntensity * 0.25 + segmentIntensityBoost * 0.12;
      const targetSize = RIDE_CONFIG.PARTICLE_BASE_SIZE * (1 + bass * 1.2 * segmentIntensityBoost) * consciousnessLift;
      mat.size = THREE.MathUtils.lerp(mat.size || RIDE_CONFIG.PARTICLE_BASE_SIZE, targetSize, 0.06);
      const targetCol = this._tempColor.copy(segmentColorTarget).lerp(baseRailColor, 0.45);
      const neuralBlend = Math.min(0.65, this.consciousnessIntensity * 0.28);
      if (neuralBlend > 1e-3) {
        targetCol.lerp(this.synapticColorB, neuralBlend);
      }
      (mat.color as THREE.Color).lerp(targetCol, 0.02);
      mat.needsUpdate = true;
    } catch (e) {
      // ignore material update failures
    }
  }

  public applyLOD(mode: 'low' | 'high') {
    if (mode === 'low') {
      if (this.particleInstancedMesh) this.particleInstancedMesh.visible = false;
      if (this.particleSystem && !this.particleSystem.parent) {
        this.scene.add(this.particleSystem);
      }
      if (this.particleSystem) this.particleSystem.visible = true;
    } else {
      if (this.particleInstancedMesh) this.particleInstancedMesh.visible = true;
      if (this.particleSystem && this.particleSystem.parent === this.scene) {
        this.scene.remove(this.particleSystem);
      }
      if (this.particleSystem) this.particleSystem.visible = false;
    }
  }

  public switchToFallback() {
    console.warn('[VisualEffects] Switching to fallback particle system (THREE.Points).');
    if (this.particleInstancedMesh) {
      this.particleInstancedMesh.visible = false;
    }
    if (this.particleSystem) {
      if (!this.particleSystem.parent) {
        this.scene.add(this.particleSystem);
      }
      this.particleSystem.visible = true;
    }
  }

  public dispose() {
    if (this.particleInstancedMesh) {
      try {
        this.scene.remove(this.particleInstancedMesh);
        this.particleInstancedMesh.geometry.dispose();
        this.particleInstancedMesh.material.dispose();
      } catch (e) {}
      this.particleInstancedMesh = null;
    }

    if (this.particleSystem) {
      try {
        this.scene.remove(this.particleSystem);
        const geom = this.particleSystem.geometry as THREE.BufferGeometry;
        geom.dispose();
        (this.particleSystem.material as THREE.Material).dispose();
      } catch (e) {}
      this.particleSystem = null;
    }
    if (this.synapticLines) {
      try {
        this.scene.remove(this.synapticLines);
        this.synapticLines.geometry.dispose();
      } catch (e) {}
      if (this.synapticMaterial) {
        try { this.synapticMaterial.dispose(); } catch (e) {}
      }
      this.synapticGeometry = null;
      this.synapticMaterial = null;
      this.synapticLines = null;
    }
    this.disposeGPU();
  }

  public isGPUEnabled(): boolean {
    return this.gpuEnabled;
  }

  private validateParticleLayout(): boolean {
    if (!this.particleInstancedMesh) return false;

    const expectedCount = RIDE_CONFIG.PARTICLE_COUNT;
    const actualCount = this.particleInstancedMesh.count;
    const texSize = Math.ceil(Math.sqrt(expectedCount));
    const texCapacity = texSize * texSize;

    if (actualCount !== expectedCount) {
      console.error(`[ParticleSystem] Instance count mismatch: expected ${expectedCount}, got ${actualCount}`);
      return false;
    }

    if (texCapacity < expectedCount) {
      console.error(`[ParticleSystem] Texture too small: ${texSize}x${texSize} (${texCapacity}) < ${expectedCount}`);
      return false;
    }

    return true;
  }

  private detectRenderer() {
    if (this.rendererInfo !== null) return this.rendererInfo;
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
      if (!gl) {
        this.rendererInfo = { ok: false, renderer: 'no-webgl', vendor: 'unknown' };
        return this.rendererInfo;
      }
      const dbg = (gl as any).getExtension && (gl as any).getExtension('WEBGL_debug_renderer_info');
      const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : (gl.getParameter((gl as any).RENDERER) as string);
      const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : (gl.getParameter((gl as any).VENDOR) as string);
      this.rendererInfo = { ok: true, renderer: renderer || 'unknown', vendor: vendor || 'unknown' };
      return this.rendererInfo;
    } catch (e) {
      this.rendererInfo = { ok: false, renderer: 'error', vendor: 'error' };
      return this.rendererInfo;
    }
  }

  private validateFloatRenderTargets(renderer: THREE.WebGLRenderer): boolean {
    const gl = renderer.getContext();
    const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    if (!isWebGL2) {
      console.warn('[GPU Particles] WebGL2 is not available.');
      return false;
    }

    const hasFloatExt = gl.getExtension('EXT_color_buffer_float');
    if (!hasFloatExt) {
      console.warn('[GPU Particles] EXT_color_buffer_float extension is not available.');
      return false;
    }

    // Test actual renderability
    const testRT = new THREE.WebGLRenderTarget(1, 1, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });

    try {
      renderer.setRenderTarget(testRT);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      renderer.setRenderTarget(null);
      testRT.dispose();
      const isComplete = status === gl.FRAMEBUFFER_COMPLETE;
      if (!isComplete) {
        console.warn(`[GPU Particles] Float render target framebuffer check failed with status: ${status}.`);
      }
      return isComplete;
    } catch (e) {
      console.error('[GPU Particles] Error during float render target validation:', e);
      testRT.dispose();
      return false;
    }
  }

  private disposeGPU() {
    // Render targets
    if (this.gpuPosRTA) { this.gpuPosRTA.dispose(); this.gpuPosRTA = null; }
    if (this.gpuPosRTB) { this.gpuPosRTB.dispose(); this.gpuPosRTB = null; }
    if (this.gpuVelRTA) { this.gpuVelRTA.dispose(); this.gpuVelRTA = null; }
    if (this.gpuVelRTB) { this.gpuVelRTB.dispose(); this.gpuVelRTB = null; }

    // Materials
    if (this.gpuVelMaterial) { this.gpuVelMaterial.dispose(); this.gpuVelMaterial = null; }
    if (this.gpuPosMaterial) { this.gpuPosMaterial.dispose(); this.gpuPosMaterial = null; }

    // Scene and camera
    if (this.gpuQuadScene) {
      this.gpuQuadScene.clear();
      this.gpuQuadScene = null;
    }
    if (this.gpuQuadCamera) { this.gpuQuadCamera = null; }

    // Quad meshes
    if (this.gpuVelQuad) {
      this.gpuVelQuad.geometry.dispose();
      this.gpuVelQuad = null;
    }
    if (this.gpuPosQuad) {
      this.gpuPosQuad.geometry.dispose();
      this.gpuPosQuad = null;
    }

    this.gpuRenderer = null;
    this.gpuEnabled = false;
  }

  public async initGPU(renderer: THREE.WebGLRenderer, curlParams: { curlStrength: number; noiseScale: number; noiseSpeed: number; }) {
    const instancedMesh = this.particleInstancedMesh;
    if (!instancedMesh) {
      console.log('[GPU Particles] No instanced mesh available, skipping GPU init.');
      return;
    }
    if (!this.validateFloatRenderTargets(renderer)) {
      const ri = this.detectRenderer();
      console.warn(`[GPU Particles] GPU particle system requires WebGL2 + float render-target support. Falling back to CPU particles. renderer=${ri.renderer}, vendor=${ri.vendor}`);
      this.switchToFallback();
      return;
    }
    try {
      this.gpuRenderer = renderer;
      const size = this.texSize;
      let preResolvedVel: string | null = getCachedShader('/shaders/velFrag.resolved.glsl');
      let preResolvedPos: string | null = getCachedShader('/shaders/posFrag.resolved.glsl');

      if (!preResolvedVel) {
        try {
          const velResp = await fetch('/shaders/velFrag.resolved.glsl');
          if (velResp.ok) preResolvedVel = await velResp.text();
        } catch (e) {}
      }
      if (!preResolvedPos) {
        try {
          const posResp = await fetch('/shaders/posFrag.resolved.glsl');
          if (posResp.ok) preResolvedPos = await posResp.text();
        } catch (e) {}
      }

      let baseVelFrag = getCachedShader('/shaders/baseVelFrag.glsl') || '';
      let basePosFrag = getCachedShader('/shaders/basePosFrag.glsl') || '';

      if ((!preResolvedVel || !preResolvedPos) && (!baseVelFrag || !basePosFrag)) {
        try {
          if (!baseVelFrag) {
            const bvel = await fetch('/shaders/baseVelFrag.glsl');
            if (bvel.ok) baseVelFrag = await bvel.text();
          }
          if (!basePosFrag) {
            const bpos = await fetch('/shaders/basePosFrag.glsl');
            if (bpos.ok) basePosFrag = await bpos.text();
          }
        } catch (e) {}
      }
      let resolveLygia: ((s: string) => string) | null = getCachedLygiaResolver();

      if (!resolveLygia && (!preResolvedVel || !preResolvedPos)) {
        try {
            try {
              const localUrl = window.location.origin + '/lygia/resolve.esm.js';
              const local = await import(/* @vite-ignore */ localUrl);
              resolveLygia = (local && (local.default || local.resolveLygia || local.resolve)) ? (local.default || local.resolveLygia || local.resolve) : null;
            } catch (e) {
              resolveLygia = null;
            }
        } catch (e) {
          try {
            const cdnUrl = 'https://lygia.xyz/resolve.esm.js';
            const mod = await import(/* @vite-ignore */ cdnUrl);
            resolveLygia = (mod && (mod.default || mod.resolveLygia || mod.resolve) ) ? (mod.default || mod.resolveLygia || mod.resolve) : null;
          } catch (e2) {
            resolveLygia = null;
          }
        }
      }

      const totalTexels = size * size;
      const posArray = new Float32Array(totalTexels * 4);
      const velArrayInit = new Float32Array(totalTexels * 4);
      const tempMat = new THREE.Matrix4();
      const _pos = new THREE.Vector3();

      for (let i = 0; i < RIDE_CONFIG.PARTICLE_COUNT; i++) {
        const ti = i * 4;
        let sp = 0;
        try {
          if (instancedMesh) {
            instancedMesh.getMatrixAt(i, tempMat);
            tempMat.multiplyMatrices(instancedMesh.matrixWorld, tempMat);
            _pos.setFromMatrixPosition(tempMat);
          } else {
            _pos.set(0, -9999, 0);
          }
          if (instancedMesh && (instancedMesh.geometry as any).getAttribute('instanceSpeed')) {
            const spAttr = (instancedMesh.geometry as any).getAttribute('instanceSpeed');
            sp = spAttr.array[i] || 0;
          }
        } catch (e) {
          _pos.set(0, -9999, 0);
        }
        posArray[ti + 0] = _pos.x;
        posArray[ti + 1] = _pos.y;
        posArray[ti + 2] = _pos.z;
        posArray[ti + 3] = 1.0;
        velArrayInit[ti + 0] = sp; velArrayInit[ti + 1] = 0; velArrayInit[ti + 2] = 0; velArrayInit[ti + 3] = 0;
      }

      const posTexture = new THREE.DataTexture(posArray, size, size, THREE.RGBAFormat, THREE.FloatType);
      posTexture.needsUpdate = true;
      for (let i = 0; i < totalTexels; i++) { velArrayInit[i*4 + 0] = 0; velArrayInit[i*4 + 1] = 0; velArrayInit[i*4 + 2] = 0; velArrayInit[i*4 + 3] = 0; }
      const velTexture = new THREE.DataTexture(velArrayInit, size, size, THREE.RGBAFormat, THREE.FloatType);
      velTexture.needsUpdate = true;

      this.gpuQuadScene = new THREE.Scene();
      this.gpuQuadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const baseVelInline = `
      precision highp float; varying vec2 vUv;
      uniform sampler2D prevVel; uniform sampler2D prevPos; uniform float dt; uniform float time;
    uniform float audioForce; uniform float subBass; uniform float bass; uniform float lowMid; uniform float mid; uniform float highMid; uniform float treble; uniform float sparkle;
    uniform float neuralGain; uniform float resonanceFloor; uniform float consciousnessPersistence; uniform float consciousnessDrive;
              vec3 hash3(vec2 p) {
                vec3 q = vec3( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)) );
                return fract(sin(q) * 43758.5453);
              }
              float noise(vec2 p) {
                vec2 i = floor(p); vec2 f = fract(p);
                vec3 a = hash3(i + vec2(0.0,0.0));
                vec3 b = hash3(i + vec2(1.0,0.0));
                vec3 c = hash3(i + vec2(0.0,1.0));
                vec3 d = hash3(i + vec2(1.0,1.0));
                vec2 u = f*f*(3.0-2.0*f);
                return mix(mix(a.x,b.x,u.x), mix(c.x,d.x,u.x), u.y);
              }
              uniform float noiseScale;
              uniform float noiseSpeed;
              uniform float curlStrength;
              vec3 curlNoise(vec3 p){
                float n1 = noise(p.xy * noiseScale + time * noiseSpeed);
                float n2 = noise(p.yz * noiseScale + time * noiseSpeed * 1.1);
                float n3 = noise(p.zx * noiseScale + time * noiseSpeed * 0.95);
                return normalize(vec3(n2 - n3, n3 - n1, n1 - n2));
              }
              void main(){
                vec3 v = texture2D(prevVel, vUv).rgb;
                vec3 p = texture2D(prevPos, vUv).rgb;
                vec3 accel = vec3(0.0, -0.98, 0.0);
                v += accel * dt;
                  float bandPulse = clamp((sin(time*10.0 + vUv.x*50.0) * 0.5 + 0.5), 0.0, 1.0);
                  float audio = bandPulse * audioForce;
                  audio += subBass * 3.0;
                  audio += bass * 2.0;
                  audio += lowMid * 1.4;
                  audio += mid * 1.2;
                  audio += highMid * 1.0;
                  audio += treble * 0.8;
                  audio += sparkle * 0.6;
                  v.y += audio * 2.5;
                  float harmonicEnergy = max(resonanceFloor, subBass * 0.6 + bass * 0.8 + mid * 0.5 + sparkle * 0.35);
                  float neural = neuralGain * (audioForce * 0.12 + harmonicEnergy);
                  float drive = clamp(consciousnessDrive, 0.0, 3.0);
                  neural *= (0.6 + drive * 0.4);
                  vec3 c = curlNoise(p + v * 0.35 + vec3(time * 0.1, 0.0, 0.0));
                  v += c * curlStrength * (0.5 + harmonicEnergy * 0.6);
                  v.y += neural * 1.8;
                  v += normalize(c + vec3(0.0, harmonicEnergy * 0.4, 0.0)) * neural * 0.35;
                float damping = mix(0.982, 0.998, clamp(consciousnessPersistence, 0.0, 1.0));
                v *= damping;
                gl_FragColor = vec4(v, 1.0);
              }
            `;

      if (!baseVelFrag) baseVelFrag = baseVelInline;

      if (preResolvedVel && preResolvedVel.includes('#include')) {
        preResolvedVel = null;
      }
      if (preResolvedVel) {
        const requiredUniforms = ['subBass', 'lowMid', 'highMid', 'sparkle'];
        const missingUniform = requiredUniforms.some((name) => !new RegExp(`uniform\\s+float\\s+${name}\\b`).test(preResolvedVel!));
        if (missingUniform) {
          console.warn('[GPU Particles] Resolved velocity shader missing expected audio uniforms; falling back to base shader.');
          preResolvedVel = null;
        }
      }
      if (preResolvedPos && preResolvedPos.includes('#include')) {
        preResolvedPos = null;
      }

      let velFragSrc = baseVelFrag;
      if (preResolvedVel) {
        velFragSrc = preResolvedVel;
      } else if (resolveLygia) {
        try {
          const header = '#include "lygia/generative/simplex.glsl"\n#include "lygia/generative/curl.glsl"\n#include "lygia/color/palettes.glsl"\n';
          const resolved = resolveLygia(header + baseVelFrag);
          if (typeof resolved === 'string' && resolved.length > 32 && !resolved.includes('Path ') && !resolved.toLowerCase().includes('not found') && (resolved.includes('void main') || resolved.includes('gl_FragColor') || resolved.includes('gl_FragData'))) {
            velFragSrc = resolved;
          } else {
            velFragSrc = baseVelFrag;
          }
        } catch (e) {
          velFragSrc = baseVelFrag;
        }
      }
      const velShader = new THREE.ShaderMaterial({
        uniforms: {
          prevVel: { value: velTexture },
          prevPos: { value: posTexture },
          audioForce: { value: 0 },
          curlStrength: { value: curlParams.curlStrength },
          noiseScale: { value: curlParams.noiseScale },
          noiseSpeed: { value: curlParams.noiseSpeed },
          subBass: { value: 0.0 },
          bass: { value: 0.0 },
          lowMid: { value: 0.0 },
          mid: { value: 0.0 },
          highMid: { value: 0.0 },
          treble: { value: 0.0 },
          sparkle: { value: 0.0 },
          neuralGain: { value: this.synestheticUniforms.neuralGain },
          resonanceFloor: { value: this.synestheticUniforms.resonanceFloor },
          consciousnessPersistence: { value: this.synestheticUniforms.persistence },
          consciousnessDrive: { value: this.consciousnessIntensity },
          time: { value: 0 },
          dt: { value: 1/60 },
          texSize: { value: size },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
        fragmentShader: velFragSrc,
        depthTest: false, depthWrite: false
      });

      const basePosInline = `
              precision highp float; varying vec2 vUv;
              uniform sampler2D prevPos; uniform sampler2D velTex; uniform float dt;
              void main(){
                vec3 p = texture2D(prevPos, vUv).rgb;
                vec3 v = texture2D(velTex, vUv).rgb;
                p += v * dt;
                if (p.y < -100.0) p.y = -9999.0;
                gl_FragColor = vec4(p, 1.0);
              }
            `;
      if (!basePosFrag) basePosFrag = basePosInline;

      let posFragSrc = basePosFrag;
      if (preResolvedPos) {
        posFragSrc = preResolvedPos;
      } else if (resolveLygia) {
        try {
          const header = '#include "lygia/generative/simplex.glsl"\n';
          const resolvedPos = resolveLygia(header + basePosFrag);
          if (typeof resolvedPos === 'string' && resolvedPos.length > 32 && !resolvedPos.includes('Path ') && !resolvedPos.toLowerCase().includes('not found') && (resolvedPos.includes('void main') || resolvedPos.includes('gl_FragColor') || resolvedPos.includes('gl_FragData'))) {
            posFragSrc = resolvedPos;
          } else {
            posFragSrc = basePosFrag;
          }
        } catch (e) {
          posFragSrc = basePosFrag;
        }
      }

      const posShader = new THREE.ShaderMaterial({
        uniforms: {
          prevPos: { value: posTexture },
          velTex: { value: velTexture },
          dt: { value: 1/60 },
          texSize: { value: size },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
        fragmentShader: posFragSrc,
        depthTest: false, depthWrite: false
      });

      this.gpuVelMaterial = velShader;
      this.gpuPosMaterial = posShader;
      this.gpuVelQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.gpuVelMaterial);
      this.gpuPosQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.gpuPosMaterial);
      this.gpuVelQuad.visible = false;
      this.gpuPosQuad.visible = false;
      this.gpuQuadScene.add(this.gpuVelQuad);
      this.gpuQuadScene.add(this.gpuPosQuad);

      const rtParams: any = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.FloatType, format: THREE.RGBAFormat };
      this.gpuVelRTA = new THREE.WebGLRenderTarget(size, size, rtParams);
      this.gpuVelRTB = new THREE.WebGLRenderTarget(size, size, rtParams);
      this.gpuPosRTA = new THREE.WebGLRenderTarget(size, size, rtParams);
      this.gpuPosRTB = new THREE.WebGLRenderTarget(size, size, rtParams);

      (this.gpuVelMaterial as any).uniforms.prevVel.value = velTexture;
      (this.gpuVelMaterial as any).uniforms.prevPos.value = posTexture;
      renderer.setRenderTarget(this.gpuVelRTA);
      renderer.render(this.gpuQuadScene, this.gpuQuadCamera);
      renderer.setRenderTarget(null);
      (this.gpuPosMaterial as any).uniforms.prevPos.value = posTexture;
      (this.gpuPosMaterial as any).uniforms.velTex.value = velTexture;
      renderer.setRenderTarget(this.gpuPosRTA);
      renderer.render(this.gpuQuadScene, this.gpuQuadCamera);
      renderer.setRenderTarget(null);

  this.gpuSwap = false;
  this.gpuEnabled = true;
  this.applyPendingUniforms();
    } catch (e) {
      const ri = this.detectRenderer();
      console.error(`[GPU Particles] Failed to initialize GPU particle system. renderer=${ri.renderer}, vendor=${ri.vendor}`, e);
      this.gpuEnabled = false;
      this.switchToFallback();
    }
  }

  public updateGPU(deltaSeconds: number, params: GPUUpdateParams) {
    if (!this.gpuEnabled || !this.gpuRenderer || !this.gpuQuadScene || !this.gpuQuadCamera) return;
    if (!this.particleInstancedMesh) return;

    if (this.gpuUpdateInterval > 0) {
      this.gpuUpdateAccumulator += deltaSeconds;
      if (this.gpuUpdateAccumulator < this.gpuUpdateInterval) {
        return;
      }
      this.gpuUpdateAccumulator = 0;
    }

    if (process.env.NODE_ENV === 'development') {
      const maxSafeId = this.texSize * this.texSize - 1;
      if (this.particleInstancedMesh.count > maxSafeId + 1) {
        console.warn(`[ParticleSystem] Particle count ${this.particleInstancedMesh.count} exceeds texture capacity ${maxSafeId + 1}`);
      }
    }

    this.applyPendingUniforms();

    try {
      const size = (this.gpuPosRTA as THREE.WebGLRenderTarget).width;
      const readPos = this.gpuSwap ? this.gpuPosRTB : this.gpuPosRTA;
      const readVel = this.gpuSwap ? this.gpuVelRTB : this.gpuVelRTA;
      const writeVel = this.gpuSwap ? this.gpuVelRTA : this.gpuVelRTB;
      const writePos = this.gpuSwap ? this.gpuPosRTA : this.gpuPosRTB;

      try {
        const velMat = this.gpuVelMaterial as any;
        this.updateScalarUniform(velMat.uniforms.time, performance.now() / 1000, 5e-3);
        this.updateScalarUniform(velMat.uniforms.dt, deltaSeconds, 1e-4);
        this.updateScalarUniform(velMat.uniforms.texSize, size, 0);
        velMat.uniforms.prevVel.value = readVel!.texture;
        velMat.uniforms.prevPos.value = readPos!.texture;
        const boost = params.segmentIntensityBoost;
        this.updateScalarUniform(velMat.uniforms.subBass, (params.audioFeatures.subBass || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.bass, (params.audioFeatures.bass || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.lowMid, (params.audioFeatures.lowMid || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.mid, (params.audioFeatures.mid || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.highMid, (params.audioFeatures.highMid || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.treble, (params.audioFeatures.treble || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.sparkle, (params.audioFeatures.sparkle || 0) * boost);
        this.updateScalarUniform(velMat.uniforms.audioForce, params.gpuAudioForce || 0);
        this.updateScalarUniform(velMat.uniforms.curlStrength, params.curlStrength, 1e-3);
        this.updateScalarUniform(velMat.uniforms.noiseScale, params.noiseScale, 1e-3);
        this.updateScalarUniform(velMat.uniforms.noiseSpeed, params.noiseSpeed, 1e-3);
        this.updateScalarUniform(velMat.uniforms.neuralGain, this.synestheticUniforms.neuralGain, 1e-3);
        this.updateScalarUniform(velMat.uniforms.resonanceFloor, this.synestheticUniforms.resonanceFloor, 1e-3);
        this.updateScalarUniform(velMat.uniforms.consciousnessPersistence, this.synestheticUniforms.persistence, 1e-3);
        const harmonic = (params.audioFeatures.bass || 0) * 0.6 + (params.audioFeatures.mid || 0) * 0.4 + (params.audioFeatures.sparkle || 0) * 0.3;
        const drive = Math.min(2.6, this.consciousnessIntensity * (0.7 + params.segmentIntensityBoost * 0.45) + harmonic * 0.6);
        this.updateScalarUniform(velMat.uniforms.consciousnessDrive, drive, 1e-3);
        this.syncInstancedConsciousUniform(drive);
      } catch (e) {}

      this.gpuVelQuad!.visible = true;
      this.gpuRenderer!.setRenderTarget(writeVel!);
      this.gpuRenderer!.render(this.gpuQuadScene!, this.gpuQuadCamera!);
      this.gpuVelQuad!.visible = false;

      try {
        const posMat = this.gpuPosMaterial as any;
        this.updateScalarUniform(posMat.uniforms.dt, deltaSeconds, 1e-4);
        posMat.uniforms.prevPos.value = readPos!.texture;
        posMat.uniforms.velTex.value = writeVel!.texture;
      } catch (e) {}

      this.gpuPosQuad!.visible = true;
      this.gpuRenderer!.setRenderTarget(writePos!);
      this.gpuRenderer!.render(this.gpuQuadScene!, this.gpuQuadCamera!);
      this.gpuPosQuad!.visible = false;

      this.gpuRenderer!.setRenderTarget(null);

      try {
        const shaderMat = this.particleInstancedMesh.material as any;
        shaderMat.uniforms.posTex.value = writePos!.texture;
        this.updateScalarUniform(shaderMat.uniforms.texSize, size, 0);
        shaderMat.needsUpdate = true;
      } catch (e) {}

      this.gpuSwap = !this.gpuSwap;
    } catch (e) {
      this.gpuEnabled = false;
      this.switchToFallback();
    }
  }

  private buildParticleMeshes() {
    const particleCount = RIDE_CONFIG.PARTICLE_COUNT;

    try {
      const instanceGeo = new THREE.SphereGeometry(1, 6, 4);
      const instanceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.particleInstancedMesh = new THREE.InstancedMesh(instanceGeo, instanceMat, particleCount);
      this.particleInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.particleInstancedMesh.frustumCulled = false;
      this.particleInstancedMesh.renderOrder = 10;

      const dummy = this._dummy;
      for (let i = 0; i < particleCount; i++) {
        dummy.position.set(0, 0, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        this.particleInstancedMesh.setMatrixAt(i, dummy.matrix);
      }

      try {
        const colors = new Float32Array(particleCount * 3);
        const speeds = new Float32Array(particleCount);
        const positionsAttrArray = new Float32Array(particleCount * 3);
        const scalesAttrArray = new Float32Array(particleCount);
        const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
        const speedAttr = new THREE.InstancedBufferAttribute(speeds, 1);
        const posAttr = new THREE.InstancedBufferAttribute(positionsAttrArray, 3);
        const scaleAttr = new THREE.InstancedBufferAttribute(scalesAttrArray, 1);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceColor', colorAttr);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceSpeed', speedAttr);
        (this.particleInstancedMesh.geometry as any).setAttribute('instancePosition', posAttr);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceScale', scaleAttr);
      } catch (e) {}

      try {
        const feat = new Float32Array(particleCount);
        const featAttr = new THREE.InstancedBufferAttribute(feat, 1);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceFeature', featAttr);
      } catch (e) {}

      const vert = `
          attribute vec3 instancePosition;
          attribute float instanceScale;
          attribute vec3 instanceColor;
          attribute float instanceSpeed;
          attribute float instanceFeature;
          uniform sampler2D posTex;
          uniform float texSize;
          uniform float consciousnessIntensity;
          varying vec3 vColor;
          varying float vFeature;
          varying float vConscious;
          varying vec3 vNormal;

          vec3 sampleTexturePosition(float id, float dimension) {
            float row = floor(id / dimension);
            float col = mod(id, dimension);
            vec2 uv = (vec2(col, row) + 0.5) / dimension;
            return texture2D(posTex, uv).rgb;
          }

          void main() {
            float fi = instanceFeature;
            vFeature = fi;
            vConscious = consciousnessIntensity;
            float tint = 0.15 * (fi - 3.0);
            float neuralMix = clamp(consciousnessIntensity * 0.35, 0.0, 0.9);
            vec3 neuralAura = mix(instanceColor, vec3(0.78, 0.55, 1.0), neuralMix);
            vColor = neuralAura + vec3(tint, -tint * 0.2, tint * 0.1);

            float id = float(gl_InstanceID);
            vec3 center = instancePosition;
            if (texSize > 0.5) {
              center = sampleTexturePosition(id, texSize);
            }

            float sc = max(0.0001, instanceScale);
            vec3 localScaled = position * sc;
            vec4 mvPosition = modelViewMatrix * vec4(localScaled + center, 1.0);
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `;
      const frag = `
          varying vec3 vColor;
          varying float vFeature;
          varying float vConscious;
          varying vec3 vNormal;
          void main() {
            vec3 n = normalize(vNormal);
            float rim = pow(1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0))), 2.0);
            float brightness = 0.75 + rim * 0.8;
            float neuralGlow = 0.65 + clamp(vConscious, 0.0, 2.5) * 0.35;
            vec3 color = vColor * brightness * neuralGlow;
            float desat = 1.0 - clamp((vFeature - 2.0) * 0.06, 0.0, 0.35);
            color = mix(vec3(dot(color, vec3(0.333))), color, desat);
            color = mix(color, vec3(0.82, 0.45, 1.0), clamp(vConscious * 0.25, 0.0, 0.5));
            gl_FragColor = vec4(color, 1.0);
          }
        `;
      const shaderMat = new THREE.ShaderMaterial({
        uniforms: { posTex: { value: null }, texSize: { value: 0 }, consciousnessIntensity: { value: this.consciousnessIntensity } },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });
      this.particleInstancedMesh.material = shaderMat as any;
      this.particleInstancedMesh.matrixAutoUpdate = false;
      this.particleInstancedMesh.matrix.identity();
      this.particleInstancedMesh.count = this.particleBudget;
      this.scene.add(this.particleInstancedMesh);
      this.validateParticleLayout();
    } catch (e) {
      // instancing unavailable; fall back to Points
    }

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const startTimes = new Float32Array(particleCount);
    const geometryParticles = new THREE.BufferGeometry();
    geometryParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryParticles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometryParticles.setAttribute('startTime', new THREE.BufferAttribute(startTimes, 1));
    (geometryParticles.attributes.position as any).updateRange = { offset: 0, count: 0 };
    (geometryParticles.attributes.velocity as any).updateRange = { offset: 0, count: 0 };
    (geometryParticles.attributes.startTime as any).updateRange = { offset: 0, count: 0 };

    this.particleSystem = new THREE.Points(
      geometryParticles,
      new THREE.PointsMaterial({
        size: RIDE_CONFIG.PARTICLE_BASE_SIZE,
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );

    if (!this.particleInstancedMesh) this.scene.add(this.particleSystem);

    if (this.particleInstancedMesh) {
      this.instanceStartTimes = new Float32Array(particleCount);
      this.instanceLifetimes = new Float32Array(particleCount);
      for (let i = particleCount - 1; i >= 0; i--) {
        this.instanceFreeStack.push(i);
        this.instanceStartTimes[i] = 0;
        this.instanceLifetimes[i] = 0;
      }
    }
  }

  private spawnInstanceBatch(spawnCount: number, context: SpawnContext, nowSeconds: number) {
    if (!this.particleInstancedMesh) return;
    const particleCount = this.particleBudget;
    if (particleCount <= 0) return;
    const positionsAttr = (this.particleSystem!.geometry as THREE.BufferGeometry).attributes.position as any;
    const velocitiesAttr = (this.particleSystem!.geometry as THREE.BufferGeometry).attributes.velocity as any;
    const startTimesAttr = (this.particleSystem!.geometry as THREE.BufferGeometry).attributes.startTime as any;
    const dummy = this._dummy;

    if (this.particleCursor + spawnCount > particleCount) {
      positionsAttr.updateRange = { offset: 0, count: -1 };
      velocitiesAttr.updateRange = { offset: 0, count: -1 };
      startTimesAttr.updateRange = { offset: 0, count: -1 };
      this.particleCursor = (this.particleCursor + spawnCount) % particleCount;
      this.particleInstancedMesh.instanceMatrix.needsUpdate = true;
      return;
    }

    const allocated: number[] = [];
    for (let i = 0; i < spawnCount; i++) {
      const idx = this.allocateInstance();
      if (idx === -1) break;
      allocated.push(idx);

      const visualConfig = context.feature ? this.featureVisuals.get(context.feature) : undefined;
      const featureIntensity = Math.min(1, (context.feature ? (context.audioFeatures[context.feature] || 0) : 0) * context.segmentIntensityBoost);
      const jitter = 1.5 + featureIntensity * 2.0;
      const px = context.origin.x + (Math.random() - 0.5) * jitter;
      const py = context.origin.y + (Math.random() - 0.5) * jitter;
      const pz = context.origin.z + (Math.random() - 0.5) * jitter;

      dummy.position.set(px, py, pz);
      const baseSize = RIDE_CONFIG.PARTICLE_BASE_SIZE * (visualConfig?.size ?? 1.0) * (0.7 + Math.random() * 0.6);
      dummy.scale.setScalar(baseSize * (1 + featureIntensity * 1.2));
      dummy.updateMatrix();
      this.particleInstancedMesh!.setMatrixAt(idx, dummy.matrix);

      if (this.instanceStartTimes && this.instanceLifetimes) {
        this.instanceStartTimes[idx] = nowSeconds;
        const baseLifetime = visualConfig?.lifetime ?? 1.5;
        this.instanceLifetimes[idx] = baseLifetime + (Math.random() - 0.2) * baseLifetime * 0.5;
      }

      const pa = idx * 3;
      positionsAttr.array[pa + 0] = px;
      positionsAttr.array[pa + 1] = py;
      positionsAttr.array[pa + 2] = pz;
      velocitiesAttr.array[pa + 0] = 0;
      velocitiesAttr.array[pa + 1] = 0;
      velocitiesAttr.array[pa + 2] = 0;
      startTimesAttr.array[idx] = nowSeconds;

      try {
        const geo: any = this.particleInstancedMesh!.geometry;
        const colorAttr = geo.getAttribute('instanceColor');
        const speedAttr = geo.getAttribute('instanceSpeed');
        const featAttr = geo.getAttribute('instanceFeature');
        const instPosAttr = geo.getAttribute('instancePosition');
        const scaleAttr = geo.getAttribute('instanceScale');

        if (colorAttr) {
          const ci = idx * 3;
          let col: [number, number, number] = [0.7, 0.7, 0.7];
          if (visualConfig) {
            col = visualConfig.color;
            const inten = Math.min(1, (context.feature ? context.audioFeatures[context.feature] || 0 : 0) * context.segmentIntensityBoost);
            const brightness = 0.6 + 0.4 * inten;
            col = [col[0] * brightness, col[1] * brightness, col[2] * brightness];
          } else {
            col = [0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4];
          }
          colorAttr.array[ci + 0] = col[0];
          colorAttr.array[ci + 1] = col[1];
          colorAttr.array[ci + 2] = col[2];
          colorAttr.needsUpdate = true;
        }
        if (speedAttr) {
          speedAttr.array[idx] = 0.5 + Math.random() * 2.0;
          speedAttr.needsUpdate = true;
        }
        if (instPosAttr) {
          instPosAttr.array[pa + 0] = px;
          instPosAttr.array[pa + 1] = py;
          instPosAttr.array[pa + 2] = pz;
          instPosAttr.needsUpdate = true;
        }
        if (scaleAttr) {
          scaleAttr.array[idx] = baseSize;
          scaleAttr.needsUpdate = true;
        }
        if (featAttr) {
          const featureIndex = context.feature === 'subBass' ? 0
            : context.feature === 'bass' ? 1
            : context.feature === 'lowMid' ? 2
            : context.feature === 'mid' ? 3
            : context.feature === 'highMid' ? 4
            : context.feature === 'treble' ? 5
            : context.feature === 'sparkle' ? 6
            : 1;
          featAttr.array[idx] = featureIndex;
          featAttr.needsUpdate = true;
        }
      } catch (e) {}
    }

    positionsAttr.needsUpdate = true;
    velocitiesAttr.needsUpdate = true;
    startTimesAttr.needsUpdate = true;
    this.particleInstancedMesh.instanceMatrix.needsUpdate = true;

    if (allocated.length > 0) {
      const minIdx = Math.min(...allocated);
      const posOffset = minIdx * 3;
      positionsAttr.updateRange = { offset: posOffset, count: allocated.length * 3 };
      velocitiesAttr.updateRange = { offset: posOffset, count: allocated.length * 3 };
      startTimesAttr.updateRange = { offset: minIdx, count: allocated.length };
    }

    this.particleCursor = (this.particleCursor + allocated.length) % particleCount;
  }

  private spawnPointsBatch(spawnCount: number, origin: THREE.Vector3, feature: string | undefined, audioFeatures: Record<string, number>, segmentIntensityBoost: number, nowSeconds: number) {
    if (!this.particleSystem) return;
    const geom = this.particleSystem.geometry as THREE.BufferGeometry;
    const positions = geom.attributes.position as THREE.BufferAttribute;
    const velocities = geom.attributes.velocity as THREE.BufferAttribute;
    const startTimes = geom.attributes.startTime as THREE.BufferAttribute;
  const particleCount = this.particleBudget;
  if (particleCount <= 0) return;

    if (this.particleCursor + spawnCount > particleCount) {
      (positions as any).updateRange = { offset: 0, count: -1 };
      (velocities as any).updateRange = { offset: 0, count: -1 };
      (startTimes as any).updateRange = { offset: 0, count: -1 };
      this.particleCursor = (this.particleCursor + spawnCount) % particleCount;
      return;
    }

    const posOffset = this.particleCursor * 3;
    for (let i = 0; i < spawnCount; i++) {
      const idx = this.particleCursor + i;
      const offset = idx * 3;
      const featureIntensity = Math.min(1, (feature ? (audioFeatures[feature] || 0) : 0) * segmentIntensityBoost);
      const jitter = 1.5 + featureIntensity * 2.0;
      positions.array[offset + 0] = origin.x + (Math.random() - 0.5) * jitter;
      positions.array[offset + 1] = origin.y + (Math.random() - 0.5) * jitter;
      positions.array[offset + 2] = origin.z + (Math.random() - 0.5) * jitter;
      velocities.array[offset + 0] = 0;
      velocities.array[offset + 1] = 0;
      velocities.array[offset + 2] = 0;
      startTimes.array[idx] = nowSeconds;
    }

    (positions as any).updateRange = { offset: posOffset, count: spawnCount * 3 };
    (velocities as any).updateRange = { offset: posOffset, count: spawnCount * 3 };
    (startTimes as any).updateRange = { offset: this.particleCursor, count: spawnCount };
    (positions as any).needsUpdate = true;
    (velocities as any).needsUpdate = true;
    (startTimes as any).needsUpdate = true;

    this.particleCursor += spawnCount;
  }

  private allocateInstance(): number {
    if (!this.instanceFreeStack || this.instanceFreeStack.length === 0) return -1;
    while (this.instanceFreeStack.length > 0) {
      const idx = this.instanceFreeStack.pop() as number;
      if (idx < this.particleBudget) {
        return idx;
      }
    }
    return -1;
  }

  private registerConsciousParticle(featureName: string | undefined, origin: THREE.Vector3, intensity: number, segmentIntensityBoost: number, nowSeconds: number): void {
    if (!this.synestheticSettings) return;

    const featureKey = featureName || 'sparkle';
    const resonance = Math.max(0, Math.min(1, intensity * segmentIntensityBoost));
    const lifespanBase = this.synestheticSettings?.lifespanSeconds ?? 4.0;
    const particle: ConsciousParticle = {
      id: this.consciousIdCounter++,
      featureKey,
      position: origin.clone(),
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.35, 0.05 + Math.random() * 0.12, (Math.random() - 0.5) * 0.35),
      resonance,
      createdAt: nowSeconds,
      lifespan: Math.max(0.5, lifespanBase * (0.75 + Math.random() * 0.5)),
    };

    this.consciousParticles.push(particle);
    if (this.consciousParticles.length > 256) {
      this.consciousParticles.splice(0, this.consciousParticles.length - 256);
    }
  }

  private freeInstance(idx: number) {
    if (!this.instanceFreeStack) this.instanceFreeStack = [];
    if (this.instanceLifetimes) this.instanceLifetimes[idx] = 0;
    if (this.instanceStartTimes) this.instanceStartTimes[idx] = 0;
    if (idx < this.particleBudget) {
      this.instanceFreeStack.push(idx);
    }
    try {
      if (this.particleInstancedMesh) {
        const geo: any = this.particleInstancedMesh.geometry;
        const posAttr = geo.getAttribute('instancePosition');
        const scaleAttr = geo.getAttribute('instanceScale');
        if (posAttr) {
          const base = idx * 3;
          posAttr.array[base + 0] = 0;
          posAttr.array[base + 1] = -9999;
          posAttr.array[base + 2] = 0;
          posAttr.needsUpdate = true;
        }
        if (scaleAttr) {
          scaleAttr.array[idx] = 0;
          scaleAttr.needsUpdate = true;
        }
      }
    } catch (e) {}
  }
}
