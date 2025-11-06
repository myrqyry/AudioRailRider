import * as THREE from 'three';
import { TrackData } from 'shared/types';
import { geometryPool } from '../utils/memory';
import { MeshBVH } from 'three-mesh-bvh';
import { RIDE_CONFIG } from 'shared/constants';

const HIGH_QUALITY_SEGMENTS = 2;
const LOW_QUALITY_SEGMENTS = 1;

export class TrackGeometryManager {
    private scene: THREE.Scene;
    private trackData: TrackData;
    private trackMesh: THREE.Mesh;
    private trackMaterial: THREE.MeshStandardMaterial;
    public pathCurve: THREE.CatmullRomCurve3 | null = null;
    private highQualityMode: boolean = true;
    private placeTrackUnderCamera: boolean;
    private trackUnderCameraVerticalOffset: number;
    private trackRadius: number;
    private trackPathPoints: THREE.Vector3[] = [];

    constructor(
        scene: THREE.Scene,
        trackData: TrackData,
        trackMaterial: THREE.MeshStandardMaterial,
        initialSettings: {
            placeTrackUnderCamera: boolean;
            trackUnderCameraVerticalOffset: number;
            trackRadius: number;
            trackPathPoints: THREE.Vector3[];
        }
    ) {
        this.scene = scene;
        this.trackData = trackData;
        this.trackMaterial = trackMaterial;
        this.placeTrackUnderCamera = initialSettings.placeTrackUnderCamera;
        this.trackUnderCameraVerticalOffset = initialSettings.trackUnderCameraVerticalOffset;
        this.trackRadius = initialSettings.trackRadius;
        this.trackPathPoints = initialSettings.trackPathPoints;

        this.rebuildTrackGeometry();
    }

    public rebuildTrackGeometry() {
        try {
            if (!this.trackPathPoints || this.trackPathPoints.length === 0) return;
            const segments = this.highQualityMode ? this.trackPathPoints.length * HIGH_QUALITY_SEGMENTS : this.trackPathPoints.length * LOW_QUALITY_SEGMENTS;
            let curvePoints = this.trackPathPoints.map((p) => p.clone());
            if (this.placeTrackUnderCamera) {
                curvePoints = this.computeOffsetCurvePoints(this.trackPathPoints);
            }

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            this.pathCurve = curve;
            const newGeom = new THREE.TubeGeometry(curve, Math.max(4, segments), this.trackRadius, this.highQualityMode ? 8 : 6, false);
            const geometry = geometryPool.acquire();
            geometry.copy(newGeom);
            newGeom.dispose();
            (geometry as any).boundsTree = new MeshBVH(geometry);

            if (!this.trackMesh) {
                this.trackMesh = new THREE.Mesh(geometry, this.trackMaterial);
                this.trackMesh.frustumCulled = true;
                this.scene.add(this.trackMesh);
            } else {
                const oldGeometry = this.trackMesh.geometry as THREE.BufferGeometry;
                geometryPool.release(oldGeometry);
                this.trackMesh.geometry = geometry;
            }
        } catch (e) {
            console.error('[TrackGeometryManager] rebuildTrackGeometry failed', e);
        }
    }

    private computeOffsetCurvePoints(points: THREE.Vector3[]): THREE.Vector3[] {
        const ups = this.trackData?.upVectors;
        const n = points.length;
        if (!ups || ups.length === 0) {
            const down = new THREE.Vector3(0, -this.trackUnderCameraVerticalOffset, 0);
            return points.map((p) => p.clone().add(down));
        }
        const out: THREE.Vector3[] = [];
        for (let i = 0; i < n; i++) {
            let up = new THREE.Vector3(0, 1, 0);
            if (ups.length >= 2) {
                const scaled = (i / Math.max(1, n - 1)) * (ups.length - 1);
                const a = Math.floor(scaled);
                const b = Math.min(a + 1, ups.length - 1);
                const t = scaled - a;
                const upA = new THREE.Vector3(ups[a].x, ups[a].y, ups[a].z);
                const upB = new THREE.Vector3(ups[b].x, ups[b].y, ups[b].z);
                up = upA.lerp(upB, t).normalize();
            } else if (ups.length === 1) {
                up = new THREE.Vector3(ups[0].x, ups[0].y, ups[0].z).normalize();
            }
            const down = up.clone().multiplyScalar(-this.trackUnderCameraVerticalOffset);
            out.push(points[i].clone().add(down));
        }
        return out;
    }

    public getTrackMesh() {
        return this.trackMesh;
    }

    public getPathCurve() {
        return this.pathCurve;
    }

    public dispose() {
        if (this.trackMesh) {
            this.scene.remove(this.trackMesh);
            geometryPool.release(this.trackMesh.geometry as THREE.BufferGeometry);
        }
    }
}
