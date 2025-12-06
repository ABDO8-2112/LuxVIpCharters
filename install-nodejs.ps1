# Auto-install Node.js Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js Auto-Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script requires administrator privileges" -ForegroundColor Yellow
    Write-Host "Right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, manually install Node.js from:" -ForegroundColor Cyan
    Write-Host "https://nodejs.org/" -ForegroundColor Cyan
    Write-Host ""
    pause
    exit
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Download Node.js LTS installer
$nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Download complete" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download Node.js" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please download manually from: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "Installing Node.js..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Install Node.js silently
$process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru

if ($process.ExitCode -eq 0) {
    Write-Host "✅ Node.js installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Please restart your terminal and run the server setup script again." -ForegroundColor Yellow
} else {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    Write-Host "Exit code: $($process.ExitCode)" -ForegroundColor Red
}

# Clean up
Remove-Item $installerPath -ErrorAction SilentlyContinue

Write-Host ""
pause

