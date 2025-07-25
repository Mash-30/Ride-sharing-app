@echo off
REM Ride Sharing App - Service Startup Script for Windows
REM This script starts all the backend microservices

echo 🚀 Starting Ride Sharing App Backend Services...

REM Get the script directory
set SCRIPT_DIR=%~dp0
set SERVER_DIR=%SCRIPT_DIR%server

REM Check if server directory exists
if not exist "%SERVER_DIR%" (
    echo ❌ Error: Server directory not found at %SERVER_DIR%
    pause
    exit /b 1
)

REM Function to start a service
:start_service
set service_name=%1
set service_path=%2
set port=%3

echo 📦 Starting %service_name% on port %port%...
cd /d "%service_path%"

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found in %service_path%
    goto :eof
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing dependencies for %service_name%...
    npm install
)

REM Start the service in background
start "npm start" cmd /c "npm start"
echo ✅ %service_name% started

REM Wait a bit for the service to start
timeout /t 2 /nobreak >nul
goto :eof

REM Start API Gateway first
echo 🌐 Starting API Gateway...
call :start_service "API Gateway" "%SERVER_DIR%\api-gateway" 5000

REM Start all microservices
echo 🔧 Starting Microservices...

call :start_service "User Service" "%SERVER_DIR%\services\user-service" 5001
call :start_service "Ride Service" "%SERVER_DIR%\services\ride-service" 5002
call :start_service "Location Service" "%SERVER_DIR%\services\location-service" 5003
call :start_service "Payment Service" "%SERVER_DIR%\services\payment-service" 5004
call :start_service "Notification Service" "%SERVER_DIR%\services\notification-service" 5005
call :start_service "Analytics Service" "%SERVER_DIR%\services\analytics-service" 5006
call :start_service "Admin Service" "%SERVER_DIR%\services\admin-service" 5007

echo.
echo 🎉 All services started successfully!
echo.
echo 📱 To start the client app, run:
echo    cd client\app\riders\ridersapp
echo    npm start
echo.
echo 🌐 API Gateway is running on: http://localhost:5000
echo.
echo 📋 Service Status:
echo    - API Gateway: http://localhost:5000
echo    - User Service: http://localhost:5001
echo    - Ride Service: http://localhost:5002
echo    - Location Service: http://localhost:5003
echo    - Payment Service: http://localhost:5004
echo    - Notification Service: http://localhost:5005
echo    - Analytics Service: http://localhost:5006
echo    - Admin Service: http://localhost:5007
echo.
echo 🛑 Close this window to stop all services

pause 