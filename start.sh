#!/bin/bash

# TalentHub Startup Script

echo "🚀 Starting TalentHub - AI-Powered Recruitment Platform"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed!"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    exit 1
fi

# Check if Tesseract is installed
if ! command -v tesseract &> /dev/null; then
    echo "⚠️  Warning: Tesseract OCR not found. PDF text extraction may not work properly."
    echo "Install Tesseract:"
    echo "  Ubuntu/Debian: sudo apt install tesseract-ocr"
    echo "  macOS: brew install tesseract"
    echo "  Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki"
fi

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📦 Installing Node.js dependencies..."
npm install

echo "🗄️  Creating uploads directory..."
mkdir -p uploads

echo "🔧 Starting backend server..."
echo "Backend will be available at: http://localhost:8000"
echo "API docs will be available at: http://localhost:8000/docs"
echo ""

# Start backend in background
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "🌐 Starting frontend server..."
echo "Frontend will be available at: http://localhost:3000"
echo ""

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ TalentHub is starting up!"
echo "=================================================="
echo "📊 Backend:  http://localhost:8000"
echo "📊 Frontend: http://localhost:3000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "=================================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait