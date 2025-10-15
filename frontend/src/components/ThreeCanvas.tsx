import React, { useRef, useEffect, memo, useState } from 'react';
import * as THREE from 'three';
import { AppStatus, TrackData, FrameAnalysis } from 'shared/types';
import { useAudioAnalysis } from '../lib/useAudioAnalysis';
import { useAppStore } from '../lib/store';
import { SceneManager } from '../lib/SceneManager';
import { RideCamera } from '../lib/RideCamera';
import { VisualEffects } from '../lib/VisualEffects';
// Skybox generation is now initiated by the workflow; ThreeCanvas will apply
// the resulting image URL from the global store when it becomes available.

const ThreeCanvas: React.FC = () => {
  const status = useAppStore((state) => state.status);
  const trackData = useAppStore((state) => state.trackData);
  const audioFile = useAppStore((state) => state.audioFile);
  const onRideFinish = useAppStore((state) => state.actions.handleRideFinish);
  const skyboxUrl = useAppStore((state) => state.skyboxUrl);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const rideCameraRef = useRef<RideCamera | null>(null);
  const visualEffectsRef = useRef<VisualEffects | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const gpuInitRequestedRef = useRef(false);
  const [recoveryTrigger, setRecoveryTrigger] = useState(0);

  const { audioRef } = useAudioAnalysis({ audioFile, status });

  // Effect for handling WebGL context loss and restoration
  useEffect(() => {
    const handleContextLost = () => {
      console.warn('[ThreeCanvas] WebGL context lost. Ride will pause and attempt to recover on context restoration.');
      // The animation loop will likely be stopped by the browser. We just need to be ready to recover.
    };

    const handleContextRestored = () => {
      console.log('[ThreeCanvas] WebGL context restored. Triggering scene rebuild.');
      setRecoveryTrigger(t => t + 1);
    };

    window.addEventListener('audiorailrider:webglcontextlost', handleContextLost);
    window.addEventListener('audiorailrider:webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('audiorailrider:webglcontextlost', handleContextLost);
      window.removeEventListener('audiorailrider:webglcontextrestored', handleContextRestored);
    };
  }, []);

  // Effect for scene initialization and disposal
  useEffect(() => {
    if (!mountRef.current) {
      console.error('[ThreeCanvas] mountRef.current is null!');
      return;
    }
    const container = mountRef.current;
    console.log('[ThreeCanvas] Initializing SceneManager', { width: container.clientWidth, height: container.clientHeight });
    sceneManagerRef.current = new SceneManager(container);
    console.log('[ThreeCanvas] SceneManager initialized', { hasScene: !!sceneManagerRef.current.scene, hasCamera: !!sceneManagerRef.current.camera });

    return () => {
      console.log('[ThreeCanvas] Cleaning up scene');
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      visualEffectsRef.current?.dispose();
      sceneManagerRef.current?.dispose();
      visualEffectsRef.current = null;
      sceneManagerRef.current = null;
    };
  }, []);

  // Effect for building the ride when trackData is ready or on recovery
  useEffect(() => {
    const sceneManager = sceneManagerRef.current;
    if (!sceneManager || !trackData) {
      console.log('[ThreeCanvas] Cannot build ride - missing requirements', { hasSceneManager: !!sceneManager, hasTrackData: !!trackData });
      return;
    }

    console.log('[ThreeCanvas] Building ride from trackData', { pathLength: trackData.path.length, rideName: trackData.rideName, recoveryTrigger });

    // Clean up previous ride visuals
    visualEffectsRef.current?.dispose();

    rideCameraRef.current = new RideCamera(sceneManager.camera, trackData);
    console.log('[ThreeCanvas] RideCamera created');
    visualEffectsRef.current = new VisualEffects(sceneManager.scene, trackData, sceneManager.camera);
    console.log('[ThreeCanvas] VisualEffects created');
    gpuInitRequestedRef.current = false;
    const renderer = sceneManager.renderer;
    if (visualEffectsRef.current && renderer && !gpuInitRequestedRef.current) {
      gpuInitRequestedRef.current = true;
      visualEffectsRef.current.initGPU(renderer)
        .then(() => console.log('[ThreeCanvas] GPU particle system ready'))
        .catch((error) => {
          const message = error instanceof Error ? error.message : String(error);
          console.info('[ThreeCanvas] GPU particle init skipped', message);
        });
    }
  }, [trackData, recoveryTrigger]);

  // Apply skybox from the global store when it becomes available
  useEffect(() => {
    const sceneManager = sceneManagerRef.current;
    if (!sceneManager) return;
    if (!skyboxUrl) return;
    try {
      console.log('[ThreeCanvas] Applying skybox from store', skyboxUrl);
      sceneManager.updateSkybox(skyboxUrl);
    } catch (e) {
      console.warn('[ThreeCanvas] Failed to apply skybox from store', e);
    }
  }, [skyboxUrl]);

  // Wire low-latency audio frames (dispatched by useAudioAnalysis) to VisualEffects.
  useEffect(() => {
    const handler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const detail = (ev as CustomEvent).detail as FrameAnalysis;
        if (!detail) return;
        const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
        const spectralFlux = detail.spectralFlux ?? 0;
        const spectralCentroid = detail.spectralCentroid ?? 0;
        const energy = detail.energy ?? 0;
        const bass = detail.bass ?? 0;
        const mid = detail.mid ?? 0;
        const high = detail.high ?? 0;
        ve.setAudioFeatures({
          subBass: clamp01(bass * 0.75),
          bass: clamp01(bass),
          lowMid: clamp01(mid * 0.85),
          mid: clamp01(mid),
          highMid: clamp01((mid * 0.4) + (high * 0.6)),
          treble: clamp01(high),
          sparkle: clamp01((spectralFlux * 0.6) + (spectralCentroid / 6000) + (energy * 0.1)),
        });
        ve.setAudioForce((energy * 2.0) + (spectralFlux * 1.5));
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

    const devTrackHandler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const detail = (ev as CustomEvent).detail as any;
        if (!detail) return;
        if (typeof ve.setTrackSettings === 'function') ve.setTrackSettings(detail);
        const rc = rideCameraRef.current;
        if (rc && typeof rc.setTrackRadius === 'function' && typeof detail.trackRadius === 'number') {
          rc.setTrackRadius(detail.trackRadius);
        }
      } catch (e) {}
    };

    const forceTrackHandler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        const detail = (ev as CustomEvent).detail as any;
        if (!detail) return;
        if (typeof ve.forceTrackInside === 'function') ve.forceTrackInside(!!detail.force);
      } catch (e) {}
    };

    const rebuildTrackHandler = (ev: Event) => {
      try {
        const ve = visualEffectsRef.current;
        if (!ve) return;
        if (typeof ve.rebuildTrackGeometry === 'function') ve.rebuildTrackGeometry();
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
    window.addEventListener('audiorailrider:dev:setTrackSettings', devTrackHandler as EventListener);
    window.addEventListener('audiorailrider:dev:forceTrackInside', forceTrackHandler as EventListener);
    window.addEventListener('audiorailrider:dev:rebuildTrack', rebuildTrackHandler as EventListener);
    return () => {
      window.removeEventListener('audiorailrider:frame', handler as EventListener);
      window.removeEventListener('audiorailrider:dev:setCurlParams', devHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:applyUniform', applyUniformHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:loadUniformsManifest', loadManifestHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:setTrackSettings', devTrackHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:forceTrackInside', forceTrackHandler as EventListener);
      window.removeEventListener('audiorailrider:dev:rebuildTrack', rebuildTrackHandler as EventListener);
    };
  }, []);

  // Effect for managing the animation loop
  useEffect(() => {
    console.log('[ThreeCanvas] Animation effect triggered', { status, hasTrackData: !!trackData, hasAudioFile: !!audioFile });
    
    if (status === AppStatus.Idle || !trackData || !audioFile) {
      if (animationFrameId.current) {
        console.log('[ThreeCanvas] Stopping animation loop');
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    console.log('[ThreeCanvas] Starting animation loop');

  const clock = new THREE.Clock();
  let currentFrameIndex = 0;
  let lastLoggedProgress = -1;

    const DEFAULT_PATH_SPEED = 50;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const audioTime = audioRef.current?.currentTime || 0;

      const audioDuration = audioRef.current?.duration;
      const duration = (audioDuration && isFinite(audioDuration))
        ? audioDuration
        : trackData.path.length / DEFAULT_PATH_SPEED;

      const sceneManager = sceneManagerRef.current;
      const rideCamera = rideCameraRef.current;
      const visualEffects = visualEffectsRef.current;

      if (!sceneManager || !rideCamera || !visualEffects) {
        return;
      }

      if (status === AppStatus.Riding && audioRef.current?.ended) {
        onRideFinish();
        return;
      }

      const progress = status === AppStatus.Riding
          ? audioTime / duration
          : (elapsedTime * 0.05) % 1;

      if (status === AppStatus.Riding) {
        const rounded = Math.floor(progress * 20) / 20; // log at ~5% intervals
        if (rounded !== lastLoggedProgress) {
          lastLoggedProgress = rounded;
          console.log('[ThreeCanvas] Ride progress', {
            progress: Number(progress.toFixed(3)),
            audioTime: Number(audioTime.toFixed(2)),
            duration: Number(duration.toFixed(2))
          });
        }
      }

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
          Math.max(0, Math.min(1, progress)),
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

  return <div ref={mountRef} className="fixed inset-0 z-10 w-full h-full" style={{ opacity: status === AppStatus.Riding ? 1 : 0.5 }} />;
};

export default memo(ThreeCanvas);