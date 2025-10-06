# AudioRailRider Backend

This is the backend for the AudioRailRider project, built with FastAPI and Poetry.

## Setup

1. Install dependencies:
   ```
   poetry install
   ```

2. Run the server:
   ```
   poetry run python main.py
   ```
   Or:
   ```
   poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API

- `GET /`: Health check endpoint.

## Gemini SDK notes

We use `google-genai` (pinned in `pyproject.toml`). Useful scripts:

```bash
# Probe SDK upload/generate signatures
python3 backend/scripts/check_genai_signature.py
```

To test the full generate workflow, POST a multipart request with `audio_file` to `/api/generate-blueprint` while the server is running.

## Use project .venv and run tests

This repo contains a `.venv` at the repository root. Use the helper to run commands inside it:

```bash
# start an interactive shell inside .venv
./scripts/with_venv.sh

# run backend tests (install dev deps first)
./scripts/run_backend_tests.sh
```

Install dev dependencies into the project's .venv with Poetry (from repo root):

```bash
poetry install --with dev
```

## Setting your Gemini API key (securely)

1. Copy the example file and add your real API key locally (do not commit):

```bash
cp backend/.env.example backend/.env
# then edit backend/.env and replace <YOUR_GEMINI_API_KEY_HERE> with your key
```

2. Or export it in your shell for a single session:

```bash
export GEMINI_API_KEY="<YOUR_GEMINI_API_KEY>"
# start the server or run tests in the same shell session
.venv/bin/python3 -m pytest -q backend/tests/test_gemini_service.py
```

3. For CI (GitHub Actions): add a repository secret named `GEMINI_API_KEY` and reference it in your workflow; do not place the raw key in source code or issue threads.

Security note: Never paste API keys into chat logs or commit them to the repository. If you mistakenly shared a key in an insecure channel, rotate it immediately.

