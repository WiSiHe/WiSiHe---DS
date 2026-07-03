#!/usr/bin/env bash
set -euo pipefail

# Doppler prd often has NEXT_PUBLIC_* but not SANITY_STUDIO_* — map for build + CLI.
export SANITY_STUDIO_PROJECT_ID="${SANITY_STUDIO_PROJECT_ID:-${NEXT_PUBLIC_SANITY_PROJECT_ID:-}}"
export SANITY_STUDIO_DATASET="${SANITY_STUDIO_DATASET:-${NEXT_PUBLIC_SANITY_DATASET:-production}}"

if [[ -z "${SANITY_STUDIO_PROJECT_ID}" ]]; then
  echo "Missing Sanity project ID. Add SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID to Doppler." >&2
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "Warning: OPENAI_API_KEY is not set. Deploy may fail during Assist schema deployment." >&2
  echo "Add OPENAI_API_KEY to Doppler prd (same key as Studio dev) or run: doppler secrets set OPENAI_API_KEY --project portfolio --config prd" >&2
fi

exec pnpm exec sanity deploy -y "$@"
