#!/usr/bin/env bash
set -euo pipefail

MODEL="${1:-llama3.1:8b}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"
LLM_MODEL="$MODEL" npm run dev
