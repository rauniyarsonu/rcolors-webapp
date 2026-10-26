import { useSyncExternalStore } from "react";
import { apiUrl } from "../api";

/**
 * The admin session: a bearer token from POST /api/admin/auth/login, kept in
 * sessionStorage (gone when the tab closes, never shared with other tabs or
 * stored long-term). Reusable by any future admin area (CMS etc.).
 */
export interface AdminSession {
  token: string;
  username: string;
  /** ISO instant */
  expiresAt: string;
}

const KEY = "rcolors.admin.session";
const listeners = new Set<() => void>();
let current: AdminSession | null | undefined;

function read(): AdminSession | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    return Date.parse(session.expiresAt) > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function write(session: AdminSession | null) {
  current = session;
  try {
    if (session) window.sessionStorage.setItem(KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked (private mode): the session lasts until reload
  }
  listeners.forEach((fn) => fn());
}

export function getSession(): AdminSession | null {
  if (current === undefined) current = read();
  if (current && Date.parse(current.expiresAt) <= Date.now()) write(null);
  return current;
}

export const getToken = () => getSession()?.token ?? null;

export class LoginError extends Error {}

export async function login(username: string, password: string): Promise<AdminSession> {
  let res: Response;
  try {
    res = await fetch(apiUrl("/api/admin/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new LoginError("Couldn't reach the server. Check your connection and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as { token?: string; expiresAt?: string; errors?: Record<string, string> };
  if (!res.ok || !data.token || !data.expiresAt) {
    throw new LoginError(data.errors?.login ?? `Sign-in failed (${res.status}). Please try again.`);
  }
  const session = { token: data.token, username: username.trim(), expiresAt: data.expiresAt };
  write(session);
  return session;
}

export function logout() {
  write(null);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The current session (null when signed out); re-renders on login, logout and expiry */
export function useAdminSession(): AdminSession | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}
