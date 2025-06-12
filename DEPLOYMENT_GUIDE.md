# Haven Mental Health MVP - Deployment Guide

## 🚀 Quick Deploy (5 minutes)

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
./build-production.sh
cd build
vercel --prod

# Follow prompts to:
# 1. Create new project
# 2. Name it: haven-mental-health
# 3. Deploy!
```

### Option 2: Netlify
1. Run `./build-production.sh`
2. Go to https://app.netlify.com
3. Drag the `build/` folder to the deployment area
4. Configure domain: haven-mental.health

### Option 3: GitHub Pages
```bash
# Build
./build-production.sh

# Deploy
npm install -g gh-pages
gh-pages -d build
```

## 🔧 Configuration

### Environment Variables (Optional for MVP)
```env
# Not needed for MVP - all client-side
REACT_APP_ENV=production
```

### Domain Setup
1. Register `haven-mental.health` at Namecheap ($10/year)
2. Point to deployment:
   - Vercel: Add custom domain in dashboard
   - Netlify: Add custom domain in settings
   - Use provided nameservers

### SSL Certificate
- ✅ Automatic with Vercel/Netlify
- Free Let's Encrypt certificate

## 🔒 Security Headers

Already configured in build:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Content-Security-Policy: default-src 'self'
- Permissions-Policy: camera, microphone only

## 📱 Mobile Considerations

The app is responsive but consider:
- Video calls work best on desktop
- PWA manifest for "Add to Home Screen"
- Test on iPhone/Android before therapist outreach

## 🚨 Monitoring

### Free Options:
1. **UptimeRobot** (free tier)
   - Monitor https://haven-mental.health
   - Email alerts if down
   - Public status page

2. **Vercel Analytics** (built-in)
   - Page views
   - User geography
   - Performance metrics

3. **Browser Console**
   ```javascript
   // Add to app for basic telemetry
   window.onerror = (msg, url, line) => {
     console.error('Global error:', {msg, url, line});
     // Could send to free service like LogRocket
   };
   ```

## 🎯 Launch Checklist

### Before First Therapist:
- [ ] Domain active (haven-mental.health)
- [ ] SSL working (https://)
- [ ] Demo account functional
- [ ] Video permissions tested
- [ ] Mobile responsive verified

### First Day:
- [ ] Send to 3 therapist friends for feedback
- [ ] Monitor error logs
- [ ] Check uptime monitor
- [ ] Respond to any issues within 1 hour

### First Week:
- [ ] Daily check-ins with early users
- [ ] Fix any reported bugs same day
- [ ] Gather feature requests (but say no)
- [ ] Focus on reliability over features

## 🆘 Troubleshooting

### "Page not found" on refresh
- SPA routing issue
- Check _redirects (Netlify) or vercel.json

### Video not working
- HTTPS required for WebRTC
- Check browser permissions
- Test at https://webrtc.github.io/samples/

### Slow initial load
- Normal for first visit
- Consider code splitting later
- Not critical for MVP

### Login issues
- Check browser console
- Verify localStorage enabled
- Clear cache and retry

## 📞 Support Plan

For the first 10 therapists:
- Personal cell: [Your number]
- Response time: <1 hour (business hours)
- Direct email: founder@haven-mental.health
- Weekly check-in calls

Remember: **Reliability > Features** for mental health professionals.