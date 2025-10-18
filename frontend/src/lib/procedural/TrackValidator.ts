import * as THREE from 'three';

export class TrackValidator {
    public validate(points: THREE.Vector3[]): boolean {
        if (points.length < 2) {
            return true; // Not enough points to have issues
        }

        for (let i = 1; i < points.length; i++) {
            // Placeholder validation logic
            // Example: Check for sharp turns
            if (i > 1) {
                const v1 = new THREE.Vector3().subVectors(points[i - 1], points[i - 2]).normalize();
                const v2 = new THREE.Vector3().subVectors(points[i], points[i - 1]).normalize();
                if (v1.dot(v2) < 0.5) { // Angle > 60 degrees
                    console.warn(`Sharp turn detected at point ${i}`);
                    // return false; // Or handle it gracefully
                }
            }
        }
        return true;
    }
}