import * as THREE from 'three';
import { RIDE_CONFIG } from 'shared/constants';
import { getCachedShader, getCachedLygiaResolver } from './preloader';

export class GPUParticleSystem {
    private renderer: THREE.WebGLRenderer;
    private positionTargets: THREE.WebGLRenderTarget[];
    private velocityTargets: THREE.WebGLRenderTarget[];
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private velMaterial: THREE.ShaderMaterial | null = null;
    private posMaterial: THREE.ShaderMaterial | null = null;
    private swap: boolean = false;
    private size: number;
    private initialized: boolean = false;

    constructor(renderer: THREE.WebGLRenderer, particleCount: number) {
        this.renderer = renderer;
        this.size = Math.ceil(Math.sqrt(particleCount));
        this.positionTargets = [];
        this.velocityTargets = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }

    private validateShaderSource(source: string): boolean {
        const includePattern = /#include\s+["<][^">]+[">]/g;
        const matches = source.match(includePattern);
        if (matches) {
            for (const match of matches) {
                if (match.includes('#include') && !match.match(/^\/\*/)) {
                    console.error('[GPUParticleSystem] Unresolved shader include found:', match);
                    return false;
                }
            }
        }
        return true;
    }

    public async init() {
        this.initializeTargets();
        await this.initializeMaterials();
        this.initializeScene();
        this.primeRenderTargets();
        this.initialized = true;
    }

