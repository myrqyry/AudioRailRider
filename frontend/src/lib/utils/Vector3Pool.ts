import * as THREE from 'three';

/**
 * Reusable object pool for THREE.Vector3 instances to avoid per-frame allocations.
 */
export class Vector3Pool {
  private readonly pool: THREE.Vector3[] = [];

  constructor(initialSize = 0) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new THREE.Vector3());
    }
  }

  acquire(): THREE.Vector3 {
    return this.pool.pop() || new THREE.Vector3();
  }

  release(vector: THREE.Vector3): void {
    vector.set(0, 0, 0);
    this.pool.push(vector);
  }

  /**
   * Convenience helper that acquires a vector, passes it to the callback, and releases it afterwards.
   */
  withVector(callback: (vector: THREE.Vector3) => void): void {
    const vector = this.acquire();
    try {
      callback(vector);
    } finally {
      this.release(vector);
    }
  }
}
