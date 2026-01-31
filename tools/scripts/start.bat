@REM CMD: start.bat 
@REM PowerShell: .\start.bat
@echo off

REM Start Java services (with .env loading)
start cmd /k "call %~dp0start.java.bat ..\..\apps\auth-service"
start cmd /k "call %~dp0start.java.bat ..\..\apps\statistics-service"

REM Start Node.js services
start cmd /k "call %~dp0start.node.bat ..\..\apps\gateway"
start cmd /k "call %~dp0start.node.bat ..\..\apps\user-service"
start cmd /k "call %~dp0start.node.bat ..\..\apps\catalog-service"
start cmd /k "call %~dp0start.node.bat ..\..\apps\file-service"
start cmd /k "call %~dp0start.node.bat ..\..\apps\borrow-service"
start cmd /k "call %~dp0start.node.bat ..\..\apps\interaction-service"
