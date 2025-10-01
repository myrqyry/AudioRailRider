import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { AppStatus, TrackData } from 'shared/types';
import { useAudioAnalysis } from '../lib/useAudioAnalysis';
import { useAppStore } from '../lib/store';
import { SceneManager } from '../lib/SceneManager';
import { RideCamera } from '../lib/RideCamera';
import { VisualEffects } from '../lib/VisualEffects';
import { generateSkyboxImage } from '../services/geminiService';

const ThreeCanvas: React.FC = () => {
  const status = useAppStore((state) => state.status);
  const trackData = useAppStore((state) => state.trackData);
  const audioFile = useAppStore((state) => state.audioFile);
  const onRideFinish = useAppStore((state) => state.actions.handleRideFinish);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const rideCameraRef = useRef<RideCamera | null>(null);
  const visualEffectsRef = useRef<VisualEffects | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const { audioRef } = useAudioAnalysis({ audioFile, status });

  // Effect for scene initialization and disposal
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    sceneManagerRef.current = new SceneManager(container);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      visualEffectsRef.current?.dispose();
      sceneManagerRef.current?.dispose();
      visualEffectsRef.current = null;
      sceneManagerRef.current = null;
    };
  }, []);

  // Effect for building the ride when trackData is ready
  useEffect(() => {
    const sceneManager = sceneManagerRef.current;
    if (!sceneManager || !trackData) return;

    // Clean up previous ride visuals
    visualEffectsRef.current?.dispose();

    rideCameraRef.current = new RideCamera(sceneManager.camera, trackData);
    visualEffectsRef.current = new VisualEffects(sceneManager.scene, trackData);

    // Generate and apply the skybox
    if (trackData.moodDescription) {
      const prompt = `A vast, epic sky that captures the feeling of: "${trackData.moodDescription}". Style: photorealistic, 8k, cinematic lighting.`;
      generateSkyboxImage(prompt)
        .then(imageUrl => {
          sceneManager.updateSkybox(imageUrl);
        })
        .catch(error => {
          console.error("Failed to generate or apply skybox:", error);
        });
    }
  }, [trackData]);

  // Effect for managing the animation loop
  useEffect(() => {
    if (status === AppStatus.Idle || !trackData || !audioFile) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const sceneManager = sceneManagerRef.current;
    const rideCamera = rideCameraRef.current;
    const visualEffects = visualEffectsRef.current;

    if (!sceneManager || !rideCamera || !visualEffects) return;

    const clock = new THREE.Clock();
    let currentFrameIndex = 0;
    
    const DEFAULT_PATH_SPEED = 50;
    const audioDuration = audioRef.current?.duration;
    const duration = (audioDuration && isFinite(audioDuration))
      ? audioDuration
      : trackData.path.length / DEFAULT_PATH_SPEED;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const audioTime = audioRef.current?.currentTime || 0;

      if (status === AppStatus.Riding && audioRef.current?.ended) {
        onRideFinish();
        return;
      }

      const progress = status === AppStatus.Riding
          ? audioTime / duration
          : (elapsedTime * 0.05) % 1;

      try {
        rideCamera.update(progress);

        let currentFrame = null;
        if (trackData.frameAnalyses && trackData.frameAnalyses.length > 0) {
          while (
            currentFrameIndex < trackData.frameAnalyses.length - 1 &&
            trackData.frameAnalyses[currentFrameIndex].timestamp < audioTime
          ) {
            currentFrameIndex++;
          }
          currentFrame = trackData.frameAnalyses[currentFrameIndex];
        }

        visualEffects.update(
          elapsedTime,
          currentFrame,
          sceneManager.camera.position,
          rideCamera.lookAtPos,
        );
        sceneManager.render();
      } catch (error) {
        console.error('Error during animation frame:', error);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [status, trackData, audioFile, onRideFinish, audioRef]);

  return <div ref={mountRef} className={`fixed inset-0 z-0 transition-opacity duration-1000 ${status === AppStatus.Riding ? 'opacity-100' : 'opacity-50'}`} />;
};

export default memo(ThreeCanvas);
