#!/bin/bash

# Deploy Curation Station to Vercel
echo "🚀 Deploying Curation Station API & Docs..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Build the project
echo "Building project..."
npm install

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "Your Curation Station is now live at:"
echo "- Main App: https://curation-station.vercel.app"
echo "- API Docs: https://curation-station.vercel.app/curation-api-docs.html"
echo "- Registry API: https://curation-station.vercel.app/api/v2/"
echo ""
echo "Share these with agents and developers!"