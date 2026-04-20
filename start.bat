@echo off
title Job Portal - Startup
color 0A

echo.
echo  ============================================
echo   JOB PORTAL - Starting All Services
echo  ============================================
echo.

:: ── Paths ──────────────────────────────────────────────
set JAVA_HOME=C:\Program Files\Java\jdk-17
set MAVEN_HOME=%USERPROFILE%\.m2\apache-maven-3.9.6
set MONGODB_BIN=C:\Program Files\MongoDB\Server\8.2\bin
set MONGODB_CFG=C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg
set PROJECT_DIR=%~dp0
set FRONTEND_DIR=%PROJECT_DIR%frontend

:: ── Add to PATH ─────────────────────────────────────────
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%MONGODB_BIN%;%PATH%

echo [1/3] Checking MongoDB...
netstat -ano | findstr ":27017" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo  MongoDB is already running on port 27017
) else (
    echo  Starting MongoDB...
    start "MongoDB" "%MONGODB_BIN%\mongod.exe" --config "%MONGODB_CFG%"
    timeout /t 3 /nobreak >nul
    echo  MongoDB started
)

echo.
echo [2/3] Starting Spring Boot Backend...
start "Backend - Spring Boot" cmd /k "cd /d "%PROJECT_DIR%" && set JAVA_HOME=%JAVA_HOME% && set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH% && echo Starting backend... && mvn spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8080 && pause"

echo  Backend starting in a new window (wait ~15 seconds)...

echo.
echo [3/3] Starting React Frontend...
start "Frontend - React" cmd /k "cd /d "%FRONTEND_DIR%" && echo Starting frontend... && npm run dev && pause"

echo  Frontend starting in a new window...

echo.
echo  ============================================
echo   All services launched!
echo.
echo   MongoDB  : localhost:27017
echo   Backend  : http://localhost:8080/api
echo   Frontend : http://localhost:3000
echo.
echo   Wait ~15 seconds for backend to fully start,
echo   then open: http://localhost:3000
echo  ============================================
echo.
pause
