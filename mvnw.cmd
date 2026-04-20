@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set JAVA_HOME=C:\Program Files\Java\jdk-17
set MAVEN_PROJECTBASEDIR=%~dp0

set MAVEN_WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set MAVEN_WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

for /f "usebackq tokens=1,2 delims==" %%a in (%MAVEN_WRAPPER_PROPERTIES%) do (
    if "%%a"=="distributionUrl" set DISTRIBUTION_URL=%%b
)

set MAVEN_USER_HOME=%USERPROFILE%\.m2
set MAVEN_HOME=%MAVEN_USER_HOME%\wrapper\dists\apache-maven-3.9.6

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Maven 3.9.6...
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $url = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip'; $dest = '%MAVEN_USER_HOME%\wrapper\dists\apache-maven-3.9.6-bin.zip'; New-Item -ItemType Directory -Force -Path '%MAVEN_USER_HOME%\wrapper\dists' | Out-Null; Invoke-WebRequest -Uri $url -OutFile $dest; Expand-Archive -Path $dest -DestinationPath '%MAVEN_USER_HOME%\wrapper\dists' -Force }"
    if errorlevel 1 (
        echo Failed to download Maven. Please install Maven manually.
        exit /b 1
    )
    ren "%MAVEN_USER_HOME%\wrapper\dists\apache-maven-3.9.6" "apache-maven-3.9.6" 2>nul
)

set PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%
"%MAVEN_HOME%\bin\mvn.cmd" %*
