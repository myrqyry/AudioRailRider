import * as THREE from 'three';
import { TrackData, FrameAnalysis, TimelineEvent, secondsToNumber } from 'shared/types';
import { TrackGeometryManager } from './TrackGeometryManager';
import { ParticleSystemController } from './ParticleSystemController';
import { ShaderUniformManager } from './ShaderUniformManager';
import {
    BASS_GLOW_MIN,
    BASS_GLOW_MAX,
    LERP_FACTOR,
    TRACK_DEFAULT_OPACITY,
    TRACK_INSIDE_OPACITY,
    TRACK_OPACITY_LERP_SPEED,
    PLACE_TRACK_UNDER_CAMERA,
    TRACK_UNDER_CAMERA_VERTICAL_OFFSET,
    TRACK_RADIUS,
    PERFORMANCE_CHECK_INTERVAL,
    TARGET_FPS,
    LOW_QUALITY_DEBOUNCE_MS
} from '../constants';
import { AtmosphereController } from '../environment/AtmosphereController';
import { AnimationFrameManager } from '../utils/AnimationFrameManager';

export class VisualEffectsOrchestrator {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private trackData: TrackData;
    private trackGeometryManager: TrackGeometryManager;
    private particleSystemController: ParticleSystemController;
    private shaderUniformManager: ShaderUniformManager;
    private atmosphere: AtmosphereController;
    private animationFrameManager: AnimationFrameManager;
    private trackMaterial: THREE.MeshStandardMaterial;
    private ghostRibbonMaterial: THREE.ShaderMaterial;
    private audioFeatures: Record<string, number> = { subBass: 0, bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, sparkle: 0 };
    private trackPulse: number = 0;
    private segmentIntensityBoost: number = 1;
    private gpuAudioForce: number = 0;
    private rideSpeedSmoothed: number = 0;
    private lastUpdateSeconds: number = 0;
    private highQualityMode: boolean = true;
    private lastPerformanceCheck: number = 0;
    private frameCount: number = 0;
    private lowQualitySince: number | null = null;
    private isWarmedUp: boolean = false;
    private firstUpdateTime: number = 0;
    private timelineEvents: TimelineEvent[] = [];
    private timelineTriggeredUntil: Map<number, number> = new Map();
    private lastAudioTimeSeconds: number = 0;
    private baseRailColor: THREE.Color;
    private baseEmissiveColor: THREE.Color;
    private segmentColorTarget: THREE.Color;
    private trackTintA: THREE.Color;
    private trackTintB: THREE.Color;

