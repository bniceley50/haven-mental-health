import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Divider
} from '@mui/material';
import { Lock, Email } from '@mui/icons-material';
import { useAuth } from './auth-context';
import { useNavigate } from 'react-router-dom';

/**
 * Login Page - Simple, secure therapist login
 * No complex SSO, no social login, no magic links
 * Just email and password for licensed therapists
 */
export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // Basic validation for registration
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        
        await register(email, password, name);
        
        // Auto-login after registration
        await login(email, password);
      }
      
      // Redirect to dashboard
      console.log('Login successful, redirecting to dashboard...');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Haven Mental Health
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Secure therapy communication platform
          </Typography>
        </Box>

        {/* Security Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 3,
            p: 1,
            bgcolor: 'success.light',
            borderRadius: 2
          }}
        >
          <Lock fontSize="small" />
          <Typography variant="caption">
            HIPAA Compliant • End-to-End Encrypted
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="Dr. Jane Smith"
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            placeholder="therapist@practice.com"
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            helperText={!isLogin ? "Minimum 8 characters" : ""}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <Divider sx={{ my: 2 }} />

        {/* Toggle between login and register */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </Typography>
        </Box>

        {/* Demo notice */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="caption">
            <strong>Demo Mode:</strong> Use email "demo@haven.health" and password "demo1234" to explore
          </Typography>
        </Alert>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            For licensed mental health professionals only
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            By signing in, you agree to maintain patient confidentiality
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

// What we're NOT implementing:
// - OAuth/Social login (complexity)
// - Two-factor authentication (can add later)
// - Password reset flow (can add later)
// - Email verification (can add later)
// - Remember me (security concern)
// - Login with phone number (not needed)
// Just simple, secure email/password auth