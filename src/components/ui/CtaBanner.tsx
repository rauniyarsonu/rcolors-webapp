import { MessageCircle, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { COMPANY, telHref } from "@/config/company";

interface CtaBannerProps {
  eyebrow?: string;
  title: React.ReactNode;
  text: string;
  href?: string;
  label?: string;
  /** Adds Call and WhatsApp buttons beside the enquiry button */
  showContact?: boolean;
}

/** Professional full-width CTA banner with deep navy-to-ocean gradient, glassmorphic buttons, and trust indicators */
export default function CtaBanner({
  eyebrow,
  title,
  text,
  href = "/contact",
  label = "Contact Us Today",
  showContact = false,
}: CtaBannerProps) {
  const phone = COMPANY.phones[0];

  return (
    <section
      data-aos="fade-up"
      data-aos-duration="1000"
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#082238] via-brand-navy to-[#0a2c47] py-16 text-center text-white sm:py-20 md:py-24"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(40,169,220,0.2),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-brand-sky/15 blur-3xl"
      />
      {/* Top subtle highlight divider */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sky/40 to-transparent"
      />

      <div className="site-container relative z-10 max-w-4xl space-y-6 md:space-y-8">
        {/* Eyebrow badge */}
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-sky/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-sky backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-sky animate-pulse" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
        )}

        {/* Heading */}
        <h2 className="text-balance font-heading text-[clamp(2rem,1.5rem+3vw,3.25rem)] font-black leading-[1.15] tracking-tight text-white drop-shadow-sm">
          {title}
        </h2>

        {/* Body Text */}
        <p className="mx-auto max-w-2xl text-pretty text-base text-blue-100/90 sm:text-lg md:text-xl font-normal leading-relaxed">
          {text}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-stretch justify-center gap-3.5 pt-2 sm:flex-row sm:flex-wrap sm:items-center md:pt-4">
          <Link
            href={href}
            className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-white px-7 py-3 text-base font-bold text-brand-navy shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-sky hover:text-brand-navy hover:shadow-xl active:translate-y-0"
          >
            <span>{label}</span>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>

          {showContact && (
            <>
              <a
                href={telHref(phone)}
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-brand-navy hover:shadow-lg active:translate-y-0"
              >
                <Phone size={18} aria-hidden="true" className="text-brand-sky transition-colors group-hover:text-brand-navy" />
                <span>Call {phone}</span>
              </a>

              <a
                href={`https://wa.me/91${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:shadow-lg active:translate-y-0"
              >
                <MessageCircle size={18} aria-hidden="true" className="text-[#25D366] transition-colors group-hover:text-white" />
                <span>WhatsApp</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          )}
        </div>

        {/* Professional Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-xs text-blue-100/75 sm:mt-10 sm:pt-8 sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-sky" aria-hidden="true" />
            <span>Consultation & Site Visits</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-sky" aria-hidden="true" />
            <span>Transparent Quotations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-sky" aria-hidden="true" />
            <span>Timely Project Execution</span>
          </div>
        </div>
      </div>
    </section>
  );
}

