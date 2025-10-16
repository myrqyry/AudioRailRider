import * as THREE from 'three';
import { TrackData } from 'shared/types';
import { RIDE_CONFIG } from 'shared/constants';

/**
 * Manages the camera's position and orientation along a predefined 3D path.
 * It simulates a "ride" experience by moving the camera along a curve,
 * handling look-ahead, up-vector stabilization, and dynamic field-of-view adjustments.
 */
export class RideCamera {
    private static readonly WORLD_UP = new THREE.Vector3(0, 1, 0);
    /** The Three.js camera object being controlled. */
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
    private _trackRadius: number = 0.35;

    /**
     * The current position the camera is looking at.
     * @type {THREE.Vector3}
     */
    public get lookAtPos(): THREE.Vector3 {
        return this._lookAtPos;
    }

    /**
     * Sets the radius of the track, used for calculating camera offset.
     * @param {number} r - The new track radius.
     */
    public setTrackRadius(r: number) {
        if (typeof r === 'number' && isFinite(r) && r > 0) this._trackRadius = r;
    }

    /**
     * Creates an instance of RideCamera.
     * @param {THREE.PerspectiveCamera} camera - The camera to control.
     * @param {TrackData} trackData - The data defining the track path and properties.
     */
    constructor(camera: THREE.PerspectiveCamera, trackData: TrackData) {
        this.camera = camera;
        this.trackData = trackData;
        this.curve = new THREE.CatmullRomCurve3(trackData.path, false, 'catmullrom', 0.5);
    }

    /**
     * Updates the camera's position and orientation based on the progress along the track.
     * @param {number} progress - A value from 0 to 1 representing the position along the curve.
     */
    update(progress: number) {
        const u = THREE.MathUtils.clamp(progress, 0, 1);
    this.curve.getPointAt(u, this._pos);

        // Adaptive look-ahead; avoid zero-length look vector at u === 1
    const LOOKAHEAD_U = 0.025;
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
    // Camera positioned relative to the configured track radius
    const SAFETY_MARGIN = 0.18; // Extra distance to guarantee clearance
    const lateralOffset = this._trackRadius + SAFETY_MARGIN;
    const seatHeight = 0.12; // Small vertical offset
    // Remove backwardOffset for now to avoid being inside tube on sharp turns
    this._offsetTmp.set(0, 0, 0)
        .addScaledVector(this._sideTmp, lateralOffset)
        .addScaledVector(RideCamera.WORLD_UP, seatHeight);

    this._cameraPosTmp.copy(this._pos).add(this._offsetTmp);
    this.camera.position.copy(this._cameraPosTmp);

        this._lookAtOffsetTmp.set(0, 0, 0)
            .addScaledVector(RideCamera.WORLD_UP, seatHeight * 0.55)
            .addScaledVector(this._sideTmp, lateralOffset * 0.28);

    this._lookTargetTmp.copy(this._lookAtPos).add(this._lookAtOffsetTmp);
    this.camera.lookAt(this._lookTargetTmp);

        // Geometric step magnitude over du (proxy for motion; replace with time-based speed if needed)
        const speed = du > 0 ? this._lookAtPos.distanceTo(this._pos) / du : 0;
        const speedBoost = THREE.MathUtils.clamp(speed * 1.35, 0, 160);
        this.camera.fov =
            RIDE_CONFIG.CAMERA_BASE_FOV +
            Math.min(RIDE_CONFIG.CAMERA_MAX_FOV_BOOST, speedBoost * RIDE_CONFIG.CAMERA_SPEED_FOV_FACTOR);
        this.camera.updateProjectionMatrix();
    }
}
