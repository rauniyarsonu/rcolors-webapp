import { useId, useRef, useState } from "react";
import { ArrowRight, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { PROPERTY_TYPES, type PropertyType } from "@/config/estate/catalog";
import { ESTATE } from "@/config/estate/site";
import { formatPhone, normaliseIndianMobile } from "@/lib/estate/format";
import { EMAIL, inputClass } from "./EnquiryForm";

interface Values {
  name: string;
  phone: string;
  email: string;
  propertyType: PropertyType | "";
  location: string;
  area: string;
  price: string;
  message: string;
}
type Errors = Partial<Record<keyof Values, string>>;

const LAND = (Object.keys(PROPERTY_TYPES) as PropertyType[]).filter((k) => PROPERTY_TYPES[k].category === "land");
const BUILT = (Object.keys(PROPERTY_TYPES) as PropertyType[]).filter((k) => PROPERTY_TYPES[k].category === "property");

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!v.phone.trim()) e.phone = "Please enter your phone number.";
  else if (!normaliseIndianMobile(v.phone)) e.phone = "Enter a 10-digit Indian mobile number, e.g. 98765 43210.";
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, or leave it blank.";
  if (!v.propertyType) e.propertyType = "Please choose the type of property.";
  if (v.location.trim().length < 3) e.location = "Please enter the locality, village or address.";
  return e;
}

/**
 * "Sell Your Property" registration, submitted to the backend
 * (POST /api/estate/sell-requests). The team calls the owner back to verify and list it.
 */
export default function SellForm({ city }: { city: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const empty: Values = { name: "", phone: "", email: "", propertyType: "", location: "", area: "", price: "", message: "" };
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
        "form-name": ESTATE.sellRequest.formName,
        name: values.name.trim(),
        phone: normaliseIndianMobile(values.phone) ?? values.phone,
        email: values.email.trim(),
        propertyType: values.propertyType,
        location: values.location.trim(),
        area: values.area.trim(),
        price: values.price.trim(),
        message: values.message.trim(),
        city,
        page: typeof window !== "undefined" ? window.location.href : "",
      });
      const res = await fetch(ESTATE.sellRequest.endpoint, {
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
          We&apos;ve received your property details. Our team will call you on{" "}
          <strong className="text-es-ink">{formatPhone(normaliseIndianMobile(values.phone) ?? values.phone)}</strong> to verify the documents and get it listed.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setValues((v) => ({ ...empty, name: v.name, phone: v.phone, email: v.email }));
            setTouched(false);
          }}
          className="min-h-[44px] rounded-md border border-es-line px-5 font-semibold text-es-ink hover:border-es-ink"
        >
          Register another property
        </button>
      </div>
    );
  }

  const describe = (key: keyof Values) => (errors[key] ? id(`${key}-error`) : undefined);
  const errorText = (name: keyof Values) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
        <CircleAlert size={14} aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null;
  const label = (name: keyof Values, text: string, required = false) => (
    <label htmlFor={id(name)} className="mb-2 block text-sm font-semibold text-es-ink">
      {text} {required && <span aria-hidden="true">*</span>}
    </label>
  );

  const legend = (step: string, text: string) => (
    <legend className="flex items-center gap-3 font-display text-lg font-bold text-es-ink">
      <span aria-hidden="true" className="text-sm font-bold text-es-accent-strong">
        {step}
      </span>
      {text}
    </legend>
  );

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-8">
      {/* Honeypot: hidden from people and assistive tech, attractive to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("bot")}>Leave this field empty</label>
        <input id={id("bot")} name="bot-field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <fieldset className="space-y-5">
        {legend("01", "Your details")}
        <div>
          {label("name", "Owner's Full Name", true)}
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
            {label("phone", "Phone Number", true)}
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
            {label("email", "Email Address")}
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
      </fieldset>

      <fieldset className="space-y-5 border-t border-es-line pt-8">
        {legend("02", "Property details")}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            {label("propertyType", "Property Type", true)}
            <select
              id={id("propertyType")}
              name="propertyType"
              required
              value={values.propertyType}
              onChange={set("propertyType")}
              aria-invalid={!!errors.propertyType}
              aria-describedby={describe("propertyType")}
              className={inputClass(!!errors.propertyType)}
            >
              <option value="">Select Property Type</option>
              <optgroup label="Land & Plots">
                {LAND.map((k) => (
                  <option key={k} value={k}>
                    {PROPERTY_TYPES[k].label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Built Property">
                {BUILT.map((k) => (
                  <option key={k} value={k}>
                    {PROPERTY_TYPES[k].label}
                  </option>
                ))}
              </optgroup>
            </select>
            {errorText("propertyType")}
          </div>
          <div>
            {label("location", "Location", true)}
            <input
              id={id("location")}
              name="location"
              type="text"
              autoComplete="street-address"
              required
              value={values.location}
              onChange={set("location")}
              aria-invalid={!!errors.location}
              aria-describedby={describe("location")}
              className={inputClass(!!errors.location)}
              placeholder={`Locality or village, ${city}`}
            />
            {errorText("location")}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            {label("area", "Area / Size")}
            <input id={id("area")} name="area" type="text" value={values.area} onChange={set("area")} className={inputClass(false)} placeholder="e.g. 1200 sq ft or 2 bigha" />
          </div>
          <div>
            {label("price", "Expected Price")}
            <input id={id("price")} name="price" type="text" value={values.price} onChange={set("price")} className={inputClass(false)} placeholder="e.g. ₹45 lakh" />
          </div>
        </div>

        <div>
          {label("message", "Anything else?")}
          <textarea
            id={id("message")}
            name="message"
            rows={3}
            value={values.message}
            onChange={set("message")}
            className={`${inputClass(false)} resize-y`}
            placeholder="Road width, facing, documents available, best time to call…"
          />
        </div>
      </fieldset>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            We couldn&apos;t send your details just now. Please try again, or call us on{" "}
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
            <span>Register My Property</span>
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="-mt-4 text-center text-xs text-es-muted">We use your details only to contact you about selling this property.</p>
    </form>
  );
}
