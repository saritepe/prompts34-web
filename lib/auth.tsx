'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Manual login only - don't restore session from localStorage
    setLoading(false);
  }, []);

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
      if (error instanceof Error && error.message !== 'Kayıt başarısız') {
        throw new Error('Bir hata oluştu, lütfen tekrar deneyin');
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
          'Authorization': `Bearer ${newToken}`,
        },
      });

      if (!meResponse.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const userData = await meResponse.json();

      setToken(newToken);
      setUser({
        email: userData.email,
        username: userData.username,
        id: userData.id
      });
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        username: userData.username,
        id: userData.id
      }));
    } catch (error) {
      if (error instanceof Error && error.message !== 'Giriş başarısız') {
        throw new Error('Bir hata oluştu, lütfen tekrar deneyin');
      }
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signUp, signOut, loading }}>
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
