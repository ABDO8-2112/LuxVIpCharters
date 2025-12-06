# Lux VIP Charters - Server Setup and Run Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Lux VIP Charters Server Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeInstalled = $false
$nodePath = $null

# Check common Node.js locations
$nodeLocations = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:ProgramFiles\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
)

foreach ($location in $nodeLocations) {
    if (Test-Path $location) {
        $nodePath = $location
        $nodeInstalled = $true
        Write-Host "✅ Node.js found at: $location" -ForegroundColor Green
        break
    }
}

# Check PATH
if (-not $nodeInstalled) {
    try {
        $nodeCheck = Get-Command node -ErrorAction Stop
        $nodePath = $nodeCheck.Source
        $nodeInstalled = $true
        Write-Host "✅ Node.js found in PATH: $nodePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js not found" -ForegroundColor Red
    }
}

# If Node.js is not installed, offer to install it
if (-not $nodeInstalled) {
    Write-Host ""
    Write-Host "Node.js is not installed. It's required to run the server." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Node.js:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Download the LTS version" -ForegroundColor Cyan
    Write-Host "3. Run the installer" -ForegroundColor Cyan
    Write-Host "4. Restart this script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening Node.js download page..." -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & $nodePath -v
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env.example as template..." -ForegroundColor Yellow
    @"
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created. Please edit it with your email credentials." -ForegroundColor Green
    Write-Host ""
}

# Start the server
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

& $nodePath server.js

