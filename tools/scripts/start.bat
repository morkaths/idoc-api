@REM CMD: start.bat 
@REM PowerShell: .\start.bat
@echo off

start cmd /k "cd /d %~dp0..\..\apps\auth-service && mvn spring-boot:run"
start cmd /k "cd /d %~dp0..\..\apps\user-service && npm run dev"
start cmd /k "cd /d %~dp0..\..\apps\catalog-service && npm run dev"