import * as THREE from 'three';
import { RIDE_CONFIG } from 'shared/constants';

export class SceneManager {
    readonly scene: THREE.Scene;
    readonly camera: THREE.PerspectiveCamera;
    readonly renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private skyboxTexture?: THREE.Texture;

    constructor(container: HTMLElement) {
        this.container = container;
        this.scene = new THREE.Scene();
        const width = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1);
        const height = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 1);
        this.camera = new THREE.PerspectiveCamera(RIDE_CONFIG.CAMERA_BASE_FOV, width / height, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.init();
    }

    private init() {
        const width = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1);
        const height = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 1);
        const dpr = (typeof window !== 'undefined' && window.devicePixelRatio)
          ? Math.min(window.devicePixelRatio, 2)
          : 1;
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        // Set a default background color
        this.scene.background = new THREE.Color(0x000000);

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize);
        }
    }

    public updateSkybox(imageUrl: string): void {
        if (this.skyboxTexture) {
            this.skyboxTexture.dispose();
        }

        const loader = new THREE.TextureLoader();
        loader.load(
            imageUrl,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
                this.scene.environment = texture;
                this.skyboxTexture = texture;
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the skybox texture:', error);
                this.scene.background = new THREE.Color(0x000000); // Fallback to black
            }
        );
    }

    private handleResize = (): void => {
        const containerWidth = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1);
        const containerHeight = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 1);
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();
        const dpr = (typeof window !== 'undefined' && window.devicePixelRatio)
          ? Math.min(window.devicePixelRatio, 2)
          : 1;
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(containerWidth, containerHeight);
    };

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize);
        }
        if (this.skyboxTexture) {
            this.skyboxTexture.dispose();
        }
        if (this.renderer.domElement.parentElement === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
        this.scene.clear();
    }
}