    constructor(scene: THREE.Scene, trackData: TrackData, camera: THREE.Camera) {
        this.scene = scene;
        this.camera = camera;
        this.trackData = trackData;
        this.animationFrameManager = new AnimationFrameManager();

        this.baseRailColor = new THREE.Color(trackData.railColor || '#ffffff');
        this.baseEmissiveColor = new THREE.Color(trackData.glowColor || '#00ffff');
        const pastelBase = new THREE.Color('#e6f3ff');
        const pastelGlow = new THREE.Color('#ffe5ff');
        this.baseRailColor.lerp(pastelBase, 0.35);
        this.baseEmissiveColor.lerp(pastelGlow, 0.4);
        this.segmentColorTarget = this.baseEmissiveColor.clone();
        this.trackTintA = this.baseRailColor.clone().lerp(new THREE.Color('#cfe9ff'), 0.5);
        this.trackTintB = this.baseEmissiveColor.clone().lerp(new THREE.Color('#ffdff9'), 0.6);

        this.trackMaterial = new THREE.MeshStandardMaterial({
            color: this.baseRailColor.clone(),
            emissive: this.baseEmissiveColor.clone(),
            emissiveIntensity: BASS_GLOW_MIN,
            metalness: 0.15,
            roughness: 0.65,
            transparent: true,
            opacity: TRACK_DEFAULT_OPACITY,
            side: THREE.DoubleSide,
        });

        this.ghostRibbonMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioPulse: { value: 0 },
                colorInner: { value: this.trackTintA },
                colorOuter: { value: this.trackTintB },
            },
            vertexShader: `...`, // Placeholder for ghost ribbon vertex shader
            fragmentShader: `...`, // Placeholder for ghost ribbon fragment shader
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        });

        const sanitized = this.analyzeAndSanitizePath(trackData.path);

        const initialSettings = {
            placeTrackUnderCamera: PLACE_TRACK_UNDER_CAMERA,
            trackUnderCameraVerticalOffset: TRACK_UNDER_CAMERA_VERTICAL_OFFSET,
            trackRadius: TRACK_RADIUS,
            trackPathPoints: sanitized.points,
        };

        this.trackGeometryManager = new TrackGeometryManager(scene, trackData, this.trackMaterial, initialSettings);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.highQualityMode = !isMobile;
        this.particleSystemController = new ParticleSystemController(scene, this.highQualityMode, trackData.synesthetic?.particles ?? null);
        this.shaderUniformManager = new ShaderUniformManager(this.trackMaterial, this.ghostRibbonMaterial);
        this.atmosphere = new AtmosphereController(this.scene, trackData.skyColor1 || '#0d0a1f', trackData.synesthetic?.atmosphere ?? null);

        try {
            this.timelineEvents = Array.isArray((trackData as any).events) ? (trackData as any).events.slice() : [];
            for (const ev of this.timelineEvents) {
                if (ev && ev.timestamp === undefined && ev.params && ev.params.audioSyncPoint) {
                    ev.timestamp = ev.params.audioSyncPoint as any;
                }
            }
            this.timelineEvents.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        } catch (e) {
            this.timelineEvents = [];
        }
    }

    private analyzeAndSanitizePath(rawPath: unknown): { points: THREE.Vector3[]; issues: string[] } {
        const issues: string[] = [];
        if (!Array.isArray(rawPath)) {
            issues.push('Path is not an array');
            return { points: [], issues };
        }

        const normalized: THREE.Vector3[] = [];
        rawPath.forEach((entry, index) => {
            const vec = this.normalizePathPoint(entry);
            if (!vec) {
                issues.push(`Invalid point at index ${index}`);
            } else {
                normalized.push(vec);
            }
        });

        const deduped = this.removeDuplicatePoints(normalized);
        if (deduped.length === 0) {
            issues.push('No valid points after sanitization');
        } else if (deduped.length === 1) {
            issues.push('Only one unique point provided');
        }

        return { points: deduped, issues };
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
            curlStrength: 0.12,
            noiseScale: 2.0,
            noiseSpeed: 0.12,
        });
    }

    public update(elapsedTime: number, currentFrame: FrameAnalysis | null, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3, rideProgress: number) {
        const now = performance.now();
        const nowSeconds = now / 1000;
        const deltaSeconds = this.lastUpdateSeconds === 0 ? 1 / 60 : Math.min(0.25, Math.max(1 / 240, nowSeconds - this.lastUpdateSeconds));
        this.lastUpdateSeconds = nowSeconds;

        const clampedProgress = THREE.MathUtils.clamp(rideProgress ?? 0, 0, 1);

        const passionBoost = this.atmosphere.update({
            deltaSeconds,
            frame: currentFrame,
            audioFeatures: this.audioFeatures,
            segmentColor: this.segmentColorTarget,
            segmentIntensity: this.segmentIntensityBoost,
        });
        this.segmentIntensityBoost *= passionBoost;

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
                }
                if (this.lowQualitySince !== null && now - this.lowQualitySince >= LOW_QUALITY_DEBOUNCE_MS) {
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
        let targetGlowIntensity = BASS_GLOW_MIN;

        if (currentFrame) {
            const bassValue = THREE.MathUtils.clamp(currentFrame.bass, 0, 1);
            targetGlowIntensity = THREE.MathUtils.clamp(baseMinGlow + bassValue * (baseMaxGlow - baseMinGlow), BASS_GLOW_MIN, glowCeiling);
        } else {
            targetGlowIntensity = THREE.MathUtils.clamp(baseMinGlow + fallbackBass * (baseMaxGlow - baseMinGlow), BASS_GLOW_MIN, glowCeiling);
        }

        const baseForce = currentFrame ? currentFrame.energy * 2.0 + currentFrame.spectralFlux * 1.5 : this.gpuAudioForce;
        this.gpuAudioForce = Math.max(0, baseForce) * this.segmentIntensityBoost;

        this.trackMaterial.emissiveIntensity = THREE.MathUtils.lerp(this.trackMaterial.emissiveIntensity, targetGlowIntensity, LERP_FACTOR);

        this.trackPulse = this.particleSystemController.update(deltaSeconds, this.audioFeatures, this.segmentIntensityBoost, this.gpuAudioForce, 0.12, 2.0, 0.12, cameraPosition, lookAtPosition, this.trackPulse, this.segmentColorTarget, this.baseRailColor);

        try {
            const durationNum = this.trackData && this.trackData.audioFeatures && typeof this.trackData.audioFeatures.duration === 'number' ? secondsToNumber(this.trackData.audioFeatures.duration) : 0;
            const currentAudioTime = durationNum > 0 ? clampedProgress * durationNum : 0;
            this.handleTimelineEvents(currentAudioTime, deltaSeconds, cameraPosition, lookAtPosition);
            this.lastAudioTimeSeconds = currentAudioTime;
        } catch (e) {}

        this.shaderUniformManager.update(elapsedTime, this.trackPulse, this.segmentIntensityBoost, this.gpuAudioForce, this.audioFeatures, this.rideSpeedSmoothed, this.trackTintA, this.trackTintB);
    }

    private handleTimelineEvents(currentAudioTime: number, deltaSeconds: number, cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3) {
        if (!this.timelineEvents || !this.timelineEvents.length) return;
        const now = currentAudioTime;
        const forward = new THREE.Vector3().subVectors(lookAtPosition, cameraPosition).normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();

        for (let i = 0; i < this.timelineEvents.length; i++) {
            const ev = this.timelineEvents[i];
            if (!ev || typeof ev.timestamp !== 'number') continue;
            const triggeredUntil = this.timelineTriggeredUntil.get(i) || 0;
            if (now <= triggeredUntil) continue;
            const lookahead = Math.max(0.05, deltaSeconds * 1.5);
            if (now + lookahead >= ev.timestamp) {
                const intensity = Math.max(0, Math.min(1, (ev.intensity ?? 0.6) * (this.segmentIntensityBoost || 1)));
                const spawnPos = new THREE.Vector3().copy(cameraPosition).addScaledVector(forward, 8).addScaledVector(up, 1.5);
                this.spawnEvent(ev, intensity, spawnPos);
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
                    const jitter = new THREE.Vector3((Math.random() - 0.5) * 6, 6 + Math.random() * 6, (Math.random() - 0.5) * 6);
                    const pos = new THREE.Vector3().copy(origin).add(jitter);
                    this.particleSystemController.spawnFeatureBurst('sparkle', inten * (0.8 + Math.random() * 0.6), pos, this.audioFeatures, this.segmentIntensityBoost);
                }
                break;
            }
            // ... other event types
        }
    }

    private switchToLowQuality() {
        if (!this.highQualityMode) return;
        this.highQualityMode = false;
        // ... (update particle system and track geometry)
    }

    public dispose() {
        this.trackGeometryManager.dispose();
        this.particleSystemController.dispose();
        this.animationFrameManager.dispose();
    }
}
