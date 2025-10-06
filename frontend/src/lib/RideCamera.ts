import * as THREE from 'three';
import { TrackData } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';

export class RideCamera {
    private static readonly WORLD_UP = new THREE.Vector3(0, 1, 0);
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
    private readonly _blendedUp = new THREE.Vector3(0, 1, 0);
    private readonly _smoothedUp = new THREE.Vector3(0, 1, 0);

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
            this._upTmp.copy(ups[i]).lerp(ups[j], tt);
        } else if (ups.length === 1) {
            this._upTmp.copy(ups[0]);
        } else {
            this._upTmp.copy(RideCamera.WORLD_UP);
        }
        this._upTmp.normalize();
        this._blendedUp.copy(this._upTmp).lerp(RideCamera.WORLD_UP, 0.6).normalize();
        this._smoothedUp.lerp(this._blendedUp, 0.2).normalize();
        this.camera.up.copy(this._smoothedUp);

        // Compute a world-stable right vector with smoothing to avoid sudden flips on rolls
        this._sideTmp.crossVectors(tangent, RideCamera.WORLD_UP);
        if (this._sideTmp.lengthSq() < 1e-6) {
            this._sideTmp.crossVectors(tangent, this._smoothedUp);
        }
        if (this._sideTmp.lengthSq() < 1e-6) {
            this._sideTmp.copy(this._lastSide);
        } else {
            this._sideTmp.normalize();
            this._lastSide.lerp(this._sideTmp, 0.3).normalize();
            this._sideTmp.copy(this._lastSide);
        }

        const rollFactor = THREE.MathUtils.clamp(1 - Math.abs(this._smoothedUp.dot(RideCamera.WORLD_UP)), 0, 1);
        const seatHeight = THREE.MathUtils.lerp(3.0, 3.6, rollFactor);
        const lateralOffset = THREE.MathUtils.lerp(5.0, 3.2, rollFactor);
        const backwardOffset = THREE.MathUtils.lerp(4.0, 4.8, rollFactor * 0.6);

        this._offsetTmp.set(0, 0, 0)
            .addScaledVector(RideCamera.WORLD_UP, seatHeight)
            .addScaledVector(this._sideTmp, lateralOffset)
            .addScaledVector(tangent, -backwardOffset);

    this._cameraPosTmp.copy(this._pos).add(this._offsetTmp);
    this.camera.position.copy(this._cameraPosTmp);

        this._lookAtOffsetTmp.set(0, 0, 0)
            .addScaledVector(RideCamera.WORLD_UP, seatHeight * 0.55)
            .addScaledVector(this._sideTmp, lateralOffset * 0.28);

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
