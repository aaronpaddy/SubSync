@echo off
echo 🚀 Starting SubTrackr Backend Server...
echo ========================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if .env file exists, if not create one
if not exist ".env" (
    echo ⚙️  Creating .env file...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # MongoDB Configuration
        echo MONGODB_URI=mongodb://localhost:27017/subtrackr
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=subtrackr_jwt_secret_key_2024_development
        echo JWT_EXPIRE=7d
        echo.
        echo # Frontend URL (for CORS)
        echo FRONTEND_URL=http://localhost:3001
    ) > .env
    echo ✅ .env file created
)

echo 🔧 Starting server with dynamic port discovery...
echo 📝 The server will automatically find an available port if 5000 is busy
echo 🌐 CORS is configured to accept requests from any localhost port
echo.

REM Start the server
npm start

pause

