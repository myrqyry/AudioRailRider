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
            // Reset geometry for reuse. Older versions of three.js do not implement
            // BufferGeometry.clear(), so try to call it when available and otherwise
            // perform a manual cleanup of attributes / index / morph targets.
            try {
                if (typeof (geometry as any).clear === 'function') {
                    // Preferred, available on newer three.js versions
                    (geometry as any).clear();
                } else {
                    // Manual cleanup for compatibility with older three.js
                    const gAny = geometry as any;
                    if (gAny.attributes && typeof gAny.attributes === 'object') {
                        for (const name of Object.keys(gAny.attributes)) {
                            if (typeof (geometry as any).deleteAttribute === 'function') {
                                geometry.deleteAttribute(name);
                            } else {
                                // best-effort: remove attribute entry
                                try { delete gAny.attributes[name]; } catch (e) {}
                            }
                        }
                    }
                    try { geometry.setIndex(null); } catch (e) {}
                    if (gAny.morphAttributes && typeof gAny.morphAttributes === 'object') {
                        for (const k of Object.keys(gAny.morphAttributes)) {
                            try { delete gAny.morphAttributes[k]; } catch (e) {}
                        }
                    }
                    // clear cached spatial acceleration structures if present
                    try { if ((gAny).boundsTree) { delete (gAny).boundsTree; } } catch (e) {}
                    // reset bounding data
                    try { geometry.boundingBox = null; geometry.boundingSphere = null; } catch (e) {}
                    try { geometry.groups = []; } catch (e) {}
                }

                this.activeGeometries.delete(geometry);
                this.pool.push(geometry); // Return the same geometry to the pool
            } catch (cleanupErr) {
                // If anything goes wrong during cleanup, dispose the geometry and
                // replace it with a fresh BufferGeometry to keep the pool healthy.
                try { geometry.dispose(); } catch (e) {}
                this.activeGeometries.delete(geometry);
                this.pool.push(new THREE.BufferGeometry());
            }
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