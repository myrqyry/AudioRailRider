import React, { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { useWebGLContextRecovery } from './hooks/useWebGLContextRecovery';
import { useSceneManager } from './hooks/useSceneManager';
import { useTrackComposer } from './hooks/useTrackComposer';
import { useRide } from './hooks/useRide';
import { useGlobalEventListeners } from './hooks/useGlobalEventListeners';
import { useAnimationLoop } from './hooks/useAnimationLoop';
import { useAudioAnalysis } from '../../lib/useAudioAnalysis';

interface ThreeCanvasCoreProps {
  mountRef: React.RefObject<HTMLDivElement>;
}

/**
 * The core component for the Three.js scene, responsible for orchestrating all hooks and logic.
 * This component is kept separate from the main export to allow for better composition and
 * to keep the main `ThreeCanvas` component clean.
 * @param {ThreeCanvasCoreProps} props The props for the component.
 * @returns {null} This component does not render any DOM elements itself.
 */
export const ThreeCanvasCore: React.FC<ThreeCanvasCoreProps> = ({ mountRef }) => {
  // Global state selectors
  const status = useAppStore((state) => state.status);
  const blueprint = useAppStore((state) => state.blueprint);
  const audioFeatures = useAppStore((state) => state.audioFeatures);
  const trackData = useAppStore((state) => state.trackData);
  const audioFile = useAppStore((state) => state.audioFile);
  const skyboxUrl = useAppStore((state) => state.skyboxUrl);
  const onRideFinish = useAppStore((state) => state.actions.handleRideFinish);

  // --- Hooks ---

  // 1. Manages WebGL context loss and provides a recovery trigger
  const recoveryTrigger = useWebGLContextRecovery();

  // 2. Initializes and cleans up the main SceneManager
  const sceneManagerRef = useSceneManager(mountRef);

  // 3. Composes the track data when blueprint and audio features are ready
  useTrackComposer(blueprint, audioFeatures);

  // 4. Connects to the Web Audio API for real-time analysis
  const { audioRef } = useAudioAnalysis({ audioFile, status });

  // 5. Creates the ride camera and visual effects when track data is available
  const { rideCameraRef, visualEffectsRef } = useRide(sceneManagerRef.current, trackData, recoveryTrigger);

  // 6. Listens for global events (audio frames, dev tools)
  useGlobalEventListeners(visualEffectsRef, rideCameraRef);

  // 7. Manages the main animation loop
  useAnimationLoop(
    status,
    trackData,
    audioRef.current,
    sceneManagerRef.current,
    rideCameraRef.current,
    visualEffectsRef.current,
    onRideFinish
  );

  // Note: AudioReactivePostProcessing (R3F-based) is mounted inside the Three.js scene layer,
  // not here, so any postprocessing runtime mismatch will not crash the controller.

  // --- Effects ---

  // Effect to apply the skybox when the URL is available from the store
  useEffect(() => {
    const sceneManager = sceneManagerRef.current;
    if (!sceneManager || !skyboxUrl) return;
    try {
      console.log('[ThreeCanvasCore] Applying skybox from store', skyboxUrl);
      sceneManager.updateSkybox(skyboxUrl);
    } catch (e) {
      console.warn('[ThreeCanvasCore] Failed to apply skybox from store', e);
    }
  }, [skyboxUrl, sceneManagerRef]);

  return null; // This component is a controller, it doesn't render DOM
};