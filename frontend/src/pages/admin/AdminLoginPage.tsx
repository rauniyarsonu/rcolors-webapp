import { useId, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircleAlert, LoaderCircle, LogIn } from "lucide-react";
import { useNoIndex } from "@/components/admin/useNoIndex";
import { inputClass, labelClass } from "@/components/careers/formStyles";
import { LoginError, login, useAdminSession } from "@/lib/admin/auth";
import { useSearchParams } from "@/lib/navigation";

/** Only same-site admin paths, so ?next= can't send the admin somewhere else */
const safeNext = (next: string | null) => (next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");

export default function AdminLoginPage() {
  useNoIndex("Sign in");
  const uid = useId();
  const session = useAdminSession();
  const navigate = useNavigate();
  const next = safeNext(useSearchParams().get("next"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  if (session && !sending) return <Navigate to={next} replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await login(username, password);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof LoginError ? err.message : "Sign-in failed. Please try again.");
      setPassword("");
      setSending(false);
    }
  };

  return (
    <main id="main-content" className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center font-heading text-2xl font-black text-brand-navy">
          <span className="text-brand-red">R</span> Colors <span className="text-es-accent-strong">Admin</span>
        </p>
        <form noValidate onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
          <h1 className="font-heading text-xl font-bold text-brand-navy">Sign in</h1>
          <div>
            <label htmlFor={`${uid}-user`} className={labelClass}>
              Username
            </label>
            <input
              id={`${uid}-user`}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass(false)}
              required
            />
          </div>
          <div>
            <label htmlFor={`${uid}-pass`} className={labelClass}>
              Password
            </label>
            <input
              id={`${uid}-pass`}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass(false)}
              required
            />
          </div>
          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-es-accent-strong px-6 font-bold text-white transition-colors hover:bg-brand-navy disabled:cursor-wait disabled:opacity-80"
          >
            {sending ? <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
            {sending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
