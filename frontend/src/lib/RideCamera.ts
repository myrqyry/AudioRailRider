import * as THREE from 'three';
import { TrackData } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';

export class RideCamera {
    readonly camera: THREE.PerspectiveCamera;
    private curve: THREE.CatmullRomCurve3;
    private trackData: TrackData;
    // Reused temporaries to avoid per-frame allocations
    private readonly _pos = new THREE.Vector3();
    private readonly _lookAtPos = new THREE.Vector3();
    private readonly _upTmp = new THREE.Vector3();
    private readonly _sideTmp = new THREE.Vector3();
    private readonly _offsetTmp = new THREE.Vector3();
    private readonly _lookAtOffsetTmp = new THREE.Vector3();
    private readonly _cameraPosTmp = new THREE.Vector3();
    private readonly _lookTargetTmp = new THREE.Vector3();
    private readonly _lastSide = new THREE.Vector3(1, 0, 0);

    public get lookAtPos(): THREE.Vector3 {
        return this._lookAtPos;
    }

    constructor(camera: THREE.PerspectiveCamera, trackData: TrackData) {
        this.camera = camera;
        this.trackData = trackData;
        this.curve = new THREE.CatmullRomCurve3(trackData.path, false, 'catmullrom', 0.5);
    }

    update(progress: number) {
        const u = THREE.MathUtils.clamp(progress, 0, 1);
    this.curve.getPointAt(u, this._pos);

        // Adaptive look-ahead; avoid zero-length look vector at u === 1
        const LOOKAHEAD_U = 0.01;
        const du = Math.min(LOOKAHEAD_U, 1 - u);
        if (du > 0) {
            this.curve.getPointAt(u + du, this._lookAtPos);
        } else {
            const dir = this.curve.getTangentAt(u);
            this._lookAtPos.copy(this._pos).addScaledVector(dir, 1);
        }

        // Compute a comfortable rider offset so the camera sits above the track
        const tangent = this.curve.getTangentAt(u).normalize();

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

        // Compute an approximate "right" vector using Frenet frame, falling back to previous frame when tangent ≈ up
        this._sideTmp.crossVectors(tangent, this.camera.up);
        if (this._sideTmp.lengthSq() < 1e-6) {
            this._sideTmp.copy(this._lastSide);
        } else {
            this._sideTmp.normalize();
            this._lastSide.copy(this._sideTmp);
        }

        const seatHeight = 3.0; // lift camera above tube
        const lateralOffset = 5.0; // shift camera outside the tube radius (~2)
        const backwardOffset = 4.0; // trail slightly behind for better view

        this._offsetTmp.set(0, 0, 0)
            .addScaledVector(this.camera.up, seatHeight)
            .addScaledVector(this._sideTmp, lateralOffset)
            .addScaledVector(tangent, -backwardOffset);

    this._cameraPosTmp.copy(this._pos).add(this._offsetTmp);
    this.camera.position.copy(this._cameraPosTmp);

        this._lookAtOffsetTmp.set(0, 0, 0)
            .addScaledVector(this.camera.up, seatHeight * 0.6)
            .addScaledVector(this._sideTmp, lateralOffset * 0.3);

    this._lookTargetTmp.copy(this._lookAtPos).add(this._lookAtOffsetTmp);
    this.camera.lookAt(this._lookTargetTmp);

        // Geometric step magnitude over du (proxy for motion; replace with time-based speed if needed)
        const speed = du > 0 ? this._lookAtPos.distanceTo(this._pos) / du : 0;
        this.camera.fov =
            RIDE_CONFIG.CAMERA_BASE_FOV +
            Math.min(RIDE_CONFIG.CAMERA_MAX_FOV_BOOST, speed * RIDE_CONFIG.CAMERA_SPEED_FOV_FACTOR);
        this.camera.updateProjectionMatrix();
    }
}
