#!/bin/bash

echo "🚀 Starting SubTrackr Backend Server..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists, if not create one
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/subtrackr

# JWT Configuration
JWT_SECRET=subtrackr_jwt_secret_key_2024_development
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
EOF
    echo "✅ .env file created"
fi

echo "🔧 Starting server with dynamic port discovery..."
echo "📝 The server will automatically find an available port if 5000 is busy"
echo "🌐 CORS is configured to accept requests from any localhost port"
echo ""

# Start the server
npm start

