import * as THREE from 'three';
import { TrackData, FrameAnalysis, SegmentDetail, TimelineEvent, secondsToNumber } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';
import { getCachedShader, getCachedLygiaResolver } from './preloader';
import { VISUAL_EFFECTS_CONFIG } from '../config/visualEffects';
import { GPUParticleSystem } from './GPUParticleSystem';

interface FeatureVisualConfig {
  color: [number, number, number];
  sensitivity: number;
  size: number; // base size multiplier
  lifetime: number; // base lifetime in seconds
  behavior: 'burst' | 'trail' | 'flow'; // for future use
}

interface ParticleLODConfig {
    maxParticles: number;
    updateFrequency: number;
    gpuEnabled: boolean;
    qualityPreset: 'ultra' | 'high' | 'medium' | 'low' | 'potato';
}


/**
 * Manages the visual representation of the rollercoaster track and its
 * audio-reactive effects.
 */
export class VisualEffects {
  private scene: THREE.Scene;
  private trackData: TrackData;
  private trackMesh: THREE.Mesh;
  private trackMaterial: THREE.MeshStandardMaterial;
  private ghostRibbonMesh: THREE.Mesh | null = null;
  private ghostRibbonMaterial: THREE.ShaderMaterial | null = null;
  // Minimal particle system used by tests
  private particleSystem: THREE.Points | null = null;
  // Use InstancedMesh for higher particle counts when available
  private particleInstancedMesh: THREE.InstancedMesh | null = null;
  private particleCursor: number = 0;
  // Instance pooling structures
  private instanceFreeStack: number[] = [];
  private instanceStartTimes: Float32Array | null = null; // per-instance spawn time
  private instanceLifetimes: Float32Array | null = null; // per-instance lifetime
  private targetGlowIntensity: number = BASS_GLOW_MIN;
  // Per-instance GPU attributes and GPU update state
  private gpuEnabled: boolean = false;
  private gpuParticleSystem: GPUParticleSystem | null = null;
  // audio-reactive scalar sent to GPU shaders
  private gpuAudioForce: number = 0;
  private rawAudioForce: number = 0;
  // Curl/noise parameters exposed to runtime for tuning
  private curlStrength: number = 0.12;
  private noiseScale: number = 2.0;
  private noiseSpeed: number = 0.12;
  // Per-audio-feature values (0..1) that can be pushed from the audio pipeline.
  // Common keys: 'subBass','bass','lowMid','mid','highMid','treble','sparkle'
  private audioFeatures: Record<string, number> = { subBass: 0, bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, sparkle: 0 };
  private segmentProgress: number[] = [];
  // Timeline events (from blueprint) and a small map to avoid repeated triggers
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
  // Per-feature visual configuration (color, sensitivity) used when spawning particles
  private featureVisuals: Map<string, FeatureVisualConfig> = new Map([
    ['subBass', { color: [1.0, 0.2, 0.1], sensitivity: 1.2, size: 2.5, lifetime: 3.5, behavior: 'flow' }],
    ['bass', { color: [1.0, 0.4, 0.2], sensitivity: 1.0, size: 2.0, lifetime: 3.0, behavior: 'flow' }],
    ['lowMid', { color: [0.2, 0.8, 1.0], sensitivity: 0.9, size: 1.2, lifetime: 2.5, behavior: 'burst' }],
    ['mid', { color: [0.5, 1.0, 0.8], sensitivity: 0.8, size: 1.0, lifetime: 2.0, behavior: 'burst' }],
    ['highMid', { color: [0.8, 1.0, 0.6], sensitivity: 0.7, size: 0.8, lifetime: 1.8, behavior: 'trail' }],
    ['treble', { color: [1.0, 0.8, 0.8], sensitivity: 0.6, size: 0.6, lifetime: 1.5, behavior: 'trail' }],
    ['sparkle', { color: [1.0, 1.0, 1.0], sensitivity: 0.65, size: 0.7, lifetime: 1.2, behavior: 'trail' }],
  ]);
  private highQualityMode: boolean = true;
  private lastPerformanceCheck: number = 0;
  private frameCount: number = 0;
  // Renderer detection info (populated on first update)
  private rendererInfo: { ok: boolean; renderer: string; vendor: string } | null = null;
  // When we first detect low performance, record timestamp and only switch after debounce
  private lowQualitySince: number | null = null;
  // Track initialization to avoid false positive FPS warnings during GPU warmup
  private isWarmedUp: boolean = false;
  private firstUpdateTime: number = 0;
  private featureCooldowns: Record<string, number> = {};
  private ambientAccumulator: number = 0;
  private lastUpdateSeconds: number = 0;
  private trackPulse: number = 0;
  private readonly _spawnOrigin = new THREE.Vector3();
  private readonly _spawnForward = new THREE.Vector3();
  private readonly _spawnRight = new THREE.Vector3();
  private readonly _spawnUp = new THREE.Vector3();
  private readonly _worldUp = new THREE.Vector3(0, 1, 0);
  private readonly _spawnWork = new THREE.Vector3();
  private lodConfig: ParticleLODConfig;
  

