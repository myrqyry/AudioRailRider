import * as THREE from 'three';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Glitch, Vignette, RenderPass } from 'postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

export interface AudioData {
    bass: number;
    mid: number;
    treble: number;
    energy: number;
}

export class AudioReactivePostProcessing {
    private composer: EffectComposer;
    private bloom: Bloom;
    private chromaticAberration: ChromaticAberration;
    private glitch: Glitch;
    private smoothedAudio: AudioData = { bass: 0, mid: 0, treble: 0, energy: 0 };

    constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
        this.composer = new EffectComposer(renderer);
        this.composer.addPass(new RenderPass(scene, camera));

        this.bloom = new Bloom({
            intensity: 0.5,
            luminanceThreshold: 0.9,
            luminanceSmoothing: 0.9,
            mipmapBlur: true,
        });

        this.chromaticAberration = new ChromaticAberration({
            blendFunction: BlendFunction.NORMAL,
            offset: new THREE.Vector2(0.001, 0.001),
        });

        this.glitch = new Glitch({
            delay: new THREE.Vector2(0.5, 1.0),
            duration: new THREE.Vector2(0.1, 0.3),
            strength: new THREE.Vector2(0, 0),
            mode: GlitchMode.SPORADIC,
        });

        const vignette = new Vignette({
            offset: 0.3,
            darkness: 0.6,
            blendFunction: BlendFunction.NORMAL,
        });

        this.composer.addPass(this.bloom);
        this.composer.addPass(this.chromaticAberration);
        this.composer.addPass(this.glitch);
        this.composer.addPass(vignette);
    }

    public update(audioData: AudioData, intensity = 1.0) {
        const smoothingFactor = 0.15;

        this.smoothedAudio.bass += (audioData.bass - this.smoothedAudio.bass) * smoothingFactor;
        this.smoothedAudio.mid += (audioData.mid - this.smoothedAudio.mid) * smoothingFactor;
        this.smoothedAudio.treble += (audioData.treble - this.smoothedAudio.treble) * smoothingFactor;
        this.smoothedAudio.energy += (audioData.energy - this.smoothedAudio.energy) * smoothingFactor;

        this.bloom.intensity = THREE.MathUtils.lerp(0.5, 3.0, this.smoothedAudio.bass * intensity);
        this.bloom.luminanceThreshold = THREE.MathUtils.lerp(0.9, 0.3, this.smoothedAudio.energy);

        const chromaticOffsetValue = this.smoothedAudio.treble * 0.003 * intensity;
        this.chromaticAberration.offset.set(chromaticOffsetValue, chromaticOffsetValue);

        if (this.smoothedAudio.energy > 0.85) {
            const glitchAmount = THREE.MathUtils.lerp(0.1, 0.6, (this.smoothedAudio.energy - 0.85) / 0.15);
            this.glitch.strength.set(glitchAmount, glitchAmount);
        } else {
            this.glitch.strength.set(0, 0);
        }
    }

    public render(deltaTime: number) {
        this.composer.render(deltaTime);
    }

    public setSize(width: number, height: number) {
        this.composer.setSize(width, height);
    }
}
