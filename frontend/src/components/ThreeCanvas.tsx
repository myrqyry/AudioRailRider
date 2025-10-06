import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { AppStatus, TrackData, FrameAnalysis } from 'shared/types';
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

  // Wire low-latency audio frames (dispatched by useAudioAnalysis) to VisualEffects.
  useEffect(() => {
    // Handlers will read the current VisualEffects ref at event time so
    // they don't depend on initialization order and won't throw when
    // the VisualEffects instance is recreated during hot reload or errors.
    const handler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const detail = (ev as CustomEvent).detail as FrameAnalysis;
        if (!detail) return;
        // Map frame bands to visual features and push audioForce
        ve.setAudioFeatures({ bass: detail.bass, mid: detail.mid, treble: detail.high });
        ve.setAudioForce(detail.energy * 2.0 + detail.spectralFlux * 1.5);
      } catch (e) {
        // ignore malformed events
      }
    };

    const devHandler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const detail = (ev as CustomEvent).detail as any;
        if (!detail) return;
        ve.setCurlParams({ curlStrength: detail.curlStrength, noiseScale: detail.noiseScale, noiseSpeed: detail.noiseSpeed });
      } catch (e) {}
    };

    const applyUniformHandler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const detail = (ev as CustomEvent).detail as any;
        if (!detail) return;
        ve.applyShaderUniform(detail.name, detail.value);
      } catch (e) {}
    };

    const loadManifestHandler = async (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const resp = await fetch('/shaders/shader-uniforms.json');
        if (!resp.ok) return;
        const manifest = await resp.json();
        ve.setShaderUniformsFromManifest(manifest);
      } catch (e) {}
    };

    window.addEventListener('audiorailrider:frame', handler as EventListener);
    window.addEventListener('audiorailrider:dev:setCurlParams', devHandler as EventListener);
    window.addEventListener('audiorailrider:dev:applyUniform', applyUniformHandler as EventListener);
    window.addEventListener('audiorailrider:dev:loadUniformsManifest', loadManifestHandler as EventListener);
    return () => {
      window.removeEventListener('audiorailrider:frame', handler as EventListener);
      window.removeEventListener('audiorailrider:dev:setCurlParams', devHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:applyUniform', applyUniformHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:loadUniformsManifest', loadManifestHandler as EventListener);
    };
  }, []);

  // Effect for managing the animation loop
  useEffect(() => {
    if (status === AppStatus.Idle || !trackData || !audioFile) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

  // Don't capture .current at effect start — read them each frame to handle
  // hot-reloads or late initialization without throwing on `.current` reads.

    const clock = new THREE.Clock();
    let currentFrameIndex = 0;

    const DEFAULT_PATH_SPEED = 50;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const audioTime = audioRef.current?.currentTime || 0;

      // Read audio duration inside the frame to avoid capturing a possibly
      // uninitialized `audioRef.current` at effect start. Fall back to a
      // duration derived from the track length when audio metadata isn't ready.
      const audioDuration = audioRef.current?.duration;
      const duration = (audioDuration && isFinite(audioDuration))
        ? audioDuration
        : trackData.path.length / DEFAULT_PATH_SPEED;

      const sceneManager = sceneManagerRef.current;
      const rideCamera = rideCameraRef.current;
      const visualEffects = visualEffectsRef.current;

      if (!sceneManager || !rideCamera || !visualEffects) {
        // If a component hasn't been initialized yet, skip this frame.
        return;
      }

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
