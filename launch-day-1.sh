#!/bin/bash

# Haven Mental Health - Day 1 Launch Script
# Run this on launch day to ensure everything is ready

echo "🚀 Haven Mental Health - Launch Day Script"
echo "========================================="
echo "Date: $(date)"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        exit 1
    fi
}

echo "📋 Pre-Launch Checklist:"
echo "------------------------"

# 1. Check if domain is registered
echo -n "1. Checking domain registration... "
nslookup haven-mental.health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Domain registered${NC}"
else
    echo -e "${YELLOW}⚠ Domain not found - register at namecheap.com${NC}"
fi

# 2. Check if site is deployed
echo -n "2. Checking if site is live... "
curl -s -o /dev/null -w "%{http_code}" https://haven-mental.health | grep -q "200"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Site is live!${NC}"
else
    echo -e "${RED}✗ Site not accessible - deploy with Vercel${NC}"
fi

# 3. Build the production bundle
echo -n "3. Building production bundle... "
if [ -f "build-production.sh" ]; then
    echo ""
    ./build-production.sh
    check_status "Production build complete"
else
    echo -e "${RED}✗ Build script not found${NC}"
fi

# 4. Create launch directories
echo "4. Creating launch directories... "
mkdir -p launch-data/emails-sent
mkdir -p launch-data/responses
mkdir -p launch-data/demos
mkdir -p launch-data/customers
check_status "Directories created"

# 5. Initialize tracking files
echo "5. Initializing tracking files... "
cat > launch-data/day-1-plan.md << EOF
# Haven Mental Health - Day 1 Launch Plan

## Morning (9 AM - 12 PM)
- [ ] Deploy site to production
- [ ] Verify all features work
- [ ] Send first 3 emails to warm contacts
- [ ] Post on personal social media

## Afternoon (1 PM - 5 PM)
- [ ] Send 5 cold outreach emails
- [ ] Connect with 10 therapists on LinkedIn
- [ ] Monitor site uptime
- [ ] Respond to any questions

## Evening (6 PM - 8 PM)
- [ ] Review responses
- [ ] Update tracking spreadsheet
- [ ] Plan tomorrow's outreach
- [ ] Celebrate launching! 🎉

## Today's Email List:
1. ________________________
2. ________________________
3. ________________________
4. ________________________
5. ________________________
6. ________________________
7. ________________________
8. ________________________

## Notes:
_________________________________
_________________________________
_________________________________
EOF
check_status "Launch plan created"

# 6. Create first email batch
echo "6. Preparing first email batch... "
cat > launch-data/emails-sent/batch-1.md << EOF
# Email Batch 1 - Sent $(date)

## Warm Contacts (Friends/Colleagues)

### Email 1: [Name]
- Sent: [Time]
- Template: Personal Connection
- Notes: 

### Email 2: [Name]
- Sent: [Time]
- Template: Personal Connection
- Notes:

### Email 3: [Name]
- Sent: [Time]
- Template: Personal Connection
- Notes:

## Cold Contacts (Psychology Today)

### Email 4: [Name]
- Sent: [Time]
- Template: Problem/Solution
- Notes:

### Email 5: [Name]
- Sent: [Time]
- Template: Honest Pitch
- Notes:
EOF
check_status "Email templates ready"

# 7. Start monitoring
echo "7. Starting monitoring service... "
if [ -f "monitoring/simple-monitor.js" ]; then
    echo -e "${GREEN}✓ Run: node monitoring/simple-monitor.js${NC}"
else
    echo -e "${RED}✗ Monitoring script not found${NC}"
fi

# 8. Create quick commands file
echo "8. Creating quick commands... "
cat > launch-data/quick-commands.sh << 'EOF'
#!/bin/bash
# Quick commands for daily use

# Check site status
alias check-site='curl -I https://haven-mental.health'

# View recent signups (mock)
alias check-signups='echo "Checking for new signups..."'

# Send follow-up email
send-followup() {
    echo "Subject: Just checking in"
    echo "Hi [Name], just wanted to see if you had a chance to look at Haven?"
}

# Daily report
daily-report() {
    echo "=== Daily Report $(date) ==="
    echo "Emails sent: $(ls -1 launch-data/emails-sent | wc -l)"
    echo "Responses: $(ls -1 launch-data/responses | wc -l)"
    echo "Demos scheduled: $(ls -1 launch-data/demos | wc -l)"
}
EOF
chmod +x launch-data/quick-commands.sh
check_status "Quick commands created"

# 9. Final reminders
echo ""
echo "🎯 LAUNCH DAY REMINDERS:"
echo "========================"
echo ""
echo "1. START SIMPLE:"
echo "   - Send 3 emails to friends first"
echo "   - Get comfortable with the pitch"
echo "   - Ask for honest feedback"
echo ""
echo "2. TRACK EVERYTHING:"
echo "   - Use outreach/therapist-tracker.csv"
echo "   - Note what resonates"
echo "   - Update status immediately"
echo ""
echo "3. RESPOND FAST:"
echo "   - Check email every 2 hours"
echo "   - Respond within 1 hour"
echo "   - Book demos same day"
echo ""
echo "4. STAY FOCUSED:"
echo "   - No new features today"
echo "   - No perfectionism"
echo "   - Just get users"
echo ""
echo "5. CELEBRATE WINS:"
echo "   - First email sent ✓"
echo "   - First response ✓"
echo "   - First demo ✓"
echo "   - First user ✓"
echo ""
echo -e "${GREEN}🚀 YOU'RE READY TO LAUNCH!${NC}"
echo ""
echo "Next steps:"
echo "1. Open outreach/therapist-tracker.csv"
echo "2. Open outreach/therapist-email-template.md"
echo "3. Find 3 therapist friends to email"
echo "4. Send your first email NOW"
echo ""
echo "Remember: Done is better than perfect."
echo "The first email is the hardest. Send it!"
echo ""
echo "Good luck! 🍀"