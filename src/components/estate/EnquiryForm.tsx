"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { ENQUIRY_INTERESTS } from "@/config/estate/catalog";
import { ESTATE } from "@/config/estate/site";
import { formatPhone, normaliseIndianMobile } from "@/lib/estate/format";

export interface EnquiryContext {
  /** Human-readable subject, e.g. a listing title */
  subject?: string;
  /** Record id, sent with the enquiry */
  reference?: string;
  city?: string;
  interest?: string;
}

interface Values {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!v.phone.trim()) e.phone = "Please enter your phone number.";
  else if (!normaliseIndianMobile(v.phone)) e.phone = "Enter a 10-digit Indian mobile number, e.g. 98765 43210.";
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, or leave it blank.";
  if (!v.interest) e.interest = "Please choose what you're interested in.";
  return e;
}

const inputClass = (invalid: boolean) =>
  `w-full min-h-[48px] rounded-md border bg-white px-4 py-3 text-[15px] text-es-ink placeholder:text-es-muted/70 outline-none transition-colors focus:border-es-accent-strong focus:ring-2 focus:ring-es-accent-strong/25 ${
    invalid ? "border-red-600" : "border-slate-300 hover:border-slate-400"
  }`;

/**
 * The "Enquire About a Property" form (same fields as before), submitted to
 * Netlify Forms. Used on the page and inside the enquiry modal.
 */
export default function EnquiryForm({ context, onDone }: { context?: EnquiryContext; onDone?: () => void }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    interest: context?.interest ?? "",
    message: context?.subject ? `I'm interested in "${context.subject}". Please share more details.` : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    // Bots fill the hidden field; pretend success without sending
    if (honeypot) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const body = new URLSearchParams({
        "form-name": ESTATE.enquiry.formName,
        name: values.name.trim(),
        phone: normaliseIndianMobile(values.phone) ?? values.phone,
        email: values.email.trim(),
        interest: values.interest,
        message: values.message.trim(),
        listing: context?.reference ? `${context.reference} — ${context.subject ?? ""}` : "",
        city: context?.city ?? "",
        page: typeof window !== "undefined" ? window.location.href : "",
      });
      const res = await fetch(ESTATE.enquiry.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <CircleCheck size={40} className="text-emerald-600" aria-hidden="true" />
        <h3 className="font-display text-2xl font-bold text-es-ink">Thank you{values.name ? `, ${values.name.trim().split(" ")[0]}` : ""}!</h3>
        <p className="text-es-body">
          Your enquiry has reached the R Colors Estate team. We&apos;ll call you on{" "}
          <strong className="text-es-ink">{formatPhone(normaliseIndianMobile(values.phone) ?? values.phone)}</strong> shortly.
        </p>
        <div className="flex flex-wrap gap-3">
          {onDone && (
            <button type="button" onClick={onDone} className="min-h-[44px] rounded-md bg-es-accent-strong px-5 font-semibold text-white hover:bg-es-ink">
              Done
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setValues((v) => ({ ...v, message: "" }));
            }}
            className="min-h-[44px] rounded-md border border-es-line px-5 font-semibold text-es-ink hover:border-es-ink"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const describe = (key: keyof Values, hint?: boolean) =>
    [errors[key] ? id(`${key}-error`) : null, hint ? id(`${key}-hint`) : null].filter(Boolean).join(" ") || undefined;
  const errorText = (name: keyof Values) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
        <CircleAlert size={14} aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-5" aria-describedby={context?.subject ? id("context") : undefined}>
      {context?.subject && (
        <p id={id("context")} className="rounded-md border border-es-line bg-es-surface px-4 py-3 text-sm text-es-body">
          Enquiring about <strong className="text-es-ink">{context.subject}</strong>
          {context.city ? `, ${context.city}` : ""}
        </p>
      )}

      {/* Honeypot: hidden from people and assistive tech, attractive to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("bot")}>Leave this field empty</label>
        <input id={id("bot")} name="bot-field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div>
        <label htmlFor={id("name")} className="mb-2 block text-sm font-semibold text-es-ink">
          Full Name <span aria-hidden="true">*</span>
        </label>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={set("name")}
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
          className={inputClass(!!errors.name)}
          placeholder="e.g. Rahul Sharma"
        />
        {errorText("name")}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("phone")} className="mb-2 block text-sm font-semibold text-es-ink">
            Phone Number <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={describe("phone")}
            className={inputClass(!!errors.phone)}
            placeholder="+91 XXXXX XXXXX"
          />
          {errorText("phone")}
        </div>
        <div>
          <label htmlFor={id("email")} className="mb-2 block text-sm font-semibold text-es-ink">
            Email Address
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={describe("email")}
            className={inputClass(!!errors.email)}
            placeholder="rahul@example.com"
          />
          {errorText("email")}
        </div>
      </div>

      <div>
        <label htmlFor={id("interest")} className="mb-2 block text-sm font-semibold text-es-ink">
          Interested In <span aria-hidden="true">*</span>
        </label>
        <select
          id={id("interest")}
          name="interest"
          required
          value={values.interest}
          onChange={set("interest")}
          aria-invalid={!!errors.interest}
          aria-describedby={describe("interest")}
          className={inputClass(!!errors.interest)}
        >
          <option value="">Select Property Type</option>
          {ENQUIRY_INTERESTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errorText("interest")}
      </div>

      <div>
        <label htmlFor={id("message")} className="mb-2 block text-sm font-semibold text-es-ink">
          Message
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={3}
          value={values.message}
          onChange={set("message")}
          className={`${inputClass(false)} resize-y`}
          placeholder="Any specific requirements or preferred location?"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            We couldn&apos;t send your enquiry just now. Please try again, or call us on{" "}
            <a href={`tel:+91${ESTATE.company.phones[0]}`} className="font-semibold underline">
              {formatPhone(ESTATE.company.phones[0])}
            </a>
            .
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-es-accent-strong px-6 font-bold text-white transition-colors hover:bg-es-ink disabled:cursor-wait disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <span>Submit Enquiry</span>
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-xs text-es-muted">We use your details only to respond to this enquiry.</p>
    </form>
  );
}
