"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

import { login as loginRequest } from "@/lib/api/auth";
import {
  clearAuthSession,
  getAuthHydration,
  getAuthHydrationForServer,
  getAuthSession,
  getAuthSessionForServer,
  persistAuthSession,
  subscribeToAuth,
} from "@/lib/auth/session";
import type { AuthSession, LoginCredentials } from "@/types/auth";

interface AuthContextValue {
  isHydrated: boolean;
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
  const isHydrated = useSyncExternalStore(
    subscribeToAuth,
    getAuthHydration,
    getAuthHydrationForServer,
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
    <AuthContext.Provider value={{ isHydrated, session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
