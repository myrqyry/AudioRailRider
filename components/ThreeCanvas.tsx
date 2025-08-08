import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AppStatus } from '../types';
import { useAudioAnalysis } from '../lib/useAudioAnalysis';
import { useAppStore } from '../lib/store';

const ThreeCanvas: React.FC = () => {
  const status = useAppStore((state) => state.status);
  const trackData = useAppStore((state) => state.trackData);
  const audioFile = useAppStore((state) => state.audioFile);
  const onRideFinish = useAppStore((state) => state.actions.handleRideFinish);

  const mountRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const trackGlowMaterial = useRef<THREE.MeshStandardMaterial | null>(null);
  const particleSystem = useRef<THREE.Points | null>(null);
  const particleVelocities = useRef<THREE.Vector3[]>([]);
  const particleLifetimes = useRef<number[]>([]);
  const isUnmounting = useRef(false);
  const lastBassLoudness = useRef(0);

  const { audioRef, featuresRef } = useAudioAnalysis({ audioFile, status });
    
  // This effect handles the entire lifecycle of the three.js scene
  useEffect(() => {
    console.log(`ThreeCanvas effect triggered. Status: ${status}`);
    if (!mountRef.current || !trackData || !audioFile || status === AppStatus.Idle) {
        console.log("ThreeCanvas effect aborted:", {
            mount: !!mountRef.current,
            trackData: !!trackData,
            audioFile: !!audioFile,
            isIdle: status === AppStatus.Idle
        });
        return;
    }
    
    isUnmounting.current = false;
    const container = mountRef.current;
    
    // Core Scene Objects
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Starry background
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.7 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Create Track
    const curve = new THREE.CatmullRomCurve3(trackData.path, false, 'catmullrom', 0.5);
    const tubeGeometry = new THREE.TubeGeometry(curve, trackData.path.length * 2, 1.5, 8, false);
    
    trackGlowMaterial.current = new THREE.MeshStandardMaterial({
        color: trackData.railColor,
        emissive: trackData.glowColor,
        emissiveIntensity: 0,
        metalness: 0.8,
        roughness: 0.4,
    });
    const trackMesh = new THREE.Mesh(tubeGeometry, trackGlowMaterial.current);
    scene.add(trackMesh);
 
    // Particle system for sparks
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    particleVelocities.current = [];
    particleLifetimes.current = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -1000; // hide initially
      positions[i * 3 + 2] = 0;
      particleVelocities.current.push(new THREE.Vector3());
      particleLifetimes.current.push(0);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: trackData.glowColor, size: 1.2, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9 });
    particleSystem.current = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem.current);

    // Animation loop
    const clock = new THREE.Clock();
    const audioDuration = audioRef.current?.duration;
    const duration = (audioDuration && isFinite(audioDuration)) ? audioDuration : trackData.path.length / 50;
    const pos = new THREE.Vector3();
    const lookAtPos = new THREE.Vector3();
    const up = new THREE.Vector3();

    const animate = () => {
        if (isUnmounting.current) return;
        animationFrameId.current = requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (status === AppStatus.Riding && audioRef.current && audioRef.current.ended) {
            onRideFinish();
            return;
        }

        const audioTime = audioRef.current?.currentTime || 0;
        const progress = status === AppStatus.Riding ? (audioTime / duration) : ((clock.getElapsedTime() * 0.05) % 1);

        if (progress < 1) {
            curve.getPointAt(progress, pos);
            camera.position.copy(pos);

            curve.getPointAt(Math.min(1, progress + 0.01), lookAtPos);
            
            const sample = Math.floor(progress * (trackData.upVectors.length - 1));
            const nextSample = Math.min(sample + 1, trackData.upVectors.length - 1);
            const t = progress * (trackData.upVectors.length - 1) - sample;
            up.copy(trackData.upVectors[sample]).lerp(trackData.upVectors[nextSample], t).normalize();
            camera.up.copy(up);

            camera.lookAt(lookAtPos);
            
            const tangent = curve.getTangentAt(progress);
            const speed = tangent.length();
            camera.fov = 75 + Math.min(20, speed * 0.05);
            camera.updateProjectionMatrix();
        }
        
        // Update Three.js elements based on latest audio features
        if (featuresRef.current && trackGlowMaterial.current && particleSystem.current) {
          const loudness = featuresRef.current.loudness;
          if (loudness) {
            const midLoudness = loudness.specific.slice(7, 14).reduce((a: number, b: number) => a + b, 0);
            const bassLoudness = loudness.specific.slice(0, 5).reduce((a: number, b: number) => a + b, 0);

            trackGlowMaterial.current.emissiveIntensity = Math.max(0.1, Math.min(3.0, midLoudness * 0.5));

            if (bassLoudness > 15 && lastBassLoudness.current <= 15) { // Threshold for bass kick to trigger particles
                const positions = particleSystem.current.geometry.attributes.position as THREE.BufferAttribute;
                const camPos = camera.position;
                let spawned = 0;
                const particleCount = positions.count; // Use positions.count to get actual particle count
                for (let i = 0; i < particleCount && spawned < 5; i++) { // burst of 5 particles
                    const pIndex = Math.floor(Math.random() * particleCount);
                    if (particleLifetimes.current[pIndex] <= 0) { // only trigger if particle is "dead"
                        positions.setXYZ(pIndex, camPos.x, camPos.y, camPos.z);
                        particleVelocities.current[pIndex].set(
                            (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10
                        );
                        particleLifetimes.current[pIndex] = 1.0 + Math.random() * 0.5;
                        spawned++;
                    }
                }
                if (spawned > 0) positions.needsUpdate = true;
            }
            lastBassLoudness.current = bassLoudness;
          }
        }

        if (particleSystem.current) {
            const positions = particleSystem.current.geometry.attributes.position as THREE.BufferAttribute;
            let needsUpdate = false;
            const particleCount = positions.count;
            for (let i = 0; i < particleCount; i++) {
                if (particleLifetimes.current[i] > 0) {
                    particleLifetimes.current[i] -= delta;
                    if (particleLifetimes.current[i] <= 0) {
                        positions.setY(i, -1000); // Hide particle
                    } else {
                        positions.setXYZ(
                            i,
                            positions.getX(i) + particleVelocities.current[i].x * delta,
                            positions.getY(i) + particleVelocities.current[i].y * delta,
                            positions.getZ(i) + particleVelocities.current[i].z * delta
                        );
                        particleVelocities.current[i].multiplyScalar(0.98); // air resistance
                    }
                    needsUpdate = true;
                }
            }
            if(needsUpdate) positions.needsUpdate = true;
        }
        
        stars.rotation.y += 0.00005;
        renderer.render(scene, camera);
    };
    
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        isUnmounting.current = true;
        window.removeEventListener('resize', handleResize);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        
        container.removeChild(renderer.domElement);
        renderer.dispose();
        scene.clear();
    };
  }, [status, trackData, audioFile, onRideFinish]);

  // Refactor the JSX to a separate component
  return <div ref={mountRef} className={`fixed inset-0 z-0 transition-opacity duration-1000 ${status === AppStatus.Riding ? 'opacity-100' : 'opacity-50'}`} />;
};

export default ThreeCanvas;
