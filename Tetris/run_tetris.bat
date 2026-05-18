@echo off
cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not available in PATH.
    echo Please install Python and add it to your system PATH, then try again.
    pause
    exit /b 1
)

echo Starting Tetris server on http://localhost:8000
echo Press Ctrl+C to stop the server.

python -m http.server 8000
pause
