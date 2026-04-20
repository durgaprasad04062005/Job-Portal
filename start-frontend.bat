@echo off
echo ============================================
echo  Job Portal - Frontend Startup
echo ============================================

cd /d "%~dp0frontend"

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting React frontend on http://localhost:3000
echo Press Ctrl+C to stop.
echo.

call npm run dev
pause
