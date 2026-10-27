import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Download, LoaderCircle, Search } from "lucide-react";
import { useDebounced } from "@/components/estate/useQueryState";
import { useNoIndex } from "@/components/admin/useNoIndex";
import { AdminPageTitle, ErrorNotice, Loading, Pagination, cardClass, formatDate, secondaryButtonClass, smallInputClass } from "@/components/admin/ui";
import { APPLICATION_STATUS_LABELS } from "@/config/careers";
import { AdminApiError, adminApi } from "@/lib/admin/adminApi";
import { useAdminData } from "@/lib/admin/useAdminData";
import { APPLICATION_STATUSES, type AdminJob, type ApplicationRow, type ApplicationStatus, type Page } from "@/lib/careers/types";
import { useRouter, useSearchParams } from "@/lib/navigation";

const FILTER_KEYS = ["jobId", "status", "q", "from", "to", "sort"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];
type Filters = Partial<Record<FilterKey, string>>;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Filters live in the URL (?jobId=&status=&q=&from=&to=&sort=&page=), so Back from a detail page keeps them */
function readFilters(params: URLSearchParams): Filters {
  const f: Filters = {};
  const jobId = params.get("jobId");
  if (jobId && (jobId === "general" || /^\d+$/.test(jobId))) f.jobId = jobId;
  const status = params.get("status");
  if (status && (APPLICATION_STATUSES as readonly string[]).includes(status)) f.status = status;
  const q = params.get("q")?.trim();
  if (q) f.q = q;
  for (const key of ["from", "to"] as const) {
    const v = params.get(key);
    if (v && DATE.test(v)) f[key] = v;
  }
  if (params.get("sort") === "oldest") f.sort = "oldest";
  return f;
}

const toParams = (f: Filters, extra: Record<string, string> = {}) => {
  const p = new URLSearchParams();
  for (const key of FILTER_KEYS) if (f[key]) p.set(key, f[key]!);
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return p;
};

