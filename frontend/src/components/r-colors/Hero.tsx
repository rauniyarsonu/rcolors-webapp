import { useState } from "react";
import HeroImage from "@/components/ui/HeroImage";
import ButtonLink from "@/components/construction/ButtonLink";

const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` });

export default function Hero() {
  const [ready, setReady] = useState(false);

  return (
    <section
      data-hero-pending={ready ? undefined : ""}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(600px,100vh)] items-end overflow-hidden bg-brand-navy text-white supports-[height:100svh]:min-h-[max(600px,100svh)]"
    >
      <HeroImage
        src="/images/finishinghero001.jpg"
        alt="Freshly painted interior finished by R Colors"
        className="object-center"
        ready={ready}
        onReady={() => setReady(true)}
      />
      {/* Contrast overlays, same treatment as the home hero slider */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="site-container relative pb-20 pt-32 md:pb-28 lg:pb-32">

        <h1
          id="hero-title"
          className="cx-rise mt-6 text-balance font-heading text-[clamp(2.25rem,1.4rem+4vw,4.5rem)] font-black leading-tight drop-shadow-lg"
          style={rise(160)}
        >
          <span className="block"> R Colors</span>
          <span className="block">Finishing Works</span>
        </h1>

        <p
          className="cx-rise mt-6 max-w-[58ch] border-l-4 border-brand-sky pl-4 text-base leading-relaxed text-gray-200 drop-shadow-md md:text-lg"
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
