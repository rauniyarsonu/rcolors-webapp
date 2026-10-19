/**
 * Spring Boot backend access. In development Vite proxies /api to the backend
 * (vite.config.ts); set VITE_API_BASE_URL when the API lives on another origin.
 */
const API_BASE = (import.meta.env?.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE}${path}`;

export class NotFoundError extends Error {}

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { headers: { Accept: "application/json" } });
  if (res.status === 404) throw new NotFoundError(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}
