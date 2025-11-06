import * as THREE from 'three';
import { VisualEffectsOrchestrator } from './VisualEffectsOrchestrator';
import { TrackData } from 'shared/types';

describe('VisualEffectsOrchestrator', () => {
    let scene: THREE.Scene;
    let camera: THREE.Camera;
    let trackData: TrackData;

    beforeEach(() => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        trackData = {
            path: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: -10 }],
            railColor: '#ff0000',
            glowColor: '#00ff00',
            synesthetic: {
                particles: {
                    maxCount: 1000,
                }
            },
            events: [],
        } as unknown as TrackData;
    });

    it('should be created without errors', () => {
        expect(() => new VisualEffectsOrchestrator(scene, trackData, camera)).not.toThrow();
    });

    it('should create a track mesh', () => {
        const orchestrator = new VisualEffectsOrchestrator(scene, trackData, camera);
        const trackMesh = scene.children.find((child) => child instanceof THREE.Mesh);
        expect(trackMesh).toBeDefined();
    });

    it('should dispose correctly', () => {
        const orchestrator = new VisualEffectsOrchestrator(scene, trackData, camera);
        orchestrator.dispose();
        const trackMesh = scene.children.find((child) => child instanceof THREE.Mesh);
        expect(trackMesh).toBeUndefined();
    });
});