export default function AdminApplicationsPage() {
  useNoIndex("Applications");
  const params = useSearchParams();
  const router = useRouter();
  const filters = readFilters(params);
  const page = Math.max(0, Number(params.get("page")) || 0);
  const list = useAdminData<Page<ApplicationRow>>(`/api/admin/applications?${toParams(filters, { page: String(page), size: "20" })}`);
  const jobs = useAdminData<Page<AdminJob>>("/api/admin/jobs?size=100");

  const [text, setText] = useState(filters.q ?? "");
  useEffect(() => setText(filters.q ?? ""), [filters.q]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Rows whose status was just changed from the dropdown (optimistic) */
  const [overrides, setOverrides] = useState<Record<number, ApplicationStatus>>({});

  const setFilters = (next: Filters, { replace = false, keepPage = false } = {}) => {
    const p = toParams(next, keepPage && page ? { page: String(page) } : {});
    const href = p.toString() ? `/admin/applications?${p}` : "/admin/applications";
    if (replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };
  const change = (key: FilterKey, value: string) => setFilters({ ...filters, [key]: value || undefined });
  const pushText = useDebounced((value: string) => setFilters({ ...filters, q: value.trim() || undefined }, { replace: true }), 350);

  const setStatus = async (row: ApplicationRow, status: ApplicationStatus) => {
    setError(null);
    setOverrides((o) => ({ ...o, [row.id]: status }));
    try {
      await adminApi.patch(`/api/admin/applications/${row.id}`, { status });
    } catch (e) {
      setOverrides((o) => {
        const { [row.id]: _dropped, ...rest } = o;
        return rest;
      });
      setError(e instanceof AdminApiError ? e.message : "Couldn't change the status.");
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    setError(null);
    try {
      const p = toParams({ ...filters, sort: undefined });
      await adminApi.download(`/api/admin/applications/export.csv${p.toString() ? `?${p}` : ""}`, "applications.csv");
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Couldn't export.");
    } finally {
      setExporting(false);
    }
  };

  const statusOf = (row: ApplicationRow) => overrides[row.id] ?? row.status;
  const oldest = filters.sort === "oldest";

  const statusSelect = (row: ApplicationRow) => (
    <>
      <label htmlFor={`status-${row.id}`} className="sr-only">
        Status for {row.name}
      </label>
      <select
        id={`status-${row.id}`}
        value={statusOf(row)}
        onChange={(e) => void setStatus(row, e.target.value as ApplicationStatus)}
        className={`${smallInputClass} min-h-9 py-1`}
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {APPLICATION_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </>
  );

  const jobLabel = (row: ApplicationRow) => (row.job ? row.job.title : <span className="italic text-gray-500">General application</span>);

  return (
    <>
      <AdminPageTitle title="Applications">
        <button type="button" onClick={() => void exportCsv()} disabled={exporting} className={secondaryButtonClass}>
          {exporting ? <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
          Export CSV
        </button>
      </AdminPageTitle>

      <div className={`${cardClass} mb-4 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto_auto]`}>
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="apps-q" className="sr-only">
            Search name, email or phone
          </label>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="apps-q"
            type="search"
            value={text}
            placeholder="Search name, email or phone"
            onChange={(e) => {
              setText(e.target.value);
              pushText(e.target.value);
            }}
            className={`${smallInputClass} w-full pl-9`}
          />
        </div>
        <div>
          <label htmlFor="apps-job" className="sr-only">
            Job
          </label>
          <select id="apps-job" value={filters.jobId ?? ""} onChange={(e) => change("jobId", e.target.value)} className={`${smallInputClass} w-full`}>
            <option value="">All jobs</option>
            <option value="general">General applications</option>
            {jobs.data?.items.map((j) => (
              <option key={j.id} value={String(j.id)}>
                {j.title}
                {j.status !== "OPEN" ? ` (${j.status.toLowerCase()})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="apps-status" className="sr-only">
            Status
          </label>
          <select id="apps-status" value={filters.status ?? ""} onChange={(e) => change("status", e.target.value)} className={`${smallInputClass} w-full`}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {APPLICATION_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="apps-from" className="text-sm text-gray-600">
            From
          </label>
          <input id="apps-from" type="date" value={filters.from ?? ""} max={filters.to} onChange={(e) => change("from", e.target.value)} className={`${smallInputClass} min-w-0 flex-1`} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="apps-to" className="text-sm text-gray-600">
            To
          </label>
          <input id="apps-to" type="date" value={filters.to ?? ""} min={filters.from} onChange={(e) => change("to", e.target.value)} className={`${smallInputClass} min-w-0 flex-1`} />
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorNotice error={error} />
        </div>
      )}
      {list.status === "error" && <ErrorNotice error={list.error} onRetry={list.reload} />}
      {!list.data && list.status === "loading" && <Loading />}

      {list.data && list.data.items.length === 0 && (
        <div className={`${cardClass} px-5 py-12 text-center text-gray-500`}>
          {Object.keys(filters).length > 0 ? "No applications match these filters." : "No applications yet."}
        </div>
      )}

      {list.data && list.data.items.length > 0 && (
        <>
          <div className={`${cardClass} hidden overflow-x-auto md:block`}>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Candidate</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Job</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Experience</th>
                  <th scope="col" className="px-4 py-3 font-semibold" aria-sort={oldest ? "ascending" : "descending"}>
                    <button
                      type="button"
                      onClick={() => setFilters({ ...filters, sort: oldest ? undefined : "oldest" })}
                      className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-gray-800"
                    >
                      Applied
                      {oldest ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />}
                      <span className="sr-only">{oldest ? ", oldest first. Sort newest first" : ", newest first. Sort oldest first"}</span>
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.data.items.map((row) => {
                  const isNew = statusOf(row) === "NEW";
                  return (
                    <tr key={row.id} className={isNew ? "bg-sky-50/70" : ""}>
                      <td className="px-4 py-3">
                        <Link to={`/admin/applications/${row.id}`} className={`hover:underline ${isNew ? "font-bold text-brand-navy" : "font-semibold text-gray-800"}`}>
                          {isNew && <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-600 align-middle" />}
                          {row.name}
                          {isNew && <span className="sr-only"> (new)</span>}
                        </Link>
                        <p className="text-gray-500">
                          {row.email} · {row.phone}
                        </p>
                      </td>
                      <td className="max-w-[14rem] px-4 py-3 text-gray-700">{jobLabel(row)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{row.totalExperienceYears === null ? "—" : `${row.totalExperienceYears} yrs`}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-2">{statusSelect(row)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {list.data.items.map((row) => {
              const isNew = statusOf(row) === "NEW";
              return (
                <li key={row.id} className={`${cardClass} p-4 ${isNew ? "border-sky-300 bg-sky-50/70" : ""}`}>
                  <Link to={`/admin/applications/${row.id}`} className={`hover:underline ${isNew ? "font-bold text-brand-navy" : "font-semibold text-gray-800"}`}>
                    {row.name}
                    {isNew && <span className="ml-2 rounded-full bg-sky-600 px-2 py-0.5 text-xs font-bold text-white">New</span>}
                  </Link>
                  <p className="mt-1 text-sm text-gray-600">{jobLabel(row)}</p>
                  <p className="text-sm text-gray-500">
                    {row.phone} · Applied {formatDate(row.createdAt)}
                  </p>
                  <div className="mt-2">{statusSelect(row)}</div>
                </li>
              );
            })}
          </ul>

          <Pagination
            page={list.data.page}
            totalPages={list.data.totalPages}
            total={list.data.total}
            onPage={(p) => router.push(`/admin/applications?${toParams(filters, p ? { page: String(p) } : {})}`, { scroll: false })}
          />
        </>
      )}
    </>
  );
}
