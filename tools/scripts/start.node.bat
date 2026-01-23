@echo off
REM Helper script to run Node.js services
REM Usage: start.node.bat <relative-path-to-service-from-here>

set SERVICE_REL_PATH=%1
cd /d "%~dp0%SERVICE_REL_PATH%"
echo Starting Node.js service in %cd%
npm run dev
