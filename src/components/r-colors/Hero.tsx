import Image from "next/image";
import ButtonLink from "@/components/construction/ButtonLink";

const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` });

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="cx-on-dark relative isolate flex min-h-[max(600px,90vh)] items-end overflow-hidden bg-cx-ink text-white supports-[height:100svh]:min-h-[max(600px,90svh)]"
    >
      <Image
        src="/images/Rcolors-1.jpg"
        alt="Freshly painted interior finished by R Colors"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Contrast overlays: kept to the top (navigation) and lower-left (copy) */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-cx-ink/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-cx-ink via-cx-ink/55 to-cx-ink/5" />
      {/* Small screens: copy covers most of the frame, so tone the whole image down slightly */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-cx-ink/35 md:hidden" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-cx-ink/75 via-cx-ink/25 to-transparent" />

      <div className="cx-container relative pb-20 pt-32 md:pb-28 lg:pb-32">

        <h1
          id="hero-title"
          className="cx-rise mt-6 font-display text-[clamp(2.5rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          style={rise(160)}
        >
          <span className="block">Finishing &amp; Interiors.</span>
          <span className="block text-white/80">Done with Precision.</span>
        </h1>

        <p
          className="cx-rise mt-8 max-w-[58ch] text-base leading-relaxed text-white/85 md:text-lg"
          style={rise(240)}
        >
          Delivering high-quality finishing and interior solutions designed to enhance durability, functionality, and
          aesthetic appeal.
        </p>

        <div className="cx-rise mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" style={rise(320)}>
          <ButtonLink href="#services" variant="primary-on-dark" className="w-full sm:w-auto">
            Explore Our Services
          </ButtonLink>
          <ButtonLink href="/projects?business=r-colors" variant="outline-light" arrow={false} className="w-full sm:w-auto">
            View Portfolio
          </ButtonLink>
        </div>
      </div>

    </section>
  );
}
