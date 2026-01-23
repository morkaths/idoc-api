@echo off
REM Helper script to run Spring Boot services with .env loaded
REM Usage: start.java.bat <relative-path-to-service-from-here>

set SERVICE_REL_PATH=%1
set ENV_FILE=%~dp0..\..\.env

if exist "%ENV_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%ENV_FILE%") do (
        if "%%a" neq "" (
            set "VAR_NAME=%%a"
            set "VAR_VALUE=%%b"
            REM Basic check to skip comments
            echo %%a | findstr /b /c:"#" >nul
            if errorlevel 1 (
                REM Set environment variable
                call set "%%a=%%b"
            )
        )
    )
    echo [Java] Loaded env from %ENV_FILE%
) else (
    echo [Java] Warning: .env file not found at %ENV_FILE%
)

cd /d "%~dp0%SERVICE_REL_PATH%"
echo Starting Spring Boot service in %cd%
..\..\mvnw.cmd spring-boot:run
