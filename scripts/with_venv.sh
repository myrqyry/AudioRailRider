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

if [ "$#" -eq 0 ]; then
  exec bash
else
  exec "$@"
fi
