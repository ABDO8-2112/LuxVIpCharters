@echo off
echo ========================================
echo Lux VIP Charters Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    echo Opening download page...
    start https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed!
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    (
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-app-password
        echo PORT=3000
    ) > .env
    echo .env file created. Please edit it with your email credentials.
    echo.
)

echo ========================================
echo Starting Server...
echo ========================================
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js

pause

