@REM CMD: start.bat 
@REM PowerShell: .\start.bat
@echo off

start cmd /k "cd /d %~dp0auth-service && mvn spring-boot:run"
start cmd /k "cd /d %~dp0user-service && npm run dev"
start cmd /k "cd /d %~dp0document-service && npm run dev"