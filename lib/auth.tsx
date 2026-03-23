'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  email: string;
  username: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour
const SESSION_EXPIRES_KEY = 'session_expires_at';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setSessionExpiresAt(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(SESSION_EXPIRES_KEY);
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedExpiry = localStorage.getItem(SESSION_EXPIRES_KEY);

      if (!storedToken || !storedUser || !storedExpiry) {
        clearSession();
        setLoading(false);
        return;
      }

      const expiry = Number(storedExpiry);
      if (!Number.isFinite(expiry) || Date.now() >= expiry) {
        clearSession();
        setLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setSessionExpiresAt(expiry);
    } catch {
      clearSession();
    }

    setLoading(false);
  }, [clearSession]);

  useEffect(() => {
    if (!token || !sessionExpiresAt) return;

    const timeoutId = window.setTimeout(
      () => {
        clearSession();
      },
      Math.max(0, sessionExpiresAt - Date.now()),
    );

    return () => window.clearTimeout(timeoutId);
  }, [token, sessionExpiresAt, clearSession]);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Kayıt başarısız');
      }

      // Don't auto-login after signup - user needs to verify email first
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Sunucuya bağlanılamadı, lütfen daha sonra tekrar deneyin',
        );
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Giriş başarısız');
      }

      const data = await response.json();
      const newToken = data.access_token || data.token;

      // Fetch user profile from /auth/me
      const meResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (!meResponse.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const userData = await meResponse.json();
      const currentUser = userData?.user ?? userData;

      setToken(newToken);
      setUser({
        email: currentUser.email,
        username:
          currentUser.user_metadata?.username ||
          currentUser.username ||
          currentUser.email,
        id: currentUser.id,
      });
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      setSessionExpiresAt(expiresAt);
      localStorage.setItem('token', newToken);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: currentUser.email,
          username:
            currentUser.user_metadata?.username ||
            currentUser.username ||
            currentUser.email,
          id: currentUser.id,
        }),
      );
      localStorage.setItem(SESSION_EXPIRES_KEY, String(expiresAt));
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Sunucuya bağlanılamadı, lütfen daha sonra tekrar deneyin',
        );
      }
      throw error;
    }
  };

  const signOut = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signUp, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
