import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AppStatus } from 'shared/types';
import { useAudioAnalysis } from '../lib/useAudioAnalysis';
import { useAppStore } from '../lib/store';
import { SceneManager } from '../lib/SceneManager';
import { RideCamera } from '../lib/RideCamera';
import { VisualEffects } from '../lib/VisualEffects';
const ThreeCanvas = () => {
    const status = useAppStore((state) => state.status);
    const trackData = useAppStore((state) => state.trackData);
    const audioFile = useAppStore((state) => state.audioFile);
    const onRideFinish = useAppStore((state) => state.actions.handleRideFinish);
    const mountRef = useRef(null);
    const animationFrameId = useRef(null);
    const isUnmounting = useRef(false);
    const { audioRef, featuresRef } = useAudioAnalysis({ audioFile, status });
    useEffect(() => {
        if (!mountRef.current || !trackData || !audioFile || status === AppStatus.Idle) {
            return;
        }
        isUnmounting.current = false;
        const container = mountRef.current;
        const clock = new THREE.Clock();
        const sceneManager = new SceneManager(container);
        const rideCamera = new RideCamera(sceneManager.camera, trackData);
        const visualEffects = new VisualEffects(sceneManager.scene, trackData);
        const animate = () => {
            if (isUnmounting.current)
                return;
            animationFrameId.current = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            if (status === AppStatus.Riding && audioRef.current && audioRef.current.ended) {
                onRideFinish();
                return;
            }
            const audioTime = audioRef.current?.currentTime || 0;
            
            let effectiveDuration;
            if (status === AppStatus.Riding) {
                const currentAudioDuration = audioRef.current?.duration;
                const computedDuration = (currentAudioDuration && isFinite(currentAudioDuration)) ? currentAudioDuration : trackData.path.length / 50;
                const epsilon = 1e-9; // Small value to prevent division by zero
                effectiveDuration = Math.max(epsilon, computedDuration);
            } else {
                // For non-riding status, elapsedTime is used directly with modulo 1
                effectiveDuration = 1; // Not directly used for progress calculation in this branch due to modulo
            }

            let progress;
            if (status === AppStatus.Riding) {
                progress = audioTime / effectiveDuration;
            } else {
                progress = (elapsedTime * 0.05) % 1;
            }
            // Clamp progress to [0, 1]
            progress = Math.min(1, Math.max(0, progress));
            
            try {
                // Re-read objects and guard in case of late disposal/hot reload
                if (!rideCamera || !visualEffects || !sceneManager) return;
                rideCamera.update(progress);
                // featuresRef is updated by useAudioAnalysis; read current value at call time
                const features = featuresRef == null ? null : featuresRef.current;
                visualEffects.update(elapsedTime, features, sceneManager.camera.position);
                sceneManager.render();
            } catch (err) {
                // Swallow errors to avoid stopping the animation loop; log for diagnostics
                // This prevents a single frame error (e.g., transient null field) from crashing the app
                // eslint-disable-next-line no-console
                console.error('ThreeCanvas frame error:', err);
                return;
            }
        };
        animate();
        return () => {
            isUnmounting.current = true;
            if (animationFrameId.current)
                cancelAnimationFrame(animationFrameId.current);
            sceneManager.dispose();
        };
    }, [status, trackData, audioFile, onRideFinish]);
    return _jsx("div", { ref: mountRef, className: `fixed inset-0 z-0 transition-opacity duration-1000 ${status === AppStatus.Riding ? 'opacity-100' : 'opacity-50'}` });
};
export default ThreeCanvas;
