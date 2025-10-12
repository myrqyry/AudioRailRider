import * as THREE from 'three';
import { VisualEffects } from './VisualEffects';
import { TrackData, seconds } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';
import { ParticleSystem } from './visual-effects/ParticleSystem';

describe('VisualEffects', () => {
  const createTrackData = (): TrackData => ({
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
  });

  describe('BVH integration', () => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let trackData: TrackData;
    let visualEffects: VisualEffects;
    let driveReactiveParticlesSpy: jest.SpyInstance;
    let reclaimExpiredSpy: jest.SpyInstance;
    let updatePointsMaterialSpy: jest.SpyInstance;
    let isGPUEnabledSpy: jest.SpyInstance;
    let spawnParticlesSpy: jest.SpyInstance;
    let setQualityProfileSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.restoreAllMocks();
      driveReactiveParticlesSpy = jest.spyOn(ParticleSystem.prototype, 'driveReactiveParticles').mockReturnValue(0);
      reclaimExpiredSpy = jest.spyOn(ParticleSystem.prototype, 'reclaimExpired').mockImplementation(() => {});
      updatePointsMaterialSpy = jest.spyOn(ParticleSystem.prototype, 'updatePointsMaterial').mockImplementation(() => {});
      isGPUEnabledSpy = jest.spyOn(ParticleSystem.prototype, 'isGPUEnabled').mockReturnValue(false);
      spawnParticlesSpy = jest.spyOn(ParticleSystem.prototype, 'spawnParticles');
      setQualityProfileSpy = jest.spyOn(ParticleSystem.prototype, 'setQualityProfile');

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera();
      trackData = createTrackData();

      visualEffects = new VisualEffects(scene, trackData, camera);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('creates a track mesh with an attached BVH', () => {
      const trackMesh = scene.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh;
      expect(trackMesh).toBeDefined();
      expect((trackMesh.geometry as any).boundsTree).toBeDefined();
    });

    it('invokes particle system hooks during update', () => {
      const now = performance.now() / 1000;
      visualEffects.update(now, null, new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0.5);

      expect(driveReactiveParticlesSpy).toHaveBeenCalled();
      expect(reclaimExpiredSpy).toHaveBeenCalled();
      expect(updatePointsMaterialSpy).toHaveBeenCalled();
      expect(isGPUEnabledSpy).toHaveBeenCalled();
    });

    it('delegates to ParticleSystem.spawnParticles', () => {
      const origin = new THREE.Vector3(1, 2, 3);
      visualEffects.spawnParticles(10, origin);

      expect(spawnParticlesSpy).toHaveBeenCalledWith(10, {
        origin,
        feature: undefined,
        audioFeatures: expect.any(Object),
        segmentIntensityBoost: expect.any(Number),
        nowSeconds: expect.any(Number),
      });
    });

    it('rebuilds BVH geometry and downgrades particle quality in low quality mode', () => {
      const initialGeometry = (scene.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh).geometry;

      (visualEffects as any).switchToLowQuality();

      const lowGeometry = (scene.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh).geometry;
      expect(lowGeometry).not.toBe(initialGeometry);
      expect((lowGeometry as any).boundsTree).toBeDefined();
      expect(setQualityProfileSpy).toHaveBeenCalledWith('low');
    });

    it('restores high quality geometry with a fresh BVH', () => {
      (visualEffects as any).switchToLowQuality();
      const lowGeometry = (scene.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh).geometry;

      visualEffects.switchToHighQuality();

      const highGeometry = (scene.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh).geometry;
      expect(highGeometry).not.toBe(lowGeometry);
      expect((highGeometry as any).boundsTree).toBeDefined();
      expect(setQualityProfileSpy).toHaveBeenCalledWith('high');
    });
  });

  describe('Legacy Particle System Tests', () => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let trackData: TrackData;
    let visualEffects: VisualEffects;

    beforeEach(() => {
      jest.restoreAllMocks();
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera();
      trackData = createTrackData();
      visualEffects = new VisualEffects(scene, trackData, camera);
    });

    const getGeometryAttributes = () => {
      const system: any = (visualEffects as any).particles;
      if (!system) {
        throw new Error('ParticleSystem instance not found on VisualEffects');
      }

      const points: THREE.Points | null = system.points ?? system.particleSystem ?? null;
      if (!points || !points.geometry) {
        throw new Error('ParticleSystem points geometry unavailable');
      }

      return points.geometry.attributes;
    };

    it('sets updateRange correctly when not wrapping around', () => {
      const attributes = getGeometryAttributes();

      (visualEffects as any).particles.particleCursor = 0;
      visualEffects.spawnParticles(0, new THREE.Vector3(0, 0, 0));

  expect(attributes.position.updateRange.offset).toBeGreaterThanOrEqual(0);
  expect(attributes.position.updateRange.offset % 3).toBe(0);
      expect(attributes.position.updateRange.count).toBe(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * 3);
  expect(attributes.velocity.updateRange.offset).toBeGreaterThanOrEqual(0);
  expect(attributes.velocity.updateRange.offset % 3).toBe(0);
      expect(attributes.velocity.updateRange.count).toBe(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * 3);
  expect(attributes.startTime.updateRange.offset).toBeGreaterThanOrEqual(0);
      expect(attributes.startTime.updateRange.count).toBe(RIDE_CONFIG.PARTICLE_SPAWN_COUNT);
    });

    it('sets updateRange correctly when wrapping around', () => {
      const attributes = getGeometryAttributes();

      (visualEffects as any).particles.particleCursor = RIDE_CONFIG.PARTICLE_COUNT - 10;
      visualEffects.spawnParticles(0, new THREE.Vector3(0, 0, 0));

      expect(attributes.position.updateRange.offset).toBe(0);
      expect(attributes.position.updateRange.count).toBe(-1);
      expect(attributes.velocity.updateRange.offset).toBe(0);
      expect(attributes.velocity.updateRange.count).toBe(-1);
      expect(attributes.startTime.updateRange.offset).toBe(0);
      expect(attributes.startTime.updateRange.count).toBe(-1);
    });
  });
});
