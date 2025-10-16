/**
 * Preloader module for AudioRailRider
 * Handles early loading of critical resources to reduce initialization time
 */

// Cache for preloaded resources
interface PreloadCache {
  shaders: Map<string, string>;
  lygiaResolver: any | null;
  webglContext: WebGLRenderingContext | WebGL2RenderingContext | null;
  audioContext: AudioContext | null;
}

const cache: PreloadCache = {
  shaders: new Map(),
  lygiaResolver: null,
  webglContext: null,
  audioContext: null,
};

// Track preload status
let preloadStarted = false;
let preloadCompleted = false;
const preloadPromises: Promise<any>[] = [];

/**
 * Preload shader files that will be needed for GPU particle system
 */
async function preloadShaders(): Promise<void> {
  const shaderFiles = [
    '/shaders/velFrag.resolved.glsl',
    '/shaders/posFrag.resolved.glsl',
    '/shaders/baseVelFrag.glsl',
    '/shaders/basePosFrag.glsl',
  ];

  const fetchPromises = shaderFiles.map(async (path) => {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const text = await response.text();
        cache.shaders.set(path, text);
        console.log(`[Preloader] Cached shader: ${path}`);
      }
    } catch (e) {
      // Silently fail - runtime will handle fallback
      console.debug(`[Preloader] Could not preload ${path}`, e);
    }
  });

  await Promise.allSettled(fetchPromises);
}

/**
 * Preload the LYGIA shader resolver module
 */
async function preloadLygiaResolver(): Promise<void> {
  try {
    // Try local version first
    try {
      const localUrl = window.location.origin + '/lygia/resolve.esm.js';
      // @ts-ignore: prevent bundlers from resolving this import at build-time
      const local = await import(/* @vite-ignore */ localUrl);
      cache.lygiaResolver = local && (local.default || local.resolveLygia || local.resolve) 
        ? (local.default || local.resolveLygia || local.resolve) 
        : null;
      if (cache.lygiaResolver) {
        console.log('[Preloader] Cached LYGIA resolver (local)');
        return;
      }
    } catch (e) {
      // Fall through to CDN
    }

    // Try CDN fallback
    const cdnUrl = 'https://lygia.xyz/resolve.esm.js';
    // @ts-ignore
    const mod = await import(/* @vite-ignore */ cdnUrl);
    cache.lygiaResolver = mod && (mod.default || mod.resolveLygia || mod.resolve)
      ? (mod.default || mod.resolveLygia || mod.resolve)
      : null;
    if (cache.lygiaResolver) {
      console.log('[Preloader] Cached LYGIA resolver (CDN)');
    }
  } catch (e) {
    console.debug('[Preloader] Could not preload LYGIA resolver', e);
  }
}

/**
 * Initialize WebGL context early to trigger driver initialization
 * This helps the browser start compiling shaders sooner
 */
function preloadWebGLContext(): void {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Try WebGL2 first (required for float render targets)
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    }) || canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (gl) {
      cache.webglContext = gl;
      
      // Trigger some basic GL operations to warm up the driver
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Check for float texture support (needed for GPU particles)
      if ((gl as WebGL2RenderingContext).getExtension) {
        (gl as WebGL2RenderingContext).getExtension('EXT_color_buffer_float');
        (gl as WebGL2RenderingContext).getExtension('OES_texture_float_linear');
      }
      
      console.log('[Preloader] WebGL context initialized');
    }
  } catch (e) {
    console.debug('[Preloader] Could not preload WebGL context', e);
  }
}

/**
 * Initialize AudioContext early to bypass browser autoplay restrictions
 * Note: AudioContext will still need user interaction to resume
 */
function preloadAudioContext(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      cache.audioContext = new AudioContextClass();
      // Suspend immediately to save resources
      cache.audioContext.suspend();
      console.log('[Preloader] AudioContext initialized (suspended)');
    }
  } catch (e) {
    console.debug('[Preloader] Could not preload AudioContext', e);
  }
}

/**
 * Start preloading all resources
 * This should be called as early as possible in the app lifecycle
 */
/**
 * Initiates the preloading of all critical resources.
 * This function should be called as early as possible in the application's lifecycle.
 * It is safe to call this function multiple times; it will only run once.
 */
export function startPreload(): void {
  if (preloadStarted) return;
  preloadStarted = true;

  console.log('[Preloader] Starting resource preload...');

  // Start all preload operations in parallel
  preloadPromises.push(
    preloadShaders(),
    preloadLygiaResolver(),
  );

  // Synchronous preloads
  preloadWebGLContext();
  preloadAudioContext();

  // Mark as complete when all async operations finish
  Promise.allSettled(preloadPromises).then(() => {
    preloadCompleted = true;
    console.log('[Preloader] All preload operations completed');
  });
}

/**
 * Wait for preload to complete (useful for components that need preloaded resources)
 */
/**
 * Returns a promise that resolves when all asynchronous preload operations have completed.
 * This is useful for components or modules that depend on preloaded resources.
 * @returns {Promise<void>} A promise that resolves when preloading is finished.
 */
export async function waitForPreload(): Promise<void> {
  if (preloadCompleted) return;
  await Promise.allSettled(preloadPromises);
  preloadCompleted = true;
}

/**
 * Get cached shader source
 */
/**
 * Retrieves a preloaded shader source from the cache.
 * @param {string} path - The path of the shader file.
 * @returns {string | null} The shader source code, or `null` if not found in the cache.
 */
export function getCachedShader(path: string): string | null {
  return cache.shaders.get(path) || null;
}

/**
 * Get cached LYGIA resolver
 */
/**
 * Retrieves the preloaded LYGIA shader resolver function from the cache.
 * @returns {any | null} The resolver function, or `null` if not preloaded.
 */
export function getCachedLygiaResolver(): any | null {
  return cache.lygiaResolver;
}

/**
 * Get the preloaded AudioContext (may be suspended)
 */
/**
 * Retrieves the pre-initialized `AudioContext` from the cache.
 * Note: The context may be in a 'suspended' state and require user interaction to resume.
 * @returns {AudioContext | null} The cached `AudioContext`, or `null` if not preloaded.
 */
export function getCachedAudioContext(): AudioContext | null {
  return cache.audioContext;
}

/**
 * Check if preload has been started
 */
/**
 * Checks if the preloading process has been initiated.
 * @returns {boolean} `true` if `startPreload` has been called, `false` otherwise.
 */
export function isPreloadStarted(): boolean {
  return preloadStarted;
}

/**
 * Check if preload has completed
 */
/**
 * Checks if all preload operations have finished.
 * @returns {boolean} `true` if all asynchronous preloading has completed, `false` otherwise.
 */
export function isPreloadCompleted(): boolean {
  return preloadCompleted;
}
