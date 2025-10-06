# Developer Quickstart

This repository contains the AudioRailRider web app (frontend + backend). Below are the key developer workflows related to shaders, LYGIA, and building the frontend with pre-resolved shaders.

## Prerequisites
- Node 18+ (recommended)
- pnpm (project uses pnpm workspace)
- Python3 (optional, used for `prune.py` during LYGIA fetch)

## Fetch a local pruned copy of LYGIA
We keep an optional local copy of LYGIA for resolving shader `#include` helpers at build time.

Run:

```bash
chmod +x ./scripts/fetch-lygia.sh
./scripts/fetch-lygia.sh
```

This clones a shallow copy into `frontend/public/lygia` and runs `prune.py` if present.

## Pre-resolve shaders (prebuild)
The project includes a `scripts/resolve-shaders.js` script that resolves LYGIA `#include` directives into inline GLSL fragments. The frontend `package.json` includes a `prebuild` script that runs this resolver.

To pre-resolve shaders locally:

```bash
pnpm --filter ./frontend run prebuild
```

This will write resolved GLSL files to:

- `frontend/src/lib/shaders/velFrag.resolved.glsl`
- `frontend/src/lib/shaders/posFrag.resolved.glsl`

and copy them (plus the base fragments) into `frontend/public/shaders/` so they can be fetched at runtime if needed.

## Build (production)
When you run the frontend build, the prebuild step runs automatically (see `frontend/package.json`).

```bash
pnpm --filter ./frontend build
```

CI is configured to run the LYGIA fetch and `prebuild` automatically.

## Dev mode & DevPanel
Start the frontend in dev mode:

```bash
pnpm --filter ./frontend dev
```

When running in development with `VITE_DEBUG=true`, the floating Dev Panel appears in the top-right. Use `Ctrl+Shift+D` to toggle it and `Esc` to hide. DevPanel sliders persist to localStorage.

## Troubleshooting
- If `prebuild` doesn't produce resolved shaders, the resolver likely failed or LYGIA wasn't available locally. Check `frontend/public/lygia` and rerun `./scripts/fetch-lygia.sh`.
- If shaders still fail at runtime (compilation errors), enable the shader compile smoke test in CI (we've left a placeholder).

## Notes
- For rapid iteration you can skip `prebuild` and rely on the runtime resolver; however baked shaders are preferred for production for stability and performance.

If you want, I can extend this file with CI examples (GitHub Actions) and the exact expected file layout.
