import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDebounced } from "@/components/estate/useQueryState";
import { useNoIndex } from "@/components/admin/useNoIndex";
import {
  AdminPageTitle,
  ErrorNotice,
  JobStatusBadge,
  Loading,
  Pagination,
  cardClass,
  formatDate,
  primaryButtonClass,
  smallInputClass,
} from "@/components/admin/ui";
import { JOB_STATUS_LABELS } from "@/config/careers";
import { AdminApiError, adminApi } from "@/lib/admin/adminApi";
import { useAdminData } from "@/lib/admin/useAdminData";
import { JOB_STATUSES, type AdminJob, type JobStatus, type Page } from "@/lib/careers/types";
import { useRouter, useSearchParams } from "@/lib/navigation";

type Action = "publish" | "close" | "reopen" | "archive" | "duplicate" | "delete";

const actionLabels: Record<Action, string> = {
  publish: "Publish",
  close: "Close",
  reopen: "Reopen",
  archive: "Archive",
  duplicate: "Duplicate",
  delete: "Delete",
};

/** What each action asks before it runs; publish/reopen/duplicate don't need a confirm */
const confirms: Partial<Record<Action, { title: string; text: string; danger?: boolean }>> = {
  close: { title: "Close this job?", text: "It stops taking applications. Its page stays up and says it's closed. You can reopen it later." },
  archive: { title: "Archive this job?", text: "It disappears from the careers page, including its link. Applications are kept." },
  delete: { title: "Delete this draft?", text: "This removes the draft for good. It can't be undone.", danger: true },
};

const isExpired = (job: AdminJob) => job.status === "OPEN" && !job.acceptingApplications;

/** Actions that make sense for a job's current state */
function actionsFor(job: AdminJob): Action[] {
  const out: Action[] = [];
  if (job.status === "DRAFT") out.push("publish");
  if (job.status === "OPEN") out.push("close");
  if (job.status === "CLOSED" || job.status === "ARCHIVED") out.push("reopen");
  out.push("duplicate");
  if (job.status !== "ARCHIVED") out.push("archive");
  if (job.status === "DRAFT" && job.applicationCount === 0) out.push("delete");
  return out;
}

