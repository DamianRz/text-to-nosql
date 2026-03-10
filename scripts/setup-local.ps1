param(
  [string]$Model = "llama3.1:8b"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $repoRoot ".env"
$envExamplePath = Join-Path $repoRoot ".env.example"

function Update-EnvValue {
  param(
    [string]$Path,
    [string]$Key,
    [string]$Value
  )

  $content = Get-Content $Path -Raw
  if ($content -match "(?m)^$Key=") {
    $escapedValue = [Regex]::Escape($Value).Replace("\\", "\")
    $content = [Regex]::Replace($content, "(?m)^$Key=.*$", "$Key=$escapedValue")
  } else {
    $content = $content.TrimEnd() + "`r`n$Key=$Value`r`n"
  }

  Set-Content -Path $Path -Value $content
}

Write-Host "==> Preparing local environment"
Write-Host "==> Repository: $repoRoot"
Write-Host "==> Model: $Model"

if (-not (Test-Path $envPath)) {
  Copy-Item $envExamplePath $envPath
}

Update-EnvValue -Path $envPath -Key "LLM_MODEL" -Value $Model
Update-EnvValue -Path $envPath -Key "LLM_ENABLED" -Value "true"

Push-Location $repoRoot
try {
  npm.cmd install
  ollama pull $Model
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "Local setup completed."
Write-Host "Next step:"
Write-Host "powershell -ExecutionPolicy Bypass -File scripts/run-local.ps1 -Model $Model"
