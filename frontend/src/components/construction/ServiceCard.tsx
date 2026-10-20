import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import ButtonLink from "./ButtonLink";

export interface ServiceItem {
  index: string;
  total: string;
  title: string;
  tagline?: string;
  desc: string;
  scopeBadge: string;
  image: string;
  imageAlt: string;
  capabilities: string[];
  ctaText: string;
  ctaHref: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  /** Puts the image on the right from lg up, for alternating rows */
  flip?: boolean;
  capabilitiesLabel?: string;
  /** "link" is the underlined text link, "button" an outline-dark ButtonLink */
  ctaStyle?: "link" | "button";
}

export default function ServiceCard({
  service,
  flip = false,
  capabilitiesLabel = "Key Deliverables & Standards",
  ctaStyle = "link",
}: ServiceCardProps) {
  return (
    <article
      aria-labelledby={`service-title-${service.index}`}
      className="group relative rounded-sm border border-cx-ink/10 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(32,37,34,0.05)] transition-all duration-300 hover:border-brand-sky/60 hover:shadow-[0_12px_36px_-6px_rgba(32,37,34,0.1)] sm:p-8 md:p-10 lg:p-12"
    >
      <div
        className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Image Column */}
        <div className="lg:col-span-6 xl:col-span-5">
          <Reveal delay={100}>
            <div className="relative">
              {/* Decorative framing corner accents */}
              <div
                aria-hidden="true"
                className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-brand-sky transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-brand-sky transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
              />

              {/* Image Container with 4:3 architectural aspect */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs bg-cx-concrete">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 460px, (min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle gradient vignette for contrast */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-cx-ink/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                />

                {/* Scope badge */}
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="inline-flex items-center rounded-xs bg-cx-ink/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {service.scopeBadge}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
          <Reveal delay={150}>
            {/* Architectural Index Counter */}
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold tracking-[0.2em] text-brand-sky">
                {service.index}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-cx-ink/20" />
              <span className="text-xs uppercase tracking-[0.2em] text-cx-muted font-medium">
                Scope {service.index} of {service.total}
              </span>
            </div>

            {/* Title */}
            <h3
              id={`service-title-${service.index}`}
              className="mt-3 font-display text-2xl font-semibold tracking-[-0.015em] text-cx-ink sm:text-3xl lg:text-[2rem]"
            >
              {service.title}
            </h3>

            {/* Tagline */}
            {service.tagline && (
              <p className="mt-2 text-sm font-medium text-brand-sky sm:text-base">{service.tagline}</p>
            )}

            {/* Description */}
            <p className="mt-4 text-[15px] leading-relaxed text-cx-muted sm:text-base max-w-[58ch]">
              {service.desc}
            </p>

            {/* Capabilities Checklist */}
            <div className="mt-6 pt-6 border-t border-cx-ink/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cx-ink">{capabilitiesLabel}</p>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {service.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="flex items-start gap-2.5 rounded-xs border border-cx-ink/5 bg-cx-paper px-3 py-2 text-xs sm:text-[13px] font-medium text-cx-ink transition-colors group-hover:border-cx-ink/10"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-brand-sky"
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Action Link */}
            <div className="mt-8">
              {ctaStyle === "button" ? (
                <ButtonLink href={service.ctaHref} variant="outline-dark" className="w-full sm:w-auto">
                  {service.ctaText}
                </ButtonLink>
              ) : (
                <Link
                  href={service.ctaHref}
                  className="group/link inline-flex min-h-[44px] items-center gap-2.5 border-b-2 border-cx-ink/30 pb-1 text-sm font-semibold text-cx-ink transition-all duration-200 hover:border-brand-sky hover:text-brand-sky"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/link:translate-x-1.5 motion-reduce:transition-none"
                  />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
