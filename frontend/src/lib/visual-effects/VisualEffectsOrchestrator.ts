import * as THREE from 'three';
import { TrackData, FrameAnalysis } from 'shared/types';
import { TrackGeometryManager } from './TrackGeometryManager';
import { ParticleSystemController } from './ParticleSystemController';
import { ShaderUniformManager } from './ShaderUniformManager';
import { Result, Ok, Err } from 'neverthrow';
import { RIDE_CONFIG } from '../constants';
import { AnimationFrameManager } from '../utils/AnimationFrameManager';
import { secondsToNumber } from 'shared/types';

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class VisualEffectsOrchestrator {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private trackData: TrackData;
    private trackGeometryManager: TrackGeometryManager;
    private particleSystemController: ParticleSystemController;
    private shaderUniformManager: ShaderUniformManager;
    private animationFrameManager: AnimationFrameManager;
    private trackMaterial: THREE.MeshStandardMaterial;
    private ghostRibbonMaterial: THREE.ShaderMaterial;
    private audioFeatures: Record<string, number> = { subBass: 0, bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, sparkle: 0 };
    private trackPulse: number = 0;
    private segmentIntensityBoost: number = 1;
    private gpuAudioForce: number = 0;
    private rideSpeedSmoothed: number = 0;
    private lastUpdateSeconds: number = 0;
    private readonly _forward = new THREE.Vector3();
    private readonly _right = new THREE.Vector3();
    private readonly _up = new THREE.Vector3();
    private readonly _worldUp = new THREE.Vector3(0, 1, 0);

    constructor(scene: THREE.Scene, trackData: TrackData, camera: THREE.Camera) {
        this.scene = scene;
        this.camera = camera;
        this.trackData = trackData;
        this.animationFrameManager = new AnimationFrameManager();

        const baseRailColor = new THREE.Color(trackData.railColor || '#ffffff');
        const baseEmissiveColor = new THREE.Color(trackData.glowColor || '#00ffff');
        const pastelBase = new THREE.Color('#e6f3ff');
        const pastelGlow = new THREE.Color('#ffe5ff');
        baseRailColor.lerp(pastelBase, 0.35);
        baseEmissiveColor.lerp(pastelGlow, 0.4);

        this.trackMaterial = new THREE.MeshStandardMaterial({
            color: baseRailColor.clone(),
            emissive: baseEmissiveColor.clone(),
            emissiveIntensity: RIDE_CONFIG.BASS_GLOW_MIN,
            metalness: 0.15,
            roughness: 0.65,
            transparent: true,
            opacity: RIDE_CONFIG.TRACK_DEFAULT_OPACITY,
            side: THREE.DoubleSide,
        });

        const trackTintA = baseRailColor.clone().lerp(new THREE.Color('#cfe9ff'), 0.5);
        const trackTintB = baseEmissiveColor.clone().lerp(new THREE.Color('#ffdff9'), 0.6);

        this.ghostRibbonMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioPulse: { value: 0 },
                colorInner: { value: trackTintA },
                colorOuter: { value: trackTintB },
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

        const sanitized = this.analyzeAndSanitizePath(trackData.path);
        if (sanitized.isErr()) {
            console.warn('[VisualEffectsOrchestrator] Issues found in track path:', sanitized.error);
        }

        const initialSettings = {
            placeTrackUnderCamera: RIDE_CONFIG.PLACE_TRACK_UNDER_CAMERA,
            trackUnderCameraVerticalOffset: RIDE_CONFIG.TRACK_UNDER_CAMERA_VERTICAL_OFFSET,
            trackRadius: RIDE_CONFIG.TRACK_RADIUS,
            trackPathPoints: sanitized.isOk() ? sanitized.value.points : [],
        };

        this.trackGeometryManager = new TrackGeometryManager(scene, trackData, this.trackMaterial, initialSettings);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.particleSystemController = new ParticleSystemController(scene, !isMobile, trackData.synesthetic?.particles ?? null);
        this.shaderUniformManager = new ShaderUniformManager(this.trackMaterial, this.ghostRibbonMaterial);

        try {
            this.timelineEvents = Array.isArray((trackData as any).events) ? (trackData as any).events.slice() : [];
            for (const ev of this.timelineEvents) {
                if (ev && ev.timestamp === undefined && ev.params && ev.params.audioSyncPoint) {
                    ev.timestamp = ev.params.audioSyncPoint as any;
                }
            }
            this.timelineEvents.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        } catch (e) {
            console.error('[VisualEffectsOrchestrator] Failed to process timeline events:', e);
            this.timelineEvents = [];
        }
    }

    private spawnEvent(ev: TimelineEvent, intensity: number, origin: THREE.Vector3) {
        const t = ev.type;
        const inten = Math.max(0.02, Math.min(1, intensity));
        switch (t) {
            case 'fireworks': {
                const bursts = 3 + Math.round(inten * 5);
                for (let i = 0; i < bursts; i++) {
                    const jitter = new THREE.Vector3((Math.random() - 0.5) * 6, 6 + Math.random() * 6, (Math.random() - 0.5) * 6);
                    const pos = new THREE.Vector3().copy(origin).add(jitter);
                    this.particleSystemController.spawnFeatureBurst('sparkle', inten * (0.8 + Math.random() * 0.6), pos, this.audioFeatures, this.segmentIntensityBoost);
                }
                break;
            }
            // ... other event types
        }
    }

    private hasBoundsTree(geometry: THREE.BufferGeometry): geometry is THREE.BufferGeometry & { boundsTree: MeshBVH } {
        return 'boundsTree' in geometry && typeof (geometry as any).boundsTree?.closestPointToPoint === 'function';
    }

    private analyzeAndSanitizePath(rawPath: unknown): Result<{ points: THREE.Vector3[]; issues: string[] }, ValidationError> {
        try {
            const issues: string[] = [];

            if (!Array.isArray(rawPath)) {
                return new Err(new ValidationError('Path must be an array'));
            }

            const points: THREE.Vector3[] = [];
            for (let i = 0; i < rawPath.length; i++) {
                const entry = rawPath[i];
                const result = this.validatePathPoint(entry, i);

                if (result.isErr()) {
                    issues.push(result.error.message);
                    continue;
                }

                points.push(result.value);
            }

            if (points.length < 2) {
                return new Err(new ValidationError('Path must contain at least 2 valid points'));
            }

            return new Ok({ points, issues });
        } catch (error) {
            return new Err(new ValidationError(`Path analysis failed: ${error.message}`));
        }
    }

    private validatePathPoint(point: any, index: number): Result<THREE.Vector3, ValidationError> {
        const vec = this.normalizePathPoint(point);
        if (!vec) {
            return new Err(new ValidationError(`Invalid point at index ${index}`));
        }
        return new Ok(vec);
    }

    private normalizePathPoint(point: any): THREE.Vector3 | null {
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

    private removeDuplicatePoints(points: THREE.Vector3[], epsilon = 1e-2): THREE.Vector3[] {
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

    public async initGPU(renderer: THREE.WebGLRenderer) {
        await this.particleSystemController.initGPU(renderer, {
            // ... (initial uniforms)
        });
    }

    public update(elapsedTime: number, currentFrame: FrameAnalysis | null, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3, rideProgress: number) {
        const now = performance.now();
        const nowSeconds = now / 1000;
        const deltaSeconds = this.lastUpdateSeconds === 0 ? 1 / 60 : Math.min(0.25, Math.max(1 / 240, nowSeconds - this.lastUpdateSeconds));
        this.lastUpdateSeconds = nowSeconds;

        const clampedProgress = THREE.MathUtils.clamp(rideProgress ?? 0, 0, 1);

        try {
            const durationNum = this.trackData && this.trackData.audioFeatures && typeof this.trackData.audioFeatures.duration === 'number' ? secondsToNumber(this.trackData.audioFeatures.duration) : 0;
            const currentAudioTime = durationNum > 0 ? clampedProgress * durationNum : 0;
            this.handleTimelineEvents(currentAudioTime, deltaSeconds, cameraPosition, lookAtPosition);
            this.lastAudioTimeSeconds = currentAudioTime;
        } catch (e) {
            console.error('[VisualEffectsOrchestrator] Error during timeline event handling:', e);
        }

        this.particleSystemController.update(nowSeconds, deltaSeconds, cameraPosition, this.audioFeatures, this.segmentIntensityBoost, this.gpuAudioForce);

        this.shaderUniformManager.update(
            elapsedTime,
            this.trackPulse,
            this.segmentIntensityBoost,
            this.gpuAudioForce,
            this.audioFeatures,
            this.rideSpeedSmoothed
        );
    }

    private handleTimelineEvents(currentAudioTime: number, deltaSeconds: number, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3) {
        if (!this.timelineEvents || !this.timelineEvents.length) return;
        const now = currentAudioTime;
        this._forward.subVectors(lookAtPosition, cameraPosition).normalize();
        this._right.crossVectors(this._forward, this._worldUp).normalize();
        this._up.crossVectors(this._right, this._forward).normalize();

        for (let i = 0; i < this.timelineEvents.length; i++) {
            const ev = this.timelineEvents[i];
            if (!ev || typeof ev.timestamp !== 'number') continue;
            const triggeredUntil = this.timelineTriggeredUntil.get(i) || 0;
            if (now <= triggeredUntil) continue;
            const lookahead = Math.max(0.05, deltaSeconds * 1.5);
            if (now + lookahead >= ev.timestamp) {
                const intensity = Math.max(0, Math.min(1, (ev.intensity ?? 0.6) * (this.segmentIntensityBoost || 1)));
                const spawnPos = new THREE.Vector3().copy(cameraPosition).addScaledVector(this._forward, 8).addScaledVector(this._up, 1.5);
                this.spawnEvent(ev, intensity, spawnPos);
                const duration = ev.duration ? (typeof ev.duration === 'number' ? ev.duration : Number(ev.duration)) : 2.0;
                this.timelineTriggeredUntil.set(i, ev.timestamp + duration + 0.5);
            }
        }
    }

    public dispose() {
        this.trackGeometryManager.dispose();
        this.particleSystemController.dispose();
        this.animationFrameManager.dispose();
    }
}
