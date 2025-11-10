import { useEffect, useRef } from 'react';
import { FrameAnalysis } from 'shared/types';

export interface SmoothedAudioReactiveFeatures {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

// Hook that listens to `audiorailrider:frame` and maintains a smoothed
// set of audio-reactive features for visual systems.
// It is read-only and non-invasive: if no events arrive, it stays at zero.
export const useAudioReactiveFeatures = (): SmoothedAudioReactiveFeatures => {
  const featuresRef = useRef<SmoothedAudioReactiveFeatures>({
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
  });

  useEffect(() => {
    const smoothing = 0.18;

    const handleFrame = (event: Event) => {
      const custom = event as CustomEvent<FrameAnalysis>;
      const frame = custom.detail;
      if (!frame) return;

      const next = {
        bass: clamp01(frame.bass ?? 0),
        mid: clamp01(frame.mid ?? 0),
        treble: clamp01((frame as any).high ?? 0),
        energy: clamp01(frame.energy ?? 0),
      };

      const current = featuresRef.current;
      featuresRef.current = {
        bass: current.bass + (next.bass - current.bass) * smoothing,
        mid: current.mid + (next.mid - current.mid) * smoothing,
        treble: current.treble + (next.treble - current.treble) * smoothing,
        energy: current.energy + (next.energy - current.energy) * smoothing,
      };
    };

    window.addEventListener('audiorailrider:frame', handleFrame as EventListener);
    return () => {
      window.removeEventListener('audiorailrider:frame', handleFrame as EventListener);
    };
  }, []);

  return featuresRef.current;
};
