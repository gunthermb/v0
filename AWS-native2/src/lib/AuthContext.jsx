import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  ctoCurrentUser,
  ctoTokenValid,
  ctoSignOut,
  ctoHandleOAuthRedirect,
} from '@/lib/aws-native';

const AuthContext = createContext();

// Where "/login" lives, honoring the Vite base path (e.g. "/new/login").
const APP_BASE = (import.meta.env.BASE_URL || '/').replace(/\/*$/, '/');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  // Kept for API compatibility with the old Base44 context shape (App.jsx reads it).
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAppState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = () => {
    const u = ctoCurrentUser();
    setUser(u);
    setIsAuthenticated(!!u);
    return u;
  };

  const checkAppState = async () => {
    let cameFromOAuth = false;
    try {
      // Finish a Google / Hosted-UI redirect if we came back with ?code=…
      cameFromOAuth = await ctoHandleOAuthRedirect().catch(() => false);
    } finally {
      loadUser();
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
      setAuthChecked(true);
      // After a successful Google sign-in, land on the app (job board) rather
      // than the marketing home the OAuth callback returns to.
      if (cameFromOAuth) window.location.replace(APP_BASE + 'jobs');
    }
  };

  // Re-read auth state from the stored token (e.g. after sign-in on the same page).
  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    const u = loadUser();
    setIsLoadingAuth(false);
    setAuthChecked(true);
    return u;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    ctoSignOut();
  };

  const navigateToLogin = () => {
    window.location.href = APP_BASE + 'login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      authChecked,
      isTokenValid: ctoTokenValid,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
