#!/usr/bin/env node

/**
 * Simple Monitoring Script for Haven Mental Health MVP
 * Tracks uptime, first users, and basic metrics
 * Run this daily to stay on top of your launch
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://haven-mental.health';
const CHECK_INTERVAL = 60000; // 1 minute
const LOG_FILE = path.join(__dirname, 'monitor.log');
const METRICS_FILE = path.join(__dirname, 'metrics.json');

// Initialize metrics
let metrics = {
  uptime: {
    checks: 0,
    successes: 0,
    failures: 0,
    lastCheck: null,
    lastStatus: null
  },
  users: {
    signups: 0,
    logins: 0,
    lastActivity: null
  },
  errors: []
};

// Load existing metrics if available
if (fs.existsSync(METRICS_FILE)) {
  metrics = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
}

// Simple logging
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${type}: ${message}\n`;
  
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Check site availability
function checkUptime() {
  const startTime = Date.now();
  
  https.get(SITE_URL, (res) => {
    const responseTime = Date.now() - startTime;
    metrics.uptime.checks++;
    
    if (res.statusCode === 200) {
      metrics.uptime.successes++;
      metrics.uptime.lastStatus = 'UP';
      log(`Site is UP (${responseTime}ms)`);
    } else {
      metrics.uptime.failures++;
      metrics.uptime.lastStatus = 'DOWN';
      log(`Site returned ${res.statusCode}`, 'ERROR');
      notifyDown(res.statusCode);
    }
    
    metrics.uptime.lastCheck = new Date().toISOString();
    saveMetrics();
  }).on('error', (err) => {
    metrics.uptime.failures++;
    metrics.uptime.lastStatus = 'DOWN';
    log(`Site is DOWN: ${err.message}`, 'ERROR');
    notifyDown(err.message);
    saveMetrics();
  });
}

// Check for new users (mock - replace with real API)
function checkNewUsers() {
  // In production, this would call your backend API
  // For now, we'll check a simple endpoint
  
  // Mock user activity detector
  const mockCheckUsers = () => {
    // Simulate checking localStorage or session data
    log('Checking for user activity...');
    
    // In real implementation:
    // - Check your database for new signups
    // - Monitor login events
    // - Track active sessions
  };
  
  mockCheckUsers();
}

// Send notification when site is down
function notifyDown(error) {
  // In production, integrate with:
  // - Email (SendGrid free tier)
  // - SMS (Twilio)
  // - Slack webhook
  
  log(`ALERT: Site is down! Error: ${error}`, 'CRITICAL');
  
  // For MVP, just log to console with alert
  console.log('\n🚨🚨🚨 SITE IS DOWN! 🚨🚨🚨');
  console.log(`Error: ${error}`);
  console.log('Check immediately!\n');
}

// Save metrics to file
function saveMetrics() {
  fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
}

// Generate daily report
function generateDailyReport() {
  const uptime = (metrics.uptime.successes / metrics.uptime.checks * 100).toFixed(2);
  
  const report = `
=== Haven Mental Health Daily Report ===
Date: ${new Date().toLocaleDateString()}

📊 Uptime Statistics:
- Total Checks: ${metrics.uptime.checks}
- Successful: ${metrics.uptime.successes}
- Failed: ${metrics.uptime.failures}
- Uptime: ${uptime}%
- Current Status: ${metrics.uptime.lastStatus}

👥 User Activity:
- New Signups: ${metrics.users.signups}
- Total Logins: ${metrics.users.logins}
- Last Activity: ${metrics.users.lastActivity || 'None yet'}

${metrics.errors.length > 0 ? `
⚠️ Recent Errors:
${metrics.errors.slice(-5).map(e => `- ${e}`).join('\n')}
` : '✅ No errors reported'}

📋 Action Items:
${uptime < 99 ? '- Investigate downtime issues\n' : ''}
${metrics.users.signups === 0 ? '- No signups yet - reach out to therapists!\n' : ''}
${metrics.users.signups > 0 ? '- Follow up with new users\n' : ''}
- Check error logs for issues
- Monitor user feedback

Keep going! 🚀
`;

  console.log(report);
  fs.writeFileSync(path.join(__dirname, `report-${new Date().toISOString().split('T')[0]}.txt`), report);
}

// Quick stats command
function showQuickStats() {
  console.log('\n📊 Quick Stats:');
  console.log(`Status: ${metrics.uptime.lastStatus || 'Unknown'}`);
  console.log(`Uptime: ${((metrics.uptime.successes / metrics.uptime.checks) * 100).toFixed(2)}%`);
  console.log(`Last Check: ${metrics.uptime.lastCheck || 'Never'}`);
  console.log(`New Users Today: ${metrics.users.signups}`);
  console.log('\n');
}

// Main monitoring loop
function startMonitoring() {
  log('Starting Haven Mental Health monitoring...');
  
  // Initial check
  checkUptime();
  checkNewUsers();
  
  // Regular checks
  setInterval(() => {
    checkUptime();
  }, CHECK_INTERVAL);
  
  // User activity check every 5 minutes
  setInterval(() => {
    checkNewUsers();
  }, 5 * 60000);
  
  // Quick stats every 30 minutes
  setInterval(() => {
    showQuickStats();
  }, 30 * 60000);
  
  // Daily report at midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow - now;
  
  setTimeout(() => {
    generateDailyReport();
    // Then daily
    setInterval(generateDailyReport, 24 * 60 * 60000);
  }, msUntilMidnight);
}

// Handle process termination
process.on('SIGINT', () => {
  log('Monitoring stopped by user');
  showQuickStats();
  process.exit(0);
});

// Command line interface
if (process.argv[2] === 'report') {
  generateDailyReport();
} else if (process.argv[2] === 'stats') {
  showQuickStats();
} else {
  console.log(`
🏥 Haven Mental Health Monitor

Commands:
  node monitor.js         - Start monitoring
  node monitor.js stats   - Show quick statistics  
  node monitor.js report  - Generate daily report

Starting continuous monitoring...
Press Ctrl+C to stop.
`);
  startMonitoring();
}

// Export for testing
module.exports = {
  checkUptime,
  generateDailyReport,
  metrics
};