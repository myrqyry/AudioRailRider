/**
 * Environment configuration for the frontend application
 * Provides environment detection and validation for configuration values
 */

export type Environment = 'development' | 'production' | 'test';

/**
 * Configuration interface for environment variables
 */
export interface EnvironmentConfig {
  /** Current environment */
  NODE_ENV: Environment;
  /** Backend API URL */
  VITE_BACKEND_URL: string;
  /** Frontend development server port */
  VITE_DEV_PORT: string;
  /** Production frontend URL */
  VITE_PROD_URL: string;
  /** Enable debug logging */
  VITE_DEBUG: string;
}

/**
 * Validates that a required environment variable is present
 */
function validateRequiredEnvVar(name: keyof EnvironmentConfig, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Please check your .env file.`);
  }
  return value;
}

/**
 * Validates and parses boolean environment variables
 */
function validateBooleanEnvVar(name: keyof EnvironmentConfig, value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

// Safe environment accessor: prefer Vite's import.meta.env in browser builds,
// but fall back to Node's process.env when available (e.g., during SSR/test).
function safeEnv(name: string): string | undefined {
  // Avoid using `import.meta` here so the file can be parsed by Node/Jest
  // (which do not understand the import.meta syntax). Prefer process.env
  // (available in Node and can be polyfilled in browsers at startup),
  // then fall back to a runtime-injected global object set by the app entry.
  try {
    if (typeof process !== 'undefined' && (process as any).env) {
      const v = (process as any).env[name];
      if (typeof v !== 'undefined' && v !== null && v !== '') return String(v);
    }
  } catch (e) {
    // ignore
  }

  try {
    const runtimeEnv = (globalThis as any).__import_meta_env__;
    if (runtimeEnv && typeof runtimeEnv[name] !== 'undefined' && runtimeEnv[name] !== null && runtimeEnv[name] !== '') {
      return String(runtimeEnv[name]);
    }
  } catch (e) {
    // ignore
  }

  return undefined;
}

/**
 * Environment-specific configurations
 */
const ENVIRONMENTS = {
  development: {
    NODE_ENV: 'development' as const,
    VITE_BACKEND_URL: 'http://localhost:8000',
    VITE_DEV_PORT: '5173',
    VITE_PROD_URL: 'http://localhost:5173',
    VITE_DEBUG: 'true',
  },
  production: {
    NODE_ENV: 'production' as const,
    VITE_BACKEND_URL: safeEnv('VITE_BACKEND_URL') || 'https://your-production-backend.com',
    VITE_DEV_PORT: '5173',
    VITE_PROD_URL: safeEnv('VITE_PROD_URL') || 'https://your-production-frontend.com',
    VITE_DEBUG: 'false',
  },
  test: {
    NODE_ENV: 'test' as const,
    VITE_BACKEND_URL: 'http://localhost:8000',
    VITE_DEV_PORT: '5173',
    VITE_PROD_URL: 'http://localhost:5173',
    VITE_DEBUG: 'false',
  },
} as const;

/**
 * Detects the current environment from NODE_ENV or Vite's mode
 */
function detectEnvironment(): Environment {
  // Vite exposes mode via import.meta.env.MODE at build time; however we avoid
  // referencing import.meta here so tests and Node can parse this file. The
  // recommended approach is to set NODE_ENV or provide a runtime `__import_meta_env__`
  // object (populated by the app entry) when running in the browser.
  const detected = (safeEnv('NODE_ENV') as Environment) || (safeEnv('MODE') as Environment) || 'development';
  const env = detected;

  if (env && ['development', 'production', 'test'].includes(env)) {
    return env as Environment;
  }

  console.warn(`Unknown environment "${env}", defaulting to development`);
  return 'development';
}

/**
 * Gets the current environment configuration
 */
function getEnvironmentConfig(): EnvironmentConfig {
  const currentEnv = detectEnvironment();

  // Start with environment-specific defaults
  const baseConfig = ENVIRONMENTS[currentEnv];

  // Override with actual environment variables if they exist
  const config: EnvironmentConfig = {
    NODE_ENV: currentEnv,
    VITE_BACKEND_URL: validateRequiredEnvVar('VITE_BACKEND_URL', safeEnv('VITE_BACKEND_URL') || baseConfig.VITE_BACKEND_URL),
    VITE_DEV_PORT: safeEnv('VITE_DEV_PORT') || baseConfig.VITE_DEV_PORT,
    VITE_PROD_URL: safeEnv('VITE_PROD_URL') || baseConfig.VITE_PROD_URL,
    VITE_DEBUG: safeEnv('VITE_DEBUG') || baseConfig.VITE_DEBUG,
  };

  return config;
}

/**
 * Current environment configuration
 */
export const env = getEnvironmentConfig();

/**
 * Utility functions for environment checks
 */
export const isDevelopment = (): boolean => env.NODE_ENV === 'development';
export const isProduction = (): boolean => env.NODE_ENV === 'production';
export const isTest = (): boolean => env.NODE_ENV === 'test';
export const isDebugEnabled = (): boolean => validateBooleanEnvVar('VITE_DEBUG', env.VITE_DEBUG, false);

/**
 * Logs configuration in development mode for debugging
 */
if (isDevelopment() && isDebugEnabled()) {
  console.log('[Environment Config]', {
    environment: env.NODE_ENV,
    backendUrl: env.VITE_BACKEND_URL,
    devPort: env.VITE_DEV_PORT,
    prodUrl: env.VITE_PROD_URL,
    debug: env.VITE_DEBUG,
  });
}