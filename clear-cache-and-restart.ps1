# Clear Next.js cache and restart dev server

Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host ".next folder deleted" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "node_modules/.cache deleted" -ForegroundColor Green
}

Write-Host "`nCache cleared successfully!" -ForegroundColor Green
Write-Host "`nTo restart the dev server, run:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor White
