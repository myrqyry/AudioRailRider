import React, { useRef, memo } from 'react';
import { AppStatus } from 'shared/types';
import { useAppStore } from '../lib/store';
import { ThreeCanvasCore } from './three';

/**
 * The main container component for the Three.js scene.
 * Its primary responsibilities are to render the mounting div for the canvas
 * and to host the ThreeCanvasCore component, which contains all the
 * underlying logic for rendering, animation, and event handling.
 *
 * This component is kept minimal to act as a clean entry point into the 3D scene.
 *
 * @returns {React.ReactElement} The rendered div element that hosts the canvas.
 */
const ThreeCanvas: React.FC = () => {
  const status = useAppStore((state) => state.status);
  const mountRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-10 w-full h-full"
      style={{ opacity: status === AppStatus.Riding ? 1 : 0.5 }}
    >
      {/* The Core component handles all the Three.js logic. */}
      <ThreeCanvasCore mountRef={mountRef} />
    </div>
  );
};

export default memo(ThreeCanvas);