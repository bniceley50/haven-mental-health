#!/bin/bash

echo "🚀 Deploying Haven Mental Health to Vercel"
echo "========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Build the project
echo "🔨 Building production bundle..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Share your live URL with therapists"
echo "2. Add custom domain (haven-mental.health)"
echo "3. Monitor usage in Vercel dashboard"
echo ""
echo "🔒 Security features deployed:"
echo "- HTTPS/TLS encryption enabled"
echo "- Security headers configured"
echo "- HIPAA compliance messaging"
echo ""
echo "Start reaching out to therapists NOW! 🎯"