    private initializeTargets() {
        const rtParams: any = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.FloatType, format: THREE.RGBAFormat };
        this.positionTargets.push(new THREE.WebGLRenderTarget(this.size, this.size, rtParams));
        this.positionTargets.push(new THREE.WebGLRenderTarget(this.size, this.size, rtParams));
        this.velocityTargets.push(new THREE.WebGLRenderTarget(this.size, this.size, rtParams));
        this.velocityTargets.push(new THREE.WebGLRenderTarget(this.size, this.size, rtParams));
    }

    private primeRenderTargets() {
        const posArray = new Float32Array(this.size * this.size * 4);
        for (let i = 0; i < this.size * this.size; i++) { posArray[i * 4 + 1] = -9999; }
        const posTexture = new THREE.DataTexture(posArray, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
        posTexture.needsUpdate = true;

        const velArray = new Float32Array(this.size * this.size * 4).fill(0);
        const velTexture = new THREE.DataTexture(velArray, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
        velTexture.needsUpdate = true;

        // Vel prime
        (this.velMaterial as any).uniforms.prevVel.value = velTexture;
        (this.velMaterial as any).uniforms.prevPos.value = posTexture;
        this.renderer.setRenderTarget(this.velocityTargets[0]);
        (this.scene.children[0] as THREE.Mesh).material = this.velMaterial!;
        this.renderer.render(this.scene, this.camera);

        // Pos prime
        (this.posMaterial as any).uniforms.prevPos.value = posTexture;
        (this.posMaterial as any).uniforms.velTex.value = this.velocityTargets[0].texture;
        this.renderer.setRenderTarget(this.positionTargets[0]);
        (this.scene.children[1] as THREE.Mesh).material = this.posMaterial!;
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(null);
    }

    private async initializeMaterials() {
        let preResolvedVel: string | null = getCachedShader('/shaders/velFrag.resolved.glsl');
        let preResolvedPos: string | null = getCachedShader('/shaders/posFrag.resolved.glsl');

        if (!preResolvedVel) { try { const r = await fetch('/shaders/velFrag.resolved.glsl'); if (r.ok) preResolvedVel = await r.text(); } catch (e) {} }
        if (!preResolvedPos) { try { const r = await fetch('/shaders/posFrag.resolved.glsl'); if (r.ok) preResolvedPos = await r.text(); } catch (e) {} }

        let baseVelFrag = getCachedShader('/shaders/baseVelFrag.glsl') || '';
        let basePosFrag = getCachedShader('/shaders/basePosFrag.glsl') || '';

        if ((!preResolvedVel || !preResolvedPos) && (!baseVelFrag || !basePosFrag)) {
            try {
                if (!baseVelFrag) { const r = await fetch('/shaders/baseVelFrag.glsl'); if (r.ok) baseVelFrag = await r.text(); }
                if (!basePosFrag) { const r = await fetch('/shaders/basePosFrag.glsl'); if (r.ok) basePosFrag = await r.text(); }
            } catch (e) {}
        }

        let resolveLygia: ((s: string) => string) | null = getCachedLygiaResolver();
        if (!resolveLygia && (!preResolvedVel || !preResolvedPos)) {
            try {
                try {
                    const localUrl = window.location.origin + '/lygia/resolve.esm.js';
                    const local = await import(/* @vite-ignore */ localUrl);
                    resolveLygia = (local && (local.default || local.resolveLygia || local.resolve)) ? (local.default || local.resolveLygia || local.resolve) : null;
                } catch (e) {
                    const cdnUrl = 'https://lygia.xyz/resolve.esm.js';
                    const mod = await import(/* @vite-ignore */ cdnUrl);
                    resolveLygia = (mod && (mod.default || mod.resolveLygia || mod.resolve) ) ? (mod.default || mod.resolveLygia || mod.resolve) : null;
                }
            } catch (e) { resolveLygia = null; }
        }

        const baseVelInline = `
            precision highp float; varying vec2 vUv;
            uniform sampler2D prevVel; uniform sampler2D prevPos; uniform float dt; uniform float time;
            uniform float audioForce; uniform float subBass; uniform float bass; uniform float lowMid; uniform float mid; uniform float highMid; uniform float treble; uniform float sparkle;
            vec3 hash3(vec2 p) { vec3 q = vec3( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)) ); return fract(sin(q) * 43758.5453); }
            float noise(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); vec3 a = hash3(i + vec2(0.0,0.0)); vec3 b = hash3(i + vec2(1.0,0.0)); vec3 c = hash3(i + vec2(0.0,1.0)); vec3 d = hash3(i + vec2(1.0,1.0)); vec2 u = f*f*(3.0-2.0*f); return mix(mix(a.x,b.x,u.x), mix(c.x,d.x,u.x), u.y); }
            uniform float noiseScale; uniform float noiseSpeed; uniform float curlStrength;
            vec3 curlNoise(vec3 p){ float n1 = noise(p.xy * noiseScale + time * noiseSpeed); float n2 = noise(p.yz * noiseScale + time * noiseSpeed * 1.1); float n3 = noise(p.zx * noiseScale + time * noiseSpeed * 0.95); return normalize(vec3(n2 - n3, n3 - n1, n1 - n2)); }
            void main(){
              vec3 v = texture2D(prevVel, vUv).rgb;
              vec3 p = texture2D(prevPos, vUv).rgb;
              vec3 accel = vec3(0.0, -0.98, 0.0);
              v += accel * dt;
              float bandPulse = clamp((sin(time*10.0 + vUv.x*50.0) * 0.5 + 0.5), 0.0, 1.0);
              float audio = bandPulse * audioForce;
              audio += subBass * 3.0; audio += bass * 2.0; audio += lowMid * 1.4; audio += mid * 1.2; audio += highMid * 1.0; audio += treble * 0.8; audio += sparkle * 0.6;
              v.y += audio * 2.5;
              vec3 c = curlNoise(p + v * 0.5);
              v += c * curlStrength * (0.5 + bass);
              v *= 0.995;
              gl_FragColor = vec4(v, 1.0);
            }`;

        let velFragSrc = baseVelFrag || baseVelInline;
        if (preResolvedVel) { velFragSrc = preResolvedVel; }
        else if (resolveLygia) {
            try {
                const resolved = resolveLygia('#include "lygia/generative/curl.glsl"\\n' + baseVelFrag);
                if (this.validateShaderSource(resolved)) velFragSrc = resolved;
            } catch (e) { /* use fallback */ }
        }

        this.velMaterial = new THREE.ShaderMaterial({
            uniforms: {
                prevVel: { value: null }, prevPos: { value: null }, audioForce: { value: 0 },
                curlStrength: { value: 0.12 }, noiseScale: { value: 2.0 }, noiseSpeed: { value: 0.12 },
                subBass: { value: 0.0 }, bass: { value: 0.0 }, lowMid: { value: 0.0 }, mid: { value: 0.0 },
                highMid: { value: 0.0 }, treble: { value: 0.0 }, sparkle: { value: 0.0 },
                time: { value: 0 }, dt: { value: 1/60 }, texSize: { value: this.size },
            },
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
            fragmentShader: velFragSrc,
            depthTest: false, depthWrite: false
        });

        const basePosInline = `
            precision highp float; varying vec2 vUv;
            uniform sampler2D prevPos; uniform sampler2D velTex; uniform float dt;
            void main(){
              vec3 p = texture2D(prevPos, vUv).rgb;
              vec3 v = texture2D(velTex, vUv).rgb;
              p += v * dt;
              if (p.y < -100.0) p.y = -9999.0;
              gl_FragColor = vec4(p, 1.0);
            }`;

        let posFragSrc = basePosFrag || basePosInline;
        if (preResolvedPos) { posFragSrc = preResolvedPos; }
        else if (resolveLygia) {
            try {
                const resolved = resolveLygia(basePosFrag);
                if (this.validateShaderSource(resolved)) posFragSrc = resolved;
            } catch (e) { /* use fallback */ }
        }

        this.posMaterial = new THREE.ShaderMaterial({
            uniforms: { prevPos: { value: null }, velTex: { value: null }, dt: { value: 1/60 }, texSize: { value: this.size } },
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
            fragmentShader: posFragSrc,
            depthTest: false, depthWrite: false
        });
    }

    private initializeScene() {
        const quadVel = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.velMaterial!);
        const quadPos = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.posMaterial!);
        this.scene.add(quadVel);
        this.scene.add(quadPos);
    }

    public update(deltaTime: number, audioFeatures: Record<string, number>, curlParams: any, segmentIntensityBoost: number, gpuAudioForce: number) {
        if (!this.initialized) return;

        const readPos = this.positionTargets[this.swap ? 1 : 0];
        const readVel = this.velocityTargets[this.swap ? 1 : 0];
        const writeVel = this.velocityTargets[this.swap ? 0 : 1];
        const writePos = this.positionTargets[this.swap ? 0 : 1];

        const velMat = this.velMaterial as any;
        velMat.uniforms.time.value = performance.now() / 1000;
        velMat.uniforms.dt.value = deltaTime;
        velMat.uniforms.prevVel.value = readVel.texture;
        velMat.uniforms.prevPos.value = readPos.texture;

        const boost = segmentIntensityBoost;
        velMat.uniforms.subBass.value = (audioFeatures.subBass || 0.0) * boost;
        velMat.uniforms.bass.value = (audioFeatures.bass || 0.0) * boost;
        velMat.uniforms.lowMid.value = (audioFeatures.lowMid || 0.0) * boost;
        velMat.uniforms.mid.value = (audioFeatures.mid || 0.0) * boost;
        velMat.uniforms.highMid.value = (audioFeatures.highMid || 0.0) * boost;
        velMat.uniforms.treble.value = (audioFeatures.treble || 0.0) * boost;
        velMat.uniforms.sparkle.value = (audioFeatures.sparkle || 0.0) * boost;
        velMat.uniforms.audioForce.value = gpuAudioForce || 0.0;

        velMat.uniforms.curlStrength.value = curlParams.curlStrength;
        velMat.uniforms.noiseScale.value = curlParams.noiseScale;
        velMat.uniforms.noiseSpeed.value = curlParams.noiseSpeed;

        (this.scene.children[0] as THREE.Mesh).material = this.velMaterial!;
        this.renderer.setRenderTarget(writeVel);
        this.renderer.render(this.scene, this.camera);

        const posMat = this.posMaterial as any;
        posMat.uniforms.dt.value = deltaTime;
        posMat.uniforms.prevPos.value = readPos.texture;
        posMat.uniforms.velTex.value = writeVel.texture;
        (this.scene.children[1] as THREE.Mesh).material = this.posMaterial!;
        this.renderer.setRenderTarget(writePos);
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(null);
        this.swap = !this.swap;
    }

    public getPositionTexture(): THREE.Texture {
        return this.positionTargets[this.swap ? 1 : 0].texture;
    }

    public dispose() {
        this.positionTargets.forEach(rt => rt.dispose());
        this.velocityTargets.forEach(rt => rt.dispose());
        if (this.velMaterial) this.velMaterial.dispose();
        if (this.posMaterial) this.posMaterial.dispose();
    }
}