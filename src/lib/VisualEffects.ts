import * as THREE from 'three';
import { TrackData } from '../types';
import { RIDE_CONFIG } from './constants';

const particleVertexShader = `
  attribute vec3 velocity;
  attribute float startTime;
  uniform float time;
  uniform float size;

  varying float v_age;
  const float lifetime = ${RIDE_CONFIG.PARTICLE_LIFETIME.toFixed(1)};

  void main() {
    float age = time - startTime;
    if (age < 0.0 || age > lifetime) {
      gl_Position = vec4(0.0, 0.0, 0.0, 0.0); // Hide particle
      return;
    }

    v_age = age / lifetime; // 0 to 1

    // Simple physics: gravity and initial velocity
    vec3 newPosition = position + velocity * age;
    newPosition.y += 0.5 * ${RIDE_CONFIG.PARTICLE_GRAVITY.toFixed(1)} * age * age; // Gravity

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = size * (1.0 - v_age); // Shrink over time
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  uniform vec3 color;
  varying float v_age;

  void main() {
    // Fade out over time
    gl_FragColor = vec4(color, 1.0 - v_age);
  }
`;

export class VisualEffects {
    private scene: THREE.Scene;
    private trackGlowMaterial: THREE.MeshStandardMaterial;
    private particleSystem: THREE.Points;
    private particleMaterial: THREE.ShaderMaterial;
    private particleCursor = 0;
    private lastBassLoudness = 0;
    private trackMesh: THREE.Mesh;

    constructor(scene: THREE.Scene, trackData: TrackData) {
        this.scene = scene;

        // Track
        const curve = new THREE.CatmullRomCurve3(trackData.path, false, 'catmullrom', 0.5);
        const tubeGeometry = new THREE.TubeGeometry(curve, trackData.path.length * 2, 1.5, 8, false);
        this.trackGlowMaterial = new THREE.MeshStandardMaterial({
            color: trackData.railColor,
            emissive: trackData.glowColor,
            emissiveIntensity: 0,
            metalness: 0.8,
            roughness: 0.4,
        });
        this.trackMesh = new THREE.Mesh(tubeGeometry, this.trackGlowMaterial);
        this.scene.add(this.trackMesh);

        // Particles
        const particleCount = RIDE_CONFIG.PARTICLE_COUNT;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const startTimes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            startTimes[i] = -1.0;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        particleGeometry.setAttribute('startTime', new THREE.BufferAttribute(startTimes, 1));

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                color: { value: new THREE.Color(trackData.glowColor) },
                size: { value: RIDE_CONFIG.PARTICLE_BASE_SIZE }
            },
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });

        this.particleSystem = new THREE.Points(particleGeometry, this.particleMaterial);
        this.scene.add(this.particleSystem);
    }

    update(elapsedTime: number, audioFeatures: any, cameraPosition: THREE.Vector3) {
        // Validate and update uniform values
        this.particleMaterial.uniforms.time.value = elapsedTime;
        this.particleMaterial.uniforms.lifetime.value = RIDE_CONFIG.PARTICLE_LIFETIME;
        this.particleMaterial.uniforms.gravity.value = RIDE_CONFIG.PARTICLE_GRAVITY;

        if (audioFeatures && audioFeatures.loudness) {
            if (!audioFeatures.loudness.specific || !Array.isArray(audioFeatures.loudness.specific)) {
                return;
            }
            const midLoudness = audioFeatures.loudness.specific
                .slice(7, 14)
                .reduce((a: number, b: number) => a + b, 0);
            const bassLoudness = audioFeatures.loudness.specific
                .slice(0, 5)
                .reduce((a: number, b: number) => a + b, 0);

            this.trackGlowMaterial.emissiveIntensity = Math.max(0.1, Math.min(3.0, midLoudness * 0.5));

            if (bassLoudness > RIDE_CONFIG.BASS_KICK_THRESHOLD && this.lastBassLoudness <= RIDE_CONFIG.BASS_KICK_THRESHOLD) {
                this.spawnParticles(elapsedTime, cameraPosition);
            }
            this.lastBassLoudness = bassLoudness;
        }
    }

    private spawnParticles(elapsedTime: number, cameraPosition: THREE.Vector3) {
        const geometry = this.particleSystem.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position as THREE.BufferAttribute;
        const velocities = geometry.attributes.velocity as THREE.BufferAttribute;
        const startTimes = geometry.attributes.startTime as THREE.BufferAttribute;

        const spawnCount = RIDE_CONFIG.PARTICLE_SPAWN_COUNT;
        for (let i = 0; i < spawnCount; i++) {
            const pIndex = this.particleCursor;

            positions.setXYZ(pIndex, cameraPosition.x, cameraPosition.y, cameraPosition.z);
            velocities.setXYZ(
                pIndex,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            startTimes.setX(pIndex, elapsedTime);

            this.particleCursor = (this.particleCursor + 1) % RIDE_CONFIG.PARTICLE_COUNT;
        }

        positions.needsUpdate = true;
        velocities.needsUpdate = true;
        startTimes.needsUpdate = true;
    }

    public dispose(): void {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            if (this.particleSystem.geometry) {
                this.particleSystem.geometry.dispose();
            }
            this.particleMaterial.dispose();
            this.particleSystem = null;
            this.particleMaterial = null;
        }

        // Assuming trackMesh is stored as a property
        if (this.trackMesh) {
            this.scene.remove(this.trackMesh);
            if (this.trackMesh.geometry) {
                this.trackMesh.geometry.dispose();
            }
            this.trackGlowMaterial.dispose();
            this.trackMesh = null;
            this.trackGlowMaterial = null;
        }

        this.scene = null;
    }
}
