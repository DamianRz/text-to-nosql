#!/usr/bin/env bash
set -euo pipefail

MODEL="${1:-llama3.1:8b}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_PATH="$REPO_ROOT/.env"
ENV_EXAMPLE_PATH="$REPO_ROOT/.env.example"

update_env_value() {
  local file_path="$1"
  local key="$2"
  local value="$3"

  if grep -q "^${key}=" "$file_path"; then
    sed -i.bak "s#^${key}=.*#${key}=${value}#g" "$file_path"
    rm -f "${file_path}.bak"
  else
    printf "\n%s=%s\n" "$key" "$value" >> "$file_path"
  fi
}

echo "==> Preparing local environment"
echo "==> Repository: $REPO_ROOT"
echo "==> Model: $MODEL"

if [[ ! -f "$ENV_PATH" ]]; then
  cp "$ENV_EXAMPLE_PATH" "$ENV_PATH"
fi

update_env_value "$ENV_PATH" "LLM_MODEL" "$MODEL"
update_env_value "$ENV_PATH" "LLM_ENABLED" "true"

cd "$REPO_ROOT"
npm install
ollama pull "$MODEL"

echo ""
echo "Local setup completed."
echo "Next step:"
echo "./scripts/run-local.sh $MODEL"
