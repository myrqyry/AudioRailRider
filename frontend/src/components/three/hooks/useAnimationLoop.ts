import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AppStatus, TrackData, FrameAnalysis } from 'shared/types';
import { SceneManager } from '../../../lib/SceneManager';
import { RideCamera } from '../../../lib/RideCamera';
import { VisualEffectsOrchestrator } from '../../../lib/visual-effects/VisualEffectsOrchestrator';

const DEFAULT_PATH_SPEED = 50;

/**
 * A custom hook to manage the main animation loop for the Three.js scene.
 * It starts, stops, and drives the animation based on the application status.
 *
 * @param {AppStatus} status - The current status of the application.
 * @param {TrackData | null} trackData - The generated track data.
 * @param {HTMLAudioElement | null} audioEl - The audio element for timing.
 * @param {SceneManager | null} sceneManager - The SceneManager instance.
 * @param {RideCamera | null} rideCamera - The RideCamera instance.
 * @param {VisualEffects | null} visualEffects - The VisualEffects instance.
 * @param {() => void} onRideFinish - Callback to execute when the ride finishes.
 */
export const useAnimationLoop = (
  status: AppStatus,
  trackData: TrackData | null,
  audioEl: HTMLAudioElement | null,
  sceneManager: SceneManager | null,
  rideCamera: RideCamera | null,
  visualEffects: VisualEffectsOrchestrator | null,
  onRideFinish: () => void,
) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (status === AppStatus.Idle || !trackData || !sceneManager || !rideCamera || !visualEffects) {
      if (animationFrameId.current) {
        console.log('[useAnimationLoop] Stopping animation loop.');
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    console.log('[useAnimationLoop] Starting animation loop.');

    const clock = new THREE.Clock();
    let currentFrameIndex = 0;
    let lastLoggedProgress = -1;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const audioTime = audioEl?.currentTime || 0;

      const audioDuration = audioEl?.duration;
      const duration = (audioDuration && isFinite(audioDuration))
        ? audioDuration
        : trackData.path.length / DEFAULT_PATH_SPEED;

      const progress = status === AppStatus.Riding
        ? audioTime / duration
        : (elapsedTime * 0.05) % 1;

      if (status === AppStatus.Riding && progress >= 1) {
        onRideFinish();
        return;
      }

      if (status === AppStatus.Riding) {
        const rounded = Math.floor(progress * 20) / 20; // log at ~5% intervals
        if (rounded !== lastLoggedProgress) {
          lastLoggedProgress = rounded;
          console.log('[useAnimationLoop] Ride progress', {
            progress: Number(progress.toFixed(3)),
            audioTime: Number(audioTime.toFixed(2)),
            duration: Number(duration.toFixed(2))
          });
        }
      }

      try {
        rideCamera.update(progress);

        let currentFrame: FrameAnalysis | null = null;
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

        if (currentFrame) {
            const audioData = {
                bass: currentFrame.bands.bass,
                mid: currentFrame.bands.mid,
                treble: currentFrame.bands.treble,
                energy: currentFrame.energy,
            };
            sceneManager.updatePostProcessing(audioData);
        }

        sceneManager.render(clock.getDelta());
      } catch (error) {
        console.error('Error during animation frame:', error);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [status, trackData, audioEl, sceneManager, rideCamera, visualEffects, onRideFinish]);
};