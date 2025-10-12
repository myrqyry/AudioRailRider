import * as THREE from 'three';
import { FrameAnalysis, SynestheticAtmosphere } from 'shared/types';

interface AtmosphereUpdateParams {
  deltaSeconds: number;
  frame: FrameAnalysis | null;
  audioFeatures: Record<string, number>;
  segmentColor: THREE.Color;
  segmentIntensity: number;
}

/**
 * Centralises sky and fog transitions so the ride atmosphere can breathe with the music
 * without cluttering the main VisualEffects class.
 */
export class AtmosphereController {
  private readonly scene: THREE.Scene;
  private readonly sky: THREE.Object3D | null;
  private readonly fog: THREE.FogExp2 | null;
  private readonly baseSkyTint: THREE.Color;
  private readonly workingColor = new THREE.Color();
  private readonly targetSkyColor = new THREE.Color();
  private readonly tintOverride: THREE.Color | null;

  private synesthetic: SynestheticAtmosphere | null = null;

  constructor(scene: THREE.Scene, baseSkyColor: string, synesthetic: SynestheticAtmosphere | null) {
    this.scene = scene;
    this.sky = scene.getObjectByName('sky') || null;
    this.fog = scene.fog instanceof THREE.FogExp2 ? scene.fog : null;
    this.baseSkyTint = new THREE.Color(baseSkyColor);
    this.tintOverride = synesthetic?.tint ? new THREE.Color(synesthetic.tint) : null;
    this.synesthetic = synesthetic;
  }

  public setSynesthetic(atmosphere: SynestheticAtmosphere | null): void {
    this.synesthetic = atmosphere;
  }

  public update(params: AtmosphereUpdateParams): number {
    const { deltaSeconds, frame, audioFeatures, segmentColor, segmentIntensity } = params;
    const turbulenceBias = this.synesthetic?.turbulenceBias ?? 1.0;
    const passionBias = this.synesthetic?.passionIntensity ?? 1.0;

    const bass = audioFeatures.bass ?? 0;
    const energy = frame?.energy ?? audioFeatures.subBass ?? 0;
    const vocal = Math.max(audioFeatures.mid ?? 0, audioFeatures.highMid ?? 0);

    this.updateSkyUniforms({ deltaSeconds, bass, energy, segmentColor, segmentIntensity, turbulenceBias });
    this.updateFog({ deltaSeconds, bass, energy });

    const passion = Math.min(2.0, 0.7 + passionBias * (0.5 + vocal * 0.9));
    return passion;
  }

  private updateSkyUniforms(args: { deltaSeconds: number; bass: number; energy: number; segmentColor: THREE.Color; segmentIntensity: number; turbulenceBias: number; }): void {
    if (!this.sky) return;
    const material = (this.sky as any).material;
    if (!material || !material.uniforms) return;

    const uniforms = material.uniforms;
    const { deltaSeconds, bass, energy, segmentColor, segmentIntensity, turbulenceBias } = args;
    const targetTurbidity = (10 + bass * 16) * turbulenceBias;
    const targetRayleigh = 2 + bass * 2.5;
    const lerpFactor = THREE.MathUtils.clamp(deltaSeconds * 1.5, 0.02, 0.16);

    if (typeof uniforms.turbidity?.value === 'number') {
      uniforms.turbidity.value = THREE.MathUtils.lerp(uniforms.turbidity.value, targetTurbidity, lerpFactor);
    }
    if (typeof uniforms.rayleigh?.value === 'number') {
      uniforms.rayleigh.value = THREE.MathUtils.lerp(uniforms.rayleigh.value, targetRayleigh, lerpFactor);
    }

    const tintSource = this.tintOverride ?? this.baseSkyTint;
    this.targetSkyColor.copy(tintSource).lerp(segmentColor, THREE.MathUtils.clamp(0.35 + energy * 0.4 + segmentIntensity * 0.15, 0, 1));
    if (uniforms.mieColor?.value instanceof THREE.Color) {
      uniforms.mieColor.value.lerp(this.targetSkyColor, lerpFactor * 0.8);
    }
    if (uniforms.upColor?.value instanceof THREE.Color) {
      uniforms.upColor.value.lerp(this.targetSkyColor, lerpFactor * 0.8);
    }
  }

  private updateFog(args: { deltaSeconds: number; bass: number; energy: number }): void {
    if (!this.fog) return;
    const { deltaSeconds, bass, energy } = args;
    const targetDensity = 0.0025 + energy * 0.005;
    this.fog.density = THREE.MathUtils.lerp(this.fog.density, targetDensity, THREE.MathUtils.clamp(deltaSeconds * 1.8, 0.04, 0.2));
    const targetColor = this.workingColor.copy(this.baseSkyTint).lerp(this.tintOverride ?? this.baseSkyTint, 0.4 + bass * 0.3);
    this.fog.color.lerp(targetColor, THREE.MathUtils.clamp(deltaSeconds * 1.2, 0.04, 0.18));
  }
}
