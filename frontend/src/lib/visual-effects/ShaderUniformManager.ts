import * as THREE from 'three';

export class ShaderUniformManager {
    private trackMaterial: THREE.MeshStandardMaterial;
    private ghostRibbonMaterial: THREE.ShaderMaterial;
    private trackShaderUniforms: Record<string, THREE.IUniform> | null = null;
    private motionUniformsBound: boolean = false;
    private previousTrackModelViewMatrix: THREE.Matrix4 = new THREE.Matrix4();
    private hasPreviousModelViewMatrix: boolean = false;

    constructor(trackMaterial: THREE.MeshStandardMaterial, ghostRibbonMaterial: THREE.ShaderMaterial) {
        this.trackMaterial = trackMaterial;
        this.ghostRibbonMaterial = ghostRibbonMaterial;
        this.trackMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.trackTime = { value: 0 };
            shader.uniforms.pulseIntensity = { value: 0 };
            shader.uniforms.segmentBoost = { value: 1 };
            shader.uniforms.audioFlow = { value: 0 };
            shader.uniforms.ghostTintA = { value: new THREE.Color('#cfe9ff') };
            shader.uniforms.ghostTintB = { value: new THREE.Color('#ffdff9') };
            shader.uniforms.distortionStrength = { value: 0 };
            shader.uniforms.bassIntensity = { value: 0 };
            shader.uniforms.trebleIntensity = { value: 0 };
            shader.uniforms.rideSpeed = { value: 0 };
            shader.uniforms.motionBlur = { value: 0 };
            shader.uniforms.cameraDirection = { value: new THREE.Vector3() };
            shader.uniforms.previousModelViewMatrix = { value: new THREE.Matrix4() };
            shader.uniforms.breathingStrength = { value: 0 };
            shader.uniforms.breathingRate = { value: 0 };
            shader.uniforms.spectralCentroid = { value: 0 };
            shader.uniforms.energy = { value: 0 };

            shader.fragmentShader = shader.fragmentShader
              .replace(
                '#include <common>',
                `#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
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
float railCenterLine = abs(vUv.x - 0.5) * 2.0;
float railShine = smoothstep(0.35, 0.85, 1.0 - railCenterLine);
float loopWave = sin(pathV * 24.0 - trackTime * 5.5);
float traveler = smoothstep(0.05, 0.95, fract(pathV - trackTime * 0.35));
float spirit = pulseIntensity + audioFlow * 0.35 + segmentBoost * 0.2;
vec3 energyColorBase = mix(ghostTintA, ghostTintB, clamp(pathV + sin(trackTime * 3.0) * 0.08, 0.0, 1.0));
vec3 dreamTint = energyColorBase * (0.35 + 0.25 * traveler + 0.2 * max(loopWave, 0.0));
vec3 totalEmissiveRadiance = emissive + dreamTint * spirit;
`
              );

            shader.vertexShader = shader.vertexShader
              .replace(
                '#include <common>',
                `#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
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
float motionRibbon = sin(vPath * 18.0 + trackTime * 2.0);
float ribbonIntensity = distortionStrength * (0.2 + 0.3 * motionRibbon);
transformed += normal * ribbonIntensity;
vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
`
              );

            this.trackShaderUniforms = shader.uniforms as Record<string, THREE.IUniform>;
            this.motionUniformsBound = false;
        };
    }

    public update(
        elapsedTime: number,
        trackPulse: number,
        segmentIntensityBoost: number,
        gpuAudioForce: number,
        audioFeatures: Record<string, number>,
        rideSpeed: number,
        trackTintA: THREE.Color,
        trackTintB: THREE.Color
    ) {
        if (this.trackShaderUniforms) {
            this.updateUniformSafe(this.trackShaderUniforms.trackTime, elapsedTime, 1e-2);
            this.updateUniformSafe(this.trackShaderUniforms.pulseIntensity, trackPulse);
            this.updateUniformSafe(this.trackShaderUniforms.segmentBoost, segmentIntensityBoost, 1e-3);
            this.updateUniformSafe(this.trackShaderUniforms.audioFlow, Math.min(1.2, gpuAudioForce * 0.25));
            this.updateUniformSafe(this.trackShaderUniforms.distortionStrength, Math.min(0.6, 0.2 + trackPulse * 0.5 + segmentIntensityBoost * 0.1));
            this.updateUniformSafe(this.trackShaderUniforms.bassIntensity, audioFeatures.bass || 0);
            this.updateUniformSafe(this.trackShaderUniforms.trebleIntensity, audioFeatures.treble || 0);
            this.updateUniformSafe(this.trackShaderUniforms.rideSpeed, rideSpeed, 1e-3);
            this.updateUniformSafe(this.trackShaderUniforms.motionBlur, Math.min(1.0, rideSpeed * 0.12), 1e-3);
            this.updateUniformSafe(this.trackShaderUniforms.breathingStrength, Math.min(0.8, 0.1 + segmentIntensityBoost * 0.3));
            this.updateUniformSafe(this.trackShaderUniforms.breathingRate, 0.5 + (audioFeatures.energy || 0) * 2.0);
            this.updateUniformSafe(this.trackShaderUniforms.spectralCentroid, audioFeatures.spectralCentroid || 0);
            this.updateUniformSafe(this.trackShaderUniforms.energy, audioFeatures.energy || 0);
        }

        if (this.ghostRibbonMaterial) {
            const uniforms = this.ghostRibbonMaterial.uniforms;
            this.updateUniformSafe(uniforms.time, elapsedTime, 1e-2);
            this.updateUniformSafe(uniforms.audioPulse, Math.min(1.8, trackPulse * 1.1 + gpuAudioForce * 0.1));
            this.updateColorUniformSafe(uniforms.colorInner, trackTintA);
            this.updateColorUniformSafe(uniforms.colorOuter, trackTintB);
        }
    }

    private updateUniformSafe(uniform: THREE.IUniform, newValue: number, epsilon = 1e-3): boolean {
        if (uniform && uniform.value !== undefined && Math.abs(uniform.value - newValue) > epsilon) {
            uniform.value = newValue;
            return true;
        }
        return false;
    }

    private updateColorUniformSafe(uniform: THREE.IUniform, newColor: THREE.Color, epsilon = 1e-3): boolean {
        if (!uniform) {
            return false;
        }

        const existing = uniform.value as THREE.Color | THREE.Vector3 | undefined;

        // If no usable value is present yet, initialize directly to the target color.
        if (!existing || typeof existing !== 'object') {
            uniform.value = newColor.clone();
            return true;
        }

        const value = existing;

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
}
