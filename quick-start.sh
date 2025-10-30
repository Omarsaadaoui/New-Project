#!/bin/bash

# Instagram AI Helper - Quick Start Script
# For omar_saadaoui_officiel

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           INSTAGRAM AI HELPER - QUICK START                   ║"
echo "║           Account: omar_saadaoui_officiel                     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm found: $(npm --version)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo ""
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your credentials before continuing!"
    echo ""
    echo "Required:"
    echo "  1. INSTAGRAM_USERNAME (already set to omar_saadaoui_officiel)"
    echo "  2. INSTAGRAM_PASSWORD"
    echo "  3. OPENAI_API_KEY"
    echo ""
    echo "After editing .env, run this script again."
    exit 0
fi

echo "✓ .env file found"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✓ Dependencies installed"
fi

echo "✓ Dependencies ready"

# Create necessary directories
mkdir -p logs data

echo ""
echo "🚀 Starting Instagram AI Helper..."
echo ""

# Run the main script
npm start

echo ""
echo "Setup complete! Check the documentation for usage instructions:"
echo "  - README.md - Main documentation"
echo "  - SETUP_GUIDE.md - Detailed setup instructions"
echo "  - USAGE_EXAMPLES.md - Real-world examples"
echo ""
