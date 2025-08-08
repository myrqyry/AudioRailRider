import * as THREE from 'three';
import { RIDE_CONFIG } from './constants';

export class SceneManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(RIDE_CONFIG.CAMERA_BASE_FOV, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.init();
    }

    private init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.addStarryBackground();
        window.addEventListener('resize', this.handleResize);
    }

    private addStarryBackground() {
        const starVertices = [];
        for (let i = 0; i < RIDE_CONFIG.STARS_COUNT; i++) {
            starVertices.push(THREE.MathUtils.randFloatSpread(2000));
            starVertices.push(THREE.MathUtils.randFloatSpread(2000));
            starVertices.push(THREE.MathUtils.randFloatSpread(2000));
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.7 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    private handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
        this.scene.clear();
    }
}
