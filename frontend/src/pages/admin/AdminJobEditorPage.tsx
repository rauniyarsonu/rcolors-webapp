import { useEffect, useId, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CircleAlert, ExternalLink, Eye, LoaderCircle, Pencil } from "lucide-react";
import JobDetailView from "@/components/careers/JobDetailView";
import { errorTextClass, hintClass, inputClass, labelClass } from "@/components/careers/formStyles";
import ListEditor from "@/components/admin/ListEditor";
import { useNoIndex } from "@/components/admin/useNoIndex";
import { useUnsavedChanges } from "@/components/admin/useUnsavedChanges";
import { AdminPageTitle, ErrorNotice, JobStatusBadge, Loading, cardClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/ui";
import { BUSINESS_LABELS, EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/config/careers";
import { AdminApiError, adminApi } from "@/lib/admin/adminApi";
import { useAdminData } from "@/lib/admin/useAdminData";
import { parsePrice } from "@/lib/estate/format";
import {
  BUSINESSES,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  type AdminJob,
  type Business,
  type EmploymentType,
  type JobInput,
  type JobStatus,
  type PublicJobDetail,
  type WorkMode,
} from "@/lib/careers/types";

/** The editor's state: numbers as typed, lists as rows */
interface Draft {
  title: string;
  business: Business | "";
  department: string;
  location: string;
  workMode: WorkMode | "";
  employmentType: EmploymentType | "";
  experienceMinYears: string;
  experienceMaxYears: string;
  salaryMin: string;
  salaryMax: string;
  showSalary: boolean;
  openings: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  applicationDeadline: string;
}
type Field = keyof Draft;
type Errors = Partial<Record<Field | "form", string>>;

const blank: Draft = {
  title: "",
  business: "",
  department: "",
  location: "Lucknow, UP",
  workMode: "ON_SITE",
  employmentType: "FULL_TIME",
  experienceMinYears: "0",
  experienceMaxYears: "",
  salaryMin: "",
  salaryMax: "",
  showSalary: false,
  openings: "1",
  summary: "",
  description: "",
  responsibilities: [],
  requirements: [],
  niceToHave: [],
  benefits: [],
  applicationDeadline: "",
};

const FIELD_ORDER: Field[] = [
  "title",
  "business",
  "department",
  "location",
  "workMode",
  "employmentType",
  "experienceMinYears",
  "experienceMaxYears",
  "openings",
  "salaryMin",
  "salaryMax",
  "summary",
  "description",
  "responsibilities",
  "requirements",
  "niceToHave",
  "benefits",
  "applicationDeadline",
];

const fromJob = (j: AdminJob): Draft => ({
  title: j.title,
  business: j.business,
  department: j.department ?? "",
  location: j.location,
  workMode: j.workMode,
  employmentType: j.employmentType,
  experienceMinYears: j.experienceMinYears === null ? "" : String(j.experienceMinYears),
  experienceMaxYears: j.experienceMaxYears === null ? "" : String(j.experienceMaxYears),
  salaryMin: j.salaryMin === null ? "" : String(j.salaryMin),
  salaryMax: j.salaryMax === null ? "" : String(j.salaryMax),
  showSalary: j.showSalary,
  openings: j.openings === null ? "" : String(j.openings),
  summary: j.summary ?? "",
  description: j.description ?? "",
  responsibilities: [...j.responsibilities],
  requirements: [...j.requirements],
  niceToHave: [...j.niceToHave],
  benefits: [...j.benefits],
  applicationDeadline: j.applicationDeadline ?? "",
});

const int = (v: string) => (v.trim() === "" ? null : /^\d+$/.test(v.trim()) ? Number(v) : NaN);
const money = (v: string) => (v.trim() === "" ? null : (parsePrice(v) ?? NaN));
const rows = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);

/** Same required fields and ranges as the backend's JobForm; the backend's 400 has the final say */
function validate(d: Draft): Errors {
  const e: Errors = {};
  if (!d.title.trim()) e.title = "Enter a job title.";
  if (!d.business) e.business = "Choose a business.";
  if (!d.location.trim()) e.location = "Enter a location, e.g. Lucknow, UP.";
  if (!d.workMode) e.workMode = "Choose a work mode.";
  if (!d.employmentType) e.employmentType = "Choose a job type.";
  const min = int(d.experienceMinYears);
  const max = int(d.experienceMaxYears);
  if (min === null || Number.isNaN(min) || min > 50) e.experienceMinYears = "Enter whole years from 0 to 50.";
  if (Number.isNaN(max) || (max !== null && max > 50)) e.experienceMaxYears = "Enter whole years up to 50, or leave empty.";
  else if (max !== null && min !== null && !Number.isNaN(min) && max < min) e.experienceMaxYears = "Must be at least the minimum.";
  const openings = int(d.openings);
  if (openings === null || Number.isNaN(openings) || openings < 1 || openings > 999) e.openings = "Enter a number from 1 to 999.";
  const sMin = money(d.salaryMin);
  const sMax = money(d.salaryMax);
  if (Number.isNaN(sMin)) e.salaryMin = "Enter a yearly amount, e.g. 360000 or 3.6 L.";
  if (Number.isNaN(sMax)) e.salaryMax = "Enter a yearly amount, e.g. 540000 or 5.4 L.";
  else if (sMin !== null && sMax !== null && !Number.isNaN(sMin) && sMax < sMin) e.salaryMax = "Must be at least the minimum.";
  if (d.showSalary && sMin === null && sMax === null && !e.salaryMin) e.salaryMin = "Enter a salary to show it.";
  if (!d.summary.trim()) e.summary = "Write a one-line summary for the job card.";
  if (!d.description.trim()) e.description = "Describe the role.";
  return e;
}

function toInput(d: Draft, status?: JobStatus): JobInput {
  return {
    title: d.title.trim(),
    business: d.business as Business,
    department: d.department.trim() || null,
    location: d.location.trim(),
    workMode: d.workMode as WorkMode,
    employmentType: d.employmentType as EmploymentType,
    experienceMinYears: int(d.experienceMinYears),
    experienceMaxYears: int(d.experienceMaxYears),
    salaryMin: money(d.salaryMin),
    salaryMax: money(d.salaryMax),
    showSalary: d.showSalary,
    openings: int(d.openings),
    summary: d.summary.trim(),
    description: d.description.trim(),
    responsibilities: rows(d.responsibilities),
    requirements: rows(d.requirements),
    niceToHave: rows(d.niceToHave),
    benefits: rows(d.benefits),
    applicationDeadline: d.applicationDeadline || null,
    ...(status ? { status } : {}),
  };
}

/** What the public page will show, for the preview */
function toPreview(d: Draft, job: AdminJob | undefined): PublicJobDetail {
  const input = toInput(d);
  const num = (n: number | null) => (n === null || Number.isNaN(n) ? null : n);
  return {
    ...input,
    slug: job?.slug ?? "preview",
    business: input.business || "GROUP",
    workMode: input.workMode || "ON_SITE",
    employmentType: input.employmentType || "FULL_TIME",
    experienceMinYears: num(input.experienceMinYears),
    experienceMaxYears: num(input.experienceMaxYears),
    openings: num(input.openings),
    salaryMin: d.showSalary ? num(input.salaryMin) : null,
    salaryMax: d.showSalary ? num(input.salaryMax) : null,
    publishedAt: job?.publishedAt ?? new Date().toISOString(),
    updatedAt: job?.updatedAt ?? null,
    acceptingApplications: true,
  };
}

/** /admin/jobs/new and /admin/jobs/:id/edit */
export default function AdminJobEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  useNoIndex(isNew ? "New job" : "Edit job");
  const loaded = useAdminData<AdminJob>(isNew ? null : `/api/admin/jobs/${id}`);

  if (!isNew && !loaded.data) {
    if (loaded.status === "error") {
      return loaded.error.status === 404 ? <ErrorNotice error="This job doesn't exist (it may have been deleted)." /> : <ErrorNotice error={loaded.error} onRetry={loaded.reload} />;
    }
    return <Loading />;
  }
  // key: a fresh editor (and baseline) per job
  return <Editor key={id ?? "new"} job={loaded.data} />;
}

