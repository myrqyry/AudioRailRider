import * as THREE from 'three';

/**
 * A pool for managing and reusing Three.js BufferGeometry objects.
 * This helps reduce memory allocation and garbage collection overhead
 * by recycling geometries instead of creating new ones for every object.
 */
class GeometryPool {
    private pool: THREE.BufferGeometry[] = [];
    private activeGeometries: Set<THREE.BufferGeometry> = new Set();

    /**
     * Acquires a geometry from the pool. If the pool is empty,
     * it creates a new BufferGeometry.
     * @returns A BufferGeometry instance.
     */
    acquire(): THREE.BufferGeometry {
        const geometry = this.pool.pop() || new THREE.BufferGeometry();
        this.activeGeometries.add(geometry);
        return geometry;
    }

    /**
     * Releases a geometry back to the pool for reuse.
     * It's crucial to call this when a mesh is no longer needed.
     * The geometry is reset before being added back to the pool.
     * @param geometry The geometry to release.
     */
    release(geometry: THREE.BufferGeometry) {
        if (this.activeGeometries.has(geometry)) {
            geometry.dispose(); // Dispose of old buffers
            this.activeGeometries.delete(geometry);
            this.pool.push(new THREE.BufferGeometry()); // Add a fresh geometry to the pool
        }
    }

    /**
     * Disposes of all geometries in the pool and clears the pool.
     * Should be called when the scene is being destroyed.
     */
    dispose() {
        this.pool.forEach(geometry => geometry.dispose());
        this.activeGeometries.forEach(geometry => geometry.dispose());
        this.pool = [];
        this.activeGeometries.clear();
    }
}

export const geometryPool = new GeometryPool();