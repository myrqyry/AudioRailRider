import { useState, useEffect } from 'react';

/**
 * A custom hook to manage WebGL context loss and restoration.
 * It listens for custom window events and provides a recovery trigger
 * that increments whenever the context is restored.
 *
 * @returns {number} A recovery trigger that increments on context restoration.
 */
export const useWebGLContextRecovery = (): number => {
  const [recoveryTrigger, setRecoveryTrigger] = useState(0);

  useEffect(() => {
    const handleContextLost = () => {
      console.warn('[useWebGLContextRecovery] WebGL context lost. Ride will pause and attempt to recover on context restoration.');
      // The animation loop will likely be stopped by the browser.
    };

    const handleContextRestored = () => {
      console.log('[useWebGLContextRecovery] WebGL context restored. Triggering scene rebuild.');
      setRecoveryTrigger(t => t + 1);
    };

    window.addEventListener('audiorailrider:webglcontextlost', handleContextLost);
    window.addEventListener('audiorailrider:webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('audiorailrider:webglcontextlost', handleContextLost);
      window.removeEventListener('audiorailrider:webglcontextrestored', handleContextRestored);
    };
  }, []);

  return recoveryTrigger;
};