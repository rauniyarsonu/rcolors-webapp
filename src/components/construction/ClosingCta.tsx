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
    <section className="cx-on-dark relative isolate overflow-hidden bg-cx-ink py-20 md:py-28 text-white">
      {/* Subtle decorative architectural glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(40,169,220,0.22),transparent)]"
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
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonLink href={primary.href} variant="primary-on-dark">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="outline-light">
              {secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
