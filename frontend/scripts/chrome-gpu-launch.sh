#!/usr/bin/env bash
# Wrapper to launch system Chromium with PRIME offload and GPU flags for testing
set -euo pipefail

# Allow overriding binary via CHROMIUM_BIN env
CHROMIUM_BIN=${CHROMIUM_BIN:-/usr/bin/chromium}

# Flags we want for forcing desktop GL and ignoring blocklists
FLAGS=(--use-gl=desktop --disable-gpu-blocklist --ignore-gpu-blocklist)

export __NV_PRIME_RENDER_OFFLOAD=1
export __GLX_VENDOR_LIBRARY_NAME=nvidia

"${CHROMIUM_BIN}" "${FLAGS[@]}" "$@"
