/**
 * Resource Prefetch Service
 * Provides utilities for advanced resource loading strategies
 */

/**
 * Prefetch a resource using the browser's prefetch mechanism
 * This is lower priority than preload but still useful for non-critical resources
 */
export function prefetchResource(url: string, type: 'script' | 'fetch' | 'style' = 'fetch'): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = type;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Preload a resource with high priority
 */
export function preloadResource(url: string, type: 'script' | 'fetch' | 'style' | 'image' = 'fetch'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Establish early connection to a domain
 */
export function preconnectDomain(url: string): void {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Batch prefetch multiple resources
 */
export function batchPrefetch(resources: Array<{ url: string; type?: 'script' | 'fetch' | 'style' }>): void {
  resources.forEach(({ url, type = 'fetch' }) => {
    prefetchResource(url, type);
  });
}

/**
 * Prefetch resources with priority queue
 * Higher priority resources are fetched first
 */
export class PriorityPrefetcher {
  private queue: Array<{ url: string; priority: number; type: 'script' | 'fetch' | 'style' }> = [];
  private loading = false;

  add(url: string, priority: number = 0, type: 'script' | 'fetch' | 'style' = 'fetch'): void {
    this.queue.push({ url, priority, type });
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async start(): Promise<void> {
    if (this.loading || this.queue.length === 0) return;
    this.loading = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      try {
        // Use fetch for actual loading (more control than link prefetch)
        await fetch(item.url, { mode: 'cors' });
        console.debug(`[PriorityPrefetcher] Loaded: ${item.url}`);
      } catch (e) {
        console.debug(`[PriorityPrefetcher] Failed to load: ${item.url}`, e);
      }

      // Small delay between fetches to avoid overwhelming network
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.loading = false;
  }

  clear(): void {
    this.queue = [];
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

/**
 * Image preloader with promise-based API
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images in parallel
 */
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Check if a resource is already cached
 */
export async function isResourceCached(url: string): Promise<boolean> {
  if (!('caches' in window)) return false;

  try {
    const cache = await caches.open('resource-cache');
    const response = await cache.match(url);
    return !!response;
  } catch (e) {
    return false;
  }
}

/**
 * Adaptive prefetching based on network conditions
 */
export class AdaptivePrefetcher {
  private enabled: boolean = true;

  constructor() {
    this.checkNetworkConditions();
  }

  private checkNetworkConditions(): void {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      // Disable prefetching on slow connections or when save-data is enabled
      if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.enabled = false;
        console.log('[AdaptivePrefetcher] Prefetching disabled due to network conditions');
      }

      // Listen for network changes
      connection.addEventListener('change', () => {
        this.checkNetworkConditions();
      });
    }
  }

  shouldPrefetch(): boolean {
    return this.enabled;
  }

  async prefetchIfEnabled(url: string): Promise<void> {
    if (!this.enabled) return;
    
    try {
      await fetch(url, { mode: 'cors' });
    } catch (e) {
      // Silently fail
    }
  }
}

// Singleton instance for adaptive prefetching
export const adaptivePrefetcher = new AdaptivePrefetcher();

/**
 * Idle time prefetcher - loads resources during browser idle time
 */
export class IdlePrefetcher {
  private queue: string[] = [];
  private loading = false;

  add(url: string): void {
    if (!this.queue.includes(url)) {
      this.queue.push(url);
      this.scheduleLoad();
    }
  }

  private scheduleLoad(): void {
    if (this.loading || this.queue.length === 0) return;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.loadNext(), { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => this.loadNext(), 1000);
    }
  }

  private async loadNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.loading = false;
      return;
    }

    this.loading = true;
    const url = this.queue.shift();
    
    if (url && adaptivePrefetcher.shouldPrefetch()) {
      try {
        await fetch(url, { mode: 'cors' });
        console.debug(`[IdlePrefetcher] Loaded during idle: ${url}`);
      } catch (e) {
        console.debug(`[IdlePrefetcher] Failed to load: ${url}`, e);
      }
    }

    this.loading = false;
    this.scheduleLoad();
  }

  clear(): void {
    this.queue = [];
    this.loading = false;
  }
}

// Singleton instance for idle prefetching
export const idlePrefetcher = new IdlePrefetcher();
