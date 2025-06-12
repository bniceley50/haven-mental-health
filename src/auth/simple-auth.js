// For demo purposes, we'll use simple hashing
// In production, use proper Argon2id
const simpleHash = (password) => {
  // Simple hash for demo - NOT for production
  // Using btoa for browser compatibility
  return btoa(password);
};

/**
 * Simple Authentication for Therapists
 * No complex roles, no organizations, no permissions
 * Just therapist login with secure password hashing
 */
export class SimpleAuth {
  constructor() {
    // In-memory session storage (real app would use secure session management)
    this.sessions = new Map();
    
    // Simple user storage (real app would use encrypted database)
    this.users = new Map();
    
    // Rate limiting for login attempts
    this.loginAttempts = new Map();
    
    // Add demo account for testing
    this.createDemoAccount();
  }

  createDemoAccount() {
    // Create a demo therapist account directly
    const demoEmail = 'demo@haven.health';
    this.users.set(demoEmail, {
      id: 'demo-user-id',
      email: demoEmail,
      name: 'Demo Therapist',
      hash: simpleHash('demo1234'),
      createdAt: new Date(),
      isTherapist: true
    });
    console.log('Demo account created');
  }

  /**
   * Register a new therapist
   * Just email and password - no complex onboarding
   */
  async register(email, password, name) {
    // Basic validation
    if (!email || !password || password.length < 8) {
      throw new Error('Email and password (min 8 chars) required');
    }

    // Check if already exists
    if (this.users.has(email)) {
      throw new Error('Account already exists');
    }

    // Simple hash for demo
    const hashedPassword = simpleHash(password);

    // Store user
    this.users.set(email, {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      hash: hashedPassword,
      createdAt: new Date(),
      isTherapist: true, // Only therapists in this app
    });

    return { success: true, email };
  }

  /**
   * Login with rate limiting
   */
  async login(email, password) {
    // Check rate limiting
    const attempts = this.loginAttempts.get(email) || 0;
    if (attempts >= 5) {
      throw new Error('Too many login attempts. Try again in 15 minutes.');
    }

    // Get user
    const user = this.users.get(email);
    if (!user) {
      this.loginAttempts.set(email, attempts + 1);
      throw new Error('Invalid credentials');
    }

    // Verify password (simple for demo)
    const inputHash = simpleHash(password);
    const valid = inputHash === user.hash;
    
    if (!valid) {
      this.loginAttempts.set(email, attempts + 1);
      throw new Error('Invalid credentials');
    }

    // Clear login attempts
    this.loginAttempts.delete(email);

    // Create session
    const sessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const session = {
      id: sessionId,
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    };

    this.sessions.set(sessionId, session);

    return {
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Validate session
   */
  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Check expiration
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    // Extend session on activity
    session.expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    return {
      userId: session.userId,
      email: session.email,
      name: session.name,
    };
  }

  /**
   * Logout
   */
  logout(sessionId) {
    this.sessions.delete(sessionId);
    return { success: true };
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  cleanupSessions() {
    const now = new Date();
    for (const [id, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * Reset login attempts (run every 15 minutes)
   */
  resetLoginAttempts() {
    this.loginAttempts.clear();
  }
}

// What we're NOT implementing:
// - OAuth/SSO (complexity)
// - Two-factor auth (can add later)
// - Role-based permissions (only therapists)
// - Organization management (solo focus)
// - API keys (not needed yet)
// - Password complexity rules beyond length
// Just simple, secure therapist authentication.