import { defineConfig, devices } from '@playwright/test';

// Prefer a system-installed chromium binary if the environment sets it.
// If CHROME_BETA_BIN is present prefer Chrome Beta which on some setups
// uses the system GLX provider instead of the distro chromium bundle.
const chromiumPath = process.env.CHROMIUM_BIN || process.env.CHROME_BETA_BIN || '/usr/bin/chromium';

// GPU-friendly args. When NVIDIA Vulkan ICD / GL provider is available
// Chromium will be able to use the dGPU when launched with these flags
// together with PRIME env vars. If your system doesn't have NVIDIA set up
// these flags are safely ignored and Chromium will fall back.
// GPU-friendly args. Keep both ANGLE/Vulkan and desktop GL options so
// Playwright can fall back to desktop GL if the bundled ANGLE implementation
// is restricted by the distro package.
const gpuArgs = [
  '--use-gl=egl',
  '--use-angle=vulkan',
  '--use-gl=desktop', // fallback to desktop GL if necessary
  '--enable-gpu-rasterization',
  '--disable-gpu-blocklist',
  '--ignore-gpu-blocklist',
];

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 180000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  // Ensure the frontend dev server is running before tests execute.
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    timeout: 120000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // launchOptions accepted by Playwright for browser launch flags
        launchOptions: ((): { executablePath: string; args: string[]; env: { [k: string]: string | number | boolean } } => {
          // Create a clean env map with no `undefined` values because
          // Playwright's types require string|number|boolean values only.
          const envMap: { [k: string]: string | number | boolean } = {};
          for (const [k, v] of Object.entries(process.env)) {
            if (v !== undefined) envMap[k] = v;
          }
          envMap.__NV_PRIME_RENDER_OFFLOAD = '1';
          envMap.__GLX_VENDOR_LIBRARY_NAME = 'nvidia';

          return {
            executablePath: chromiumPath,
            args: gpuArgs,
            env: envMap,
          };
        })(),
      },
    },
    // Provide a dedicated Chrome Beta project (if available) which often
    // uses the system GLX provider instead of the distro chromium bundle.
    {
      name: 'chrome-beta',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: process.env.CHROME_BETA_BIN || '/usr/bin/google-chrome-beta',
          args: gpuArgs,
          env: ((): { [k: string]: string | number | boolean } => {
            const envMap: { [k: string]: string | number | boolean } = {};
            for (const [k, v] of Object.entries(process.env)) {
              if (v !== undefined) envMap[k] = v;
            }
            envMap.__NV_PRIME_RENDER_OFFLOAD = '1';
            envMap.__GLX_VENDOR_LIBRARY_NAME = 'nvidia';
            return envMap;
          })(),
        },
      },
    },
      // Firefox project — Firefox typically uses the system GL/EGL provider
      // (Mesa/NVIDIA) and is a reliable fallback when Chromium builds are
      // bundled with ANGLE-only libs.
      {
        name: 'firefox',
        use: {
          ...devices['Desktop Firefox'],
          // Prefer system Firefox so the test uses the system GL/EGL
          // provider (NVIDIA) instead of the Playwright-downloaded binary
          // which may be bundled with SwiftShader. Users may override via
          // FIREFOX_BIN if needed.
          launchOptions: ((): { executablePath: string; args?: string[]; env: { [k: string]: string | number | boolean } } => {
            const envMap: { [k: string]: string | number | boolean } = {};
            for (const [k, v] of Object.entries(process.env)) {
              if (v !== undefined) envMap[k] = v;
            }
            envMap.__NV_PRIME_RENDER_OFFLOAD = '1';
            envMap.__GLX_VENDOR_LIBRARY_NAME = 'nvidia';

            return {
              executablePath: process.env.FIREFOX_BIN || '/usr/bin/firefox',
              env: envMap,
            };
          })(),
        },
      },
  ],
});
