import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AppStatus } from '../../types';
import { useAudioAnalysis } from '../lib/useAudioAnalysis';
import { useAppStore } from '../lib/store';
import { SceneManager } from '../lib/SceneManager';
import { RideCamera } from '../lib/RideCamera';
import { VisualEffects } from '../lib/VisualEffects';

const ThreeCanvas: React.FC = () => {
  const status = useAppStore((state) => state.status);
  const trackData = useAppStore((state) => state.trackData);
  const audioFile = useAppStore((state) => state.audioFile);
  const onRideFinish = useAppStore((state) => state.actions.handleRideFinish);

  const mountRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const isUnmounting = useRef(false);

  const { audioRef, featuresRef } = useAudioAnalysis({ audioFile, status });
    
  useEffect(() => {
    if (!mountRef.current || !trackData || !audioFile || status === AppStatus.Idle) {
        return;
    }
    
    isUnmounting.current = false;
    const container = mountRef.current;
    const clock = new THREE.Clock();

  const DEFAULT_PATH_SPEED = 50; // units per second
  const audioDuration = audioRef.current?.duration;
  const duration = (audioDuration && isFinite(audioDuration))
    ? audioDuration
    : trackData.path.length / DEFAULT_PATH_SPEED;

  const sceneManager = new SceneManager(container);
  const rideCamera = new RideCamera(sceneManager.camera, trackData);
  const visualEffects = new VisualEffects(sceneManager.scene, trackData);

  const animate = () => {
    if (isUnmounting.current) return;
    animationFrameId.current = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (
      status === AppStatus.Riding &&
      audioRef.current &&
      audioRef.current.ended
    ) {
      onRideFinish();
      return;
    }

    const audioTime = audioRef.current?.currentTime || 0;
    const progress =
      status === AppStatus.Riding
        ? audioTime / duration
        : (elapsedTime * 0.05) % 1;

    // Wrap per-frame updates and rendering in a try/catch
    try {
      rideCamera.update(progress);
      visualEffects.update(
        elapsedTime,
        featuresRef.current,
        sceneManager.camera.position
      );
      sceneManager.render();
    } catch (error) {
      console.error('Error during animation frame:', error);
      // Optionally cancel the animation on critical failures:
      // cancelAnimationFrame(animationFrameId.current);
    }
  };
    
  animate();

  return () => {
    isUnmounting.current = true;
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    sceneManager.dispose();
  };
  }, [status, trackData, audioFile, onRideFinish]);

  return <div ref={mountRef} className={`fixed inset-0 z-0 transition-opacity duration-1000 ${status === AppStatus.Riding ? 'opacity-100' : 'opacity-50'}`} />;
};

export default ThreeCanvas;
