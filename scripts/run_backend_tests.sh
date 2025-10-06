#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
"$REPO_ROOT/scripts/with_venv.sh" python3 -m pytest -q backend/tests/test_gemini_service.py
