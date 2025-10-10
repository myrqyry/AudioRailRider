import * as THREE from 'three';
import { RIDE_CONFIG } from 'shared/constants';

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

export class ParticleSystem {
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

  constructor(private readonly scene: THREE.Scene) {
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

  public driveReactiveParticles(params: DriveReactiveParticlesParams, trackPulse: number): number {
    if (params.currentLOD === 'low') return trackPulse;
    if (!this.particleInstancedMesh && !this.particleSystem) return trackPulse;

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

    return trackPulse;
  }

  public spawnParticles(count: number, context: SpawnContext) {
    if (!this.particleSystem) return;

    const { origin, feature, audioFeatures, segmentIntensityBoost, nowSeconds } = context;
    const spawnCount = count > 0
      ? Math.min(count, RIDE_CONFIG.PARTICLE_SPAWN_COUNT)
      : RIDE_CONFIG.PARTICLE_SPAWN_COUNT;

    if (this.particleInstancedMesh) {
      this.spawnInstanceBatch(spawnCount, context, nowSeconds);
      return;
    }

    this.spawnPointsBatch(spawnCount, origin, feature, audioFeatures, segmentIntensityBoost, nowSeconds);
  }

  public spawnFeatureBurst(featureName: string, intensity: number, origin: THREE.Vector3, audioFeatures: Record<string, number>, segmentIntensityBoost: number, nowSeconds: number) {
    const scaled = Math.max(0, Math.min(1, intensity));
    const count = Math.max(1, Math.round(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * (0.5 + scaled * 2.0)));
    this.spawnParticles(count, {
      origin,
      feature: featureName,
      audioFeatures,
      segmentIntensityBoost,
      nowSeconds,
    });
  }

  public reclaimExpired(nowSeconds: number) {
    if (!this.particleInstancedMesh || !this.instanceStartTimes || !this.instanceLifetimes) return;
    const dummy = new THREE.Object3D();
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
      const targetSize = RIDE_CONFIG.PARTICLE_BASE_SIZE * (1 + bass * 1.2 * segmentIntensityBoost);
      mat.size = THREE.MathUtils.lerp(mat.size || RIDE_CONFIG.PARTICLE_BASE_SIZE, targetSize, 0.06);
      const targetCol = segmentColorTarget.clone().lerp(baseRailColor, 0.5);
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

      const dummy = new THREE.Object3D();
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
          varying vec3 vColor;
          varying float vFeature;
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
            float tint = 0.15 * (fi - 3.0);
            vColor = instanceColor + vec3(tint, -tint * 0.2, tint * 0.1);

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
          varying vec3 vNormal;
          void main() {
            vec3 n = normalize(vNormal);
            float rim = pow(1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0))), 2.0);
            float brightness = 0.75 + rim * 0.8;
            vec3 color = vColor * brightness;
            float desat = 1.0 - clamp((vFeature - 2.0) * 0.06, 0.0, 0.35);
            color = mix(vec3(dot(color, vec3(0.333))), color, desat);
            gl_FragColor = vec4(color, 1.0);
          }
        `;
      const shaderMat = new THREE.ShaderMaterial({
        uniforms: { posTex: { value: null }, texSize: { value: 0 } },
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
      this.scene.add(this.particleInstancedMesh);
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
    const particleCount = RIDE_CONFIG.PARTICLE_COUNT;
    const positionsAttr = (this.particleSystem!.geometry as THREE.BufferGeometry).attributes.position as any;
    const velocitiesAttr = (this.particleSystem!.geometry as THREE.BufferGeometry).attributes.velocity as any;
    const startTimesAttr = (this.particleSystem!.geometry as THREE.BufferGeometry).attributes.startTime as any;
    const dummy = new THREE.Object3D();

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
    const particleCount = RIDE_CONFIG.PARTICLE_COUNT;

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
    return this.instanceFreeStack.pop() as number;
  }

  private freeInstance(idx: number) {
    if (!this.instanceFreeStack) this.instanceFreeStack = [];
    if (this.instanceLifetimes) this.instanceLifetimes[idx] = 0;
    if (this.instanceStartTimes) this.instanceStartTimes[idx] = 0;
    this.instanceFreeStack.push(idx);
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
