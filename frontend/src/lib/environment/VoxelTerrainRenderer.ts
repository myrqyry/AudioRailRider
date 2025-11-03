import * as THREE from 'three';
import { SceneManager } from '../SceneManager';
import vertexShader from '../shaders/voxel-terrain.vert.glsl?raw';
import fragmentShader from '../shaders/voxel-terrain.frag.glsl?raw';

export class VoxelTerrainRenderer {
    private sceneManager: SceneManager;
    private mesh: THREE.Mesh;
    private material: THREE.ShaderMaterial;
    private geometry: THREE.PlaneGeometry;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
        this.createTerrain();
    }

    private createTerrain() {
        this.geometry = new THREE.PlaneGeometry(2, 2);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uColorMap: { value: new THREE.Texture() },
                uHeightMap: { value: new THREE.Texture() },
                uCameraPosition: { value: new THREE.Vector3() },
                uTime: { value: 0.0 },
                uInverseProjectionMatrix: { value: new THREE.Matrix4() },
                uInverseViewMatrix: { value: new THREE.Matrix4() },
                uFar: { value: 0.0 },
                uMapSize: { value: 256.0 },
                uVerticalScale: { value: 500.0 },
                uHorizonOffset: { value: 150.0 },
                uLodFactor: { value: 0.02 },
            },
            vertexShader,
            fragmentShader,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.sceneManager.scene.add(this.mesh);
    }

    public setMaps(heightMap: THREE.DataTexture, colorMap: THREE.DataTexture) {
        this.material.uniforms.uHeightMap.value = heightMap;
        this.material.uniforms.uColorMap.value = colorMap;
        this.material.uniforms.uMapSize.value = heightMap.image.width;
    }

    public update(deltaTime: number) {
        this.material.uniforms.uTime.value += deltaTime;
        this.material.uniforms.uCameraPosition.value.copy(this.sceneManager.camera.position);
        this.material.uniforms.uInverseProjectionMatrix.value.copy(this.sceneManager.camera.projectionMatrixInverse);
        this.material.uniforms.uInverseViewMatrix.value.copy(this.sceneManager.camera.matrixWorld);
        this.material.uniforms.uFar.value = this.sceneManager.camera.far;
    }

    public dispose() {
        this.geometry.dispose();
        this.material.dispose();
        this.sceneManager.scene.remove(this.mesh);
    }
}
