import { useState } from "react";
import HeroImage from "@/components/ui/HeroImage";
import ButtonLink from "@/components/construction/ButtonLink";
import { ESTATE } from "@/config/estate/site";

const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` });

interface EstateHeroProps {
  /** H1 override for locality landing pages */
  title?: string;
}

/** Full-screen hero in the construction / R Colors style; the search card overlaps its lower edge.
 * From md up it is 7rem shorter than the viewport so the whole search card fits on landing. */
export default function EstateHero({ title }: EstateHeroProps) {
  const [ready, setReady] = useState(false);

  return (
    <section
      data-hero-pending={ready ? undefined : ""}
      aria-labelledby="es-hero-title"
      className="es-on-dark relative isolate flex min-h-[max(600px,100vh)] items-end overflow-hidden bg-brand-navy text-white supports-[height:100svh]:min-h-[max(600px,100svh)] md:min-h-[max(600px,calc(100svh_-_7rem))]"
    >
      <HeroImage
        src={ESTATE.heroImage.src}
        alt={ESTATE.heroImage.alt}
        className="object-[50%_40%]"
        ready={ready}
        onReady={() => setReady(true)}
      />
      {/* Contrast overlays, same treatment as the home hero slider */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Extra bottom padding leaves room for the overlapping search card */}
      <div className="es-container relative pb-40 pt-32 md:pb-48 lg:pb-52">
        <h1
          id="es-hero-title"
          className="cx-rise mt-6 max-w-4xl text-balance font-heading text-[clamp(2.25rem,1.4rem+4vw,4.5rem)] font-black leading-tight drop-shadow-lg"
          style={rise(160)}
        >
          {title ?? ESTATE.brand}
        </h1>

        <p
          className="cx-rise mt-6 max-w-[58ch] border-l-4 border-brand-sky pl-4 text-base leading-relaxed text-gray-200 drop-shadow-md md:text-lg"
          style={rise(240)}
        >
          From search to keys, we&apos;ve got you covered. Verified plots, homes and commercial spaces with proper documentation and
          transparent deals.
        </p>

        <div className="cx-rise mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" style={rise(320)}>
          <ButtonLink href="#services" variant="primary-on-dark" className="w-full sm:w-auto">
            Explore Our Services
          </ButtonLink>
          <ButtonLink href="#sell" variant="light-on-dark" arrow={false} className="w-full sm:w-auto">
            Sell Your Property
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
