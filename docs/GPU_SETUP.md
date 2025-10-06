# GPU Hardware Acceleration Setup

## Problem
By default, some Chromium builds (especially distro-packaged versions) may use software rendering (SwiftShader/ANGLE) instead of hardware GPU acceleration, resulting in poor performance for WebGL/3D applications like AudioRailRider's visual effects.

## Solution: Enable Hardware Decode in Chrome

### For Manual Browser Testing

1. Open Chrome/Chromium
2. Navigate to `chrome://settings`
3. Search for "hardware" or scroll to **System** section
4. Enable **"Use hardware acceleration when available"**
5. Enable **"Use hardware video decode"** (if available)
6. Restart Chrome

### Verification

Check `chrome://gpu` to confirm hardware acceleration is active:
- **Canvas**: Should show "Hardware accelerated"
- **WebGL**: Should show your GPU (e.g., "NVIDIA GeForce RTX 2070 SUPER")
- **WebGL2**: Should show your GPU
- **Video Decode**: Should list hardware decoder capabilities

If you see "SwiftShader" or "Software only" - hardware acceleration is NOT working.

## For Automated Testing (Playwright)

The Playwright config has been updated with GPU-friendly flags. For systems with hybrid graphics (NVIDIA + AMD/Intel):

### Environment Variables (Optional)

```bash
# Force NVIDIA GPU (hybrid graphics systems)
export __NV_PRIME_RENDER_OFFLOAD=1
export __GLX_VENDOR_LIBRARY_NAME=nvidia

# Run Playwright tests
pnpm test:e2e
```

### Playwright Configuration

The current `playwright.config.ts` includes:

- `--enable-gpu-rasterization`
- `--disable-gpu-blocklist`
- `--ignore-gpu-blocklist`
- `--use-gl=desktop` (fallback for packaged Chromium)

### Known Issues

#### Distro-Packaged Chromium with Bundled SwiftShader

Some Linux distro Chromium packages bundle SwiftShader and prefer it over system libraries, even with GPU flags. If Playwright tests show software rendering:

**Option 1: Use Firefox** (recommended for CI)
```typescript
// In playwright.config.ts
projects: [
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
]
```

**Option 2: Use Chrome Beta/Stable**
Set environment variable to prefer system Chrome:
```bash
export CHROME_BIN=/usr/bin/google-chrome-beta
```

**Option 3: Use Playwright's Downloaded Browsers**
```bash
npx playwright install chromium
# Playwright-managed Chromium often has better system GL integration
```

## Troubleshooting

### Check GPU Process Status
```bash
# While Chrome is running, check GPU process logs
# Look for "GPU process" and "GL implementation" messages
```

### Verify NVIDIA Driver
```bash
# Check driver is loaded
nvidia-smi

# Check GLX is using NVIDIA
glxinfo | grep -i "opengl renderer"
# Should show: OpenGL renderer string: NVIDIA ...

# Check Vulkan
vulkaninfo | grep -i "deviceName"
# Should show: NVIDIA device
```

### X11 Display Issues
If you see "xcb_connect() failed" or X11 authorization errors when running as different user (e.g., via sudo), ensure:
```bash
# Run as your regular user (not root)
# For Playwright, no sudo needed
pnpm test:e2e
```

## Performance Verification

When hardware acceleration is working properly:
- **VisualEffects FPS**: 50-60 FPS (check browser console)
- **chrome://gpu**: Shows hardware acceleration for Canvas, WebGL, WebGL2
- **Renderer Info** (in-app banner, if shown): Should NOT show "SwiftShader" or "Google" vendor

## References

- [Chromium GPU Flags](https://peter.sh/experiments/chromium-command-line-switches/#enable-gpu-rasterization)
- [NVIDIA PRIME on Linux](https://download.nvidia.com/XFree86/Linux-x86_64/latest/README/primerenderoffload.html)
- [Playwright Browser Context Options](https://playwright.dev/docs/api/class-testoptions)
