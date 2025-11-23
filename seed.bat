@REM Seed Script for IDoc API Services
@REM CMD: seed.bat
@REM PowerShell: .\seed.bat

@echo off

@REM start cmd /k "cd /d %~dp0auth-service && mvn spring-boot:run -Dspring-boot.run.profiles=mock"

start cmd /k "cd /d %~dp0user-service && npm run seed"

start cmd /k "cd /d %~document-service && npm run seed"