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
    <section className="relative isolate overflow-hidden border-t border-gray-100 bg-white py-20 md:py-28 text-brand-navy">
      {/* Ambient background glows (same as the home page CtaBanner) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(40,169,220,0.08),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-brand-sky/10 blur-3xl"
      />
      {/* Top subtle highlight divider */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sky/40 to-transparent"
      />
      <div className="site-container relative max-w-4xl text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-es-accent-strong md:text-base">{eyebrow}</p>
          <h2 className="mt-3 text-balance font-heading text-[clamp(2rem,1.5rem+3vw,3.25rem)] font-black leading-[1.15] tracking-tight text-brand-navy">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-[58ch] text-base leading-relaxed text-gray-600 md:text-lg">{body}</p>
          {/* Full-width stacked buttons on phones, side by side from sm (matches the hero) */}
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href={primary.href} variant="primary" className="w-full sm:w-auto">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="outline-dark" className="w-full sm:w-auto">
              {secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
