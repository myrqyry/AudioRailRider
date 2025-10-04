import * as THREE from 'three';
import { TrackData, FrameAnalysis } from 'shared/types';

// --- Constants ---
const BASS_GLOW_MIN = 0.3; // The baseline glow intensity
const BASS_GLOW_MAX = 1.8; // The maximum glow intensity when bass hits
const LERP_FACTOR = 0.12; // How quickly the glow intensity changes (smoothing factor)

// Performance optimization constants
const HIGH_QUALITY_SEGMENTS = 2; // Segments per path point for high quality
const LOW_QUALITY_SEGMENTS = 1; // Segments per path point for low quality
const PERFORMANCE_CHECK_INTERVAL = 2000; // Check FPS every 2 seconds
const TARGET_FPS = 50; // Target FPS for quality adjustment

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
  private highQualityMode: boolean = true;
  private lastPerformanceCheck: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = performance.now();

  constructor(scene: THREE.Scene, trackData: TrackData) {
    this.scene = scene;
    this.trackData = trackData;

    // Detect device capability
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.highQualityMode = !isMobile;

    // 1. Create the track material
    this.trackMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(trackData.railColor),
      emissive: new THREE.Color(trackData.glowColor),
      emissiveIntensity: BASS_GLOW_MIN,
      metalness: 0.8,
      roughness: 0.4,
      side: THREE.FrontSide,
    });

    // 2. Create the track geometry with adaptive quality
    const segments = this.highQualityMode ? 
      this.trackData.path.length * HIGH_QUALITY_SEGMENTS : 
      this.trackData.path.length * LOW_QUALITY_SEGMENTS;
    
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const geometry = new THREE.TubeGeometry(curve, segments, 2, 8, false);

    // 3. Create the track mesh and add to the scene
    this.trackMesh = new THREE.Mesh(geometry, this.trackMaterial);
    this.trackMesh.frustumCulled = true; // Enable frustum culling for performance
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
    // Performance monitoring
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastPerformanceCheck > PERFORMANCE_CHECK_INTERVAL) {
      const fps = (this.frameCount * 1000) / (now - this.lastPerformanceCheck);
      this.lastPerformanceCheck = now;
      this.frameCount = 0;
      
      // Adaptive quality: lower quality if FPS drops
      if (fps < TARGET_FPS && this.highQualityMode) {
        console.log(`[VisualEffects] Performance: ${fps.toFixed(1)} FPS - Switching to low quality mode`);
        this.switchToLowQuality();
      }
    }

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

  private switchToLowQuality() {
    if (!this.highQualityMode) return;
    this.highQualityMode = false;
    
    // Rebuild geometry with lower quality
    const oldGeometry = this.trackMesh.geometry;
    const curve = new THREE.CatmullRomCurve3(this.trackData.path.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const newGeometry = new THREE.TubeGeometry(
      curve, 
      this.trackData.path.length * LOW_QUALITY_SEGMENTS, 
      2, 
      6, // Reduced radial segments
      false
    );
    
    this.trackMesh.geometry = newGeometry;
    oldGeometry.dispose();
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