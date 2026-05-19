@echo off
cd /d "%~dp0"

if not exist "node_modules" (
    echo ERROR: node_modules not found.
    echo Run "npm install" first, then run this script again.
    pause
    exit /b 1
)

echo Starting LocalBoard dev server...
call npm run dev
if errorlevel 1 (
    echo.
    echo The dev server exited with an error.
    echo Check the output above for details.
    pause
)
