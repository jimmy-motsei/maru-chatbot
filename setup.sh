#!/bin/bash

# Maru Chatbot Setup Script
echo "🤖 Setting up Maru Chatbot..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please add your GEMINI_API_KEY"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if API key is set
if grep -q "your_gemini_api_key_here" .env.local 2>/dev/null; then
    echo "⚠️  Don't forget to add your GEMINI_API_KEY to .env.local"
    echo "   Get one at: https://makersuite.google.com/app/apikey"
fi

echo "🚀 Setup complete! Run 'npm run dev' to start the chatbot"
echo "📚 Check docs/INTEGRATION.md for integration instructions"