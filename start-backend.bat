@echo off
setlocal EnableDelayedExpansion

echo ============================================
echo  Job Portal - Backend Startup
echo ============================================

:: Set Java Home
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

:: Verify Java
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java not found. Please install Java 17.
    pause
    exit /b 1
)
echo [OK] Java found

:: Check MongoDB
echo Checking MongoDB...
mongosh --eval "db.runCommand({ping:1})" --quiet >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB may not be running. Start it with: mongod
    echo Continuing anyway...
) else (
    echo [OK] MongoDB is running
)

:: Download Maven if not present
set MAVEN_DIR=%USERPROFILE%\.m2\wrapper\apache-maven-3.9.6
set MVN_CMD=%MAVEN_DIR%\bin\mvn.cmd

if not exist "%MVN_CMD%" (
    echo Downloading Apache Maven 3.9.6 (one-time setup)...
    set MAVEN_ZIP=%TEMP%\apache-maven-3.9.6-bin.zip
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '!MAVEN_ZIP!' }"
    if errorlevel 1 (
        echo ERROR: Failed to download Maven. Check your internet connection.
        pause
        exit /b 1
    )
    powershell -Command "Expand-Archive -Path '!MAVEN_ZIP!' -DestinationPath '%USERPROFILE%\.m2\wrapper' -Force"
    echo [OK] Maven downloaded
)

set PATH=%MAVEN_DIR%\bin;%PATH%
echo [OK] Maven ready

:: Start Spring Boot
echo.
echo Starting Spring Boot backend on http://localhost:8080/api
echo Press Ctrl+C to stop.
echo.

"%MVN_CMD%" spring-boot:run -f pom.xml

pause
