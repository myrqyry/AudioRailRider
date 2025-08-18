import * as THREE from 'three';
import { VisualEffects } from './VisualEffects';
import { RIDE_CONFIG } from './constants';
import { TrackData } from '../../types';

describe('VisualEffects', () => {
  let scene: THREE.Scene;
  let trackData: TrackData;
  let visualEffects: VisualEffects;

  beforeEach(() => {
    scene = new THREE.Scene();
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
    };
    visualEffects = new VisualEffects(scene, trackData);
  });

  it('should set updateRange correctly when not wrapping around', () => {
    const particleSystem = (visualEffects as any).particleSystem;
    const positions = particleSystem.geometry.attributes.position;
    const velocities = particleSystem.geometry.attributes.velocity;
    const startTimes = particleSystem.geometry.attributes.startTime;

    (visualEffects as any).particleCursor = 0;
    visualEffects.spawnParticles(0, new THREE.Vector3(0, 0, 0));

    expect(positions.updateRange.offset).toBe(0);
    expect(positions.updateRange.count).toBe(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * 3);
    expect(velocities.updateRange.offset).toBe(0);
    expect(velocities.updateRange.count).toBe(RIDE_CONFIG.PARTICLE_SPAWN_COUNT * 3);
    expect(startTimes.updateRange.offset).toBe(0);
    expect(startTimes.updateRange.count).toBe(RIDE_CONFIG.PARTICLE_SPAWN_COUNT);
  });

  it('should set updateRange correctly when wrapping around', () => {
    const particleSystem = (visualEffects as any).particleSystem;
    const positions = particleSystem.geometry.attributes.position;
    const velocities = particleSystem.geometry.attributes.velocity;
    const startTimes = particleSystem.geometry.attributes.startTime;

    (visualEffects as any).particleCursor = RIDE_CONFIG.PARTICLE_COUNT - 10;
    visualEffects.spawnParticles(0, new THREE.Vector3(0, 0, 0));

    expect(positions.updateRange.offset).toBe(0);
    expect(positions.updateRange.count).toBe(-1);
    expect(velocities.updateRange.offset).toBe(0);
    expect(velocities.updateRange.count).toBe(-1);
    expect(startTimes.updateRange.offset).toBe(0);
    expect(startTimes.updateRange.count).toBe(-1);
  });
});
