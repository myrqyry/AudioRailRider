import * as THREE from 'three';
import { VisualEffects } from './VisualEffects';
import { TrackData, seconds } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';
import { ParticleSystem } from './visual-effects/ParticleSystem';

// Mock the entire ParticleSystem module
jest.mock('./visual-effects/ParticleSystem', () => ({
  ParticleSystem: jest.fn().mockImplementation(() => ({
    initGPU: jest.fn().mockResolvedValue(undefined),
    setQualityProfile: jest.fn(),
    driveReactiveParticles: jest.fn().mockReturnValue(0),
    reclaimExpired: jest.fn(),
    updateGPU: jest.fn(),
    updatePointsMaterial: jest.fn(),
    dispose: jest.fn(),
    isGPUEnabled: jest.fn().mockReturnValue(false),
    spawnParticles: jest.fn(),
    spawnFeatureBurst: jest.fn(),
    applyShaderUniform: jest.fn(),
  })),
}));

describe('VisualEffects', () => {
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let trackData: TrackData;
  let visualEffects: VisualEffects;
  let mockParticleSystem: jest.Mocked<ParticleSystem>;

  beforeEach(() => {
    // Clear mock history before each test
    (ParticleSystem as jest.Mock).mockClear();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    trackData = {
      path: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -10)],
      upVectors: [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)],
      railColor: '#ffffff',
      glowColor: '#ffffff',
      skyColor1: '#000000',
      skyColor2: '#000000',
      segmentDetails: [],
      rideName: 'Test Ride',
      moodDescription: 'A test ride',
      frameAnalyses: [],
      audioFeatures: {
        duration: seconds(1),
        bpm: 120,
        energy: 0,
        spectralCentroid: 0,
        spectralFlux: 0,
        frameAnalyses: [],
      },
    };

    visualEffects = new VisualEffects(scene, trackData, camera);
    mockParticleSystem = (visualEffects as any).particles;
  });

  it('should initialize and create a track mesh with a BVH', () => {
    const trackMesh = scene.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh;
    expect(trackMesh).toBeDefined();
    expect((trackMesh.geometry as any).boundsTree).toBeDefined();
  });

  it('should call particle system methods during update', () => {
    const now = performance.now() / 1000;
    visualEffects.update(now, null, new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0.5);

    expect(mockParticleSystem.driveReactiveParticles).toHaveBeenCalled();
    expect(mockParticleSystem.reclaimExpired).toHaveBeenCalled();
    expect(mockParticleSystem.updatePointsMaterial).toHaveBeenCalled();
  });

  it('should spawn particles when spawnParticles is called', () => {
    visualEffects.spawnParticles(10, new THREE.Vector3(1, 2, 3));
    expect(mockParticleSystem.spawnParticles).toHaveBeenCalledWith(10, {
      origin: new THREE.Vector3(1, 2, 3),
      feature: undefined,
      audioFeatures: expect.any(Object),
      segmentIntensityBoost: expect.any(Number),
      nowSeconds: expect.any(Number),
    });
  });

  it('should switch to low quality and rebuild track mesh with new BVH', () => {
    const oldGeometry = (scene.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh).geometry;

    (visualEffects as any).switchToLowQuality();

    const newTrackMesh = scene.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh;
    expect(newTrackMesh.geometry).not.toBe(oldGeometry);
    expect((newTrackMesh.geometry as any).boundsTree).toBeDefined();
    expect(mockParticleSystem.setQualityProfile).toHaveBeenCalledWith('low');
  });

  it('should switch to high quality and rebuild track mesh with new BVH', () => {
    // First switch to low to ensure a change happens
    (visualEffects as any).switchToLowQuality();
    const lowQualityGeometry = (scene.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh).geometry;

    visualEffects.switchToHighQuality();

    const highQualityTrackMesh = scene.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh;
    expect(highQualityTrackMesh.geometry).not.toBe(lowQualityGeometry);
    expect((highQualityTrackMesh.geometry as any).boundsTree).toBeDefined();
    expect(mockParticleSystem.setQualityProfile).toHaveBeenCalledWith('high');
  });
});
