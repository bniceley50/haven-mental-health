import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/auth-context';
import { EncryptionProvider } from './encryption/encryption-provider';
import { P2PProvider } from './p2p/p2p-provider';
import { MessageProvider } from './messaging/message-context';

// Core components - just what we need
import { LoginPage } from './auth/login-page';
import { TherapistDashboard } from './core/therapist-dashboard';
import { SecureChat } from './messaging/secure-chat';
import { SessionNote } from './notes/session-note';
import { SimpleScheduler } from './scheduling/simple-scheduler';
import { VideoSession } from './video/video-session';
import { MessagesList } from './messaging/messages-list';
import { NavigationBar } from './components/NavigationBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SecurityPage } from './pages/SecurityPage';

// Create a calming theme for mental health
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Calming purple
    },
    secondary: {
      main: '#48bb78', // Soft green
    },
    background: {
      default: '#f7fafc',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Don't redirect while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

/**
 * Main App Component
 * Focused ONLY on mental health therapy needs
 * No feature creep, no complexity
 */
export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
        <AuthProvider>
          <EncryptionProvider>
            <P2PProvider>
              <MessageProvider>
                <NavigationBar />
                <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes - just the essentials */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <TherapistDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MessagesList />
                  </ProtectedRoute>
                } />
                
                <Route path="/chat/:patientId" element={
                  <ProtectedRoute>
                    <SecureChat />
                  </ProtectedRoute>
                } />
                
                <Route path="/note/new" element={
                  <ProtectedRoute>
                    <SessionNote />
                  </ProtectedRoute>
                } />
                
                <Route path="/schedule" element={
                  <ProtectedRoute>
                    <SimpleScheduler />
                  </ProtectedRoute>
                } />
                
                <Route path="/video/:sessionId" element={
                  <ProtectedRoute>
                    <VideoSession />
                  </ProtectedRoute>
                } />
                
                <Route path="/security" element={
                  <ProtectedRoute>
                    <SecurityPage />
                  </ProtectedRoute>
                } />
                
                {/* Redirect all other routes to dashboard */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              </MessageProvider>
            </P2PProvider>
          </EncryptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

// What routes we're NOT adding:
// - /billing (not our problem)
// - /insurance (definitely not)
// - /reports (you won't use them)
// - /admin (too complex)
// - /integrations (we're standalone)
// - /analytics (focus on patients)
// - /marketing (not our business)
// Just therapy tools. Nothing else.