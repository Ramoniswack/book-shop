# PowerShell script to clean Next.js cache on Windows
Write-Host "Cleaning Next.js cache..." -ForegroundColor Green

# Remove .next directory
if (Test-Path ".next") {
    Write-Host "Removing .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
    Write-Host ".next directory removed" -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Remove node_modules cache if exists
if (Test-Path "node_modules\.cache") {
    Write-Host "Removing node_modules cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.cache"
}

# Remove any temp files
$tempFiles = @("*.tmp", "*.temp", ".DS_Store", "Thumbs.db")
foreach ($pattern in $tempFiles) {
    if (Get-ChildItem -Path . -Name $pattern -ErrorAction SilentlyContinue) {
        Remove-Item $pattern -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Cache cleaned successfully!" -ForegroundColor Green
Write-Host "You can now run: npm run dev" -ForegroundColor Cyan