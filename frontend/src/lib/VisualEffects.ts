import * as THREE from 'three';
import { TrackData } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';

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

/**
 * Manages the visual effects in the scene, including the track and particles.
 */
export class VisualEffects {
    private scene: THREE.Scene;
    private trackGlowMaterial: THREE.MeshStandardMaterial;
    private bassParticleSystem: THREE.Points;
    private midParticleSystem: THREE.Points;
    private highParticleSystem: THREE.Points;
    private bassParticleMaterial: THREE.ShaderMaterial;
    private midParticleMaterial: THREE.ShaderMaterial;
    private highParticleMaterial: THREE.ShaderMaterial;
    private particleCursor = 0;
    private trackMesh: THREE.Mesh;

    // Lighting
    private ambientLight: THREE.AmbientLight;
    private spotlight: THREE.SpotLight;
    private strobeLights: THREE.PointLight[] = [];
    private lastStrobeTime = 0;

    constructor(scene: THREE.Scene, trackData: TrackData) {
        this.scene = scene;

        // Lighting Setup
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        this.spotlight = new THREE.SpotLight(trackData.glowColor, 5, 200, Math.PI / 4, 0.5, 1.5);
        this.spotlight.castShadow = true; // performance consideration
        this.scene.add(this.spotlight);
        this.scene.add(this.spotlight.target);

        const strobeColor = new THREE.Color(trackData.railColor).lerp(new THREE.Color(0xffffff), 0.8);
        for (let i = 0; i < 3; i++) {
            const strobe = new THREE.PointLight(strobeColor, 0, 100, 2);
            strobe.castShadow = false;
            this.scene.add(strobe);
            this.strobeLights.push(strobe);
        }

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

        // Particle Systems
        const highColor = new THREE.Color(trackData.glowColor).lerp(new THREE.Color(0xffffff), 0.5);

        this.bassParticleMaterial = this.createParticleMaterial(trackData.railColor, RIDE_CONFIG.PARTICLE_BASE_SIZE * 1.5);
        this.midParticleMaterial = this.createParticleMaterial(trackData.glowColor, RIDE_CONFIG.PARTICLE_BASE_SIZE);
        this.highParticleMaterial = this.createParticleMaterial('#' + highColor.getHexString(), RIDE_CONFIG.PARTICLE_BASE_SIZE * 0.75);

        this.bassParticleSystem = this.createParticleSystem(this.bassParticleMaterial);
        this.midParticleSystem = this.createParticleSystem(this.midParticleMaterial);
        this.highParticleSystem = this.createParticleSystem(this.highParticleMaterial);

        this.scene.add(this.bassParticleSystem);
        this.scene.add(this.midParticleSystem);
        this.scene.add(this.highParticleSystem);
    }

    private createParticleMaterial(color: string, size: number): THREE.ShaderMaterial {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                color: { value: new THREE.Color(color) },
                size: { value: size }
            },
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });
    }

    private createParticleSystem(material: THREE.ShaderMaterial): THREE.Points {
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

        return new THREE.Points(particleGeometry, material);
    }

    update(elapsedTime: number, frame: any, cameraPosition: THREE.Vector3, cameraTarget: THREE.Vector3) {
        this.bassParticleMaterial.uniforms.time.value = elapsedTime;
        this.midParticleMaterial.uniforms.time.value = elapsedTime;
        this.highParticleMaterial.uniforms.time.value = elapsedTime;

        // Update spotlight to follow camera
        this.spotlight.position.copy(cameraPosition);
        this.spotlight.target.position.copy(cameraTarget);

        // Strobe light logic
        this.strobeLights.forEach(light => {
            light.intensity *= 0.8; // Fast decay
            if (light.intensity < 0.1) light.intensity = 0;
        });

        if (frame) {
            this.trackGlowMaterial.emissiveIntensity = Math.max(0.1, Math.min(3.0, frame.mid * 0.5));

            // Ambient light mood color
            const moodColor = new THREE.Color(0x100a28); // Deep blue base
            const warmColor = new THREE.Color(0xffdcb2); // Warm orange highlight
            moodColor.lerp(warmColor, Math.min(1, frame.energy / 2));
            this.ambientLight.color = moodColor;
            this.ambientLight.intensity = 0.1 + Math.min(0.5, frame.energy * 0.2);


            // Strobe effect on high-frequency hits (e.g., snares, hi-hats)
            if (frame.high > RIDE_CONFIG.HIGH_KICK_THRESHOLD && (elapsedTime - this.lastStrobeTime > 0.1)) {
                this.lastStrobeTime = elapsedTime;
                const strobeIndex = Math.floor(Math.random() * this.strobeLights.length);
                const light = this.strobeLights[strobeIndex];
                light.position.copy(cameraPosition).add(new THREE.Vector3(
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 50
                ));
                light.intensity = 5.0; // Bright flash
            }

            if (frame.bass > RIDE_CONFIG.BASS_KICK_THRESHOLD) {
                this.spawnParticles(this.bassParticleSystem, elapsedTime, cameraPosition, 5);
            }
            if (frame.mid > RIDE_CONFIG.MID_KICK_THRESHOLD) {
                this.spawnParticles(this.midParticleSystem, elapsedTime, cameraPosition, 3);
            }
            if (frame.high > RIDE_CONFIG.HIGH_KICK_THRESHOLD) {
                this.spawnParticles(this.highParticleSystem, elapsedTime, cameraPosition, 1);
            }
        }
    }

    public spawnParticles(particleSystem: THREE.Points, elapsedTime: number, cameraPosition: THREE.Vector3, spawnCount: number) {
        const geometry = particleSystem.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position as THREE.BufferAttribute;
        const velocities = geometry.attributes.velocity as THREE.BufferAttribute;
        const startTimes = geometry.attributes.startTime as THREE.BufferAttribute;

        const particleCount = RIDE_CONFIG.PARTICLE_COUNT;
        const startCursor = this.particleCursor;

        for (let i = 0; i < spawnCount; i++) {
            const pIndex = (startCursor + i) % particleCount;
            positions.setXYZ(pIndex, cameraPosition.x, cameraPosition.y, cameraPosition.z);
            velocities.setXYZ(
                pIndex,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            startTimes.setX(pIndex, elapsedTime);
        }

        this.particleCursor = (startCursor + spawnCount) % particleCount;

        positions.needsUpdate = true;
        velocities.needsUpdate = true;
        startTimes.needsUpdate = true;
    }

    public dispose(): void {
        // Dispose lighting
        this.scene.remove(this.ambientLight);
        this.ambientLight.dispose();
        this.scene.remove(this.spotlight);
        this.spotlight.dispose();
        this.strobeLights.forEach(light => {
            this.scene.remove(light);
            light.dispose();
        });

        // Dispose particles
        this.scene.remove(this.bassParticleSystem);
        this.bassParticleSystem.geometry.dispose();
        this.bassParticleMaterial.dispose();

        this.scene.remove(this.midParticleSystem);
        this.midParticleSystem.geometry.dispose();
        this.midParticleMaterial.dispose();

        this.scene.remove(this.highParticleSystem);
        this.highParticleSystem.geometry.dispose();
        this.highParticleMaterial.dispose();

        // Dispose track
        if (this.trackMesh) {
            this.scene.remove(this.trackMesh);
            this.trackMesh.geometry.dispose();
            this.trackGlowMaterial.dispose();
        }
    }
}
