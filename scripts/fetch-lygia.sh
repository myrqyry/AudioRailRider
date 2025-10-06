#!/usr/bin/env bash
set -euo pipefail

# Fetch a shallow copy of LYGIA into frontend/public/lygia
# Usage: ./scripts/fetch-lygia.sh

DEST=frontend/public/lygia
mkdir -p "$DEST"

echo "Cloning LYGIA into $DEST (no history)..."
npx degit patriciogonzalezvivo/lygia "$DEST"

# Optionally prune to keep only GLSL sources if prune.py exists
if command -v python3 >/dev/null 2>&1; then
  if [ -f "$DEST/prune.py" ]; then
    echo "Pruning LYGIA to GLSL files..."
    python3 "$DEST/prune.py" --all --keep glsl || true
  else
    echo "prune.py not found in LYGIA; skipping prune step"
  fi
else
  echo "python3 not available; skipping prune step"
fi

echo "LYGIA copied to $DEST"
