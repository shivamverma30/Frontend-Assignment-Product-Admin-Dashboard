import { STORAGE_KEYS } from "@/lib/constants";
import type { AuthSession } from "@/types/auth";

export const AUTH_CHANGE_EVENT = "product-admin:auth-change";
export const UNAUTHORIZED_EVENT = "product-admin:unauthorized";

let sessionSnapshot: AuthSession | null = null;
let hasHydrated = false;

function readStoredSession() {
  if (typeof window === "undefined") return null;

  const storedSession = window.localStorage.getItem(STORAGE_KEYS.authSession);
  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.authSession);
    return null;
  }
}

function hydrateSession() {
  if (!hasHydrated && typeof window !== "undefined") {
    sessionSnapshot = readStoredSession();
    hasHydrated = true;
  }
}

export function getAuthSession() {
  hydrateSession();
  return sessionSnapshot;
}

export function getAuthSessionForServer() {
  return null;
}

export function getAuthHydration() {
  hydrateSession();
  return hasHydrated;
}

export function getAuthHydrationForServer() {
  return false;
}

export function getAuthToken() {
  return getAuthSession()?.accessToken ?? null;
}

export function subscribeToAuth(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  function handleAuthChange() {
    sessionSnapshot = readStoredSession();
    hasHydrated = true;
    onChange();
  }

  window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  window.addEventListener(UNAUTHORIZED_EVENT, handleAuthChange);
  window.addEventListener("storage", handleAuthChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.removeEventListener(UNAUTHORIZED_EVENT, handleAuthChange);
    window.removeEventListener("storage", handleAuthChange);
  };
}

export function persistAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;

  sessionSnapshot = session;
  hasHydrated = true;
  window.localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  sessionSnapshot = null;
  hasHydrated = true;
  window.localStorage.removeItem(STORAGE_KEYS.authSession);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function notifyUnauthorized() {
  if (typeof window === "undefined") return;

  sessionSnapshot = null;
  hasHydrated = true;
  window.localStorage.removeItem(STORAGE_KEYS.authSession);
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}
