import * as THREE from 'three';

/**
 * Reusable object pool for THREE.Vector3 instances to avoid per-frame allocations.
 * This implementation uses a WeakSet to track borrowed objects, preventing double-release
 * and other common pooling bugs.
 */
export class Vector3Pool {
    private readonly available: THREE.Vector3[] = [];
    private readonly inUse = new WeakSet<THREE.Vector3>();
    private readonly maxSize: number;

    constructor(initialSize = 10, maxSize = 100) {
        this.maxSize = maxSize;
        for (let i = 0; i < initialSize; i++) {
            this.available.push(new THREE.Vector3());
        }
    }

    acquire(): THREE.Vector3 {
        let vector = this.available.pop();

        if (!vector) {
            vector = new THREE.Vector3();
        }

        if (this.inUse.has(vector)) {
            throw new Error('Vector3Pool: Attempting to acquire vector already in use');
        }

        this.inUse.add(vector);
        return vector.set(0, 0, 0);
    }

    release(vector: THREE.Vector3): void {
        if (!this.inUse.has(vector)) {
            console.warn('Vector3Pool: Attempting to release vector not acquired from pool');
            return;
        }

        this.inUse.delete(vector);

        if (this.available.length < this.maxSize) {
            this.available.push(vector);
        }
        // If the pool is full, let the vector be garbage collected.
    }

    /**
     * Convenience helper that acquires a vector, passes it to the callback, and releases it afterwards.
     */
    withVector<T>(callback: (vector: THREE.Vector3) => T): T {
        const vector = this.acquire();
        try {
            return callback(vector);
        } finally {
            this.release(vector);
        }
    }

    dispose(): void {
        this.available.length = 0;
        // The WeakSet will be garbage collected automatically.
    }
}
