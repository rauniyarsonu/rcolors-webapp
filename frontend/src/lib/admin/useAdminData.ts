import { useCallback, useEffect, useState } from "react";
import { AdminApiError, adminApi } from "./adminApi";

export type AdminData<T> =
  | { status: "loading"; data?: T; error?: undefined }
  | { status: "ok"; data: T; error?: undefined }
  | { status: "error"; data?: T; error: AdminApiError };

/**
 * GET an admin path, fresh every time it mounts or the path changes (no cache).
 * Keeps the previous data while reloading so tables don't flash empty.
 */
export function useAdminData<T>(path: string | null) {
  const [state, setState] = useState<AdminData<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return;
    let live = true;
    setState((prev) => ({ status: "loading", data: prev.data }));
    adminApi.get<T>(path).then(
      (data) => live && setState({ status: "ok", data }),
      (error: AdminApiError) => live && setState((prev) => ({ status: "error", data: prev.data, error })),
    );
    return () => {
      live = false;
    };
  }, [path, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  /** Replace the data after a mutation that returned the new value */
  const set = useCallback((data: T) => setState({ status: "ok", data }), []);
  return { ...state, reload, set };
}
