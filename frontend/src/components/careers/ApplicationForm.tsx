import { useEffect, useId, useRef, useState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import Link from "@/components/ui/Link";
import { CONSENT_TEXT, NOTICE_PERIOD_LABELS } from "@/config/careers";
import { COMPANY, telHref } from "@/config/company";
import { apiUrl } from "@/lib/api";
import {
  APPLICATION_FIELDS,
  resumeContentProblem,
  validateApplication,
  type ApplicationField,
  type ApplicationInput,
  type ApplicationValues,
} from "@/lib/careers/schema";
import { NOTICE_PERIODS, type ApiErrors } from "@/lib/careers/types";
import ResumeInput from "./ResumeInput";
import { errorTextClass, hintClass, inputClass, labelClass } from "./formStyles";

type Values = Omit<ApplicationInput, "resume" | "noticePeriod"> & {
  /** "" until one is chosen */
  noticePeriod: string;
  resume: File | null;
};
type Errors = Partial<Record<ApplicationField, string>>;

const empty: Values = {
  name: "",
  email: "",
  phone: "",
  currentLocation: "",
  totalExperienceYears: "",
  currentCompany: "",
  noticePeriod: "",
  expectedSalary: "",
  linkedinUrl: "",
  portfolioUrl: "",
  coverLetter: "",
  resume: null,
  consent: false,
};

const COVER_LETTER_MAX = 3000;

interface ApplicationFormProps {
  /** Apply to this job; without it the form sends a general application */
  job?: { slug: string; title: string };
}

/**
 * The careers application form (multipart, with the résumé), posted to
 * POST /api/careers/jobs/{slug}/applications or POST /api/careers/applications.
 * Same rules as the backend's ApplicationForm; its 400 errors are shown per field.
 */
export default function ApplicationForm({ job }: ApplicationFormProps) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  /** Message for problems that aren't one field's (closed job, rate limit, network) */
  const [formError, setFormError] = useState<React.ReactNode>(null);
  const [honeypot, setHoneypot] = useState("");

  // noticePeriod "" fails the enum with the "Please choose" message
  const check = (v: Values) => validateApplication(v as ApplicationInput);
  const validate = (v: Values) => {
    const result = check(v);
    return result.ok ? {} : result.errors;
  };

  const update = (next: Values, extra: Errors = {}) => {
    setValues(next);
    if (touched) setErrors({ ...validate(next), ...extra });
  };

  const set = (key: Exclude<ApplicationField, "resume" | "consent">) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    update({ ...values, [key]: e.target.value });

  const setResume = async (file: File | null) => {
    const next = { ...values, resume: file };
    // Catch a renamed file (e.g. .txt → .pdf) before the upload; the backend checks the same bytes
    const contentProblem = file ? await resumeContentProblem(file) : null;
    setValues(next);
    if (touched || contentProblem) {
      const found = validate(next);
      setErrors(contentProblem && !found.resume ? { ...found, resume: contentProblem } : found);
    }
  };

  const focusField = (key: ApplicationField) => formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(key))}`)?.focus();

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFormError(null);
    const result = check(values);
    const contentProblem = values.resume ? await resumeContentProblem(values.resume) : null;
    const found: Errors = result.ok ? {} : { ...result.errors };
    if (contentProblem && !found.resume) found.resume = contentProblem;
    setErrors(found);
    const first = APPLICATION_FIELDS.find((k) => found[k]);
    if (first || !result.ok) {
      if (first) focusField(first);
      return;
    }
    await send(result.values);
  };

  const send = async (v: ApplicationValues) => {
    setStatus("sending");
    const body = new FormData();
    body.set("name", v.name);
    body.set("email", v.email);
    body.set("phone", v.phone);
    body.set("currentLocation", v.currentLocation);
    body.set("totalExperienceYears", v.totalExperienceYears);
    body.set("currentCompany", v.currentCompany);
    body.set("noticePeriod", v.noticePeriod);
    body.set("expectedSalary", v.expectedSalary === null ? "" : String(v.expectedSalary));
    body.set("linkedinUrl", v.linkedinUrl);
    body.set("portfolioUrl", v.portfolioUrl);
    body.set("coverLetter", v.coverLetter);
    body.set("consent", "true");
    body.set("website", honeypot);
    body.set("resume", values.resume!);
    const path = job ? `/api/careers/jobs/${encodeURIComponent(job.slug)}/applications` : "/api/careers/applications";

    try {
      // No Content-Type header: the browser sets multipart/form-data with its boundary
      const res = await fetch(apiUrl(path), { method: "POST", body, headers: { Accept: "application/json" } });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      setStatus("idle");
      const data = (await res.json().catch(() => ({}))) as ApiErrors;
      const serverErrors = data.errors ?? {};
      if (res.status === 400) {
        const fieldErrors: Errors = {};
        for (const [key, message] of Object.entries(serverErrors)) {
          if ((APPLICATION_FIELDS as string[]).includes(key)) fieldErrors[key as ApplicationField] = message;
        }
        setErrors(fieldErrors);
        const first = APPLICATION_FIELDS.find((k) => fieldErrors[k]);
        if (first) focusField(first);
        else setFormError("Please check the form and try again.");
      } else if (res.status === 409) {
        // Closed job or a recent duplicate: the backend's message says which
        setFormError(serverErrors.job ?? serverErrors.email ?? "We couldn't accept this application.");
      } else if (res.status === 429) {
        setFormError(serverErrors.form ?? "Too many applications from your network. Please try again in an hour.");
      } else if (res.status === 404) {
        setFormError("This position is no longer available.");
      } else {
        throw new Error(String(res.status));
      }
    } catch {
      setStatus("idle");
      setFormError(
        <>
          We couldn&apos;t send your application just now. Please try again, or call us on{" "}
          <a href={telHref(COMPANY.phones[0])} className="font-semibold underline">
            {COMPANY.phones[0]}
          </a>
          .
        </>,
      );
    }
  };

  if (status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-4 py-4 focus:outline-none">
        <CircleCheck size={40} className="text-emerald-600" aria-hidden="true" />
        <p className="font-heading text-2xl font-black text-brand-navy">Thank you, {values.name.trim().split(" ")[0]}!</p>
        <p className="text-gray-600">
          Your application{job ? <> for <strong className="font-semibold text-gray-800">{job.title}</strong></> : null} has reached our team. We review
          every CV and will contact you on {values.email.trim()} or your phone if your profile is a match.
        </p>
        <Link
          href="/careers"
          className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-5 font-semibold text-brand-navy transition-colors hover:border-brand-navy"
        >
          See other open positions
        </Link>
      </div>
    );
  }

  const describedBy = (key: ApplicationField, hint = false) =>
    [hint ? id(`${key}-hint`) : null, errors[key] ? id(`${key}-error`) : null].filter(Boolean).join(" ") || undefined;
  const field = (key: Exclude<ApplicationField, "resume" | "consent">, { required = true, hint = false } = {}) => ({
    id: id(key),
    name: key,
    value: values[key],
    onChange: set(key),
    "aria-invalid": !!errors[key],
    "aria-describedby": describedBy(key, hint),
    required,
  });
  const label = (key: ApplicationField, text: string, required = true) => (
    <label htmlFor={id(key)} className={labelClass}>
      {text} {required ? <span aria-hidden="true">*</span> : <span className="font-normal text-gray-500">(optional)</span>}
    </label>
  );
  const errorText = (key: ApplicationField) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} className={errorTextClass}>
        <CircleAlert size={14} className="shrink-0" aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-5 sm:space-y-6" aria-busy={status === "sending"}>
      {/* Honeypot: hidden from people and assistive tech, attractive to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <div>
          {label("name", "Full Name")}
          <input {...field("name")} type="text" autoComplete="name" className={inputClass(!!errors.name)} placeholder="Your full name" />
          {errorText("name")}
        </div>
        <div>
          {label("email", "Email Address")}
          <input {...field("email")} type="email" inputMode="email" autoComplete="email" className={inputClass(!!errors.email)} placeholder="name@example.com" />
          {errorText("email")}
        </div>
        <div>
          {label("phone", "Mobile Number")}
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" className={inputClass(!!errors.phone)} placeholder="+91 XXXXX XXXXX" />
          {errorText("phone")}
        </div>
        <div>
          {label("currentLocation", "Current City")}
          <input {...field("currentLocation")} type="text" autoComplete="address-level2" className={inputClass(!!errors.currentLocation)} placeholder="e.g. Lucknow" />
          {errorText("currentLocation")}
        </div>
        <div>
          {label("totalExperienceYears", "Total Experience (years)")}
          <input
            {...field("totalExperienceYears", { hint: true })}
            type="text"
            inputMode="decimal"
            className={inputClass(!!errors.totalExperienceYears)}
            placeholder="e.g. 2.5"
          />
          <p id={id("totalExperienceYears-hint")} className={hintClass}>
            Enter 0 if you are a fresher.
          </p>
          {errorText("totalExperienceYears")}
        </div>
        <div>
          {label("noticePeriod", "Notice Period")}
          <select {...field("noticePeriod")} className={inputClass(!!errors.noticePeriod)}>
            <option value="">Select notice period</option>
            {NOTICE_PERIODS.map((p) => (
              <option key={p} value={p}>
                {NOTICE_PERIOD_LABELS[p]}
              </option>
            ))}
          </select>
          {errorText("noticePeriod")}
        </div>
        <div>
          {label("currentCompany", "Current Company", false)}
          <input {...field("currentCompany", { required: false })} type="text" autoComplete="organization" className={inputClass(!!errors.currentCompany)} />
          {errorText("currentCompany")}
        </div>
        <div>
          {label("expectedSalary", "Expected Salary (₹ per year)", false)}
          <input
            {...field("expectedSalary", { required: false })}
            type="text"
            inputMode="decimal"
            className={inputClass(!!errors.expectedSalary)}
            placeholder="e.g. 450000 or 4.5 L"
          />
          {errorText("expectedSalary")}
        </div>
        <div>
          {label("linkedinUrl", "LinkedIn Profile", false)}
          <input {...field("linkedinUrl", { required: false })} type="url" inputMode="url" className={inputClass(!!errors.linkedinUrl)} placeholder="https://www.linkedin.com/in/…" />
          {errorText("linkedinUrl")}
        </div>
        <div>
          {label("portfolioUrl", "Portfolio / Website", false)}
          <input {...field("portfolioUrl", { required: false })} type="url" inputMode="url" className={inputClass(!!errors.portfolioUrl)} placeholder="https://" />
          {errorText("portfolioUrl")}
        </div>
      </div>

      <div>
        {label("coverLetter", "Cover Letter", false)}
        <textarea
          {...field("coverLetter", { required: false, hint: true })}
          rows={5}
          maxLength={COVER_LETTER_MAX}
          className={`${inputClass(!!errors.coverLetter)} resize-y`}
          placeholder="Tell us briefly why you'd be a great fit…"
        />
        <p id={id("coverLetter-hint")} className={`${hintClass} text-right`}>
          {values.coverLetter.length.toLocaleString("en-IN")} / {COVER_LETTER_MAX.toLocaleString("en-IN")}
        </p>
        {errorText("coverLetter")}
      </div>

      <ResumeInput id={id("resume")} file={values.resume} error={errors.resume} onChange={setResume} />

      <div>
        <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update({ ...values, consent: e.target.checked })}
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            required
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-brand-navy"
          />
          <span>
            {CONSENT_TEXT} <span aria-hidden="true">*</span>
          </span>
        </label>
        {errorText("consent")}
      </div>

      {formError && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-es-accent-strong px-6 text-base font-bold text-white transition-colors hover:bg-brand-navy disabled:cursor-wait disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>Sending your application…</span>
          </>
        ) : (
          <>
            <span>Submit Application</span>
            <Send size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
