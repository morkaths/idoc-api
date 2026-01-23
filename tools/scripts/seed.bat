@REM CMD: tools\scripts\seed.bat
@REM PowerShell: .\tools\scripts\seed.bat

@echo off

REM Auth service seeder
start "Auth Service" cmd /k "cd /d "%~dp0..\..\apps\auth-service" && mvn spring-boot:run -Dspring-boot.run.profiles=mock"

REM User service seeder
start "User Service Seed" cmd /k "cd /d "%~dp0..\..\apps\user-service" && npm run seed"

REM Catalog service seeder
start "Catalog Service Seed" cmd /k "cd /d "%~dp0..\..\apps\catalog-service" && npm run seed"

REM Recommendation service seeder
start "Recommendation Service Seed" cmd /k "cd /d "%~dp0..\..\apps\recommendation-service" && poetry run python -m recommendation_service.scripts.seed"