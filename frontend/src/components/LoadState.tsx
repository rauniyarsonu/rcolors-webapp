import type { ApiResult } from "@/lib/useApi";

/**
 * Placeholder while a page's data loads from the backend, or a retry prompt
 * if the request failed. Keeps the viewport filled so the footer doesn't jump.
 */
export default function LoadState({ result }: { result: ApiResult<unknown> }) {
  if (result.status !== "error") return <div aria-busy="true" className="min-h-screen" />;
  return (
    <div role="alert" className="site-container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-heading text-2xl font-bold text-brand-navy">We couldn&apos;t load this page.</p>
      <p className="text-gray-600">Please check your connection and try again.</p>
      <button
        type="button"
        onClick={result.retry}
        className="inline-flex min-h-11 items-center rounded bg-brand-sky px-6 font-bold text-white transition-colors hover:bg-brand-navy"
      >
        Try again
      </button>
    </div>
  );
}
