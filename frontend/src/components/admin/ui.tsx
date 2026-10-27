import { ChevronLeft, ChevronRight, CircleAlert, LoaderCircle } from "lucide-react";
import { APPLICATION_STATUS_LABELS, JOB_STATUS_LABELS } from "@/config/careers";
import type { AdminApiError } from "@/lib/admin/adminApi";
import type { ApplicationStatus, JobStatus } from "@/lib/careers/types";

/** Small building blocks shared by the admin pages */

export const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm";
export const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-es-accent-strong px-5 font-bold text-white transition-colors hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60";
export const smallInputClass =
  "min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900 outline-none transition-colors hover:border-gray-400 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky sm:text-sm";

export function AdminPageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-heading text-2xl font-black text-brand-navy sm:text-3xl">{title}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

const jobStatusClass: Record<JobStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  OPEN: "bg-emerald-50 text-emerald-800",
  CLOSED: "bg-amber-50 text-amber-800",
  ARCHIVED: "bg-gray-200 text-gray-600",
};

const applicationStatusClass: Record<ApplicationStatus, string> = {
  NEW: "bg-sky-100 text-sky-900",
  REVIEWED: "bg-gray-100 text-gray-700",
  SHORTLISTED: "bg-indigo-50 text-indigo-800",
  INTERVIEW: "bg-violet-50 text-violet-800",
  OFFERED: "bg-amber-50 text-amber-800",
  HIRED: "bg-emerald-50 text-emerald-800",
  REJECTED: "bg-red-50 text-red-800",
};

const badge = "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold";

export function JobStatusBadge({ status, expired = false }: { status: JobStatus; expired?: boolean }) {
  // An OPEN job past its deadline is closed publicly; say so
  if (status === "OPEN" && expired) return <span className={`${badge} ${jobStatusClass.CLOSED}`}>Expired</span>;
  return <span className={`${badge} ${jobStatusClass[status]}`}>{JOB_STATUS_LABELS[status]}</span>;
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`${badge} ${applicationStatusClass[status]}`}>{APPLICATION_STATUS_LABELS[status]}</span>;
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 py-10 text-gray-500">
      <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorNotice({ error, onRetry }: { error: AdminApiError | string; onRetry?: () => void }) {
  const message = typeof error === "string" ? error : error.message;
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <CircleAlert size={18} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function Pagination({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (page: number) => void }) {
  if (totalPages <= 1) return <p className="mt-4 text-sm text-gray-500">{total} total</p>;
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
      <span>
        Page {page + 1} of {totalPages} · {total} total
      </span>
      <div className="flex gap-2">
        <button type="button" className={secondaryButtonClass} disabled={page <= 0} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={16} aria-hidden="true" /> Previous
        </button>
        <button type="button" className={secondaryButtonClass} disabled={page + 1 >= totalPages} onClick={() => onPage(page + 1)}>
          Next <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

/** "26 Oct 2026" */
export const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

/** "26 Oct 2026, 3:40 pm" */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
