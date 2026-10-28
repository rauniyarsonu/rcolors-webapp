import { useState } from "react";
import HeroImage from "@/components/ui/HeroImage";
import ButtonLink from "./ButtonLink";

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
        src="/images/home4.jpg"
        alt="Tower crane above a high-rise under construction at sunset"
        className="object-[30%_50%]"
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
          <span className="block">R Colors Construction</span>
          <span className="block">and Developers</span>
        </h1>

        <p
          className="cx-rise mt-6 max-w-[58ch] border-l-4 border-brand-sky pl-4 text-base leading-relaxed text-gray-200 drop-shadow-md md:text-lg"
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

    </section>
  );
}
