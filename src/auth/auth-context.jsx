import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimpleAuth } from './simple-auth';

const AuthContext = createContext();
const authService = new SimpleAuth();

/**
 * Auth Context Provider
 * Manages authentication state for the entire app
 * Simple session-based auth, no complex token management
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();
    setLoading(false);
  }, []);

  const checkSession = () => {
    // For demo, check localStorage
    const authData = localStorage.getItem('haven_auth');
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        setUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('haven_auth');
      }
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      // Store auth data for demo
      localStorage.setItem('haven_auth', JSON.stringify({
        user: result.user,
        sessionId: result.sessionId
      }));
      
      // Update state
      setUser(result.user);
      setIsAuthenticated(true);
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await authService.register(email, password, name);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('haven_auth');
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}