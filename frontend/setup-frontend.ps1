<#
Usage: PowerShell
  cd D:\Giao_trinh_dai_hoc\he_thong_nhung\SmartDrip\frontend
  powershell -ExecutionPolicy Bypass -File .\setup-frontend.ps1

Checks Node version (requires 18.x for Expo SDK 52), optionally removes node_modules and reinstalls.
#>

Write-Host "[Setup] Checking Node version..." -ForegroundColor Cyan
try {
  $nodeVersion = node -v
} catch {
  Write-Warning "Node is not installed. Install Node 18 LTS from https://nodejs.org/en/download and re-run this script."; exit 1
}

Write-Host "[Setup] Detected Node $nodeVersion"
if (-not ($nodeVersion -match '^v18\.')) {
  Write-Warning "Expo SDK 52 khuyến nghị Node 18.x. Hiện tại: $nodeVersion"
  Write-Host "Tùy chọn hạ phiên bản:" -ForegroundColor Yellow
  Write-Host "1) Cài nvm-windows: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor Yellow
  Write-Host "2) Cài Volta: https://volta.sh rồi chạy 'volta install node@18'" -ForegroundColor Yellow
  Write-Host "3) Tải installer Node 18 LTS: https://nodejs.org/en" -ForegroundColor Yellow
  $confirm = Read-Host "Tiếp tục cài đặt dependencies với phiên bản hiện tại? (y/n)"
  if ($confirm -ne 'y') { exit 2 }
}

Write-Host "[Setup] Cleaning old node_modules & lock file..." -ForegroundColor Cyan
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

Write-Host "[Setup] Running npm install..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed"; exit 3 }

Write-Host "[Setup] Installing Expo SDK compatible image-picker (if not already)..." -ForegroundColor Cyan
npx expo install expo-image-picker

if (-not (Test-Path .env)) {
  "EXPO_PUBLIC_BACKEND_URL=http://localhost:8080" | Out-File -Encoding utf8 .env
  Write-Host "[Setup] Created .env with EXPO_PUBLIC_BACKEND_URL=http://localhost:8080" -ForegroundColor Green
}

Write-Host "[Setup] Clear metro cache & start (manual step). Run:\n    npx expo start --clear" -ForegroundColor Cyan
Write-Host "[Setup] Done." -ForegroundColor Green
