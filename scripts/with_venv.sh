#!/usr/bin/env bash
set -euo pipefail
# Helper: source the repository root .venv then run the given command
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$REPO_ROOT/.venv"
if [ ! -f "$VENV/bin/activate" ]; then
  echo "Error: .venv not found at $VENV" >&2
  exit 1
fi
# shellcheck source=/dev/null
source "$VENV/bin/activate"

# Auto-load backend/.env if it exists
ENV_FILE="$REPO_ROOT/backend/.env"
if [ -f "$ENV_FILE" ]; then
  set -a  # auto-export all variables
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
fi

if [ "$#" -eq 0 ]; then
  exec bash
else
  exec "$@"
fi
