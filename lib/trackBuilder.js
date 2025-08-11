import * as THREE from 'three';
import { RIDE_CONFIG, DEFAULT_SPACING } from './constants';
export const buildTrackData = (blueprint) => {
    const points = [];
    const upVectors = [];
    const segmentDetails = [];
    let currentPos = new THREE.Vector3(0, 5, 0);
    let currentDir = new THREE.Vector3(0, 0, -1);
    let currentUp = new THREE.Vector3(0, 1, 0);
    const addSegment = (newPoints, newUps) => {
        points.push(...newPoints);
        upVectors.push(...newUps);
        if (newPoints.length > 0) {
            currentPos = newPoints[newPoints.length - 1];
            // Update direction based on the last two points
            if (newPoints.length > 1) {
                currentDir.subVectors(newPoints[newPoints.length - 1], newPoints[newPoints.length - 2]).normalize();
            }
            currentUp = newUps[newUps.length - 1];
        }
    };
    // Add an initial flat segment
    const initialSegmentPoints = [];
    const initialSegmentUps = [];
    // Sanitize and clamp values
    const length = Math.max(1, Math.floor(Number(RIDE_CONFIG.INITIAL_TRACK_SEGMENT_LENGTH) || 0));
    let spacing = Number(RIDE_CONFIG.INITIAL_TRACK_SEGMENT_SPACING);
    if (!isFinite(spacing) || spacing < 0)
        spacing = DEFAULT_SPACING;
    for (let i = 0; i < length; i++) {
        initialSegmentPoints.push(currentPos.clone().add(currentDir.clone().multiplyScalar(i * spacing)));
        initialSegmentUps.push(currentUp.clone());
    }
    addSegment(initialSegmentPoints, initialSegmentUps);
    segmentDetails.push({
        intensity: 0,
        lightingEffect: "none",
        environmentChange: "none",
        audioSyncPoint: 0
    });
    blueprint.track.forEach((segment) => {
        const segmentPoints = [];
        const segmentUps = [];
        const resolution = Math.max(1, Math.floor(RIDE_CONFIG.TRACK_SEGMENT_RESOLUTION ?? 100));
        segmentDetails.push({
            intensity: segment.intensity,
            lightingEffect: segment.lightingEffect,
            environmentChange: segment.environmentChange,
            audioSyncPoint: segment.audioSyncPoint
        });
        switch (segment.component) {
            case 'climb':
            case 'drop': {
                const angle = THREE.MathUtils.degToRad(segment.angle || (segment.component === 'climb' ? 15 : -40));
                const length = segment.length || 150;
                const dir_horizontal = currentDir.clone();
                dir_horizontal.y = 0;
                dir_horizontal.normalize();
                const endPos = currentPos.clone()
                    .add(dir_horizontal.multiplyScalar(Math.cos(angle) * length))
                    .add(new THREE.Vector3(0, Math.sin(angle) * length, 0));
                for (let i = 1; i <= resolution; i++) {
                    const alpha = i / resolution;
                    segmentPoints.push(new THREE.Vector3().lerpVectors(currentPos, endPos, alpha));
                    segmentUps.push(currentUp.clone());
                }
                break;
            }
            case 'turn': {
                const radius = segment.radius || 80;
                const angle = THREE.MathUtils.degToRad(segment.angle || 90);
                const direction = segment.direction === 'left' ? 1 : -1;
                const turnAxis = new THREE.Vector3(0, 1, 0);
                const centerOffset = currentDir.clone().cross(turnAxis).multiplyScalar(radius * direction);
                const center = currentPos.clone().add(centerOffset);
                const startVec = currentPos.clone().sub(center);
                for (let i = 1; i <= resolution; i++) {
                    const alpha = i / resolution;
                    const newVec = startVec.clone().applyAxisAngle(turnAxis, angle * alpha * -direction);
                    segmentPoints.push(center.clone().add(newVec));
                    segmentUps.push(currentUp.clone());
                }
                break;
            }
            case 'loop': {
                const radius = segment.radius || 50;
                const loopCenter = currentPos.clone().add(currentDir.clone().multiplyScalar(radius));
                for (let i = 1; i <= resolution; i++) {
                    const alpha = i / resolution;
                    const loopAngle = alpha * Math.PI * 2;
                    const point = new THREE.Vector3(0, Math.sin(loopAngle) * radius, (Math.cos(loopAngle) - 1) * -radius);
                    const up = new THREE.Vector3(0, Math.cos(loopAngle), -Math.sin(loopAngle));
                    const matrix = new THREE.Matrix4().lookAt(currentPos, loopCenter, currentUp);
                    point.applyMatrix4(matrix);
                    up.transformDirection(matrix);
                    segmentPoints.push(point);
                    segmentUps.push(up);
                }
                break;
            }
            case 'barrelRoll': {
                const rotations = segment.rotations || 1;
                const length = segment.length || 150;
                const endPos = currentPos.clone().add(currentDir.clone().multiplyScalar(length));
                for (let i = 1; i <= resolution; i++) {
                    const alpha = i / resolution;
                    const rollAngle = alpha * Math.PI * 2 * rotations;
                    segmentPoints.push(new THREE.Vector3().lerpVectors(currentPos, endPos, alpha));
                    segmentUps.push(currentUp.clone().applyAxisAngle(currentDir, rollAngle));
                }
                break;
            }
        }
        addSegment(segmentPoints, segmentUps);
        segmentDetails.push({
            intensity: segment.intensity,
            lightingEffect: segment.lightingEffect,
            environmentChange: segment.environmentChange,
            audioSyncPoint: segment.audioSyncPoint
        });
    });
    return {
        path: points,
        upVectors: upVectors,
        railColor: blueprint.palette[0] || '#ffffff',
        glowColor: blueprint.palette[1] || '#00ffff',
        skyColor1: blueprint.palette[2] || '#0d0a1f',
        skyColor2: RIDE_CONFIG.DEFAULT_SKY_COLOR_2,
        segmentDetails: segmentDetails,
        rideName: blueprint.rideName,
        moodDescription: blueprint.moodDescription
    };
};
