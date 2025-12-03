@REM Seed Script for IDoc API Services
@REM CMD: seed.bat
@REM PowerShell: .\seed.bat

@echo off

REM Auth service (example)
@REM start "Auth Service" cmd /k "cd /d "%~dp0auth-service" && mvn spring-boot:run -Dspring-boot.run.profiles=mock"

REM User service seeder
start "User Service Seed" cmd /k "cd /d "%~dp0user-service" && npm run seed"

REM Catalog service seeder
start "Catalog Service Seed" cmd /k "cd /d "%~dp0catalog-service" && npm run seed"

REM Document service seeder
@REM start "Document Service Seed" cmd /k "cd /d "%~dp0document-service" && npm run seed"