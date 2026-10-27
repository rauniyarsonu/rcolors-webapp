import { useEffect, useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, FileText, LoaderCircle, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useNoIndex } from "@/components/admin/useNoIndex";
import {
  AdminPageTitle,
  ApplicationStatusBadge,
  ErrorNotice,
  Loading,
  cardClass,
  formatDateTime,
  primaryButtonClass,
  secondaryButtonClass,
  smallInputClass,
} from "@/components/admin/ui";
import { APPLICATION_STATUS_LABELS, NOTICE_PERIOD_LABELS } from "@/config/careers";
import { telHref } from "@/config/company";
import { AdminApiError, adminApi } from "@/lib/admin/adminApi";
import { useAdminData } from "@/lib/admin/useAdminData";
import { formatBytes } from "@/lib/careers/format";
import { APPLICATION_STATUSES, type ApplicationDetail, type ApplicationStatus } from "@/lib/careers/types";
import { formatPhone, formatPriceLong } from "@/lib/estate/format";

export default function AdminApplicationDetailPage() {
  useNoIndex("Application");
  const { id = "" } = useParams();
  const result = useAdminData<ApplicationDetail>(`/api/admin/applications/${encodeURIComponent(id)}`);

  if (!result.data) {
    if (result.status === "error") {
      return result.error.status === 404 ? (
        <ErrorNotice error="This application doesn't exist (it may have been deleted)." />
      ) : (
        <ErrorNotice error={result.error} onRetry={result.reload} />
      );
    }
    return <Loading />;
  }
  return <Detail app={result.data} onChange={result.set} />;
}

