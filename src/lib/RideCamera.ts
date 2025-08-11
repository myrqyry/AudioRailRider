import * as THREE from 'three';
import { TrackData } from '../types';
import { RIDE_CONFIG } from './constants';

export class RideCamera {
    readonly camera: THREE.PerspectiveCamera;
    private curve: THREE.CatmullRomCurve3;
    private trackData: TrackData;
    // Reused temporaries to avoid per-frame allocations
    private readonly _pos = new THREE.Vector3();
    private readonly _lookAtPos = new THREE.Vector3();
    private readonly _upTmp = new THREE.Vector3();

    constructor(camera: THREE.PerspectiveCamera, trackData: TrackData) {
        this.camera = camera;
        this.trackData = trackData;
        this.curve = new THREE.CatmullRomCurve3(trackData.path, false, 'catmullrom', 0.5);
    }

    update(progress: number) {
        const u = THREE.MathUtils.clamp(progress, 0, 1);
        this.curve.getPointAt(u, this._pos);
        this.camera.position.copy(this._pos);

        // Adaptive look-ahead; avoid zero-length look vector at u === 1
        const LOOKAHEAD_U = 0.01;
        const du = Math.min(LOOKAHEAD_U, 1 - u);
        if (du > 0) {
            this.curve.getPointAt(u + du, this._lookAtPos);
        } else {
            const dir = this.curve.getTangentAt(u);
            this._lookAtPos.copy(this._pos).addScaledVector(dir, 1);
        }

        // Safe up-vector interpolation
        const ups = this.trackData.upVectors;
        if (ups.length >= 2) {
            const scaled = u * (ups.length - 1);
            const i = Math.floor(scaled);
            const j = Math.min(i + 1, ups.length - 1);
            const tt = scaled - i;
            this._upTmp.copy(ups[i]).lerp(ups[j], tt).normalize();
        } else if (ups.length === 1) {
            this._upTmp.copy(ups[0]).normalize();
        } else {
            this._upTmp.set(0, 1, 0);
        }
        this.camera.up.copy(this._upTmp);

        this.camera.lookAt(this._lookAtPos);

        // Geometric step magnitude over du (proxy for motion; replace with time-based speed if needed)
        const speed = du > 0 ? this._lookAtPos.distanceTo(this._pos) / du : 0;
        this.camera.fov =
            RIDE_CONFIG.CAMERA_BASE_FOV +
            Math.min(RIDE_CONFIG.CAMERA_MAX_FOV_BOOST, speed * RIDE_CONFIG.CAMERA_SPEED_FOV_FACTOR);
        this.camera.updateProjectionMatrix();
    }
}
