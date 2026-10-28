import Image from "@/components/ui/Image";
import { ArrowRight, BadgeCheck, Tag } from "lucide-react";
import { ESTATE } from "@/config/estate/site";

interface EstateHeroProps {
  cityName: string;
  /** H1 override for locality landing pages */
  title?: string;
  /** Scrolls to the "Sell Your Property" form */
  onSell?: () => void;
}

/** Full-bleed photo with a navy overlay; the search card overlaps its lower edge */
export default function EstateHero({ title, onSell }: EstateHeroProps) {
  return (
    <section aria-labelledby="es-hero-title" className="es-on-dark relative isolate overflow-hidden bg-es-ink text-white">
      <Image src={ESTATE.heroImage.src} alt={ESTATE.heroImage.alt} fill priority sizes="100vw" className="-z-20 object-cover object-[50%_40%]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-es-ink/85 via-es-ink/60 to-es-ink/90" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-es-ink/70 to-transparent" />

      <div className="es-container pb-36 pt-28 md:pb-40 md:pt-36 lg:pt-40">

        <h1 id="es-hero-title" className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-balance">
          {title ?? ESTATE.brand}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85 md:text-xl">From Search to Keys, we&apos;ve got you covered.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white">
            <BadgeCheck size={16} aria-hidden="true" className="text-es-accent" />
            Verified listings &amp; proper documentation
          </p>
          {onSell && (
            <button
              type="button"
              onClick={onSell}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-es-ink shadow-sm transition-colors hover:bg-es-surface"
            >
              <Tag size={16} aria-hidden="true" className="text-es-accent-strong" />
              Sell your property
              <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
