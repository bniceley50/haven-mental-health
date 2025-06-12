#!/bin/bash

# Production Build Script for Haven Mental Health MVP
# Builds optimized production bundle ready for deployment

echo "🚀 Building Haven Mental Health MVP for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf node_modules/.cache/

# Install dependencies with exact versions
echo "📦 Installing dependencies..."
npm ci --production

# Run security audit (but don't fail on warnings)
echo "🔒 Running security audit..."
npm audit || true

# Set production environment
export NODE_ENV=production
export GENERATE_SOURCEMAP=false

# Build the production bundle
echo "🔨 Building production bundle..."
npm run build

# Check build size
echo "📊 Build Statistics:"
du -sh build/

# Create deployment info file
echo "📝 Creating deployment info..."
cat > build/deployment-info.json << EOF
{
  "version": "1.0.0",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "environment": "production",
  "features": {
    "messaging": true,
    "video": true,
    "notes": true,
    "scheduling": true,
    "billing": false,
    "insurance": false
  }
}
EOF

# Create _redirects file for Netlify
echo "📄 Creating Netlify redirects..."
cat > build/_redirects << EOF
# SPA redirect
/*    /index.html   200

# Security headers
/*    X-Frame-Options: DENY
/*    X-Content-Type-Options: nosniff
/*    X-XSS-Protection: 1; mode=block
/*    Referrer-Policy: strict-origin-when-cross-origin
/*    Permissions-Policy: camera=(self), microphone=(self)
EOF

# Create vercel.json for Vercel deployment
echo "📄 Creating Vercel config..."
cat > build/vercel.json << EOF
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
EOF

# Create deployment checklist
echo "📋 Creating deployment checklist..."
cat > build/DEPLOYMENT_CHECKLIST.md << EOF
# Haven Mental Health MVP - Deployment Checklist

## Pre-Deployment
- [ ] Build completed successfully
- [ ] No critical security vulnerabilities
- [ ] Environment variables configured
- [ ] Domain configured (haven-mental.health)
- [ ] SSL certificate active

## Deployment Steps
1. Choose deployment platform:
   - Vercel: \`vercel --prod\`
   - Netlify: Drag build/ folder to Netlify
   - AWS S3: \`aws s3 sync build/ s3://your-bucket\`

2. Configure environment:
   - Set NODE_ENV=production
   - Configure CORS if needed

3. Verify deployment:
   - [ ] Site loads at https://haven-mental.health
   - [ ] Login page displays
   - [ ] Demo account works
   - [ ] Video permissions prompt appears
   - [ ] Messages are encrypted

## Post-Deployment
- [ ] Monitor for first user signups
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Send to first 10 therapist prospects
EOF

echo "✅ Production build complete!"
echo "📦 Build output in: ./build/"
echo "📋 Next step: Deploy to Vercel/Netlify"
echo ""
echo "Quick deploy commands:"
echo "  Vercel:  cd build && vercel --prod"
echo "  Netlify: Drag ./build folder to netlify.com"