function Detail({ app, onChange }: { app: ApplicationDetail; onChange: (a: ApplicationDetail) => void }) {
  const uid = useId();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ApplicationStatus>(app.status);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(app.adminNotes ?? "");
  const [busy, setBusy] = useState<null | "status" | "notes" | "resume" | "delete">(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => setStatus(app.status), [app.status]);

  const act = async (kind: NonNullable<typeof busy>, fn: () => Promise<void>) => {
    setBusy(kind);
    setError(null);
    setMessage(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const saveStatus = () =>
    act("status", async () => {
      onChange(await adminApi.patch<ApplicationDetail>(`/api/admin/applications/${app.id}`, { status, note: note.trim() || undefined }));
      setNote("");
      setMessage(`Status changed to ${APPLICATION_STATUS_LABELS[status]}.`);
    });

  const saveNotes = () =>
    act("notes", async () => {
      onChange(await adminApi.patch<ApplicationDetail>(`/api/admin/applications/${app.id}`, { adminNotes: notes }));
      setMessage("Notes saved.");
    });

  const downloadResume = () => act("resume", () => adminApi.download(`/api/admin/applications/${app.id}/resume`, app.resume.filename));

  const remove = () =>
    act("delete", async () => {
      await adminApi.delete(`/api/admin/applications/${app.id}`);
      navigate("/admin/applications", { replace: true });
    });

  const details: { label: string; value: React.ReactNode }[] = [
    {
      label: "Email",
      value: (
        <a href={`mailto:${app.email}`} className="break-all text-es-accent-strong hover:underline">
          {app.email}
        </a>
      ),
    },
    {
      label: "Phone",
      value: (
        <a href={telHref(app.phone)} className="text-es-accent-strong hover:underline">
          {formatPhone(app.phone)}
        </a>
      ),
    },
    { label: "Current city", value: app.currentLocation ?? "—" },
    { label: "Experience", value: app.totalExperienceYears === null ? "—" : `${app.totalExperienceYears} years` },
    { label: "Current company", value: app.currentCompany ?? "—" },
    { label: "Notice period", value: app.noticePeriod ? NOTICE_PERIOD_LABELS[app.noticePeriod] : "—" },
    { label: "Expected salary", value: app.expectedSalary === null ? "—" : `${formatPriceLong(app.expectedSalary)} / year` },
    { label: "LinkedIn", value: <ExternalUrl url={app.linkedinUrl} /> },
    { label: "Portfolio", value: <ExternalUrl url={app.portfolioUrl} /> },
    { label: "Privacy consent", value: app.consent ? "Given" : "Not given" },
  ];

  return (
    <>
      <Link to="/admin/applications" className="mb-2 inline-flex min-h-11 items-center text-sm font-semibold text-es-accent-strong hover:underline">
        <ArrowLeft size={16} className="mr-1.5" aria-hidden="true" /> All applications
      </Link>
      <AdminPageTitle title={app.name}>
        <ApplicationStatusBadge status={app.status} />
      </AdminPageTitle>
      <p className="-mt-4 mb-6 text-sm text-gray-600">
        {app.job ? (
          <>
            Applied for{" "}
            <Link to={`/admin/jobs/${app.job.id}/edit`} className="font-semibold text-es-accent-strong hover:underline">
              {app.job.title}
            </Link>
          </>
        ) : (
          "General application"
        )}{" "}
        on {formatDateTime(app.createdAt)}
      </p>

      <div aria-live="polite">
        {message && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      </div>
      {error && (
        <div className="mb-4">
          <ErrorNotice error={error} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <section aria-labelledby={`${uid}-candidate`} className={`${cardClass} p-5 sm:p-6`}>
            <h2 id={`${uid}-candidate`} className="mb-4 font-heading text-lg font-bold text-brand-navy">
              Candidate
            </h2>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{d.label}</dt>
                  <dd className="mt-0.5 break-words text-gray-900">{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby={`${uid}-resume`} className={`${cardClass} flex flex-wrap items-center gap-4 p-5 sm:p-6`}>
            <FileText size={32} aria-hidden="true" className="shrink-0 text-es-accent-strong" />
            <div className="min-w-0 flex-1">
              <h2 id={`${uid}-resume`} className="font-heading text-lg font-bold text-brand-navy">
                Résumé
              </h2>
              <p className="truncate text-sm text-gray-600">
                {app.resume.filename} · {formatBytes(app.resume.sizeBytes)}
              </p>
            </div>
            <button type="button" onClick={() => void downloadResume()} disabled={busy === "resume"} className={primaryButtonClass}>
              {busy === "resume" ? <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
              Download résumé
            </button>
          </section>

          <section aria-labelledby={`${uid}-cover`} className={`${cardClass} p-5 sm:p-6`}>
            <h2 id={`${uid}-cover`} className="mb-3 font-heading text-lg font-bold text-brand-navy">
              Cover letter
            </h2>
            {app.coverLetter ? (
              <p className="max-w-[70ch] whitespace-pre-line break-words leading-relaxed text-gray-800">{app.coverLetter}</p>
            ) : (
              <p className="text-gray-500">No cover letter.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section aria-labelledby={`${uid}-status`} className={`${cardClass} space-y-3 p-5`}>
            <h2 id={`${uid}-status`} className="font-heading text-lg font-bold text-brand-navy">
              Status
            </h2>
            <div>
              <label htmlFor={`${uid}-status-select`} className="mb-1 block text-sm font-medium text-gray-700">
                Move to
              </label>
              <select id={`${uid}-status-select`} value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} className={`${smallInputClass} w-full`}>
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-note`} className="mb-1 block text-sm font-medium text-gray-700">
                Note for the history <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id={`${uid}-note`} value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} className={`${smallInputClass} w-full`} placeholder="e.g. Interview on Monday 11 am" />
            </div>
            <button type="button" onClick={() => void saveStatus()} disabled={busy === "status" || status === app.status} className={`${primaryButtonClass} w-full`}>
              {busy === "status" && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              Update status
            </button>
          </section>

          <section aria-labelledby={`${uid}-notes`} className={`${cardClass} space-y-3 p-5`}>
            <h2 id={`${uid}-notes`} className="font-heading text-lg font-bold text-brand-navy">
              <label htmlFor={`${uid}-notes-text`}>Admin notes</label>
            </h2>
            <textarea
              id={`${uid}-notes-text`}
              value={notes}
              maxLength={5000}
              rows={5}
              onChange={(e) => setNotes(e.target.value)}
              className={`${smallInputClass} w-full resize-y py-2`}
              placeholder="Only visible here"
            />
            <button type="button" onClick={() => void saveNotes()} disabled={busy === "notes" || notes === (app.adminNotes ?? "")} className={`${secondaryButtonClass} w-full`}>
              {busy === "notes" && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              Save notes
            </button>
          </section>

          <section aria-labelledby={`${uid}-history`} className={`${cardClass} p-5`}>
            <h2 id={`${uid}-history`} className="mb-4 font-heading text-lg font-bold text-brand-navy">
              History
            </h2>
            <ol className="relative space-y-4 border-l-2 border-gray-200 pl-5">
              {[...app.history].reverse().map((h, i) => (
                <li key={i} className="relative">
                  <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-es-accent-strong" />
                  <p className="text-sm text-gray-900">
                    {h.fromStatus ? `${APPLICATION_STATUS_LABELS[h.fromStatus]} → ` : ""}
                    <strong className="font-semibold">{APPLICATION_STATUS_LABELS[h.toStatus]}</strong>
                  </p>
                  {h.note && <p className="mt-0.5 break-words text-sm text-gray-600">{h.note}</p>}
                  <p className="text-xs text-gray-500">{formatDateTime(h.changedAt)}</p>
                </li>
              ))}
              <li className="relative">
                <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-400" />
                <p className="text-sm text-gray-900">Application received</p>
                <p className="text-xs text-gray-500">{formatDateTime(app.createdAt)}</p>
              </li>
            </ol>
          </section>

          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-red-700 hover:underline"
          >
            <Trash2 size={16} aria-hidden="true" /> Delete application
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this application?"
        confirmLabel="Delete"
        danger
        busy={busy === "delete"}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => void remove()}
      >
        This permanently removes {app.name}&apos;s application, résumé and history (for example, on a data-removal request). It can&apos;t be undone.
      </ConfirmDialog>
    </>
  );
}

/** Candidate-provided links open in a new tab without giving the page access to ours */
function ExternalUrl({ url }: { url: string | null }) {
  if (!url) return <>—</>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all text-es-accent-strong hover:underline">
      {url.replace(/^https?:\/\/(www\.)?/, "")}
      <ExternalLink size={14} aria-hidden="true" className="shrink-0" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
