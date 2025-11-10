import { useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface AudioEffectsFeatures {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

interface Props {
  features: AudioEffectsFeatures | null;
}

// Post-processing tuned for subtle, stable audio reactivity.
export function AudioReactivePostProcessing({ features }: Props) {
  const bloomRef = useRef<any>(null);
  const chromaRef = useRef<any>(null);
  const smooth = useRef<AudioEffectsFeatures>({ bass: 0, mid: 0, treble: 0, energy: 0 });

  useFrame(() => {
    if (!features) return;
    const f = features;
    const s = smooth.current;
    const k = 0.18;

    s.bass += (f.bass - s.bass) * k;
    s.mid += (f.mid - s.mid) * k;
    s.treble += (f.treble - s.treble) * k;
    s.energy += (f.energy - s.energy) * k;

    if (bloomRef.current) {
      bloomRef.current.intensity = THREE.MathUtils.lerp(0.2, 1.6, THREE.MathUtils.clamp(s.bass, 0, 1));
      bloomRef.current.luminanceThreshold = THREE.MathUtils.lerp(0.9, 0.4, THREE.MathUtils.clamp(s.energy, 0, 1));
    }

    if (chromaRef.current) {
      const amt = THREE.MathUtils.clamp(s.treble, 0, 1) * 0.0025;
      chromaRef.current.offset = new THREE.Vector2(amt, amt);
    }
  });

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        ref={bloomRef}
        intensity={0.25}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <ChromaticAberration
        ref={chromaRef}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
      />
      <Vignette
        offset={0.25}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
