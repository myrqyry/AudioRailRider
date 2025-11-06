import * as THREE from 'three';
import { TrackData, FrameAnalysis } from 'shared/types';
import { TrackGeometryManager } from './TrackGeometryManager';
import { ParticleSystemController } from './ParticleSystemController';
import { ShaderUniformManager } from './ShaderUniformManager';
import { Result, Ok, Err } from 'neverthrow';
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
} from '../constants';
import { AnimationFrameManager } from '../utils/AnimationFrameManager';

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
            emissiveIntensity: BASS_GLOW_MIN,
            metalness: 0.15,
            roughness: 0.65,
            transparent: true,
            opacity: TRACK_DEFAULT_OPACITY,
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
            vertexShader: `...`, // Placeholder for ghost ribbon vertex shader
            fragmentShader: `...`, // Placeholder for ghost ribbon fragment shader
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        });

        const sanitized = this.analyzeAndSanitizePath(trackData.path);
    }

    private hasBoundsTree(geometry: THREE.BufferGeometry): geometry is THREE.BufferGeometry & { boundsTree: MeshBVH } {
        return 'boundsTree' in geometry && typeof (geometry as any).boundsTree?.closestPointToPoint === 'function';

        const initialSettings = {
            placeTrackUnderCamera: PLACE_TRACK_UNDER_CAMERA,
            trackUnderCameraVerticalOffset: TRACK_UNDER_CAMERA_VERTICAL_OFFSET,
            trackRadius: TRACK_RADIUS,
            trackPathPoints: sanitized.points,
        };

        this.trackGeometryManager = new TrackGeometryManager(scene, trackData, this.trackMaterial, initialSettings);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.particleSystemController = new ParticleSystemController(scene, !isMobile);
        this.shaderUniformManager = new ShaderUniformManager(this.trackMaterial, this.ghostRibbonMaterial);
    }

    private analyzeAndSanitizePath(rawPath: unknown): Result<{ points: THREE.Vector3[]; issues: string[] }, ValidationError> {
        try {
            const issues: string[] = [];

            if (!Array.isArray(rawPath)) {
                return Err(new ValidationError('Path must be an array'));
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
                return Err(new ValidationError('Path must contain at least 2 valid points'));
            }

            return Ok({ points, issues });
        } catch (error) {
            return Err(new ValidationError(`Path analysis failed: ${error.message}`));
        }
    }

    private validatePathPoint(point: any, index: number): Result<THREE.Vector3, ValidationError> {
        const vec = this.normalizePathPoint(point);
        if (!vec) {
            return Err(new ValidationError(`Invalid point at index ${index}`));
        }
        return Ok(vec);
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
        // ... (orchestration logic)
    }

    public dispose() {
        this.trackGeometryManager.dispose();
        this.particleSystemController.dispose();
        this.animationFrameManager.dispose();
    }
}
