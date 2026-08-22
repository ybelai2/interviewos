import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  signIn: (email: string, name?: string) => void;
  signUp: (email: string, name: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock auth — stores user in memory. Real auth (Supabase) can replace this later.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('ios-user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('ios-user', JSON.stringify(u));
    else localStorage.removeItem('ios-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: (email, name) =>
          persist({
            id: crypto.randomUUID(),
            email,
            name: name ?? email.split('@')[0],
            plan: 'pro',
            createdAt: new Date().toISOString(),
          }),
        signUp: (email, name) =>
          persist({
            id: crypto.randomUUID(),
            email,
            name,
            plan: 'free',
            createdAt: new Date().toISOString(),
          }),
        signOut: () => persist(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