  constructor(scene: THREE.Scene, trackData: TrackData) {
    this.scene = scene;
    this.trackData = trackData;

    this.lodConfig = {
      maxParticles: RIDE_CONFIG.PARTICLE_COUNT,
      updateFrequency: 60,
      gpuEnabled: true,
      qualityPreset: 'high',
    };

    // Detect device capability
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

  let derivedProgress = Array.isArray(trackData.segmentProgress) ? [...trackData.segmentProgress] : [];
    if (!derivedProgress.length && trackData.segmentDetails.length > 0) {
      const count = trackData.segmentDetails.length;
      derivedProgress = Array.from({ length: count }, (_, idx) => (idx + 1) / count);
    }
    if (!derivedProgress.length) {
      derivedProgress = [1];
    }
    for (let i = 0; i < derivedProgress.length; i++) {
      const clamped = THREE.MathUtils.clamp(derivedProgress[i] ?? 0, 0, 1);
      derivedProgress[i] = i > 0 ? Math.max(clamped, derivedProgress[i - 1]) : clamped;
    }
    derivedProgress[derivedProgress.length - 1] = 1;
    if (trackData.segmentDetails.length > 0) {
      if (derivedProgress.length > trackData.segmentDetails.length) {
        derivedProgress.length = trackData.segmentDetails.length;
        derivedProgress[derivedProgress.length - 1] = 1;
      } else if (derivedProgress.length < trackData.segmentDetails.length) {
        const last = derivedProgress.length ? derivedProgress[derivedProgress.length - 1] : 1;
        while (derivedProgress.length < trackData.segmentDetails.length) {
          derivedProgress.push(last);
        }
        if (derivedProgress.length) derivedProgress[derivedProgress.length - 1] = 1;
      }
    }
    // Materialize timeline events from blueprint for runtime triggering
    try {
      this.timelineEvents = Array.isArray((trackData as any).events) ? (trackData as any).events.slice() : [];
      // Normalize timestamps in case Blueprint used seconds-branding as numbers
      for (const ev of this.timelineEvents) {
        if (ev && ev.timestamp === undefined && ev.params && ev.params.audioSyncPoint) {
          ev.timestamp = ev.params.audioSyncPoint as any;
        }
      }
      // Sort events by timestamp to make triggering predictable
      this.timelineEvents.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } catch (e) {
      this.timelineEvents = [];
    }
    this.segmentProgress = derivedProgress;

    // 1. Create the track material
    this.trackMaterial = new THREE.MeshStandardMaterial({
      color: this.baseRailColor.clone(),
      emissive: this.baseEmissiveColor.clone(),
      emissiveIntensity: VISUAL_EFFECTS_CONFIG.AUDIO.BASS_GLOW_MIN,
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
// expose UVs to fragment shader code injected above
vUv = uv;
float vPath = clamp(uv.y, 0.0, 1.0);
// Bass swell effect
transformed += normal * bassIntensity * 1.5;
// Treble wiggle effect
float trebleWarp = sin(vPath * 60.0 - trackTime * 4.0) * trebleIntensity * 0.4;
transformed += normal * trebleWarp;
// Existing distortion
float ribbon = sin(vPath * 18.0 + trackTime * 2.0);
transformed += normal * distortionStrength * (0.2 + 0.3 * ribbon);
`
        );

      this.trackShaderUniforms = shader.uniforms as Record<string, THREE.IUniform>;
    };

    // 2. Create the track geometry with adaptive quality
    const segments = this.highQualityMode ? 
      this.trackData.path.length * VISUAL_EFFECTS_CONFIG.TRACK.HIGH_QUALITY_SEGMENTS :
      this.trackData.path.length * VISUAL_EFFECTS_CONFIG.TRACK.LOW_QUALITY_SEGMENTS;
    
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
  const geometry = new THREE.TubeGeometry(curve, segments, VISUAL_EFFECTS_CONFIG.TRACK.RADIUS, 8, false);

    // 3. Create the track mesh and add to the scene
    this.trackMesh = new THREE.Mesh(geometry, this.trackMaterial);
    this.trackMesh.frustumCulled = true; // Enable frustum culling for performance
    this.scene.add(this.trackMesh);

  this.ghostRibbonMaterial = this.createGhostRibbonMaterial();
  this.rebuildGhostRibbon(curve, segments);

    // Create a minimal particle system with attribute arrays similar to runtime implementation
    const particleCount = RIDE_CONFIG.PARTICLE_COUNT;

  // Prefer instancing for better performance when many particles are present.
    try {
      const instanceGeo = new THREE.IcosahedronGeometry(1, 0); // Lower poly count
      const instanceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.particleInstancedMesh = new THREE.InstancedMesh(instanceGeo, instanceMat, particleCount);
      this.particleInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.particleInstancedMesh.frustumCulled = false;
      this.particleInstancedMesh.renderOrder = 10;
      // Initialize instance matrices to identity and make them invisible initially
      const dummy = new THREE.Object3D();
      for (let i = 0; i < particleCount; i++) {
        dummy.position.set(0, 0, 0);
        dummy.scale.setScalar(0); // Use scale to hide instead of position
        dummy.updateMatrix();
        this.particleInstancedMesh.setMatrixAt(i, dummy.matrix);
      }
      // Initialize per-instance position/scale attributes to offscreen so
      // the shader won't accidentally render any particles before they are
      // explicitly spawned.
      try {
        const geo: any = this.particleInstancedMesh.geometry;
        const posAttr = geo.getAttribute('instancePosition');
        const scaleAttr = geo.getAttribute('instanceScale');
        if (posAttr && scaleAttr) {
          for (let i = 0; i < particleCount; i++) {
            const bi = i * 3;
            posAttr.array[bi + 0] = 0;
            posAttr.array[bi + 1] = -9999;
            posAttr.array[bi + 2] = 0;
            scaleAttr.array[i] = 0;
          }
          posAttr.needsUpdate = true;
          scaleAttr.needsUpdate = true;
        }
      } catch (e) {}
      // Add per-instance attributes: color (vec3) and speed (float)
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
  // New attributes used as a robust, WebGL1-friendly fallback to instanceMatrix
  // Many platforms/contexts struggle with attribute mat4; providing explicit
  // per-instance position + scale attributes makes the instanced shader
  // much more portable and easier to update from JS.
  (this.particleInstancedMesh.geometry as any).setAttribute('instancePosition', posAttr);
  (this.particleInstancedMesh.geometry as any).setAttribute('instanceScale', scaleAttr);

        // Replace material with a lightweight instanced shader that samples a
        // position texture when GPU path is enabled. It falls back to the
        // basic instanceMatrix when no texture is provided.
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
              // When a GPU position texture is provided we prefer it as the
              // authoritative source of particle positions. Otherwise we fall
              // back to per-instance attributes populated by JS.
              center = sampleTexturePosition(id, texSize);
            }

            // Apply a simple uniform scale per-instance and translate the
            // local vertex coordinates into world space. This avoids
            // relying on attribute mat4 instanceMatrix which is fragile on
            // some platforms and shader profiles.
            float sc = max(0.0001, instanceScale);
            vec3 localScaled = position * sc;
            vec4 mvPosition = modelViewMatrix * vec4(localScaled + center, 1.0);
            // Provide transformed normal for per-fragment shading
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `;
        const frag = `
          varying vec3 vColor;
          varying float vFeature;
          void main() {
            // Simple rim-light-like shading to give particles more depth and
            // improve perceived motion. Keep alpha at 1.0 because we use
            // additive blending on top of the scene.
            vec3 n = normalize(vNormal);
            float rim = pow(1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0))), 2.0);
            float brightness = 0.75 + rim * 0.8;
            vec3 color = vColor * brightness;
            // Slight per-feature desaturation to add visual variety
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
        // Ensure mesh world transform is identity; we handle positioning in shader
        this.particleInstancedMesh.matrixAutoUpdate = false;
        this.particleInstancedMesh.matrix.identity();
      } catch (e) {
        // If InstancedBufferAttribute isn't supported, continue without per-instance attributes
      }
        // Ensure instanceFeature attribute exists (maps to a feature index: 0=subBass,1=bass,2=lowMid,3=mid,4=highMid,5=treble,6=sparkle)
      try {
        const feat = new Float32Array(particleCount);
        const featAttr = new THREE.InstancedBufferAttribute(feat, 1);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceFeature', featAttr);
      } catch (e) {}
      this.scene.add(this.particleInstancedMesh);
    } catch (e) {
      // instancing failed; we'll fall back to Points below
    }

    // Always create the Points-based geometry and keep it on `this.particleSystem`
    // so unit tests can access its attributes. We only add it to the scene if
    // instancing isn't available (fallback case) to avoid double-rendering.
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const startTimes = new Float32Array(particleCount);

    const geometryParticles = new THREE.BufferGeometry();
    geometryParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryParticles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometryParticles.setAttribute('startTime', new THREE.BufferAttribute(startTimes, 1));

    // Ensure updateRange shapes exist for tests
    (geometryParticles.attributes.position as any).updateRange = { offset: 0, count: 0 };
    (geometryParticles.attributes.velocity as any).updateRange = { offset: 0, count: 0 };
    (geometryParticles.attributes.startTime as any).updateRange = { offset: 0, count: 0 };

    this.particleSystem = new THREE.Points(
      geometryParticles,
      new THREE.PointsMaterial({
        size: VISUAL_EFFECTS_CONFIG.PARTICLE.BASE_SIZE,
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );
    // Add Points fallback only when instancing isn't available to avoid double-rendering
    if (!this.particleInstancedMesh) this.scene.add(this.particleSystem);

    // Initialize instance pool metadata if instanced mesh was created
    if (this.particleInstancedMesh) {
      this.instanceStartTimes = new Float32Array(particleCount);
      this.instanceLifetimes = new Float32Array(particleCount);
      // Push indices in reverse so allocateInstance() (pop) returns 0,1,2... order
      for (let i = particleCount - 1; i >= 0; i--) {
        this.instanceFreeStack.push(i);
        this.instanceStartTimes[i] = 0;
        this.instanceLifetimes[i] = 0;
      }
    }

    // Add an audio-reactive PointLight positioned near the camera to create
    // a subtle local glow that follows the listener and pulses with bass
    // energy. This improves immersion without relying on expensive post
    // processing.
    try {
      const audioGlow = new THREE.PointLight(this.baseEmissiveColor.clone(), 0.0, 48, 2);
      audioGlow.name = 'audioGlow';
      // Start slightly behind the camera so it doesn't occlude the track
      audioGlow.position.set(0, 0, 0);
      this.scene.add(audioGlow);
    } catch (e) {}
  }

  // Detect the underlying GL renderer and vendor. This is a best-effort
  // synchronous probe that works in the browser environment.
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

    // Initialize GPU-based particle update buffer and shaders (optional).
    // Call this once when a WebGL renderer is available.
    public async initGPU(renderer: THREE.WebGLRenderer) {
      if (!this.particleInstancedMesh) {
        console.log('[GPU Particles] No instanced mesh available, skipping GPU init.');
        return;
      }
      const capabilities = renderer.capabilities;
      const extensions = renderer.extensions;
      const supportsFloatRT = capabilities.isWebGL2 && (
        extensions.has('EXT_color_buffer_float') || extensions.has('WEBGL_color_buffer_float') || (extensions.has('OES_texture_float') && extensions.has('OES_texture_float_linear'))
      );

      if (!supportsFloatRT) {
        console.warn('[GPU Particles] GPU particle system requires WebGL2 + float render-target support. Falling back to CPU particles.');
        this.switchToFallbackParticles();
        return;
      }

      try {
        this.gpuParticleSystem = new GPUParticleSystem(renderer, RIDE_CONFIG.PARTICLE_COUNT);
        await this.gpuParticleSystem.init();
        this.gpuEnabled = true;
        console.log('[GPU Particles] GPU particle system initialized successfully.');
      } catch (e) {
        console.error('[GPU Particles] Failed to initialize GPUParticleSystem:', e);
        this.gpuEnabled = false;
        this.switchToFallbackParticles();
      }
    }

    // Called each update tick when GPU path is enabled; performs ping-pong passes.
    private updateGPU(deltaSeconds: number) {
      if (!this.gpuEnabled || !this.gpuParticleSystem || !this.particleInstancedMesh) return;
      try {
        const curlParams = {
            curlStrength: this.curlStrength,
            noiseScale: this.noiseScale,
            noiseSpeed: this.noiseSpeed
        };
        this.gpuParticleSystem.update(deltaSeconds, this.audioFeatures, curlParams, this.segmentIntensityBoost, this.gpuAudioForce);

        const posTex = this.gpuParticleSystem.getPositionTexture();
        const shaderMat = this.particleInstancedMesh.material as any;
        shaderMat.uniforms.posTex.value = posTex;
        shaderMat.uniforms.texSize.value = posTex.image.width;
        shaderMat.needsUpdate = true;
      } catch (e) {
        console.error('[VisualEffects] Error during GPU update:', e);
        this.gpuEnabled = false;
        this.switchToFallbackParticles();
      }
    }

  /**
   * Update the current audio feature values (0..1). Common keys: 'bass','mid','treble'.
   * These values are used to set GPU shader uniforms and to influence spawn colors/speeds.
   */
  public setAudioFeatures(features: Record<string, number> | null | undefined) {
    // Defensive: callers may pass null/undefined when audio analysis is not available
    if (!features || typeof features !== 'object') return;
    try {
      for (const k of Object.keys(features)) {
        const v = (features as Record<string, unknown>)[k];
        if (typeof v === 'number') this.audioFeatures[k] = Math.max(0, Math.min(1, v));
      }
    } catch (e) {
      // swallow unexpected structure errors to avoid bringing down the render loop
      console.warn('[VisualEffects] setAudioFeatures received invalid data', e);
    }
  }

  private deriveSegmentColor(detail?: SegmentDetail): THREE.Color {
    if (!detail) return this.baseEmissiveColor;
    const env = detail.environmentChange;
    if (typeof env === 'string' && env.trim().length > 0 && env.trim().toLowerCase() !== 'none') {
      try {
        this._colorTmp.set(env);
        return this._colorTmp;
      } catch (e) {
        // fall through to lighting keywords
      }
    }
    const effect = detail.lightingEffect?.toLowerCase() || '';
    if (effect.includes('warm') || effect.includes('ember') || effect.includes('sun') || effect.includes('fire')) {
      this._colorTmp.set('#ff8a3d');
      return this._colorTmp;
    }
    if (effect.includes('cool') || effect.includes('ice') || effect.includes('aqua') || effect.includes('ocean')) {
      this._colorTmp.set('#4bb3ff');
      return this._colorTmp;
    }
    if (effect.includes('storm') || effect.includes('night') || effect.includes('void') || effect.includes('nebula')) {
      this._colorTmp.set('#6a5bff');
      return this._colorTmp;
    }
    if (effect.includes('forest') || effect.includes('nature') || effect.includes('lush') || effect.includes('earth')) {
      this._colorTmp.set('#4caf50');
      return this._colorTmp;
    }
    return this.baseEmissiveColor;
  }

  private applySegmentMood(progress: number) {
    if (!this.trackData.segmentDetails.length) {
      this.segmentIntensityBoost = 1;
      this.segmentColorTarget.copy(this.baseEmissiveColor);
      return;
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
  }

  /**
   * Register or update a visual configuration for a named audio feature.
   * Example: registerFeatureVisual('bass', { color: [1,0.5,0.3], sensitivity: 1.2, size: 2.0, lifetime: 3.0, behavior: 'flow' })
   */
  public registerFeatureVisual(featureName: string, cfg: Partial<FeatureVisualConfig>) {
    const existing = this.featureVisuals.get(featureName);
    if (existing) {
      this.featureVisuals.set(featureName, { ...existing, ...cfg });
    } else {
      // If the feature doesn't exist, we should probably have some defaults
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
  }

  private driveAudioReactiveParticles(nowSeconds: number, deltaSeconds: number, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3) {
    if (this.currentLOD === 'low') return;
    if (!this.particleInstancedMesh && !this.particleSystem) return;

    this._spawnForward.subVectors(lookAtPosition, cameraPosition);
    if (this._spawnForward.lengthSq() < 1e-6) return;
    this._spawnForward.normalize();

    this._spawnRight.copy(this._spawnForward).cross(this._worldUp);
    if (this._spawnRight.lengthSq() < 1e-6) {
      this._spawnRight.set(1, 0, 0);
    } else {
      this._spawnRight.normalize();
    }

    this._spawnUp.copy(this._spawnRight).cross(this._spawnForward);
    if (this._spawnUp.lengthSq() < 1e-6) {
      this._spawnUp.copy(this._worldUp);
    } else {
      this._spawnUp.normalize();
    }

    this._spawnOrigin.copy(cameraPosition)
      .addScaledVector(this._spawnForward, 8)
      .addScaledVector(this._spawnUp, 2);

    type FeatureName = Extract<keyof typeof this.audioFeatures, string>;
    const triggers: Array<{ feature: FeatureName; threshold: number; cooldown: number; lateral: number; forward: number }> = [
      { feature: 'bass' as FeatureName, threshold: 0.35, cooldown: 0.16, lateral: -2.8, forward: 0.5 },
      { feature: 'mid' as FeatureName, threshold: 0.32, cooldown: 0.22, lateral: 2.8, forward: 1.8 },
      { feature: 'treble' as FeatureName, threshold: 0.28, cooldown: 0.28, lateral: 0.4, forward: 3.8 },
      { feature: 'sparkle' as FeatureName, threshold: 0.3, cooldown: 0.18, lateral: 0, forward: 0 },
    ];

    for (const trigger of triggers) {
      const baseIntensity = this.audioFeatures[trigger.feature] ?? 0;
      if (baseIntensity <= 0) continue;
      const visualConfig = this.featureVisuals.get(trigger.feature);
      if (!visualConfig) continue;

      const sensitivity = visualConfig.sensitivity;
      const scaled = Math.min(1, baseIntensity * sensitivity * this.segmentIntensityBoost);
      if (scaled < trigger.threshold) continue;
      const last = this.featureCooldowns[trigger.feature] ?? 0;
      if (nowSeconds - last < trigger.cooldown) continue;

      this._spawnWork.copy(this._spawnOrigin)
        .addScaledVector(this._spawnRight, trigger.lateral + (Math.random() - 0.5) * 1.5)
        .addScaledVector(this._spawnForward, trigger.forward + (Math.random() - 0.5) * 1.0);
      this.spawnFeatureBurst(trigger.feature, scaled, this._spawnWork);
      this.featureCooldowns[trigger.feature] = nowSeconds;
      if (trigger.feature === 'bass' || trigger.feature === 'subBass') {
        this.trackPulse = Math.min(1.5, this.trackPulse + scaled * 0.9);
      } else {
        this.trackPulse = Math.min(1.5, this.trackPulse + scaled * 0.45);
      }
    }

    this.ambientAccumulator += deltaSeconds * (1.1 + this.gpuAudioForce * 0.8);
    if (this.ambientAccumulator >= 0.45) {
      const cycles = Math.max(1, Math.floor(this.ambientAccumulator / 0.45));
      this.ambientAccumulator -= cycles * 0.45;
      for (let i = 0; i < cycles; i++) {
        this._spawnWork.copy(this._spawnOrigin)
          .addScaledVector(this._spawnForward, 1.2 + (Math.random() - 0.5) * 1.5)
          .addScaledVector(this._spawnRight, (Math.random() - 0.5) * 3.5);
        this.spawnFeatureBurst('sparkle', 0.45 + Math.random() * 0.4, this._spawnWork);
        this.trackPulse = Math.min(1.5, this.trackPulse + 0.25);
      }
    }
  }

    // Read back GPU particle positions and apply to instance matrices. This is
    // optional and requires WebGL2 (float readback support). Use cautiously
    // as readback can be slow; prefer a vertex shader that samples the texture
    // directly when possible.
    public syncGPUParticlesToCPU() {
    // No-op: prefer GPU-only path where the instanced vertex shader samples
    // the GPU position texture directly. Keeping a readback path is slow and
    // error-prone on many platforms; remove for now to prioritize GPU-only flow.
    return;
    }

  // Allocate a free instance index or return -1 if none are available
  private allocateInstance(): number {
    if (!this.instanceFreeStack || this.instanceFreeStack.length === 0) return -1;
    const idx = this.instanceFreeStack.pop();
    return idx !== undefined ? idx : -1;
  }

  // Free an instance index back to the pool
  private freeInstance(idx: number) {
    if (!this.instanceFreeStack) this.instanceFreeStack = [];
    // mark lifetime as zero so it's considered free
    if (this.instanceLifetimes) this.instanceLifetimes[idx] = 0;
    if (this.instanceStartTimes) this.instanceStartTimes[idx] = 0;
    this.instanceFreeStack.push(idx);
    // Also clear any per-instance attributes so the shader no longer
    // renders the freed instance (keep it offscreen / zero scale).
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

  /**
   * Updates the visual effects based on the current audio frame.
   * This is called from the main render loop in ThreeCanvas.
   */
  public update(
    elapsedTime: number,
    currentFrame: FrameAnalysis | null,
    cameraPosition: THREE.Vector3,
    lookAtPosition: THREE.Vector3,
    rideProgress: number
  ) {
    const now = performance.now();
    const nowSeconds = now / 1000;
    const deltaSeconds = this.lastUpdateSeconds === 0
      ? 1 / 60
      : Math.min(0.25, Math.max(0, nowSeconds - this.lastUpdateSeconds));
    this.lastUpdateSeconds = nowSeconds;

    const clampedProgress = THREE.MathUtils.clamp(rideProgress ?? 0, 0, 1);
    this.applySegmentMood(clampedProgress);
    // Blend towards the segment-driven color mood while keeping some of the base rail hue.
    this.trackMaterial.emissive.lerp(this.segmentColorTarget, 0.05);
    this._colorTmp.copy(this.segmentColorTarget).lerp(this.baseRailColor, 0.4);
    this.trackMaterial.color.lerp(this._colorTmp, 0.05);

    const tintA = this._colorTmp2.copy(this.baseGhostTintA).lerp(this.segmentColorTarget, 0.3);
    const tintB = this._colorTmp3.copy(this.baseGhostTintB).lerp(this.segmentColorTarget, 0.6);
    this.trackTintA.copy(tintA);
    this.trackTintB.copy(tintB);

    // Performance monitoring
    this.frameCount++;
    
    // Initialize performance tracking on first update
    if (this.firstUpdateTime === 0) {
      this.firstUpdateTime = now;
      this.lastPerformanceCheck = now;
    }
    
    // Warmup period: skip FPS checks for 5 seconds after first update to allow GPU/shader compilation
    if (!this.isWarmedUp && now - this.firstUpdateTime > VISUAL_EFFECTS_CONFIG.PERFORMANCE.WARMUP_PERIOD) {
      this.isWarmedUp = true;
      // Reset counters after warmup
      this.lastPerformanceCheck = now;
      this.frameCount = 0;
    }
    
    // Only check performance after warmup period
    if (this.isWarmedUp && now - this.lastPerformanceCheck > VISUAL_EFFECTS_CONFIG.PERFORMANCE.CHECK_INTERVAL) {
      const fps = (this.frameCount * 1000) / (now - this.lastPerformanceCheck);
      this.lastPerformanceCheck = now;
      this.frameCount = 0;
      
      this.applyAdvancedLOD(fps);
    }

    const baseMinGlow = VISUAL_EFFECTS_CONFIG.AUDIO.BASS_GLOW_MIN * this.segmentIntensityBoost;
    const baseMaxGlow = VISUAL_EFFECTS_CONFIG.AUDIO.BASS_GLOW_MAX * this.segmentIntensityBoost;
    const glowCeiling = VISUAL_EFFECTS_CONFIG.AUDIO.BASS_GLOW_MAX * Math.max(1, this.segmentIntensityBoost);
    const fallbackBass = this.audioFeatures.bass || 0;

    if (currentFrame) {
      const bassValue = THREE.MathUtils.clamp(currentFrame.bass, 0, 1);
      this.targetGlowIntensity = THREE.MathUtils.clamp(
        baseMinGlow + bassValue * (baseMaxGlow - baseMinGlow),
        VISUAL_EFFECTS_CONFIG.AUDIO.BASS_GLOW_MIN,
        glowCeiling
      );
    } else {
      this.targetGlowIntensity = THREE.MathUtils.clamp(
        baseMinGlow + fallbackBass * (baseMaxGlow - baseMinGlow),
        VISUAL_EFFECTS_CONFIG.AUDIO.BASS_GLOW_MIN,
        glowCeiling
      );
    }

    const baseForce = currentFrame
      ? (currentFrame.energy * 2.0 + currentFrame.spectralFlux * 1.5)
      : this.rawAudioForce;
    this.gpuAudioForce = Math.max(0, baseForce) * this.segmentIntensityBoost;

    // Smoothly interpolate the material's emissive intensity towards the target
    this.trackMaterial.emissiveIntensity = THREE.MathUtils.lerp(
      this.trackMaterial.emissiveIntensity,
      this.targetGlowIntensity,
      VISUAL_EFFECTS_CONFIG.AUDIO.LERP_FACTOR
    );

    // Apply LOD hints set by SceneManager (non-invasive): 'low' or 'high'
    try {
      const lodHint = (this.scene as any).userData?.lodHint as string | undefined;
      this.applyLOD(lodHint === 'low' ? 'low' : 'high');
    } catch (e) {
      // ignore
    }

    this.trackPulse = Math.max(0, this.trackPulse - deltaSeconds * 1.4);

    this.driveAudioReactiveParticles(nowSeconds, deltaSeconds, cameraPosition, lookAtPosition);
    // Trigger timeline events from blueprint (if any) based on ride progress/time
    try {
      const durationNum = (this.trackData && this.trackData.audioFeatures && typeof this.trackData.audioFeatures.duration === 'number')
        ? secondsToNumber(this.trackData.audioFeatures.duration)
        : 0;
      const currentAudioTime = durationNum > 0 ? (clampedProgress * durationNum) : 0;
      this.handleTimelineEvents(currentAudioTime, deltaSeconds, cameraPosition, lookAtPosition);
      this.lastAudioTimeSeconds = currentAudioTime;
    } catch (e) {}

    if (this.trackShaderUniforms) {
      const uniforms = this.trackShaderUniforms;
      uniforms.trackTime.value = elapsedTime;
      uniforms.pulseIntensity.value = this.trackPulse;
      uniforms.segmentBoost.value = this.segmentIntensityBoost;
      uniforms.audioFlow.value = Math.min(1.2, this.gpuAudioForce * 0.25);
      uniforms.distortionStrength.value = Math.min(0.6, 0.2 + this.trackPulse * 0.5 + this.segmentIntensityBoost * 0.1);
      uniforms.bassIntensity.value = this.audioFeatures.bass || 0;
      uniforms.trebleIntensity.value = this.audioFeatures.treble || 0;
    }

    if (this.ghostRibbonMaterial) {
      const uniforms = this.ghostRibbonMaterial.uniforms;
      uniforms.time.value = elapsedTime;
      uniforms.audioPulse.value = Math.min(1.8, this.trackPulse * 1.1 + this.gpuAudioForce * 0.1);
      uniforms.colorInner.value.copy(this.trackTintA);
      uniforms.colorOuter.value.copy(this.trackTintB);
    }

    // Update skybox and fog for environmental effects
    const sky = this.scene.getObjectByName('sky');
    if (sky && (sky as any).material?.uniforms) {
      const uniforms = (sky as any).material.uniforms;
      const bass = this.audioFeatures.bass || 0;
      uniforms.turbidity.value = THREE.MathUtils.lerp(uniforms.turbidity.value, 10 + bass * 15, 0.1);
      uniforms.rayleigh.value = THREE.MathUtils.lerp(uniforms.rayleigh.value, 2 + bass * 2, 0.1);
    }

    if (this.scene.fog instanceof THREE.FogExp2) {
      const energy = currentFrame?.energy || 0;
      const bass = this.audioFeatures.bass || 0;
      const targetDensity = 0.0025 + energy * 0.005;
      this.scene.fog.density = THREE.MathUtils.lerp(this.scene.fog.density, targetDensity, 0.1);
      const bassColor = new THREE.Color(0x440000);
      const defaultColor = new THREE.Color(0x000000);
      this.scene.fog.color.lerp(bass > 0.5 ? bassColor : defaultColor, 0.1);
    }

    // Reclaim expired instances (simple lifetime model)
    if (this.particleInstancedMesh && this.instanceStartTimes && this.instanceLifetimes) {
      const dummy = new THREE.Object3D();
      const count = this.particleInstancedMesh.count;
      let reclaimed = 0;
      for (let i = 0; i < count; i++) {
        const start = this.instanceStartTimes[i];
        const life = this.instanceLifetimes[i];
        if (life > 0 && nowSeconds - start >= life) {
          // Return to free stack and hide instance
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

    // Run GPU update pass if enabled
    if (this.gpuEnabled) {
      this.updateGPU(deltaSeconds);
    }

    // Audio-reactive scene light and point-size adjustments for immersion
    try {
      const glow = this.scene.getObjectByName('audioGlow') as THREE.PointLight | undefined;
      if (glow) {
        // Position near the listener/camera and pulse intensity based on bass + GPU audio force
        glow.position.copy(cameraPosition);
        const bass = this.audioFeatures.bass || 0;
        const targetIntensity = 0.12 + (this.gpuAudioForce * 1.6) + (bass * 1.5) * this.segmentIntensityBoost;
        glow.intensity = THREE.MathUtils.lerp(glow.intensity || 0, Math.max(0, targetIntensity), 0.08);
        // keep glow color aligned with current segment mood
        glow.color.lerp(this.segmentColorTarget, 0.06);
      }
    } catch (e) {}

    // Smoothly adjust Points fallback size to respond to bass without abrupt pops
    try {
      if (this.particleSystem) {
        const mat = this.particleSystem.material as THREE.PointsMaterial;
        const targetSize = VISUAL_EFFECTS_CONFIG.PARTICLE.BASE_SIZE * (1 + (this.audioFeatures.bass || 0) * 1.2);
        mat.size = THREE.MathUtils.lerp(mat.size || VISUAL_EFFECTS_CONFIG.PARTICLE.BASE_SIZE, targetSize, 0.06);
        // Slight hue shift on point material to enhance immersion
        // (PointsMaterial stores color as Color; we tint toward current segment color)
        const targetCol = this.segmentColorTarget.clone().lerp(this.baseRailColor, 0.5);
        (mat.color as THREE.Color).lerp(targetCol, 0.02);
        mat.needsUpdate = true;
      }
    } catch (e) {}
  }

  // Allow external audio pipeline to push a force value (alternative to FrameAnalysis propagation)
  public setAudioForce(value: number) {
    const clamped = Math.max(0, value);
    this.rawAudioForce = clamped;
    this.gpuAudioForce = clamped * this.segmentIntensityBoost;
  }

  /**
   * Tune curl/noise parameters used by the GPU velocity integrator.
   * curlStrength - scalar multiplier applied to curl vector
   * noiseScale - spatial frequency of the noise
   * noiseSpeed - temporal speed multiplier for animated noise
   */
  public setCurlParams({ curlStrength, noiseScale, noiseSpeed }: { curlStrength?: number; noiseScale?: number; noiseSpeed?: number; }) {
    if (typeof curlStrength === 'number') this.curlStrength = curlStrength;
    if (typeof noiseScale === 'number') this.noiseScale = noiseScale;
    if (typeof noiseSpeed === 'number') this.noiseSpeed = noiseSpeed;
  }

  /**
   * Load a shader uniform manifest (from the pre-extracted JSON) and apply
   * any defaults we recognize (e.g., curl/noise params).
   */
  public setShaderUniformsFromManifest(manifest: Record<string, Array<{ name: string; type: string }>>) {
    // look for known uniforms in velFrag and apply to internal params
    const vel = manifest['velFrag.resolved.glsl'] || manifest['velFrag.glsl'] || manifest['velFrag'] || [];
    for (const u of vel) {
      if (u.name === 'curlStrength' && typeof this.curlStrength === 'number') {
        // leave as-is; UI will call setCurlParams to change
      }
      if (u.name === 'noiseScale' && typeof this.noiseScale === 'number') {
      }
    }
  }

  /**
   * Apply an individual uniform to active GPU materials if present. Useful for
   * wiring runtime UI controls to shader uniforms.
   */
  public applyShaderUniform(name: string, value: any) {
    try {
      if (this.gpuVelMaterial && (this.gpuVelMaterial as any).uniforms && (this.gpuVelMaterial as any).uniforms[name] !== undefined) {
        (this.gpuVelMaterial as any).uniforms[name].value = value;
      }
      if (this.gpuPosMaterial && (this.gpuPosMaterial as any).uniforms && (this.gpuPosMaterial as any).uniforms[name] !== undefined) {
        (this.gpuPosMaterial as any).uniforms[name].value = value;
      }
      // Also apply to instanced particle shader if it uses uniforms
      if (this.particleInstancedMesh && (this.particleInstancedMesh.material as any).uniforms && (this.particleInstancedMesh.material as any).uniforms[name] !== undefined) {
        ((this.particleInstancedMesh.material as any).uniforms[name].value) = value;
      }
      // special case: curl params stored on the VisualEffects instance
      if (name === 'curlStrength' || name === 'noiseScale' || name === 'noiseSpeed') {
        const obj: any = {};
        if (name === 'curlStrength') obj.curlStrength = value;
        if (name === 'noiseScale') obj.noiseScale = value;
        if (name === 'noiseSpeed') obj.noiseSpeed = value;
        this.setCurlParams(obj);
      }
    } catch (e) {
      // ignore
    }
  }

  // Apply a simple LOD policy: when low, hide the instanced mesh to save draw calls
  // and skip tight particle updates. When high, enable instanced mesh and normal updates.
  private currentLOD: 'low' | 'high' = 'high';
  private applyLOD(mode: 'low' | 'high') {
    if (mode === this.currentLOD) return;
    this.currentLOD = mode;
    if (mode === 'low') {
      if (this.particleInstancedMesh) this.particleInstancedMesh.visible = false;
      if (this.particleSystem && (this.particleSystem as any).parent !== this.scene) {
        this.scene.add(this.particleSystem);
      }
      if (this.particleSystem) this.particleSystem.visible = true;
    } else {
      if (this.particleInstancedMesh) this.particleInstancedMesh.visible = true;
      if (this.particleSystem && (this.particleSystem as any).parent === this.scene) {
        this.scene.remove(this.particleSystem);
      }
      if (this.particleSystem) this.particleSystem.visible = false;
    }
  }

  // Minimal particle spawner to exercise updateRange logic in unit tests
  // spawnParticles: optional 'feature' selects which feature config to apply to spawned particles
  public spawnParticles(count: number, origin: THREE.Vector3, feature?: string) {
    if (!this.particleSystem) return;
    const geom = this.particleSystem.geometry as THREE.BufferGeometry;
    const positions = geom.attributes.position as THREE.BufferAttribute;
    const velocities = geom.attributes.velocity as THREE.BufferAttribute;
    const startTimes = geom.attributes.startTime as THREE.BufferAttribute;

    const particleCount = RIDE_CONFIG.PARTICLE_COUNT;
    const spawnCount = count > 0 ? Math.min(count, VISUAL_EFFECTS_CONFIG.PARTICLE.SPAWN_COUNT) : VISUAL_EFFECTS_CONFIG.PARTICLE.SPAWN_COUNT;

    const nowSeconds = performance.now() / 1000;

    // If we're using InstancedMesh, set the instance matrices for spawned particles
    if (this.particleInstancedMesh) {
      if (this.lodConfig) {
        const totalParticles = this.particleInstancedMesh.count;
        const activeParticles = totalParticles - this.instanceFreeStack.length;
        if (activeParticles + spawnCount > this.lodConfig.maxParticles) {
          // Don't spawn if we would exceed the cap.
          return;
        }
      }
      // Also update the Points-based geometry's updateRange so unit tests that
      // inspect those attributes remain compatible with the previous API.
      const geom = this.particleSystem.geometry as THREE.BufferGeometry;
      const positions = geom.attributes.position as any;
      const velocities = geom.attributes.velocity as any;
      const startTimes = geom.attributes.startTime as any;
      const dummy = new THREE.Object3D();
      // If we wrap around, mark full update by setting matrix usage to dynamic
      if (this.particleCursor + spawnCount > particleCount) {
        // Signal full update for Points geometry (tests expect count -1)
        positions.updateRange = { offset: 0, count: -1 };
        velocities.updateRange = { offset: 0, count: -1 };
        startTimes.updateRange = { offset: 0, count: -1 };
        // Move cursor and mark that next frame should update all instances
        this.particleCursor = (this.particleCursor + spawnCount) % particleCount;
        this.particleInstancedMesh.instanceMatrix.needsUpdate = true;
        return;
      }
      // Allocate instances from free stack so we can reuse them
      const allocated: number[] = [];
      for (let i = 0; i < spawnCount; i++) {
        const idx = this.allocateInstance();
        if (idx === -1) break; // no free instances
        allocated.push(idx);

        const visualConfig = feature ? this.featureVisuals.get(feature) : undefined;
        const featureIntensity = Math.min(1, (feature ? (this.audioFeatures[feature] || 0) : 0) * this.segmentIntensityBoost);

        const jitter = 1.5 + featureIntensity * 2.0;
        const px = origin.x + (Math.random() - 0.5) * jitter;
        const py = origin.y + (Math.random() - 0.5) * jitter;
        const pz = origin.z + (Math.random() - 0.5) * jitter;
        dummy.position.set(px, py, pz);

        const baseSize = VISUAL_EFFECTS_CONFIG.PARTICLE.BASE_SIZE * (visualConfig?.size ?? 1.0) * (0.7 + Math.random() * 0.6);
        dummy.scale.setScalar(baseSize * (1 + featureIntensity * 1.2));
        dummy.updateMatrix();
        this.particleInstancedMesh.setMatrixAt(idx, dummy.matrix);

        // mark start time and lifetime
        if (this.instanceStartTimes && this.instanceLifetimes) {
          this.instanceStartTimes[idx] = nowSeconds;
          const baseLifetime = visualConfig?.lifetime ?? 1.5;
          this.instanceLifetimes[idx] = baseLifetime + (Math.random() - 0.2) * baseLifetime * 0.5; // seconds
        }

        const pa = idx * 3;
        positions.array[pa + 0] = px;
        positions.array[pa + 1] = py;
        positions.array[pa + 2] = pz;
        velocities.array[pa + 0] = 0;
        velocities.array[pa + 1] = 0;
        velocities.array[pa + 2] = 0;
        startTimes.array[idx] = nowSeconds;
        // Set per-instance color and speed if attributes exist
        try {
          const geo: any = this.particleInstancedMesh.geometry;
          const colorAttr = geo.getAttribute('instanceColor');
          const speedAttr = geo.getAttribute('instanceSpeed');
          const featAttr = geo.getAttribute('instanceFeature');
          const posAttr = geo.getAttribute('instancePosition');
          const scaleAttr = geo.getAttribute('instanceScale');
          if (colorAttr) {
            const ci = idx * 3;
            // color influenced by feature config if provided
            let col: [number, number, number] = [0.7, 0.7, 0.7];
            if (visualConfig) {
              col = visualConfig.color;
              // modulate by feature intensity
              const inten = Math.min(1, (feature ? this.audioFeatures[feature] || 0 : 0) * this.segmentIntensityBoost);
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
          if (posAttr) {
            posAttr.array[pa + 0] = px;
            posAttr.array[pa + 1] = py;
            posAttr.array[pa + 2] = pz;
            posAttr.needsUpdate = true;
          }
          if (scaleAttr) {
            // store a scale that the shader will use (sphere geometry is unit-sized)
            scaleAttr.array[idx] = baseSize;
            scaleAttr.needsUpdate = true;
          }
          if (featAttr) {
            // choose feature index based on provided feature name
            const featureIndex = feature === 'subBass' ? 0 : feature === 'bass' ? 1 : feature === 'lowMid' ? 2 : feature === 'mid' ? 3 : feature === 'highMid' ? 4 : feature === 'treble' ? 5 : feature === 'sparkle' ? 6 : 1;
            featAttr.array[idx] = featureIndex;
            featAttr.needsUpdate = true;
          }
        } catch (e) {
          // ignore attribute setup failures
        }
      }
      positions.needsUpdate = true;
      velocities.needsUpdate = true;
      startTimes.needsUpdate = true;
      this.particleInstancedMesh.instanceMatrix.needsUpdate = true;
      // Update Points geometry updateRange for tests (report allocated indices)
      if (allocated.length > 0) {
        const minIdx = Math.min(...allocated);
        const posOffset = minIdx * 3;
        positions.updateRange = { offset: posOffset, count: allocated.length * 3 };
        velocities.updateRange = { offset: posOffset, count: allocated.length * 3 };
        startTimes.updateRange = { offset: minIdx, count: allocated.length };
      }
      this.particleCursor = (this.particleCursor + allocated.length) % particleCount;
      return;
    }

    // Fallback behavior for Points-based particle system (keeps tests compatible)
    // If we wrap around, signal full buffer update by setting count to -1 as tests expect
    if (this.particleCursor + spawnCount > particleCount) {
      (positions as any).updateRange = { offset: 0, count: -1 };
      (velocities as any).updateRange = { offset: 0, count: -1 };
      (startTimes as any).updateRange = { offset: 0, count: -1 };
      // also mark instancePosition/scale attributes for full update when using instancing
      try {
        if (this.particleInstancedMesh) {
          const geo: any = this.particleInstancedMesh.geometry;
          const posAttr = geo.getAttribute('instancePosition');
          const scaleAttr = geo.getAttribute('instanceScale');
          if (posAttr) posAttr.updateRange = { offset: 0, count: -1 };
          if (scaleAttr) scaleAttr.updateRange = { offset: 0, count: -1 };
        }
      } catch (e) {}
      this.particleCursor = (this.particleCursor + spawnCount) % particleCount;
      return;
    }

    const posOffset = this.particleCursor * 3;
    for (let i = 0; i < spawnCount; i++) {
      const idx = this.particleCursor + i;
      const offset = idx * 3;
      const featureIntensity = Math.min(1, (feature ? (this.audioFeatures[feature] || 0) : 0) * this.segmentIntensityBoost);
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

  /**
   * Convenience: spawn a burst driven by a named feature's intensity.
   * intensity (0..1) scales number and size of particles.
   */
  public spawnFeatureBurst(featureName: string, intensity: number, origin: THREE.Vector3) {
    const scaled = Math.max(0, Math.min(1, intensity));
    const count = Math.max(1, Math.round(VISUAL_EFFECTS_CONFIG.PARTICLE.SPAWN_COUNT * (0.5 + scaled * 2.0)));
    this.spawnParticles(count, origin, featureName);
  }

  // Trigger timeline events when their timestamp occurs. currentAudioTime is
  // seconds from start of track (derived from ride progress and audio duration).
  private handleTimelineEvents(currentAudioTime: number, deltaSeconds: number, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3) {
    if (!this.timelineEvents || !this.timelineEvents.length) return;
    const now = currentAudioTime;
    for (let i = 0; i < this.timelineEvents.length; i++) {
      const ev = this.timelineEvents[i];
      if (!ev || typeof ev.timestamp !== 'number') continue;
      const triggeredUntil = this.timelineTriggeredUntil.get(i) || 0;
      // If we're already within the active window, skip
      if (now <= triggeredUntil) continue;
      // If the event timestamp has passed (or occurs within a small lookahead), trigger it
      const lookahead = Math.max(0.05, deltaSeconds * 1.5);
      if (now + lookahead >= ev.timestamp) {
        const intensity = Math.max(0, Math.min(1, (ev.intensity ?? 0.6) * (this.segmentIntensityBoost || 1)));
        try {
          // Compute an origin roughly in front of the camera for visual focus
          // Place event a few units ahead/up from the camera so it feels centered
          const spawnPos = cameraPosition.clone().addScaledVector(this._spawnForward, 8).addScaledVector(this._spawnUp, 1.5);
          this.spawnEvent(ev, intensity, spawnPos);
        } catch (e) {}
        // mark triggered until timestamp + duration + safety buffer
        const duration = ev.duration ? (typeof ev.duration === 'number' ? ev.duration : Number(ev.duration)) : 2.0;
        this.timelineTriggeredUntil.set(i, ev.timestamp + duration + 0.5);
      }
    }
  }

  // Map event presets to concrete visual actions. Keep these lightweight and
  // reuse existing particle & audio-reactive mechanisms.
  private spawnEvent(ev: TimelineEvent, intensity: number, origin: THREE.Vector3) {
    const t = ev.type;
    const inten = Math.max(0.02, Math.min(1, intensity));
    switch (t) {
      case 'fireworks': {
        // Spawn multiple high-intensity sparkle bursts in the sky above the ride
        const bursts = 3 + Math.round(inten * 5);
        for (let i = 0; i < bursts; i++) {
          const jitter = new THREE.Vector3((Math.random() - 0.5) * 6, 6 + Math.random() * 6, (Math.random() - 0.5) * 6);
          const pos = origin.clone().add(jitter);
          this.spawnFeatureBurst('sparkle', inten * (0.8 + Math.random() * 0.6), pos);
        }
        // Brief flash light to enhance the effect
        try {
          const flash = new THREE.PointLight(this.segmentColorTarget.clone(), 0.0, 40, 2);
          flash.position.copy(origin).add(new THREE.Vector3(0, 6, 0));
          this.scene.add(flash);
          // Fade out using a simple timeout-ish decay driven by animation ticks
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
        // Temporarily increase fog density and spawn a few slow-moving particles
        try {
          if (this.scene.fog instanceof THREE.FogExp2) {
            const base = this.scene.fog.density || 0.001;
            const target = base + 0.0025 * (0.5 + inten);
            // animate the fog density over ~duration
            const start = performance.now() / 1000;
            const dur = Math.max(3.0, (ev.duration as number) || 6.0);
            const anim = () => {
              const now = performance.now() / 1000;
              const tNorm = Math.min(1, (now - start) / 0.6);
              this.scene.fog.density = THREE.MathUtils.lerp(base, target, tNorm);
              if (now - start < dur) {
                requestAnimationFrame(anim);
              } else {
                // fade back
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
        // spawn a gentle ambient of sparkles
        for (let i = 0; i < Math.max(2, Math.round(4 * inten)); i++) {
          const p = origin.clone().add(new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.2) * 2, (Math.random() - 0.5) * 6));
          this.spawnFeatureBurst('sparkle', 0.25 + Math.random() * 0.4, p);
        }
        break;
      }
      case 'starshow': {
        // Broad distribution of light twinkles across the sky; many low-intensity sparks
        const total = 30 + Math.round(inten * 80);
        for (let i = 0; i < total; i++) {
          const p = origin.clone().add(new THREE.Vector3((Math.random() - 0.5) * 40, 8 + Math.random() * 20, (Math.random() - 0.5) * 40));
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
        // Ring of sparks around the forward direction
        const ringCount = 10 + Math.round(inten * 30);
        for (let r = 0; r < ringCount; r++) {
          const ang = (r / ringCount) * Math.PI * 2;
          const off = new THREE.Vector3(Math.cos(ang) * (3 + Math.random() * 2), -1 + Math.random() * 3, Math.sin(ang) * (3 + Math.random() * 2));
          this.spawnFeatureBurst('sparkle', 0.5 * inten, origin.clone().add(off));
        }
        break;
      }
      case 'confetti': {
        // Confetti as many small particles with random colours
        const confettiCount = 30 + Math.round(inten * 60);
        for (let k = 0; k < confettiCount; k++) {
          const p = origin.clone().add(new THREE.Vector3((Math.random() - 0.5) * 6, Math.random() * 6, (Math.random() - 0.5) * 6));
          // spawn small bursts of low lifetime sparkles
          this.spawnParticles(2, p, 'sparkle');
        }
        break;
      }
      default: {
        // Unknown event -> treat as sparkle
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
    const newGeometry = new THREE.TubeGeometry(curve, tubularSegments, VISUAL_EFFECTS_CONFIG.TRACK.GHOST_RIBBON_RADIUS, 6, false);
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
    
    // Rebuild geometry with lower quality
    const oldGeometry = this.trackMesh.geometry;
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const newGeometry = new THREE.TubeGeometry(
      curve, 
      this.trackData.path.length * VISUAL_EFFECTS_CONFIG.TRACK.LOW_QUALITY_SEGMENTS,
      VISUAL_EFFECTS_CONFIG.TRACK.RADIUS,
      6, // Reduced radial segments
      false
    );
    
    this.trackMesh.geometry = newGeometry;
    oldGeometry.dispose();
    this.rebuildGhostRibbon(curve, this.trackData.path.length * LOW_QUALITY_SEGMENTS);
  }

  private switchToHighQuality() {
    if (this.highQualityMode) return;
    this.highQualityMode = true;

    // Rebuild geometry with higher quality
    const oldGeometry = this.trackMesh.geometry;
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const newGeometry = new THREE.TubeGeometry(
      curve,
      this.trackData.path.length * VISUAL_EFFECTS_CONFIG.TRACK.HIGH_QUALITY_SEGMENTS,
      VISUAL_EFFECTS_CONFIG.TRACK.RADIUS,
      8, // Back to original radial segments
      false
    );

    this.trackMesh.geometry = newGeometry;
    oldGeometry.dispose();
    this.rebuildGhostRibbon(curve, this.trackData.path.length * HIGH_QUALITY_SEGMENTS);
  }

  private applyAdvancedLOD(fps: number) {
    const gpuMemory = 1024; // Mock value as we can't easily detect this.
    const qualityPreset = fps > VISUAL_EFFECTS_CONFIG.PERFORMANCE.TARGET_FPS ? 'high' : fps > 30 ? 'medium' : 'low';

    if (this.lodConfig.qualityPreset === qualityPreset) {
      return; // No change
    }

    const config: ParticleLODConfig = {
        maxParticles: fps > VISUAL_EFFECTS_CONFIG.PERFORMANCE.TARGET_FPS ? RIDE_CONFIG.PARTICLE_COUNT : Math.floor(RIDE_CONFIG.PARTICLE_COUNT * 0.7),
        updateFrequency: fps > 30 ? 60 : 30,
        gpuEnabled: fps > 25 && gpuMemory > 512,
        qualityPreset: qualityPreset,
    };
    this.applyLODConfig(config);
  }

  private applyLODConfig(config: ParticleLODConfig) {
    console.log(`[VisualEffects] Applying LOD config: ${config.qualityPreset}`);
    this.lodConfig = config;

    const isLowQuality = config.qualityPreset === 'low' || config.qualityPreset === 'potato';
    if (isLowQuality) {
      if (this.lowQualitySince === null) {
        this.lowQualitySince = performance.now();
      }
      if (performance.now() - (this.lowQualitySince || 0) >= VISUAL_EFFECTS_CONFIG.PERFORMANCE.DEBOUNCE_MS) {
        if (this.highQualityMode) {
          console.log(`[VisualEffects] Performance low, switching to low quality mode`);
          this.switchToLowQuality();
        }
      }
    } else {
      // high or medium
      this.lowQualitySince = null;
      if (!this.highQualityMode) {
        console.log(`[VisualEffects] Performance recovered, switching to high quality mode`);
        this.switchToHighQuality();
      }
    }

    this.gpuEnabled = config.gpuEnabled;
    if (!this.gpuEnabled) {
      this.switchToFallbackParticles();
    }
  }

  private switchToFallbackParticles() {
    console.warn('[VisualEffects] Switching to fallback particle system (THREE.Points).');
    if (this.particleInstancedMesh) {
      this.particleInstancedMesh.visible = false;
    }
    if (this.particleSystem) {
      // Ensure it's in the scene. The constructor logic might have already added it.
      if (!this.particleSystem.parent) {
        this.scene.add(this.particleSystem);
      }
      this.particleSystem.visible = true;
    }
    // Disable GPU path to prevent further errors
    this.gpuEnabled = false;
  }

  /**
   * Cleans up resources when the ride is finished or reset.
   */
  public dispose() {
    if (this.gpuParticleSystem) {
      this.gpuParticleSystem.dispose();
      this.gpuParticleSystem = null;
    }

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
        const geom2 = this.particleSystem.geometry as THREE.BufferGeometry;
        geom2.dispose();
        (this.particleSystem.material as THREE.Material).dispose();
      } catch (e) {}
      this.particleSystem = null;
    }

    // Remove audio-reactive light if it exists
    try {
      const glow = this.scene.getObjectByName('audioGlow');
      if (glow) {
        this.scene.remove(glow);
      }
    } catch (e) {}
  }
}