/**
 * Resource Prefetch Service
 * Provides utilities for advanced resource loading strategies
 */

/**
 * Prefetch a resource using the browser's prefetch mechanism
 * This is lower priority than preload but still useful for non-critical resources
 */
/**
 * Hints the browser to prefetch a resource that might be needed for a future navigation.
 * This is a low-priority hint.
 * @param {string} url - The URL of the resource to prefetch.
 * @param {'script' | 'fetch' | 'style'} [type='fetch'] - The type of content being prefetched.
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
/**
 * Hints the browser to preload a resource that is needed for the current page.
 * This is a high-priority hint.
 * @param {string} url - The URL of the resource to preload.
 * @param {'script' | 'fetch' | 'style' | 'image'} [type='fetch'] - The type of content being preloaded.
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
/**
 * Hints the browser to establish an early connection to a domain, including DNS lookup,
 * TCP handshake, and TLS negotiation.
 * @param {string} url - The URL of the domain to connect to.
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
/**
 * Prefetches multiple resources in a batch.
 * @param {Array<{ url: string; type?: 'script' | 'fetch' | 'style' }>} resources - An array of resource objects to prefetch.
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
/**
 * A class for prefetching resources based on a priority queue.
 * Higher priority items are fetched first.
 */
export class PriorityPrefetcher {
  private queue: Array<{ url: string; priority: number; type: 'script' | 'fetch' | 'style' }> = [];
  private loading = false;

  /**
   * Adds a resource to the prefetch queue.
   * @param {string} url - The URL of the resource.
   * @param {number} [priority=0] - The priority of the resource (higher numbers are fetched first).
   * @param {'script' | 'fetch' | 'style'} [type='fetch'] - The type of resource.
   */
  add(url: string, priority: number = 0, type: 'script' | 'fetch' | 'style' = 'fetch'): void {
    this.queue.push({ url, priority, type });
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Starts processing the prefetch queue.
   * @returns {Promise<void>} A promise that resolves when the queue is empty.
   */
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

  /**
   * Clears the prefetch queue.
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Gets the current number of items in the queue.
   * @returns {number} The length of the queue.
   */
  getQueueLength(): number {
    return this.queue.length;
  }
}

/**
 * Image preloader with promise-based API
 */
/**
 * Preloads a single image.
 * @param {string} src - The source URL of the image.
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image element or rejects on error.
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
/**
 * Preloads multiple images in parallel.
 * @param {string[]} srcs - An array of image source URLs.
 * @returns {Promise<HTMLImageElement[]>} A promise that resolves with an array of the loaded image elements.
 */
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Check if a resource is already cached
 */
/**
 * Checks if a resource is already available in the browser's Cache Storage.
 * @param {string} url - The URL of the resource to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the resource is cached, `false` otherwise.
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
/**
 * A class that provides adaptive prefetching capabilities, enabling or disabling
 * prefetching based on the user's network conditions (e.g., 'save-data' mode).
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

  /**
   * Checks if prefetching is currently enabled based on network conditions.
   * @returns {boolean} `true` if prefetching is enabled, `false` otherwise.
   */
  shouldPrefetch(): boolean {
    return this.enabled;
  }

  /**
   * Fetches a resource only if adaptive prefetching is currently enabled.
   * @param {string} url - The URL of the resource to prefetch.
   * @returns {Promise<void>} A promise that resolves when the fetch is complete or if prefetching is disabled.
   */
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
/**
 * A class that prefetches resources during browser idle time using `requestIdleCallback`.
 */
export class IdlePrefetcher {
  private queue: string[] = [];
  private loading = false;

  /**
   * Adds a URL to the idle prefetch queue.
   * @param {string} url - The URL of the resource to prefetch.
   */
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

  /**
   * Clears the idle prefetch queue.
   */
  clear(): void {
    this.queue = [];
    this.loading = false;
  }
}

// Singleton instance for idle prefetching
export const idlePrefetcher = new IdlePrefetcher();