function Editor({ job: initialJob }: { job?: AdminJob }) {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(initialJob);
  const [baseline, setBaseline] = useState<Draft>(() => (initialJob ? fromJob(initialJob) : blank));
  const [draft, setDraft] = useState<Draft>(baseline);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState<null | "save" | "publish">(null);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState<string | null>((location.state as { notice?: string } | null)?.notice ?? null);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(baseline), [draft, baseline]);
  useUnsavedChanges(dirty && !saving);

  // Clear a notice passed in navigation state, so a reload doesn't show it again
  useEffect(() => {
    if ((location.state as { notice?: string } | null)?.notice) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const update = <K extends Field>(key: K, value: Draft[K]) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setNotice(null);
    if (touched) setErrors(validate(next));
  };
  const text = (key: Exclude<Field, "showSalary" | "responsibilities" | "requirements" | "niceToHave" | "benefits">) => ({
    id: fid(key),
    value: draft[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(key, e.target.value as Draft[typeof key]),
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? fid(`${key}-error`) : undefined,
  });
  const label = (key: Field, textLabel: string, required = false) => (
    <label htmlFor={fid(key)} className={labelClass}>
      {textLabel} {required ? <span aria-hidden="true">*</span> : <span className="font-normal text-gray-500">(optional)</span>}
    </label>
  );
  const errorText = (key: Field) =>
    errors[key] ? (
      <p id={fid(`${key}-error`)} className={errorTextClass}>
        <CircleAlert size={14} className="shrink-0" aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null;

  const focusFirst = (found: Errors) => {
    const first = FIELD_ORDER.find((k) => found[k]);
    if (!first) return;
    setPreview(false);
    requestAnimationFrame(() => document.getElementById(fid(first))?.focus() ?? document.getElementById(fid(`${first}-0`))?.focus());
  };

  const save = async (mode: "save" | "publish") => {
    setTouched(true);
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirst(found);
      return;
    }
    const status: JobStatus | undefined = mode === "publish" ? "OPEN" : job ? undefined : "DRAFT";
    setSaving(mode);
    try {
      const saved = job
        ? await adminApi.put<AdminJob>(`/api/admin/jobs/${job.id}`, toInput(draft, status))
        : await adminApi.post<AdminJob>("/api/admin/jobs", toInput(draft, status));
      const next = fromJob(saved);
      setJob(saved);
      setBaseline(next);
      setDraft(next);
      setErrors({});
      const message = mode === "publish" ? "Published. It's live on the careers page." : "Saved.";
      if (!job) navigate(`/admin/jobs/${saved.id}/edit`, { replace: true, state: { notice: message } });
      else setNotice(message);
    } catch (e) {
      if (e instanceof AdminApiError && e.status === 400) {
        // Keys like "title" or "responsibilities[2]" → the field they belong to
        const fieldErrors: Errors = {};
        for (const [key, message] of Object.entries(e.errors)) {
          const field = key.split(/[[.]/)[0] as Field;
          if ((FIELD_ORDER as string[]).includes(field)) fieldErrors[field] ??= message;
          else fieldErrors.form ??= message;
        }
        setErrors(fieldErrors);
        focusFirst(fieldErrors);
      } else {
        setErrors({ form: e instanceof AdminApiError ? e.message : "Couldn't save. Please try again." });
      }
    } finally {
      setSaving(null);
    }
  };

  const status = job?.status;
  const canPublish = status !== "OPEN";
  const publishLabel = !status || status === "DRAFT" ? "Publish" : "Save & reopen";
  const saveLabel = !status || status === "DRAFT" ? "Save as draft" : "Save changes";

  return (
    <>
      <Link to="/admin/jobs" className="mb-2 inline-flex min-h-11 items-center text-sm font-semibold text-es-accent-strong hover:underline">
        <ArrowLeft size={16} className="mr-1.5" aria-hidden="true" /> All jobs
      </Link>
      <AdminPageTitle title={job ? job.title || "Untitled job" : "New job"}>
        {job && <JobStatusBadge status={job.status} expired={job.status === "OPEN" && !job.acceptingApplications} />}
        {job && (job.status === "OPEN" || job.status === "CLOSED") && (
          <a href={`/careers/${job.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-es-accent-strong hover:underline">
            View public page <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </AdminPageTitle>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="View" className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            type="button"
            aria-pressed={!preview}
            onClick={() => setPreview(false)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold ${!preview ? "bg-brand-navy text-white" : "text-gray-700"}`}
          >
            <Pencil size={14} aria-hidden="true" /> Edit
          </button>
          <button
            type="button"
            aria-pressed={preview}
            onClick={() => setPreview(true)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold ${preview ? "bg-brand-navy text-white" : "text-gray-700"}`}
          >
            <Eye size={14} aria-hidden="true" /> Preview
          </button>
        </div>
        <p aria-live="polite" className="text-sm text-gray-500">
          {dirty ? "Unsaved changes" : job ? "All changes saved" : ""}
        </p>
      </div>

      {notice && (
        <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {errors.form && (
        <div className="mb-4">
          <ErrorNotice error={errors.form} />
        </div>
      )}

      {preview ? (
        <div className="-mx-4 overflow-hidden border-y border-gray-200 bg-gray-50 sm:mx-0 sm:rounded-xl sm:border">
          <p className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">Preview: this is how the job page will look.</p>
          <JobDetailView job={toPreview(draft, job)} preview />
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void save("save");
          }}
          className="space-y-6"
        >
          <section className={`${cardClass} space-y-5 p-5 sm:p-6`}>
            <h2 className="font-heading text-lg font-bold text-brand-navy">Basics</h2>
            <div>
              {label("title", "Job title", true)}
              <input {...text("title")} maxLength={120} className={inputClass(!!errors.title)} placeholder="e.g. Site Engineer (Civil)" />
              {errorText("title")}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                {label("business", "Business", true)}
                <select {...text("business")} className={inputClass(!!errors.business)}>
                  <option value="">Choose a business</option>
                  {BUSINESSES.map((b) => (
                    <option key={b} value={b}>
                      {BUSINESS_LABELS[b]}
                    </option>
                  ))}
                </select>
                {errorText("business")}
              </div>
              <div>
                {label("department", "Department")}
                <input {...text("department")} maxLength={120} className={inputClass(!!errors.department)} placeholder="e.g. Site Engineering, Sales" />
                {errorText("department")}
              </div>
              <div>
                {label("location", "Location", true)}
                <input {...text("location")} maxLength={120} className={inputClass(!!errors.location)} placeholder="e.g. Lucknow, UP" />
                {errorText("location")}
              </div>
              <div>
                {label("applicationDeadline", "Application deadline")}
                <input {...text("applicationDeadline")} type="date" className={inputClass(!!errors.applicationDeadline)}
                  aria-describedby={[fid("deadline-hint"), errors.applicationDeadline ? fid("applicationDeadline-error") : ""].join(" ").trim()}
                />
                <p id={fid("deadline-hint")} className={hintClass}>
                  The last day to apply. After it the job shows as closed.
                </p>
                {errorText("applicationDeadline")}
              </div>
              <div>
                {label("workMode", "Work mode", true)}
                <select {...text("workMode")} className={inputClass(!!errors.workMode)}>
                  {WORK_MODES.map((m) => (
                    <option key={m} value={m}>
                      {WORK_MODE_LABELS[m]}
                    </option>
                  ))}
                </select>
                {errorText("workMode")}
              </div>
              <div>
                {label("employmentType", "Job type", true)}
                <select {...text("employmentType")} className={inputClass(!!errors.employmentType)}>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {EMPLOYMENT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
                {errorText("employmentType")}
              </div>
            </div>
          </section>

          <section className={`${cardClass} space-y-5 p-5 sm:p-6`}>
            <h2 className="font-heading text-lg font-bold text-brand-navy">Experience, openings and salary</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                {label("experienceMinYears", "Min. experience (years)", true)}
                <input {...text("experienceMinYears")} inputMode="numeric" className={inputClass(!!errors.experienceMinYears)} />
                {errorText("experienceMinYears")}
              </div>
              <div>
                {label("experienceMaxYears", "Max. experience (years)")}
                <input {...text("experienceMaxYears")} inputMode="numeric" className={inputClass(!!errors.experienceMaxYears)} placeholder="No maximum" />
                {errorText("experienceMaxYears")}
              </div>
              <div>
                {label("openings", "Openings", true)}
                <input {...text("openings")} inputMode="numeric" className={inputClass(!!errors.openings)} />
                {errorText("openings")}
              </div>
              <div>
                {label("salaryMin", "Salary from (₹ / year)")}
                <input {...text("salaryMin")} inputMode="decimal" className={inputClass(!!errors.salaryMin)} placeholder="e.g. 3.6 L" />
                {errorText("salaryMin")}
              </div>
              <div>
                {label("salaryMax", "Salary up to (₹ / year)")}
                <input {...text("salaryMax")} inputMode="decimal" className={inputClass(!!errors.salaryMax)} placeholder="e.g. 5.4 L" />
                {errorText("salaryMax")}
              </div>
              <div className="flex items-end">
                <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={draft.showSalary}
                    onChange={(e) => update("showSalary", e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 accent-brand-navy"
                  />
                  Show salary on the careers page
                </label>
              </div>
            </div>
          </section>

          <section className={`${cardClass} space-y-5 p-5 sm:p-6`}>
            <h2 className="font-heading text-lg font-bold text-brand-navy">Description</h2>
            <div>
              {label("summary", "Summary", true)}
              <input {...text("summary")} maxLength={300} className={inputClass(!!errors.summary)} placeholder="One line shown on the job card" />
              <p className={`${hintClass} text-right`}>{draft.summary.length} / 300</p>
              {errorText("summary")}
            </div>
            <div>
              {label("description", "About the role", true)}
              <textarea {...text("description")} rows={8} maxLength={10000} className={`${inputClass(!!errors.description)} resize-y`} />
              <p className={hintClass}>Plain text. Blank lines start a new paragraph.</p>
              {errorText("description")}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ListEditor id={fid("responsibilities")} label="Responsibilities" addLabel="Add responsibility" items={draft.responsibilities} onChange={(v) => update("responsibilities", v)} error={errors.responsibilities} />
              <ListEditor id={fid("requirements")} label="Requirements" addLabel="Add requirement" items={draft.requirements} onChange={(v) => update("requirements", v)} error={errors.requirements} />
              <ListEditor id={fid("niceToHave")} label="Nice to have" addLabel="Add nice-to-have" items={draft.niceToHave} onChange={(v) => update("niceToHave", v)} error={errors.niceToHave} />
              <ListEditor id={fid("benefits")} label="Benefits" addLabel="Add benefit" items={draft.benefits} onChange={(v) => update("benefits", v)} error={errors.benefits} />
            </div>
          </section>

          {/* Submit buttons live in the sticky bar below */}
          <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
            Save
          </button>
        </form>
      )}

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex flex-wrap justify-end gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <button type="button" onClick={() => void save("save")} disabled={!!saving} className={secondaryButtonClass}>
          {saving === "save" && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {saveLabel}
        </button>
        {canPublish && (
          <button type="button" onClick={() => void save("publish")} disabled={!!saving} className={primaryButtonClass}>
            {saving === "publish" && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            {publishLabel}
          </button>
        )}
      </div>
    </>
  );
}
