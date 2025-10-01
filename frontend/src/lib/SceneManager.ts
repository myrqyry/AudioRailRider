import * as THREE from 'three';
import { RIDE_CONFIG } from 'shared/constants';

export class SceneManager {
    readonly scene: THREE.Scene;
    readonly camera: THREE.PerspectiveCamera;
    readonly renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private stars?: THREE.Points;

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

        this.addStarryBackground();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize);
        }
    }

    private addStarryBackground() {
        const positions = new Float32Array(RIDE_CONFIG.STARS_COUNT * 3);
        for (let i = 0; i < positions.length; i++) {
            positions[i] = THREE.MathUtils.randFloatSpread(2000);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        const starMaterial = new THREE.PointsMaterial({
            color: 0x888888,
            size: 0.7
        });
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
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
        if (this.stars) {
            this.scene.remove(this.stars);
            this.stars.geometry.dispose();
            const mat = this.stars.material;
            if (Array.isArray(mat)) {
                mat.forEach(m => m.dispose());
            } else {
                mat.dispose();
            }
            this.stars = undefined;
        }
        if (this.renderer.domElement.parentElement === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
        this.scene.clear();
    }
}
