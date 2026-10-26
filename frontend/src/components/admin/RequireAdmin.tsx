import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AdminApiError, adminApi } from "@/lib/admin/adminApi";
import { logout, useAdminSession } from "@/lib/admin/auth";
import { ErrorNotice, Loading } from "./ui";

/**
 * Admin route guard: no session → /admin/login?next=<this page>. With a session
 * it checks the token once with GET /api/admin/auth/me, and signs out when the
 * token expires (or any admin request gets a 401).
 */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const session = useAdminSession();
  const location = useLocation();
  const [check, setCheck] = useState<"pending" | "ok" | AdminApiError>("pending");
  const [attempt, setAttempt] = useState(0);
  const token = session?.token;
  const expiresAt = session?.expiresAt;

  useEffect(() => {
    if (!token) return;
    let live = true;
    setCheck("pending");
    adminApi.get("/api/admin/auth/me").then(
      () => live && setCheck("ok"),
      (e: AdminApiError) => live && e.status !== 401 && setCheck(e),
    );
    return () => {
      live = false;
    };
  }, [token, attempt]);

  useEffect(() => {
    if (!expiresAt) return;
    const ms = Date.parse(expiresAt) - Date.now();
    // setTimeout overflows past ~24 days; tokens last 8 hours
    const timer = setTimeout(logout, Math.max(0, Math.min(ms, 2 ** 31 - 1)));
    return () => clearTimeout(timer);
  }, [expiresAt]);

  if (!session) {
    const next = location.pathname + location.search;
    return <Navigate to={`/admin/login?next=${encodeURIComponent(next)}`} replace />;
  }
  if (check === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Checking your session…" />
      </div>
    );
  }
  if (check !== "ok") {
    return (
      <div className="mx-auto max-w-md p-6 pt-24">
        <ErrorNotice error={check} onRetry={() => setAttempt((n) => n + 1)} />
      </div>
    );
  }
  return <>{children}</>;
}
