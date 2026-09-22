import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await authService.getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const current = await authService.getCurrentUser();
      if (mounted) {
        setUser(current);
        setLoading(false);
      }
    })();

    // Keep user state in sync with Supabase auth events (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
        return;
      }
      const current = await authService.getCurrentUser();
      setUser(current);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    role: user?.role || null,
    refreshUser,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}