export default function AdminJobsPage() {
  useNoIndex("Jobs");
  const params = useSearchParams();
  const router = useRouter();
  const navigate = useNavigate();
  const status = (JOB_STATUSES as readonly string[]).includes(params.get("status") ?? "") ? (params.get("status") as JobStatus) : undefined;
  const q = params.get("q") ?? "";
  const page = Math.max(0, Number(params.get("page")) || 0);

  const apiParams = new URLSearchParams({ page: String(page), size: "20" });
  if (status) apiParams.set("status", status);
  if (q) apiParams.set("q", q);
  const jobs = useAdminData<Page<AdminJob>>(`/api/admin/jobs?${apiParams}`);

  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  const [pending, setPending] = useState<{ job: AdminJob; action: Action } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setFilters = (next: { status?: string; q?: string; page?: number }, replace = false) => {
    const p = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    const query = "q" in next ? next.q : q;
    if (s) p.set("status", s);
    if (query) p.set("q", query);
    if (next.page) p.set("page", String(next.page));
    const href = p.toString() ? `/admin/jobs?${p}` : "/admin/jobs";
    if (replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };
  const pushText = useDebounced((value: string) => setFilters({ q: value.trim() }, true), 350);

  const run = async (job: AdminJob, action: Action) => {
    setBusy(true);
    setError(null);
    try {
      if (action === "duplicate") {
        const copy = await adminApi.post<AdminJob>(`/api/admin/jobs/${job.id}/duplicate`);
        navigate(`/admin/jobs/${copy.id}/edit`, { state: { notice: "Copied as a new draft." } });
        return;
      }
      if (action === "delete") {
        await adminApi.delete(`/api/admin/jobs/${job.id}`);
        setNotice(`Deleted "${job.title}".`);
      } else {
        const next: JobStatus = action === "publish" || action === "reopen" ? "OPEN" : action === "close" ? "CLOSED" : "ARCHIVED";
        await adminApi.patch(`/api/admin/jobs/${job.id}/status`, { status: next });
        setNotice(`"${job.title}" is now ${JOB_STATUS_LABELS[next].toLowerCase()}.`);
      }
      jobs.reload();
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  const request = (job: AdminJob, action: Action) => {
    setNotice(null);
    if (confirms[action]) setPending({ job, action });
    else void run(job, action);
  };

  const actionButtons = (job: AdminJob) => (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      <Link to={`/admin/jobs/${job.id}/edit`} className="inline-flex min-h-9 items-center font-semibold text-es-accent-strong hover:underline">
        Edit
      </Link>
      <Link to={`/admin/applications?jobId=${job.id}`} className="inline-flex min-h-9 items-center font-semibold text-es-accent-strong hover:underline">
        Applications
      </Link>
      {actionsFor(job).map((action) => (
        <button
          key={action}
          type="button"
          disabled={busy}
          onClick={() => request(job, action)}
          className={`inline-flex min-h-9 items-center font-semibold hover:underline disabled:opacity-50 ${
            action === "delete" ? "text-red-700" : "text-gray-700"
          }`}
        >
          {actionLabels[action]}
          <span className="sr-only"> {job.title}</span>
        </button>
      ))}
    </div>
  );

  const confirm = pending ? confirms[pending.action] : undefined;

  return (
    <>
      <AdminPageTitle title="Jobs">
        <Link to="/admin/jobs/new" className={primaryButtonClass}>
          <Plus size={18} aria-hidden="true" /> New job
        </Link>
      </AdminPageTitle>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="jobs-q" className="sr-only">
            Search jobs
          </label>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="jobs-q"
            type="search"
            value={text}
            placeholder="Search title, department or location"
            onChange={(e) => {
              setText(e.target.value);
              pushText(e.target.value);
            }}
            className={`${smallInputClass} w-full pl-9`}
          />
        </div>
        <label htmlFor="jobs-status" className="sr-only">
          Status
        </label>
        <select id="jobs-status" value={status ?? ""} onChange={(e) => setFilters({ status: e.target.value, page: 0 })} className={smallInputClass}>
          <option value="">All statuses</option>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {JOB_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div aria-live="polite">
        {notice && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      </div>
      {error && (
        <div className="mb-4">
          <ErrorNotice error={error} />
        </div>
      )}
      {jobs.status === "error" && <ErrorNotice error={jobs.error} onRetry={jobs.reload} />}
      {!jobs.data && jobs.status === "loading" && <Loading />}

      {jobs.data && jobs.data.items.length === 0 && (
        <div className={`${cardClass} px-5 py-12 text-center text-gray-500`}>
          {status || q ? "No jobs match these filters." : "No jobs yet. Post your first one."}
        </div>
      )}

      {jobs.data && jobs.data.items.length > 0 && (
        <>
          {/* Table from md */}
          <div className={`${cardClass} hidden overflow-x-auto md:block`}>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Job</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Applications</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Posted</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Deadline</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.data.items.map((job) => (
                  <tr key={job.id} className="align-top">
                    <td className="max-w-xs px-4 py-3">
                      <Link to={`/admin/jobs/${job.id}/edit`} className="font-semibold text-brand-navy hover:underline">
                        {job.title}
                      </Link>
                      <p className="text-gray-500">
                        {job.location}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <JobStatusBadge status={job.status} expired={isExpired(job)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link to={`/admin/applications?jobId=${job.id}`} className="hover:underline">
                        <span className="font-semibold text-brand-navy">{job.applicationCount}</span>
                        {job.newApplicationCount > 0 && <span className="ml-1 text-sky-800">({job.newApplicationCount} new)</span>}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(job.publishedAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{job.applicationDeadline ? formatDate(job.applicationDeadline) : "—"}</td>
                    <td className="min-w-[14rem] px-4 py-2">{actionButtons(job)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards below md */}
          <ul className="space-y-3 md:hidden">
            {jobs.data.items.map((job) => (
              <li key={job.id} className={`${cardClass} p-4`}>
                <div className="mb-1 flex items-start justify-between gap-3">
                  <Link to={`/admin/jobs/${job.id}/edit`} className="min-w-0 font-semibold text-brand-navy hover:underline">
                    {job.title}
                  </Link>
                  <JobStatusBadge status={job.status} expired={isExpired(job)} />
                </div>
                <p className="text-sm text-gray-500">
                  {job.location}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {job.applicationCount} {job.applicationCount === 1 ? "application" : "applications"}{job.newApplicationCount > 0 ? ` (${job.newApplicationCount} new)` : ""} · Posted {formatDate(job.publishedAt)}
                  {job.applicationDeadline ? ` · Deadline ${formatDate(job.applicationDeadline)}` : ""}
                </p>
                <div className="mt-2 border-t border-gray-100 pt-2">{actionButtons(job)}</div>
              </li>
            ))}
          </ul>

          <Pagination page={jobs.data.page} totalPages={jobs.data.totalPages} total={jobs.data.total} onPage={(p) => setFilters({ page: p })} />
        </>
      )}

      <ConfirmDialog
        open={!!pending}
        title={confirm?.title ?? ""}
        confirmLabel={pending ? actionLabels[pending.action] : ""}
        danger={confirm?.danger}
        busy={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && void run(pending.job, pending.action)}
      >
        <p>
          <strong className="font-semibold text-gray-800">{pending?.job.title}</strong>
        </p>
        <p className="mt-1">{confirm?.text}</p>
      </ConfirmDialog>
    </>
  );
}
