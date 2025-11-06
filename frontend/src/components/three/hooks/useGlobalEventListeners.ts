import { useEffect } from 'react';
import { VisualEffectsOrchestrator } from '../../../lib/visual-effects/VisualEffectsOrchestrator';
import { RideCamera } from '../../../lib/RideCamera';
import { FrameAnalysis } from 'shared/types';

/**
 * A custom hook to manage all global event listeners for the Three.js scene.
 * This includes listeners for real-time audio analysis frames and developer tools.
 *
 * @param {React.RefObject<VisualEffectsOrchestrator | null>} visualEffectsRef - Ref to the VisualEffectsOrchestrator instance.
 * @param {React.RefObject<RideCamera | null>} rideCameraRef - Ref to the RideCamera instance.
 */
export const useGlobalEventListeners = (
  visualEffectsRef: React.RefObject<VisualEffectsOrchestrator | null>,
  rideCameraRef: React.RefObject<RideCamera | null>
) => {
  useEffect(() => {
    const ve = visualEffectsRef.current;
    if (!ve) return;

    // --- Main Audio Frame Handler ---
    const handleFrame = (ev: Event) => {
      try {
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

    // --- Developer Tool Event Handlers ---
    const handleDevCurlParams = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as any;
      if (detail) ve.setCurlParams({ curlStrength: detail.curlStrength, noiseScale: detail.noiseScale, noiseSpeed: detail.noiseSpeed });
    };

    const handleDevApplyUniform = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as any;
      if (detail) ve.applyShaderUniform(detail.name, detail.value);
    };

    const handleDevTrackSettings = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as any;
      if (!detail) return;
      if (typeof ve.setTrackSettings === 'function') ve.setTrackSettings(detail);
      const rc = rideCameraRef.current;
      if (rc && typeof rc.setTrackRadius === 'function' && typeof detail.trackRadius === 'number') {
        rc.setTrackRadius(detail.trackRadius);
      }
    };

    const handleDevForceTrackInside = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as any;
      if (detail && typeof ve.forceTrackInside === 'function') ve.forceTrackInside(!!detail.force);
    };

    const handleDevRebuildTrack = () => {
      if (typeof ve.rebuildTrackGeometry === 'function') ve.rebuildTrackGeometry();
    };

    const handleDevLoadManifest = async () => {
      try {
        const resp = await fetch('/shaders/shader-uniforms.json');
        if (!resp.ok) return;
        const manifest = await resp.json();
        ve.setShaderUniformsFromManifest(manifest);
      } catch (e) {
        console.error('[useGlobalEventListeners] Failed to load shader manifest:', e);
      }
    };

    // --- Registering Event Listeners ---
    const eventMap: { [key: string]: EventListener } = {
        'audiorailrider:frame': handleFrame as EventListener,
        'audiorailrider:dev:setCurlParams': handleDevCurlParams as EventListener,
        'audiorailrider:dev:applyUniform': handleDevApplyUniform as EventListener,
        'audiorailrider:dev:loadUniformsManifest': handleDevLoadManifest as EventListener,
        'audiorailrider:dev:setTrackSettings': handleDevTrackSettings as EventListener,
        'audiorailrider:dev:forceTrackInside': handleDevForceTrackInside as EventListener,
        'audiorailrider:dev:rebuildTrack': handleDevRebuildTrack as EventListener,
    };

    console.log('[useGlobalEventListeners] Adding event listeners.');
    Object.entries(eventMap).forEach(([event, handler]) => {
        window.addEventListener(event, handler);
    });

    return () => {
      console.log('[useGlobalEventListeners] Removing event listeners.');
      Object.entries(eventMap).forEach(([event, handler]) => {
          window.removeEventListener(event, handler);
      });
    };
  }, [visualEffectsRef, rideCameraRef]);
};