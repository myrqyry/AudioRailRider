import * as THREE from 'three';
import { RIDE_CONFIG } from 'shared/constants';
import { FPSMeter } from './fpsMeter';

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
            // Lightweight FPS meter for adaptive quality heuristics
            (this.scene as any).userData = (this.scene as any).userData || {};
            (this.scene as any).userData._fpsMeter = new FPSMeter(1000);
        this.init();
    }

    private init() {
        const width = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1);
        const height = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 1);
        console.log('[SceneManager] Initializing renderer', { width, height, containerSize: { w: this.container.clientWidth, h: this.container.clientHeight } });
        
        // Cap DPR to avoid excessive GPU work; we adaptively lower it if FPS drops.
        const rawDpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;
        const capped = Math.min(rawDpr, 2);
        this.renderer.setPixelRatio(capped);
        this.renderer.setSize(width, height);
        
        console.log('[SceneManager] Appending canvas to container', { 
            hasContainer: !!this.container, 
            containerTagName: this.container.tagName,
            canvasSize: { w: this.renderer.domElement.width, h: this.renderer.domElement.height }
        });
        
        // Ensure canvas has proper styling
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        
        this.container.appendChild(this.renderer.domElement);
        console.log('[SceneManager] Canvas appended', { childCount: this.container.children.length });

        // Set a default dark gradient background
        const topColor = new THREE.Color(0x0a0a1a); // Very dark blue
        const bottomColor = new THREE.Color(0x000000); // Black
        this.scene.background = topColor;
        this.scene.fog = new THREE.Fog(bottomColor, 100, 1000);

        // Add essential lighting to the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 50, 10);
        this.scene.add(directionalLight);
        
        const backLight = new THREE.DirectionalLight(0x6666ff, 0.3);
        backLight.position.set(-10, 20, -10);
        this.scene.add(backLight);
        
        console.log('[SceneManager] Lighting added to scene');

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize);
            this.renderer.domElement.addEventListener('webglcontextlost', this.handleContextLost, false);
            this.renderer.domElement.addEventListener('webglcontextrestored', this.handleContextRestored, false);
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
                const rawDpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;
                const capped = Math.min(rawDpr, 2);
                this.renderer.setPixelRatio(capped);
        this.renderer.setSize(containerWidth, containerHeight);
    };

    private handleContextLost = (event: Event): void => {
        event.preventDefault();
        console.warn('[SceneManager] WebGL context lost. Notifying application.');
        window.dispatchEvent(new CustomEvent('audiorailrider:webglcontextlost'));
    }

    private handleContextRestored = (): void => {
        console.log('[SceneManager] WebGL context restored. Notifying application to rebuild.');
        // We don't need to do much here because the application will be notified
        // to rebuild the scene from scratch, which is safer.
        window.dispatchEvent(new CustomEvent('audiorailrider:webglcontextrestored'));
    }

    render(): void {
        // Update adaptive hints before rendering
        try {
            const meter: FPSMeter | undefined = (this.scene as any).userData?._fpsMeter;
            if (meter) {
                const fps = meter.tick();
                if (fps !== null) {
                    // write a small LOD hint (simple heuristic) to scene.userData
                    (this.scene as any).userData.lodHint = fps < 40 ? 'low' : 'high';
                    // If FPS is very low, reduce DPR proactively
                    if (fps < 30) this.renderer.setPixelRatio(1);
                    else this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                }
            }
        } catch (e) {
            // non-fatal
        }
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize);
            this.renderer.domElement.removeEventListener('webglcontextlost', this.handleContextLost, false);
            this.renderer.domElement.removeEventListener('webglcontextrestored', this.handleContextRestored, false);
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