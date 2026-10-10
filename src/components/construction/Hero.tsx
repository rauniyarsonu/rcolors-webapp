import Image from "next/image";
import Link from "next/link";
import ButtonLink from "./ButtonLink";

const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` });

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="cx-on-dark relative isolate flex min-h-[max(600px,90vh)] items-end overflow-hidden bg-cx-ink text-white supports-[height:100svh]:min-h-[max(600px,90svh)]"
    >
      <Image
        src="/images/home4.jpg"
        alt="Tower crane above a high-rise under construction at sunset"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[30%_50%]"
      />
      {/* Contrast overlays: kept to the top (navigation) and lower-left (copy) */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-cx-ink/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-cx-ink via-cx-ink/55 to-cx-ink/5" />
      {/* Small screens: copy covers most of the frame, so tone the whole image down slightly */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-cx-ink/35 md:hidden" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-cx-ink/75 via-cx-ink/25 to-transparent" />

      <div className="cx-container relative pb-20 pt-32 md:pb-28 lg:pb-32">

        <p
          className="cx-rise mt-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 md:mt-14 md:tracking-[0.24em]"
          style={rise(80)}
        >
          <span aria-hidden="true" className="h-px w-6 shrink-0 bg-cx-accent md:w-10" />
          R Colors Construction &amp; Developers
        </p>

        <h1
          id="hero-title"
          className="cx-rise mt-6 font-display text-[clamp(2.5rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          style={rise(160)}
        >
          <span className="block">Building Strong Foundations.</span>
          <span className="block text-white/80">Creating Lasting Value.</span>
        </h1>

        <p
          className="cx-rise mt-8 max-w-[58ch] text-base leading-relaxed text-white/85 md:text-lg"
          style={rise(240)}
        >
          From residential developments to commercial spaces, we bring together thoughtful planning, engineering
          precision and quality execution to build spaces designed for the future.
        </p>

        <div className="cx-rise mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" style={rise(320)}>
          <ButtonLink href="#expertise" variant="primary-on-dark" className="w-full sm:w-auto">
            Explore Our Expertise
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline-light" arrow={false} className="w-full sm:w-auto">
            View Our Projects
          </ButtonLink>
        </div>
      </div>

      {/* Decorative edge details, desktop only */}
      <p
        aria-hidden="true"
        className="absolute bottom-32 right-10 hidden rotate-180 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60 [writing-mode:vertical-rl] lg:block xl:right-12"
      >
        Construction &bull; Development &bull; Project Management
      </p>
      <div aria-hidden="true" className="absolute bottom-0 right-10 hidden h-20 w-px overflow-hidden bg-white/15 lg:block xl:right-12">
        <span className="cx-scroll-line block h-full w-full bg-cx-accent" />
      </div>
    </section>
  );
}
