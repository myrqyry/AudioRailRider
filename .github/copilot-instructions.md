# AudioRailRider Copilot Guide

## Architecture & Data Flow
- Monorepo uses pnpm workspace (`package.json`, `pnpm-workspace.yaml`) plus a FastAPI backend (`backend/`) and React/Three.js frontend (`frontend/`).
- Core loop: `frontend/src/lib/workflow.ts` uploads the chosen audio file via `generateRideBlueprintFromBackend` → `backend/app/api/endpoints.py` → `GeminiService.generate_blueprint` (server-side analysis + Gemini call) → returns `{ blueprint, features }` that feed `trackValidator`, `trackBuilder`, and `ThreeCanvas`.
- Shared contracts live in `shared/` (`types.ts`, `constants.ts`); always extend/consume these instead of redefining shapes in frontend or backend modules.

## Backend Practices
- Configuration comes from `backend/app/config/settings.py`; expect `GEMINI_API_KEY` via `.env` or environment. Use `scripts/with_venv.sh` to enter the repo-managed `.venv` before running Python tools.
- `GeminiService` must continue to lazy-import heavy deps, guard against missing SDKs, and provide the `_procedural_fallback` path. Tests monkeypatch `analyze_audio`, so keep that helper top-level and simple to replace.
- API endpoints belong in `backend/app/api/endpoints.py` and should apply rate limiting via `@limiter.limit` and reuse shared models under `backend/app/models` / `schema`. CORS origins are fixed in `main.py`; update both `localhost` and `127.0.0.1` entries when adding ports.

## Frontend Practices
- State is centralized in `frontend/src/lib/store.ts` (Zustand). Mutations should go through `store.actions` so logging and status transitions stay consistent.
- Long-running flows extend `runAudioProcessingWorkflow`—wire new steps into its status/progress updates and honor the AbortController cleanup pattern.
- Rendering relies on precomputed `TrackData` from `trackBuilder.ts`; keep geometry edits compatible with the `segmentDetails` and `frameAnalyses` metadata consumed by `RideCamera`, `VisualEffects`, and the regl overlay.
- Audio playback & live metrics run through `useAudioAnalysis` and worklet events named `audiorailrider:*`; emit matching CustomEvents if you introduce new streams so `VisualEffects` stays in sync.

## Shader & GPU Tooling
- GLSL lives under `frontend/src/lib/shaders/`; resolved variants must be regenerated with `pnpm --filter ./frontend run prebuild` (calls `scripts/resolve-shaders.js`). That script assumes `frontend/public/lygia` exists—fetch or refresh it via `./scripts/fetch-lygia.sh` before builds.
- GPU features load through `startPreload()` (`preloader.ts`). New GPU assets should respect the cache helpers (`getCachedShader`, `getCachedLygiaResolver`) to avoid blocking the ride start.
- CI expects resolved shaders copied into `frontend/public/shaders/` and validated by `scripts/check-shaders.js`; ensure any shader additions provide a `void main()` and pass brace checks.

## Testing & Operations
- Frontend: `pnpm --filter ./frontend test` (Jest) and `pnpm --filter ./frontend run pw:test` for GPU-sensitive Playwright specs (see `docs/GPU_SETUP.md` for required flags).
- Backend: activate `.venv` then `./scripts/run_backend_tests.sh` (pytest). Use `backend/scripts/check_genai_signature.py` to probe Gemini SDK upload signatures when upgrading the client.
- Full-stack dev server: `pnpm dev` runs Vite and `uvicorn` concurrently. If the frontend cannot reach the backend, check `frontend/src/config/environment.ts` to confirm `VITE_BACKEND_URL` resolution.

## Diagnostics
- Key log prefixes (`[Workflow]`, `[Store]`, `[useAudioAnalysis]`, `[ThreeCanvas]`, `[VisualEffects]`, `[Preloader]`, `[GeminiService]`) document the ride lifecycle—maintain or extend them for new features to keep troubleshooting docs accurate (`docs/TROUBLESHOOTING.md`, `docs/RIDE_START_FIX.md`).
- When modifying ride start behavior, verify the Ready→Riding transition sequence and ensure overlays obey the `status` gates in `App.tsx`.
