param(
  [string]$Model = "llama3.1:8b"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

Push-Location $repoRoot
try {
  $env:LLM_MODEL = $Model
  npm.cmd run dev
} finally {
  Pop-Location
}
