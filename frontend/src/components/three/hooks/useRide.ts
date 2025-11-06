import { useRef, useEffect } from 'react';
import { Scene, PerspectiveCamera } from 'three';
import { TrackData } from 'shared/types';
import { RideCamera } from '../../../lib/RideCamera';
import { VisualEffectsOrchestrator } from '../../../lib/visual-effects/VisualEffectsOrchestrator';
import { SceneManager } from '../../../lib/SceneManager';

interface RideRefs {
  rideCameraRef: React.MutableRefObject<RideCamera | null>;
  visualEffectsRef: React.MutableRefObject<VisualEffectsOrchestrator | null>;
}

/**
 * A custom hook to manage the creation and disposal of the ride's camera and visual effects.
 * It initializes these components when track data is available and handles their disposal.
 *
 * @param {SceneManager | null} sceneManager - The main scene manager instance.
 * @param {TrackData | null} trackData - The generated track data.
 * @param {number} recoveryTrigger - A trigger that increments on WebGL context restoration.
 * @returns {RideRefs} Refs to the created RideCamera and VisualEffects instances.
 */
export const useRide = (
  sceneManager: SceneManager | null,
  trackData: TrackData | null,
  recoveryTrigger: number,
): RideRefs => {
  const rideCameraRef = useRef<RideCamera | null>(null);
  const visualEffectsRef = useRef<VisualEffectsOrchestrator | null>(null);
  const gpuInitRequestedRef = useRef(false);

  useEffect(() => {
    if (!sceneManager || !trackData) {
      return;
    }

    // Clean up previous ride visuals before creating new ones
    visualEffectsRef.current?.dispose();
    visualEffectsRef.current = null;
    rideCameraRef.current = null;
    gpuInitRequestedRef.current = false;

    console.log('[useRide] Track data is available. Building ride visuals...');

    if (trackData.path.length > 1) {
      rideCameraRef.current = new RideCamera(sceneManager.camera, trackData);
      visualEffectsRef.current = new VisualEffectsOrchestrator(sceneManager.scene, trackData, sceneManager.camera);
      console.log('[useRide] RideCamera and VisualEffectsOrchestrator created.');

      const renderer = sceneManager.renderer;
      if (visualEffectsRef.current && renderer && !gpuInitRequestedRef.current) {
        gpuInitRequestedRef.current = true;
        visualEffectsRef.current.initGPU(renderer)
          .then(() => console.log('[useRide] GPU particle system ready'))
          .catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.info('[useRide] GPU particle init skipped', message);
          });
      }
    }

    return () => {
      console.log('[useRide] Cleaning up ride visuals.');
      visualEffectsRef.current?.dispose();
      visualEffectsRef.current = null;
      rideCameraRef.current = null;
    };
  }, [trackData, sceneManager, recoveryTrigger]);

  return { rideCameraRef, visualEffectsRef };
};