import { useRef, useEffect } from 'react';
import { SceneManager } from '../../../lib/SceneManager';

/**
 * A custom hook to manage the lifecycle of the Three.js SceneManager.
 * It initializes the SceneManager on component mount and disposes of it on unmount.
 *
 * @param {React.RefObject<HTMLDivElement>} mountRef - A ref to the container div for the canvas.
 * @returns {React.MutableRefObject<SceneManager | null>} A ref containing the SceneManager instance.
 */
export const useSceneManager = (mountRef: React.RefObject<HTMLDivElement>) => {
  const sceneManagerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.error('[useSceneManager] mountRef.current is null!');
      return;
    }
    const container = mountRef.current;
    console.log('[useSceneManager] Initializing SceneManager', { width: container.clientWidth, height: container.clientHeight });
    sceneManagerRef.current = new SceneManager(container);
    console.log('[useSceneManager] SceneManager initialized', { hasScene: !!sceneManagerRef.current.scene, hasCamera: !!sceneManagerRef.current.camera });

    return () => {
      console.log('[useSceneManager] Cleaning up scene');
      sceneManagerRef.current?.dispose();
      sceneManagerRef.current = null;
    };
  }, [mountRef]);

  return sceneManagerRef;
};