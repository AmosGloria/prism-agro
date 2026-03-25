'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'farmer' | 'logistics' | 'admin';
  walletBalance: number;
  avatar?: string;
  ninVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for dev/hackathon — swap with real auth
const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'buyer@farm.ng': { id: 'b1', name: 'Chukwuemeka Obi', email: 'buyer@farm.ng', role: 'buyer', walletBalance: 45000, ninVerified: true, password: 'demo' },
  'farmer@farm.ng': { id: 'f1', name: 'Emeka Farms', email: 'farmer@farm.ng', role: 'farmer', walletBalance: 28500, ninVerified: true, password: 'demo' },
  'logistics@farm.ng': { id: 'l1', name: 'Yemi FastTrack', email: 'logistics@farm.ng', role: 'logistics', walletBalance: 12800, ninVerified: true, password: 'demo' },
  'admin@farm.ng': { id: 'a1', name: 'Super Admin', email: 'admin@farm.ng', role: 'admin', walletBalance: 0, ninVerified: true, password: 'demo' },
};

const ROLE_HOME: Record<string, string> = {
  buyer: '/buyer/marketplace',
  farmer: '/farmer/dashboard',
  logistics: '/logistics/loads',
  admin: '/admin/disputes',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pa_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Try real API first, fallback to mock
    try {
      const res = await authApi.login({ email, password }) as any;
      const u = res.user ?? res;
      localStorage.setItem('pa_token', res.token ?? '');
      localStorage.setItem('pa_user', JSON.stringify(u));
      setUser(u);
      router.push(ROLE_HOME[u.role] ?? '/');
    } catch {
      // Dev fallback
      const mock = MOCK_USERS[email.toLowerCase()];
      if (!mock || mock.password !== password) throw new Error('Invalid credentials');
      const { password: _, ...u } = mock;
      localStorage.setItem('pa_user', JSON.stringify(u));
      setUser(u);
      router.push(ROLE_HOME[u.role]);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('pa_token');
    localStorage.removeItem('pa_user');
    setUser(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const u = await authApi.me() as AuthUser;
      setUser(u);
      localStorage.setItem('pa_user', JSON.stringify(u));
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLE_HOME };