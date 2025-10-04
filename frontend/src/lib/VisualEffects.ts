import * as THREE from 'three';
import { TrackData, FrameAnalysis } from 'shared/types';

// --- Constants ---
const BASS_GLOW_MIN = 0.3; // The baseline glow intensity
const BASS_GLOW_MAX = 1.8; // The maximum glow intensity when bass hits
const LERP_FACTOR = 0.12; // How quickly the glow intensity changes (smoothing factor)

/**
 * Manages the visual representation of the rollercoaster track and its
 * audio-reactive effects.
 */
export class VisualEffects {
  private scene: THREE.Scene;
  private trackData: TrackData;
  private trackMesh: THREE.Mesh;
  private trackMaterial: THREE.MeshStandardMaterial;
  private targetGlowIntensity: number = BASS_GLOW_MIN;

  constructor(scene: THREE.Scene, trackData: TrackData) {
    this.scene = scene;
    this.trackData = trackData;

    // 1. Create the track material
    this.trackMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(trackData.railColor),
      emissive: new THREE.Color(trackData.glowColor),
      emissiveIntensity: BASS_GLOW_MIN,
      metalness: 0.8,
      roughness: 0.4,
      side: THREE.FrontSide,
    });

    // 2. Create the track geometry
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const geometry = new THREE.TubeGeometry(curve, this.trackData.path.length * 2, 2, 8, false);

    // 3. Create the track mesh and add to the scene
    this.trackMesh = new THREE.Mesh(geometry, this.trackMaterial);
    this.scene.add(this.trackMesh);
  }

  /**
   * Updates the visual effects based on the current audio frame.
   * This is called from the main render loop in ThreeCanvas.
   */
  public update(
    elapsedTime: number,
    currentFrame: FrameAnalysis | null,
    cameraPosition: THREE.Vector3,
    lookAtPosition: THREE.Vector3
  ) {
    if (currentFrame) {
      // Map the bass value (0-1) to our desired glow range
      this.targetGlowIntensity = BASS_GLOW_MIN + (currentFrame.bass * (BASS_GLOW_MAX - BASS_GLOW_MIN));
    } else {
      // If no audio data, settle at the minimum glow
      this.targetGlowIntensity = BASS_GLOW_MIN;
    }

    // Smoothly interpolate the material's emissive intensity towards the target
    this.trackMaterial.emissiveIntensity = THREE.MathUtils.lerp(
      this.trackMaterial.emissiveIntensity,
      this.targetGlowIntensity,
      LERP_FACTOR
    );
  }

  /**
   * Cleans up resources when the ride is finished or reset.
   */
  public dispose() {
    if (this.trackMesh) {
      this.scene.remove(this.trackMesh);
      this.trackMesh.geometry.dispose();
    }
    if (this.trackMaterial) {
      this.trackMaterial.dispose();
    }
  }
}