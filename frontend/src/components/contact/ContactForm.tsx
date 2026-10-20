import { useId, useRef, useState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { COMPANY, telHref } from "@/config/company";
import { normaliseIndianMobile } from "@/lib/estate/format";

interface Values {
  name: string;
  phone: string;
  email: string;
  business: string;
  message: string;
}
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!v.phone.trim()) e.phone = "Please enter your phone number.";
  else if (!normaliseIndianMobile(v.phone)) e.phone = "Enter a 10-digit mobile number, e.g. 98765 43210.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, e.g. name@example.com.";
  if (!v.business) e.business = "Please choose a business or subject.";
  if (v.message.trim().length < 5) e.message = "Please tell us a little about your requirement.";
  return e;
}

// text-base (16px) keeps iOS Safari from zooming in when a field is focused
const inputClass = (invalid: boolean) =>
  `w-full min-h-12 rounded-lg border bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky ${
    invalid ? "border-red-600" : "border-gray-300 hover:border-gray-400"
  }`;

const businesses = [
  { value: "general", label: "General Inquiry" },
  { value: "construction", label: "Construction & Developers" },
  { value: "r-colors", label: "R Colors Finishing Works" },
  { value: "estate", label: "R Colors Estate (Real Estate)" },
];

const empty: Values = { name: "", phone: "", email: "", business: "", message: "" };

/** "Send Us A Message" form, submitted to the backend (POST /api/contact) */
export default function ContactForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(empty);
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
        "form-name": COMPANY.contactForm.formName,
        name: values.name.trim(),
        phone: normaliseIndianMobile(values.phone) ?? values.phone,
        email: values.email.trim(),
        business: values.business,
        message: values.message.trim(),
      });
      const res = await fetch(COMPANY.contactForm.endpoint, {
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
      <div role="status" className="flex flex-col items-start gap-4 py-4">
        <CircleCheck size={40} className="text-emerald-600" aria-hidden="true" />
        <p className="font-heading text-2xl font-black text-brand-navy">Thank you{values.name ? `, ${values.name.trim().split(" ")[0]}` : ""}!</p>
        <p className="text-gray-600">Your message has reached our team. We&apos;ll get back to you shortly.</p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setTouched(false);
            setStatus("idle");
          }}
          className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-5 font-semibold text-brand-navy transition-colors hover:border-brand-navy"
        >
          Send another message
        </button>
      </div>
    );
  }

  const describedBy = (key: keyof Values) => (errors[key] ? id(`${key}-error`) : undefined);
  const field = (key: keyof Values) => ({
    id: id(key),
    name: key,
    value: values[key],
    onChange: set(key),
    "aria-invalid": !!errors[key],
    "aria-describedby": describedBy(key),
    required: true,
  });
  const label = (key: keyof Values, text: string) => (
    <label htmlFor={id(key)} className="mb-2 block text-sm font-medium text-gray-700">
      {text} <span aria-hidden="true">*</span>
    </label>
  );
  const errorText = (key: keyof Values) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
        <CircleAlert size={14} className="shrink-0" aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null;

  return (
    <form ref={formRef} name={COMPANY.contactForm.formName} noValidate onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
      {/* Honeypot: hidden from people and assistive tech, attractive to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("bot")}>Leave this field empty</label>
        <input id={id("bot")} name="bot-field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <div>
          {label("name", "Your Name")}
          <input {...field("name")} type="text" autoComplete="name" className={inputClass(!!errors.name)} placeholder="John Doe" />
          {errorText("name")}
        </div>
        <div>
          {label("phone", "Phone Number")}
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" className={inputClass(!!errors.phone)} placeholder="+91 XXXXX XXXXX" />
          {errorText("phone")}
        </div>
      </div>

      <div>
        {label("email", "Email Address")}
        <input {...field("email")} type="email" inputMode="email" autoComplete="email" className={inputClass(!!errors.email)} placeholder="johndoe@example.com" />
        {errorText("email")}
      </div>

      <div>
        {label("business", "Interested Business / Subject")}
        <select {...field("business")} className={inputClass(!!errors.business)}>
          <option value="">Select a business</option>
          {businesses.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        {errorText("business")}
      </div>

      <div>
        {label("message", "Your Message")}
        <textarea {...field("message")} rows={5} className={`${inputClass(!!errors.message)} resize-y`} placeholder="Tell us about your requirement..." />
        {errorText("message")}
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            We couldn&apos;t send your message just now. Please try again, or call us on{" "}
            <a href={telHref(COMPANY.phones[0])} className="font-semibold underline">
              {COMPANY.phones[0]}
            </a>
            .
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-brand-sky px-6 text-base font-bold text-white transition-colors hover:bg-brand-navy disabled:cursor-wait disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
