import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useNoIndex } from "@/components/admin/useNoIndex";
import { AdminPageTitle, ApplicationStatusBadge, ErrorNotice, Loading, cardClass, formatDate, primaryButtonClass } from "@/components/admin/ui";
import { APPLICATION_STATUS_LABELS } from "@/config/careers";
import { useAdminData } from "@/lib/admin/useAdminData";
import { APPLICATION_STATUSES, type ApplicationRow, type CareersSummary, type Page } from "@/lib/careers/types";

export default function AdminDashboardPage() {
  useNoIndex("Dashboard");
  const summary = useAdminData<CareersSummary>("/api/admin/careers/summary");
  const latest = useAdminData<Page<ApplicationRow>>("/api/admin/applications?size=5");

  const stats = summary.data
    ? [
        { label: "Open jobs", value: summary.data.openJobs, href: "/admin/jobs?status=OPEN" },
        { label: "New applications", value: summary.data.byStatus.NEW, href: "/admin/applications?status=NEW" },
        { label: "Applications, last 7 days", value: summary.data.applicationsLast7Days, href: "/admin/applications" },
        { label: "Applications, last 30 days", value: summary.data.applicationsLast30Days, href: "/admin/applications" },
      ]
    : [];

  return (
    <>
      <AdminPageTitle title="Dashboard">
        <Link to="/admin/jobs/new" className={primaryButtonClass}>
          <Plus size={18} aria-hidden="true" /> Post a new job
        </Link>
      </AdminPageTitle>

      {summary.status === "error" && <ErrorNotice error={summary.error} onRetry={summary.reload} />}
      {!summary.data && summary.status === "loading" && <Loading />}

      {summary.data && (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <li key={s.label}>
                <Link to={s.href} className={`${cardClass} block p-5 transition-colors hover:border-brand-sky`}>
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className="mt-1 font-heading text-3xl font-black text-brand-navy">{s.value}</p>
                </Link>
              </li>
            ))}
          </ul>

          <section aria-labelledby="by-status" className={`${cardClass} mt-6 p-5`}>
            <h2 id="by-status" className="mb-4 font-heading text-lg font-bold text-brand-navy">
              Applications by status <span className="text-sm font-normal text-gray-500">({summary.data.totalApplications} total)</span>
            </h2>
            <ul className="flex flex-wrap gap-2">
              {APPLICATION_STATUSES.map((s) => (
                <li key={s}>
                  <Link
                    to={`/admin/applications?status=${s}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm hover:border-brand-sky"
                  >
                    {APPLICATION_STATUS_LABELS[s]} <span className="font-bold text-brand-navy">{summary.data!.byStatus[s]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section aria-labelledby="latest" className={`${cardClass} mt-6`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="latest" className="font-heading text-lg font-bold text-brand-navy">
            Latest applications
          </h2>
          <Link to="/admin/applications" className="text-sm font-semibold text-es-accent-strong hover:underline">
            View all
          </Link>
        </div>
        {latest.status === "error" && (
          <div className="p-5">
            <ErrorNotice error={latest.error} onRetry={latest.reload} />
          </div>
        )}
        {!latest.data && latest.status === "loading" && (
          <div className="px-5">
            <Loading />
          </div>
        )}
        {latest.data && latest.data.items.length === 0 && <p className="px-5 py-8 text-gray-500">No applications yet.</p>}
        {latest.data && latest.data.items.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {latest.data.items.map((a) => (
              <li key={a.id}>
                <Link to={`/admin/applications/${a.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-gray-50">
                  <span className={`min-w-0 flex-1 truncate ${a.status === "NEW" ? "font-bold text-brand-navy" : "font-medium text-gray-800"}`}>
                    {a.name}
                    <span className="ml-2 font-normal text-gray-500">{a.job ? a.job.title : "General application"}</span>
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(a.createdAt)}</span>
                  <ApplicationStatusBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
