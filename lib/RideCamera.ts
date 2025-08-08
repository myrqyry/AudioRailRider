import * as THREE from 'three';
import { TrackData } from '../types';
import { RIDE_CONFIG } from './constants';

export class RideCamera {
    camera: THREE.PerspectiveCamera;
    private curve: THREE.CatmullRomCurve3;
    private trackData: TrackData;

    constructor(camera: THREE.PerspectiveCamera, trackData: TrackData) {
        this.camera = camera;
        this.trackData = trackData;
        this.curve = new THREE.CatmullRomCurve3(trackData.path, false, 'catmullrom', 0.5);
    }

    update(progress: number) {
        const pos = new THREE.Vector3();
        const lookAtPos = new THREE.Vector3();
        const up = new THREE.Vector3();

        if (progress < 1) {
            this.curve.getPointAt(progress, pos);
            this.camera.position.copy(pos);

            this.curve.getPointAt(Math.min(1, progress + 0.01), lookAtPos);

            const sample = Math.floor(progress * (this.trackData.upVectors.length - 1));
            const nextSample = Math.min(sample + 1, this.trackData.upVectors.length - 1);
            const t = progress * (this.trackData.upVectors.length - 1) - sample;
            up.copy(this.trackData.upVectors[sample]).lerp(this.trackData.upVectors[nextSample], t).normalize();
            this.camera.up.copy(up);

            this.camera.lookAt(lookAtPos);

            const tangent = this.curve.getTangentAt(progress);
            const speed = tangent.length();
            this.camera.fov = RIDE_CONFIG.CAMERA_BASE_FOV + Math.min(RIDE_CONFIG.CAMERA_MAX_FOV_BOOST, speed * RIDE_CONFIG.CAMERA_SPEED_FOV_FACTOR);
            this.camera.updateProjectionMatrix();
        }
    }
}
