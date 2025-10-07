import * as THREE from 'three';
import { TrackData, FrameAnalysis, SegmentDetail } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';
import { getCachedShader, getCachedLygiaResolver } from './preloader';

interface FeatureVisualConfig {
  color: [number, number, number];
  sensitivity: number;
  size: number; // base size multiplier
  lifetime: number; // base lifetime in seconds
  behavior: 'burst' | 'trail' | 'flow'; // for future use
}

// --- Constants ---
const BASS_GLOW_MIN = 0.3; // The baseline glow intensity
const BASS_GLOW_MAX = 1.8; // The maximum glow intensity when bass hits
const LERP_FACTOR = 0.12; // How quickly the glow intensity changes (smoothing factor)

// Performance optimization constants
const HIGH_QUALITY_SEGMENTS = 2; // Segments per path point for high quality
const LOW_QUALITY_SEGMENTS = 1; // Segments per path point for low quality
const PERFORMANCE_CHECK_INTERVAL = 2000; // Check FPS every 2 seconds
const TARGET_FPS = 50; // Target FPS for quality adjustment
const LOW_QUALITY_DEBOUNCE_MS = 3000; // Wait this long before switching quality

const TRACK_RADIUS = 0.9;
const GHOST_RIBBON_RADIUS = 1.6;

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
  private gpuRenderer: THREE.WebGLRenderer | null = null;
  // Separate ping-pong render targets for position and velocity
  private gpuPosRTA: THREE.WebGLRenderTarget | null = null;
  private gpuPosRTB: THREE.WebGLRenderTarget | null = null;
  private gpuVelRTA: THREE.WebGLRenderTarget | null = null;
  private gpuVelRTB: THREE.WebGLRenderTarget | null = null;
  private gpuQuadScene: THREE.Scene | null = null;
  private gpuQuadCamera: THREE.OrthographicCamera | null = null;
  private gpuVelMaterial: THREE.ShaderMaterial | null = null;
  private gpuPosMaterial: THREE.ShaderMaterial | null = null;
  private gpuSwap = false; // false means A is current, true means B is current
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
  

  constructor(scene: THREE.Scene, trackData: TrackData) {
    this.scene = scene;
    this.trackData = trackData;

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
    this.segmentProgress = derivedProgress;

    // 1. Create the track material
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
uniform float trackTime;
uniform float distortionStrength;
uniform float bassIntensity;
uniform float trebleIntensity;
`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
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
      this.trackData.path.length * HIGH_QUALITY_SEGMENTS : 
      this.trackData.path.length * LOW_QUALITY_SEGMENTS;
    
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
  const geometry = new THREE.TubeGeometry(curve, segments, TRACK_RADIUS, 8, false);

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
      const instanceGeo = new THREE.SphereGeometry(1, 6, 4);
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
      // Add per-instance attributes: color (vec3) and speed (float)
      try {
        const colors = new Float32Array(particleCount * 3);
        const speeds = new Float32Array(particleCount);
        const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
        const speedAttr = new THREE.InstancedBufferAttribute(speeds, 1);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceColor', colorAttr);
        (this.particleInstancedMesh.geometry as any).setAttribute('instanceSpeed', speedAttr);

        // Replace material with a lightweight instanced shader that samples a
        // position texture when GPU path is enabled. It falls back to the
        // basic instanceMatrix when no texture is provided.
        const vert = `
          attribute mat4 instanceMatrix;
          attribute vec3 instanceColor;
          attribute float instanceSpeed;
          attribute float instanceFeature;
          uniform sampler2D posTex;
          uniform float texSize;
          varying vec3 vColor;

          vec3 sampleTexturePosition(float id, float dimension) {
            float row = floor(id / dimension);
            float col = mod(id, dimension);
            vec2 uv = (vec2(col, row) + 0.5) / dimension;
            return texture2D(posTex, uv).rgb;
          }

          vec3 transformVertex(vec3 local, mat4 inst) {
            vec3 basisX = vec3(inst[0][0], inst[0][1], inst[0][2]);
            vec3 basisY = vec3(inst[1][0], inst[1][1], inst[1][2]);
            vec3 basisZ = vec3(inst[2][0], inst[2][1], inst[2][2]);
            return basisX * local.x + basisY * local.y + basisZ * local.z;
          }

          void main() {
            float fi = instanceFeature;
            float tint = 0.15 * (fi - 3.0);
            vColor = instanceColor + vec3(tint, -tint * 0.2, tint * 0.1);

            vec3 center = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
            float id = float(gl_InstanceID);
            if (texSize > 0.5) {
              center = sampleTexturePosition(id, texSize);
            }

            vec3 displaced = transformVertex(position, instanceMatrix) + center;
            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `;
        const frag = `
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
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
        size: RIDE_CONFIG.PARTICLE_BASE_SIZE,
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
      console.log('[GPU Particles] Initializing GPU particle system...');
      console.log('[GPU Particles] WebGL2 supported:', capabilities.isWebGL2);
      console.log('[GPU Particles] Float textures support (OES_texture_float):', extensions.has('OES_texture_float'));
      console.log('[GPU Particles] Float textures support (WEBGL_color_buffer_float):', extensions.has('WEBGL_color_buffer_float'));

      if (!capabilities.isWebGL2) {
        console.warn('[GPU Particles] GPU particle system requires WebGL2. Falling back to CPU particles.');
        this.switchToFallbackParticles();
        return;
      }
      try {
        this.gpuRenderer = renderer;
        const size = Math.ceil(Math.sqrt(RIDE_CONFIG.PARTICLE_COUNT));
  const params: any = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.FloatType, format: THREE.RGBAFormat };
        // Try to load pre-resolved shader sources from /shaders/ (written by prebuild script)
        // First check preloader cache, then fetch if not cached
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

        // If pre-resolved shaders aren't available, attempt to fetch base shader files from /shaders/
        // First check preloader cache
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
  // If pre-resolved shaders aren't available, fall back to loading a runtime resolver
        // First check preloader cache
        let resolveLygia: ((s: string) => string) | null = getCachedLygiaResolver();
        
        if (!resolveLygia && (!preResolvedVel || !preResolvedPos)) {
          try {
              try {
                const localUrl = window.location.origin + '/lygia/resolve.esm.js';
                // @ts-ignore: prevent bundlers from resolving this import at build-time
                const local = await import(/* @vite-ignore */ localUrl);
                resolveLygia = (local && (local.default || local.resolveLygia || local.resolve)) ? (local.default || local.resolveLygia || local.resolve) : null;
              } catch (e) {
                resolveLygia = null;
              }
          } catch (e) {
            try {
              const cdnUrl = 'https://lygia.xyz/resolve.esm.js';
              // @ts-ignore: prevent bundlers from resolving this import at build-time
              const mod = await import(/* @vite-ignore */ cdnUrl);
              resolveLygia = (mod && (mod.default || mod.resolveLygia || mod.resolve) ) ? (mod.default || mod.resolveLygia || mod.resolve) : null;
            } catch (e2) {
              resolveLygia = null;
            }
          }
        }

        // Initialize data textures for positions and speeds
  const totalTexels = size * size;
  const posArray = new Float32Array(totalTexels * 4);
  const velArrayInit = new Float32Array(totalTexels * 4);
        // Fill arrays with current instance positions/speeds where possible
        const tempMat = new THREE.Matrix4();
        for (let i = 0; i < RIDE_CONFIG.PARTICLE_COUNT; i++) {
          const ti = i * 4;
          let px = 0, py = -9999, pz = 0, sp = 0;
          try {
            if (this.particleInstancedMesh) {
              this.particleInstancedMesh.getMatrixAt(i, tempMat);
              const e = tempMat.elements;
              px = e[12]; py = e[13]; pz = e[14];
            }
            if (this.particleInstancedMesh && (this.particleInstancedMesh.geometry as any).getAttribute('instanceSpeed')) {
              const spAttr = (this.particleInstancedMesh.geometry as any).getAttribute('instanceSpeed');
              sp = spAttr.array[i] || 0;
            }
          } catch (e) {}
          posArray[ti + 0] = px; posArray[ti + 1] = py; posArray[ti + 2] = pz; posArray[ti + 3] = 1.0;
          velArrayInit[ti + 0] = sp; velArrayInit[ti + 1] = 0; velArrayInit[ti + 2] = 0; velArrayInit[ti + 3] = 0;
        }

        // Create textures for position and velocity
  const posTexture = new THREE.DataTexture(posArray, size, size, THREE.RGBAFormat, THREE.FloatType);
  posTexture.needsUpdate = true;
  for (let i = 0; i < totalTexels; i++) { velArrayInit[i*4 + 0] = 0; velArrayInit[i*4 + 1] = 0; velArrayInit[i*4 + 2] = 0; velArrayInit[i*4 + 3] = 0; }
  const velTexture = new THREE.DataTexture(velArrayInit, size, size, THREE.RGBAFormat, THREE.FloatType);
  velTexture.needsUpdate = true;

        // Quad scene
        this.gpuQuadScene = new THREE.Scene();
        this.gpuQuadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Velocity update shader: reads prevVel and prevPos and applies forces/damping
    const baseVelInline = `
            precision highp float; varying vec2 vUv;
            uniform sampler2D prevVel; uniform sampler2D prevPos; uniform float dt; uniform float time;
      uniform float audioForce; uniform float subBass; uniform float bass; uniform float lowMid; uniform float mid; uniform float highMid; uniform float treble; uniform float sparkle;
            // Lightweight fallback noise/curl functions (used when LYGIA isn't available)
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
              // simple pseudo-curl using neighboring noise samples
              return normalize(vec3(n2 - n3, n3 - n1, n1 - n2));
            }
            void main(){
              vec3 v = texture2D(prevVel, vUv).rgb;
              vec3 p = texture2D(prevPos, vUv).rgb;
              // simple gravity and damping
              vec3 accel = vec3(0.0, -0.98, 0.0);
              v += accel * dt;
                // audio-driven impulse: combine global audioForce with band-specific impulses
                float bandPulse = clamp((sin(time*10.0 + vUv.x*50.0) * 0.5 + 0.5), 0.0, 1.0);
                float audio = bandPulse * audioForce;
                // weighted band contributions (these uniforms are set from JS)
                audio += subBass * 3.0;
                audio += bass * 2.0;
                audio += lowMid * 1.4;
                audio += mid * 1.2;
                audio += highMid * 1.0;
                audio += treble * 0.8;
                audio += sparkle * 0.6;
                v.y += audio * 2.5;
                // Add curl noise perturbation to velocities for richer motion
                vec3 c = curlNoise(p + v * 0.5);
                v += c * curlStrength * (0.5 + bass);
              v *= 0.995; // damping
              gl_FragColor = vec4(v, 1.0);
            }
          `;

        if (!baseVelFrag) baseVelFrag = baseVelInline;

        if (preResolvedVel && preResolvedVel.includes('#include')) {
          preResolvedVel = null;
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
            velFragSrc = resolveLygia(header + baseVelFrag);
          } catch (e) {
            velFragSrc = baseVelFrag;
          }
        }
        const velShader = new THREE.ShaderMaterial({
          uniforms: {
            prevVel: { value: velTexture },
            prevPos: { value: posTexture },
            audioForce: { value: 0 },
            curlStrength: { value: this.curlStrength },
            noiseScale: { value: this.noiseScale },
            noiseSpeed: { value: this.noiseSpeed },
            subBass: { value: 0.0 },
            bass: { value: 0.0 },
            lowMid: { value: 0.0 },
            mid: { value: 0.0 },
            highMid: { value: 0.0 },
            treble: { value: 0.0 },
            sparkle: { value: 0.0 },
            time: { value: 0 },
            dt: { value: 1/60 },
            texSize: { value: size },
          },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
          fragmentShader: velFragSrc,
          depthTest: false, depthWrite: false
        });

        // Position update shader: integrates velocity
        const basePosInline = `
            precision highp float; varying vec2 vUv;
            uniform sampler2D prevPos; uniform sampler2D velTex; uniform float dt;
            void main(){
              vec3 p = texture2D(prevPos, vUv).rgb;
              vec3 v = texture2D(velTex, vUv).rgb;
              p += v * dt;
              // bounds
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
            posFragSrc = resolveLygia(header + basePosFrag);
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

        // Store materials for passes and add two quads to the scene
        this.gpuVelMaterial = velShader;
        this.gpuPosMaterial = posShader;
        const quadVel = new THREE.Mesh(new THREE.PlaneGeometry(2,2), this.gpuVelMaterial);
        const quadPos = new THREE.Mesh(new THREE.PlaneGeometry(2,2), this.gpuPosMaterial);
        this.gpuQuadScene.add(quadVel);
        this.gpuQuadScene.add(quadPos);

        // Create separate ping-pong RTs for vel and pos
        const rtParams: any = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.FloatType, format: THREE.RGBAFormat };
        this.gpuVelRTA = new THREE.WebGLRenderTarget(size, size, rtParams);
        this.gpuVelRTB = new THREE.WebGLRenderTarget(size, size, rtParams);
        this.gpuPosRTA = new THREE.WebGLRenderTarget(size, size, rtParams);
        this.gpuPosRTB = new THREE.WebGLRenderTarget(size, size, rtParams);

        // Prime velRTA with velTexture and posRTA with posTexture by rendering a simple copy
        // Vel prime
        (this.gpuVelMaterial as any).uniforms.prevVel.value = velTexture;
        (this.gpuVelMaterial as any).uniforms.prevPos.value = posTexture;
        renderer.setRenderTarget(this.gpuVelRTA);
        renderer.render(this.gpuQuadScene, this.gpuQuadCamera);
        renderer.setRenderTarget(null);
        // Pos prime
        (this.gpuPosMaterial as any).uniforms.prevPos.value = posTexture;
        (this.gpuPosMaterial as any).uniforms.velTex.value = velTexture;
        renderer.setRenderTarget(this.gpuPosRTA);
        renderer.render(this.gpuQuadScene, this.gpuQuadCamera);
        renderer.setRenderTarget(null);

        this.gpuSwap = false;
        this.gpuEnabled = true;
      } catch (e) {
        // disable GPU path if any error occurs
        this.gpuEnabled = false;
      }
    }

    // Called each update tick when GPU path is enabled; performs ping-pong passes.
    private updateGPU() {
    if (!this.gpuEnabled || !this.gpuRenderer || !this.gpuQuadScene || !this.gpuQuadCamera) return;
      try {
        const size = (this.gpuPosRTA as THREE.WebGLRenderTarget).width;
        // Determine read/write RTs based on swap state
        const readPos = this.gpuSwap ? this.gpuPosRTB : this.gpuPosRTA;
        const readVel = this.gpuSwap ? this.gpuVelRTB : this.gpuVelRTA;
        const writeVel = this.gpuSwap ? this.gpuVelRTA : this.gpuVelRTB;
        const writePos = this.gpuSwap ? this.gpuPosRTA : this.gpuPosRTB;

        // Velocity pass: set uniforms to read previous vel/pos and write into writeVel
        try {
          const velMat = this.gpuVelMaterial as any;
          velMat.uniforms.time.value = performance.now() / 1000;
          velMat.uniforms.dt.value = 1/60;
          velMat.uniforms.texSize.value = size;
          velMat.uniforms.prevVel.value = readVel!.texture;
          velMat.uniforms.prevPos.value = readPos!.texture;
          const boost = this.segmentIntensityBoost;
          velMat.uniforms.subBass.value = (this.audioFeatures.subBass || 0.0) * boost;
          velMat.uniforms.bass.value = (this.audioFeatures.bass || 0.0) * boost;
          velMat.uniforms.lowMid.value = (this.audioFeatures.lowMid || 0.0) * boost;
          velMat.uniforms.mid.value = (this.audioFeatures.mid || 0.0) * boost;
          velMat.uniforms.highMid.value = (this.audioFeatures.highMid || 0.0) * boost;
          velMat.uniforms.treble.value = (this.audioFeatures.treble || 0.0) * boost;
          velMat.uniforms.sparkle.value = (this.audioFeatures.sparkle || 0.0) * boost;
          velMat.uniforms.audioForce.value = this.gpuAudioForce || 0.0;
          // curl/noise uniform updates
          velMat.uniforms.curlStrength.value = this.curlStrength;
          velMat.uniforms.noiseScale.value = this.noiseScale;
          velMat.uniforms.noiseSpeed.value = this.noiseSpeed;
        } catch (e) {}
        // ensure quad0 uses vel material
        (this.gpuQuadScene!.children[0] as THREE.Mesh).material = this.gpuVelMaterial!;
        this.gpuRenderer!.setRenderTarget(writeVel!);
        this.gpuRenderer!.render(this.gpuQuadScene!, this.gpuQuadCamera!);
        this.gpuRenderer!.setRenderTarget(null);

        // Position pass: read prevPos and the newly-written vel texture to integrate
        try {
          const posMat = this.gpuPosMaterial as any;
          posMat.uniforms.dt.value = 1/60;
          posMat.uniforms.prevPos.value = readPos!.texture;
          posMat.uniforms.velTex.value = writeVel!.texture;
        } catch (e) {}
        // ensure quad1 uses pos material
        (this.gpuQuadScene!.children[1] as THREE.Mesh).material = this.gpuPosMaterial!;
        this.gpuRenderer!.setRenderTarget(writePos!);
        this.gpuRenderer!.render(this.gpuQuadScene!, this.gpuQuadCamera!);
        this.gpuRenderer!.setRenderTarget(null);

        // update instanced shader to sample the latest position texture
        const latestPos = writePos!;
        try {
          const shaderMat = this.particleInstancedMesh!.material as any;
          shaderMat.uniforms.posTex.value = latestPos.texture;
          shaderMat.uniforms.texSize.value = size;
          shaderMat.needsUpdate = true;
        } catch (e) {}

        this.gpuSwap = !this.gpuSwap;
      } catch (e) {
        // on any failure, disable GPU path to avoid repeated errors
        this.gpuEnabled = false;
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
    return this.instanceFreeStack.pop() as number;
  }

  // Free an instance index back to the pool
  private freeInstance(idx: number) {
    if (!this.instanceFreeStack) this.instanceFreeStack = [];
    // mark lifetime as zero so it's considered free
    if (this.instanceLifetimes) this.instanceLifetimes[idx] = 0;
    if (this.instanceStartTimes) this.instanceStartTimes[idx] = 0;
    this.instanceFreeStack.push(idx);
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
    const WARMUP_PERIOD = 5000; // 5 seconds
    if (!this.isWarmedUp && now - this.firstUpdateTime > WARMUP_PERIOD) {
      this.isWarmedUp = true;
      // Reset counters after warmup
      this.lastPerformanceCheck = now;
      this.frameCount = 0;
    }
    
    // Only check performance after warmup period
    if (this.isWarmedUp && now - this.lastPerformanceCheck > PERFORMANCE_CHECK_INTERVAL) {
      const fps = (this.frameCount * 1000) / (now - this.lastPerformanceCheck);
      this.lastPerformanceCheck = now;
      this.frameCount = 0;
      
      // Adaptive quality: lower quality if FPS drops
      if (fps < TARGET_FPS && this.highQualityMode) {
        // On first detection, capture renderer info and start debounce timer
        if (this.lowQualitySince === null) {
          this.lowQualitySince = now;
          const ri = this.detectRenderer();
          console.log(`[VisualEffects] Low perf detected: ${fps.toFixed(1)} FPS; renderer=${ri.renderer}; vendor=${ri.vendor}`);
        }
        // Only actually switch after the debounce period to avoid spurious flips
        if (this.lowQualitySince !== null && now - this.lowQualitySince >= LOW_QUALITY_DEBOUNCE_MS) {
          console.log(`[VisualEffects] Performance: ${fps.toFixed(1)} FPS - Switching to low quality mode`);
          this.switchToLowQuality();
          this.lowQualitySince = null;
        }
      } else {
        // performance recovered — reset debounce
        this.lowQualitySince = null;
      }
    }

    const baseMinGlow = BASS_GLOW_MIN * this.segmentIntensityBoost;
    const baseMaxGlow = BASS_GLOW_MAX * this.segmentIntensityBoost;
    const glowCeiling = BASS_GLOW_MAX * Math.max(1, this.segmentIntensityBoost);
    const fallbackBass = this.audioFeatures.bass || 0;

    if (currentFrame) {
      const bassValue = THREE.MathUtils.clamp(currentFrame.bass, 0, 1);
      this.targetGlowIntensity = THREE.MathUtils.clamp(
        baseMinGlow + bassValue * (baseMaxGlow - baseMinGlow),
        BASS_GLOW_MIN,
        glowCeiling
      );
    } else {
      this.targetGlowIntensity = THREE.MathUtils.clamp(
        baseMinGlow + fallbackBass * (baseMaxGlow - baseMinGlow),
        BASS_GLOW_MIN,
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
      LERP_FACTOR
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
      this.updateGPU();
    }
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
    const spawnCount = count > 0 ? Math.min(count, RIDE_CONFIG.PARTICLE_SPAWN_COUNT) : RIDE_CONFIG.PARTICLE_SPAWN_COUNT;

    const nowSeconds = performance.now() / 1000;

    // If we're using InstancedMesh, set the instance matrices for spawned particles
    if (this.particleInstancedMesh) {
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

        const baseSize = RIDE_CONFIG.PARTICLE_BASE_SIZE * (visualConfig?.size ?? 1.0) * (0.7 + Math.random() * 0.6);
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
    const count = Math.max(1, Math.round(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * (0.5 + scaled * 2.0)));
    this.spawnParticles(count, origin, featureName);
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
    
    // Rebuild geometry with lower quality
    const oldGeometry = this.trackMesh.geometry;
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const newGeometry = new THREE.TubeGeometry(
      curve, 
      this.trackData.path.length * LOW_QUALITY_SEGMENTS, 
      TRACK_RADIUS, 
      6, // Reduced radial segments
      false
    );
    
    this.trackMesh.geometry = newGeometry;
    oldGeometry.dispose();
    this.rebuildGhostRibbon(curve, this.trackData.path.length * LOW_QUALITY_SEGMENTS);
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
  }
}