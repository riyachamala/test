@echo off
REM TalentHub Startup Script for Windows

echo 🚀 Starting TalentHub - AI-Powered Recruitment Platform
echo ==================================================

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please copy .env.example to .env and configure your environment variables.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed!
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed!
    pause
    exit /b 1
)

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo 📦 Installing Node.js dependencies...
npm install

echo 🗄️ Creating uploads directory...
if not exist uploads mkdir uploads

echo 🔧 Starting backend server...
echo Backend will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/docs
echo.

REM Start backend in background
start "TalentHub Backend" cmd /c "python main.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo 🌐 Starting frontend server...
echo Frontend will be available at: http://localhost:3000
echo.

REM Start frontend
start "TalentHub Frontend" cmd /c "npm run dev"

echo ✅ TalentHub is starting up!
echo ==================================================
echo 📊 Backend:  http://localhost:8000
echo 📊 Frontend: http://localhost:3000
echo 📊 API Docs: http://localhost:8000/docs
echo ==================================================
echo.
echo Both servers are now running in separate windows.
echo Close those windows to stop the servers.
echo.
pause