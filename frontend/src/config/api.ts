import { env } from './environment';

/**
 * API-related configuration for the frontend application
 * Provides centralized API settings, endpoints, and utilities
 */

/**
 * API Configuration interface
 */
export interface ApiConfig {
  /** Base URL for the backend API */
  baseURL: string;
  /** API version */
  version: string;
  /** Request timeout in milliseconds */
  timeout: number;
  /** Retry configuration */
  retry: {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Delay between retries in milliseconds */
    delay: number;
    /** Backoff multiplier for retry delays */
    backoffMultiplier: number;
  };
  /** Rate limiting configuration */
  rateLimit: {
    /** Maximum requests per window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
  };
}

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  /** Generate ride blueprint from audio */
  GENERATE_BLUEPRINT: '/api/generate-blueprint',
  /** Generate skybox image */
  GENERATE_SKYBOX: '/api/generate-skybox',
  /** Health check endpoint */
  HEALTH: '/api/health',
  /** Audio analysis endpoint */
  ANALYZE_AUDIO: '/api/analyze-audio',
} as const;

/**
 * Default API configuration
 */
const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: env.VITE_BACKEND_URL,
  version: 'v1',
  timeout: 30000, // 30 seconds
  retry: {
    maxAttempts: 3,
    delay: 1000, // 1 second
    backoffMultiplier: 2,
  },
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
};

/**
 * Current API configuration (can be overridden in different environments)
 */
export const apiConfig: ApiConfig = {
  ...DEFAULT_API_CONFIG,
  // Environment-specific overrides can be added here
  ...(env.NODE_ENV === 'development' && {
    timeout: 60000, // Longer timeout for development
  }),
  ...(env.NODE_ENV === 'test' && {
    timeout: 5000, // Shorter timeout for tests
    retry: {
      maxAttempts: 1,
      delay: 100,
      backoffMultiplier: 1,
    },
  }),
};

/**
 * Builds a complete API URL from a path
 */
export function buildApiUrl(path: string): string {
  const baseUrl = apiConfig.baseURL.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = path.replace(/^\//, ''); // Remove leading slash
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Gets the full URL for a specific endpoint
 */
export function getEndpointUrl(endpoint: keyof typeof API_ENDPOINTS): string {
  return buildApiUrl(API_ENDPOINTS[endpoint]);
}

/**
 * API request configuration for fetch calls
 */
export const API_REQUEST_CONFIG: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

/**
 * Configuration for file upload requests
 */
export const FILE_UPLOAD_CONFIG: RequestInit = {
  credentials: 'include',
};

/**
 * Validates API configuration on startup
 */
export function validateApiConfig(): void {
  if (!apiConfig.baseURL) {
    throw new Error('API baseURL is required. Please check your environment configuration.');
  }

  if (apiConfig.timeout <= 0) {
    throw new Error('API timeout must be a positive number.');
  }

  if (apiConfig.retry.maxAttempts < 1) {
    throw new Error('API retry maxAttempts must be at least 1.');
  }

  // Log API configuration in development
  if (env.isDevelopment() && env.isDebugEnabled()) {
    console.log('[API Config]', {
      baseURL: apiConfig.baseURL,
      version: apiConfig.version,
      timeout: apiConfig.timeout,
      retry: apiConfig.retry,
      rateLimit: apiConfig.rateLimit,
      endpoints: API_ENDPOINTS,
    });
  }
}

/**
 * Creates a timeout promise for API requests
 */
export function createTimeoutPromise(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

/**
 * Retry utility for API calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = apiConfig.retry.maxAttempts,
  delay: number = apiConfig.retry.delay,
  backoffMultiplier: number = apiConfig.retry.backoffMultiplier
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        break;
      }

      const delayMs = delay * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError!;
}

/**
 * Validates API response
 */
export function validateApiResponse(response: Response): void {
  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    throw error;
  }
}

/**
 * Common API error messages
 */
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please check your credentials.',
  FORBIDDEN: 'Access forbidden. You do not have permission to perform this action.',
  NOT_FOUND: 'Requested resource not found.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  VALIDATION_ERROR: 'Invalid data provided. Please check your input.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
} as const;

/**
 * Gets appropriate error message based on status code
 */
export function getErrorMessage(status: number, defaultMessage?: string): string {
  switch (status) {
    case 400:
      return API_ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return API_ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return API_ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return API_ERROR_MESSAGES.NOT_FOUND;
    case 429:
      return API_ERROR_MESSAGES.RATE_LIMITED;
    case 500:
    case 502:
    case 503:
    case 504:
      return API_ERROR_MESSAGES.SERVER_ERROR;
    default:
      return defaultMessage || API_ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

// Validate configuration on module load
validateApiConfig();