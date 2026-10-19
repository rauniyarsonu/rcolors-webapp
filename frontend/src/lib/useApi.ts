import { useEffect, useState } from "react";
import { getJson, NotFoundError } from "./api";

export type ApiResult<T> =
  | { status: "loading"; data?: undefined }
  | { status: "ok"; data: T }
  | { status: "not-found"; data?: undefined }
  | { status: "error"; data?: undefined; retry: () => void };

// One request per path for the session, so moving between pages doesn't refetch
const cache = new Map<string, Promise<unknown>>();
const settled = new Map<string, ApiResult<unknown>>();

function load<T>(path: string): Promise<T> {
  let p = cache.get(path) as Promise<T> | undefined;
  if (!p) {
    p = getJson<T>(path);
    cache.set(path, p);
  }
  return p;
}

/** GET a backend path; `null` waits (for a path that depends on another request) */
export function useApi<T>(path: string | null): ApiResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<ApiResult<T>>(() => (path && (settled.get(path) as ApiResult<T>)) || { status: "loading" });

  useEffect(() => {
    if (!path) return setResult({ status: "loading" });
    const done = settled.get(path) as ApiResult<T> | undefined;
    if (done?.status === "ok" || done?.status === "not-found") return setResult(done);
    let live = true;
    setResult({ status: "loading" });
    load<T>(path).then(
      (data) => {
        const ok: ApiResult<T> = { status: "ok", data };
        settled.set(path, ok);
        if (live) setResult(ok);
      },
      (e) => {
        cache.delete(path);
        const failed: ApiResult<T> =
          e instanceof NotFoundError ? { status: "not-found" } : { status: "error", retry: () => setAttempt((n) => n + 1) };
        if (failed.status === "not-found") settled.set(path, failed);
        if (live) setResult(failed);
      },
    );
    return () => {
      live = false;
    };
  }, [path, attempt]);

  return result;
}
