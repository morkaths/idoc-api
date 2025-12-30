@REM CMD: tools\scripts\seed-db.bat
@REM PowerShell: .\tools\scripts\seed-db.bat

@echo off

REM Auth service seeder
start "Auth Service" cmd /k "cd /d "%~dp0..\..\apps\auth-service" && mvn spring-boot:run -Dspring-boot.run.profiles=mock"

REM User service seeder
start "User Service Seed" cmd /k "cd /d "%~dp0..\..\apps\user-service" && npm run seed"

REM Catalog service seeder
start "Catalog Service Seed" cmd /k "cd /d "%~dp0..\..\apps\catalog-service" && npm run seed"

REM Document service seeder
@REM start "Document Service Seed" cmd /k "cd /d "%~dp0document-service" && npm run seed"