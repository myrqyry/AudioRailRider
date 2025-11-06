import * as THREE from 'three';
import { ParticleSystem, ParticleQualityLevel, FeatureVisualConfig } from './ParticleSystem';
import { FrameAnalysis, SynestheticBlueprintLayer } from 'shared/types';
import { GHOST_RIBBON_RADIUS } from '../constants';

export class ParticleSystemController {
    private particles: ParticleSystem;
    private scene: THREE.Scene;
    private highQualityMode: boolean;

    constructor(scene: THREE.Scene, highQualityMode: boolean, consciousnessSettings: SynestheticBlueprintLayer['particles'] | null) {
        this.scene = scene;
        this.highQualityMode = highQualityMode;
        this.particles = new ParticleSystem(this.scene);
        const initialProfile: ParticleQualityLevel = highQualityMode ? 'high' : 'medium';
        this.particles.setQualityProfile(initialProfile);
        this.particles.setConsciousnessSettings(consciousnessSettings);
    }

    public seedAmbientParticles(pathCurve: THREE.CatullRomCurve3 | null, trackPathPoints: THREE.Vector3[], audioFeatures: Record<string, number>): void {
        if (!pathCurve) return;
        const sampleCount = Math.min(48, Math.max(18, Math.floor(trackPathPoints.length / 4)));
        const nowSeconds = performance.now() / 1000;
        const spread = GHOST_RIBBON_RADIUS * 4.2;
        this.particles.seedAmbientField(pathCurve, sampleCount, spread, nowSeconds, audioFeatures, 0.9);
    }

    public async initGPU(renderer: THREE.WebGLRenderer, initialUniforms: any) {
        await this.particles.initGPU(renderer, initialUniforms);
    }

    public update(
        deltaSeconds: number,
        audioFeatures: Record<string, number>,
        segmentIntensityBoost: number,
        gpuAudioForce: number,
        curlStrength: number,
        noiseScale: number,
        noiseSpeed: number,
        cameraPosition: THREE.Vector3,
        lookAtPosition: THREE.Vector3,
        trackPulse: number,
        segmentColorTarget: THREE.Color,
        baseRailColor: THREE.Color
    ) {
        this.particles.beginFrame();
        const nowSeconds = performance.now() / 1000;

        const newTrackPulse = this.particles.driveReactiveParticles(
            {
                nowSeconds,
                deltaSeconds,
                cameraPosition,
                lookAtPosition,
                audioFeatures: audioFeatures,
                segmentIntensityBoost: segmentIntensityBoost,
                currentLOD: this.highQualityMode ? 'high' : 'low',
                gpuAudioForce: gpuAudioForce,
            },
            trackPulse
        );

        if (this.particles.isGPUEnabled()) {
            this.particles.updateGPU(deltaSeconds, {
                audioFeatures,
                segmentIntensityBoost,
                gpuAudioForce,
                curlStrength,
                noiseScale,
                noiseSpeed,
            });
        }

        this.particles.reclaimExpired(nowSeconds);
        this.particles.updatePointsMaterial(audioFeatures, segmentIntensityBoost, segmentColorTarget, baseRailColor);
        return newTrackPulse;
    }

    public registerFeatureVisual(featureName: string, cfg: Partial<FeatureVisualConfig>) {
        this.particles.registerFeatureVisual(featureName, cfg);
    }

    public spawnParticles(count: number, origin: THREE.Vector3, feature?: string, audioFeatures?: Record<string, number>, segmentIntensityBoost?: number) {
        this.particles.spawnParticles(count, {
            origin,
            feature,
            audioFeatures: audioFeatures ?? {},
            segmentIntensityBoost: segmentIntensityBoost ?? 1,
            nowSeconds: performance.now() / 1000,
        });
    }

    public spawnFeatureBurst(featureName: string, intensity: number, origin: THREE.Vector3, audioFeatures: Record<string, number>, segmentIntensityBoost: number) {
        this.particles.spawnFeatureBurst(featureName, intensity, origin, audioFeatures, segmentIntensityBoost, performance.now() / 1000);
    }

    public applyShaderUniform(name: string, value: any) {
        this.particles.applyShaderUniform(name, value);
    }

    public getParticles() {
        return this.particles;
    }

    public dispose() {
        this.particles.dispose();
    }
}
