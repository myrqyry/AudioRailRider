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
      return;
    }
    const container = mountRef.current;
    sceneManagerRef.current = new SceneManager(container);

    return () => {
      sceneManagerRef.current?.dispose();
      sceneManagerRef.current = null;
    };
  }, [mountRef]);

  return sceneManagerRef;
};