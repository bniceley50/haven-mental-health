# Haven Mental Health MVP

A focused, secure communication platform for mental health professionals.

## What This Is

- **Secure Messaging**: End-to-end encrypted therapist-patient chat
- **Video Sessions**: Simple, HIPAA-compliant video therapy
- **Session Notes**: SOAP/DAP templates with full encryption
- **Basic Scheduling**: Simple appointment management
- **Therapist-Only**: Built specifically for mental health professionals

## What This Is NOT

- ❌ A billing platform
- ❌ An insurance management system
- ❌ A general healthcare platform
- ❌ A practice management suite
- ❌ An analytics dashboard

## Quick Start

```bash
npm install
npm start
```

Demo credentials:
- Email: demo@haven.health
- Password: demo1234

## Tech Stack

- React 18 with Material-UI
- AES-256-GCM encryption
- WebRTC for video
- Argon2id password hashing
- No backend required for MVP

## Security First

- All PHI is encrypted at rest and in transit
- No data leaves the browser in demo mode
- P2P connections for video (no server recording)
- Session-based authentication

## Target: 10 Therapists in 30 Days

This MVP is designed to onboard 10 paying therapists at $49/month.
Focus on therapists who need simple, secure communication tools.

## License

Proprietary - Haven Mental Health 2024