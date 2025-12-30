#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this after connecting your project to Vercel

echo "🔧 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Link to Vercel project (if not already linked)
echo "📌 Linking to Vercel project..."
vercel link

# Set environment variables
echo "🔑 Setting environment variables..."

vercel env add GEMINI_API_KEY production
vercel env add PINECONE_API_KEY production
vercel env add PINECONE_INDEX production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_CONTACT_EMAIL production

echo "✅ Environment variables set!"
echo "🚀 Deploying to production..."
vercel --prod

echo "🎉 Deployment complete!"
