"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

import { login as loginRequest } from "@/lib/api/auth";
import {
  clearAuthSession,
  getAuthSession,
  getAuthSessionForServer,
  persistAuthSession,
  subscribeToAuth,
} from "@/lib/auth/session";
import type { AuthSession, LoginCredentials } from "@/types/auth";

interface AuthContextValue {
  session: AuthSession | null;
  signIn: (credentials: LoginCredentials) => Promise<AuthSession>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = useSyncExternalStore(
    subscribeToAuth,
    getAuthSession,
    getAuthSessionForServer,
  );

  async function signIn(credentials: LoginCredentials) {
    const nextSession = await loginRequest(credentials);
    persistAuthSession(nextSession);
    return nextSession;
  }

  function signOut() {
    clearAuthSession();
  }

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
