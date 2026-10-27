import { apiUrl } from "../api";
import { getToken, logout } from "./auth";

/**
 * Fetch wrapper for /api/admin: adds the bearer token, never caches (admin views
 * must always be fresh, so not useApi), and turns {"errors": {...}} bodies into
 * AdminApiError. A 401 signs out; RequireAdmin then sends the admin to
 * /admin/login?next=<current page>.
 */
export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly errors: Record<string, string> = {},
  ) {
    super(Object.values(errors)[0] ?? `Request failed (${status})`);
  }
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", headers.get("Accept") ?? "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body !== undefined && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(apiUrl(path), { ...init, headers, cache: "no-store" });
  } catch {
    throw new AdminApiError(0, { network: "Couldn't reach the server. Check your connection and try again." });
  }
  if (res.status === 401) {
    logout();
    throw new AdminApiError(401, { auth: "Your session has ended. Please sign in again." });
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { errors?: Record<string, string> };
    throw new AdminApiError(res.status, data.errors ?? {});
  }
  return res;
}

const json = async <T>(res: Response): Promise<T> => (res.status === 204 ? (undefined as T) : ((await res.json()) as T));

export const adminApi = {
  get: <T>(path: string) => request(path).then((r) => json<T>(r)),
  post: <T>(path: string, body?: unknown) =>
    request(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }).then((r) => json<T>(r)),
  put: <T>(path: string, body: unknown) => request(path, { method: "PUT", body: JSON.stringify(body) }).then((r) => json<T>(r)),
  patch: <T>(path: string, body: unknown) => request(path, { method: "PATCH", body: JSON.stringify(body) }).then((r) => json<T>(r)),
  delete: (path: string) => request(path, { method: "DELETE" }).then(() => undefined),

  /** Downloads a file with the token (a plain link can't send it) and saves it under the server's filename */
  async download(path: string, fallbackName: string) {
    const res = await request(path, { headers: { Accept: "*/*" } });
    const blob = await res.blob();
    const name = filenameFrom(res.headers.get("Content-Disposition")) ?? fallbackName;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

/** attachment; filename="a.pdf"; filename*=UTF-8''a.pdf */
export function filenameFrom(disposition: string | null): string | null {
  if (!disposition) return null;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (star) {
    try {
      return decodeURIComponent(star[1]);
    } catch {
      // fall through to the plain filename
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  return plain ? plain[1] : null;
}
