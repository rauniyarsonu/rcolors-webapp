import ButtonLink from "./ButtonLink";
import Reveal from "./Reveal";

interface ClosingCtaProps {
  eyebrow: string;
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

export default function ClosingCta({ eyebrow, title, body, primary, secondary }: ClosingCtaProps) {
  return (
    <section className="cx-on-dark relative isolate overflow-hidden bg-brand-navy py-20 md:py-28 text-white border-b border-white/10">
      {/* Subtle decorative architectural glow using brand-sky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(40,169,220,0.28),transparent)]"
      />
      {/* Subtle brand theme depth gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0c3152] via-brand-navy to-[#0a2742]"
      />
      {/* Decorative architectural slant accent matching brand theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 translate-x-1/4 skew-x-12 bg-brand-sky/[0.05]"
      />
      <div className="cx-container relative text-center">
        <Reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-sky">
            <span aria-hidden="true" className="h-px w-8 bg-brand-sky/70" />
            <span>{eyebrow}</span>
            <span aria-hidden="true" className="h-px w-8 bg-brand-sky/70" />
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.02em] text-white">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-[58ch] text-base leading-relaxed text-white/80 md:text-lg">{body}</p>
          {/* Full-width stacked buttons on phones, side by side from sm (matches the hero) */}
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href={primary.href} variant="primary-on-dark" className="w-full sm:w-auto">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="outline-light" className="w-full sm:w-auto">
              {secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
