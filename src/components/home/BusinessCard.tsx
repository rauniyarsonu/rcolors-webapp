import Link from "next/link";
import Image from "next/image";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface BusinessCardProps {
  href: string;
  title: string;
  description?: string;
  /** Three short selling points, each with a small icon */
  highlights: { icon: LucideIcon; label: string }[];
  /** Short CTA text, rendered as "Explore {cta}" */
  cta: string;
  photo: string;
  photoAlt: string;
  logo: string;
  logoAlt: string;
  /** Set on the first card so the browser can prioritise it if it is above the fold */
  priority?: boolean;
}

/**
 * Business card: photo with a soft navy gradient, an overlapping white logo badge,
 * title, description, highlights and a CTA. The whole card is one link, so the CTA
 * is a styled span (nested links are invalid HTML). Hover only animates transform
 * and opacity; reduced-motion users get no movement.
 */
export default function BusinessCard({
  href,
  title,
  description,
  highlights,
  cta,
  photo,
  photoAlt,
  logo,
  logoAlt,
  priority = false,
}: BusinessCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-es-accent-strong focus-visible:ring-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Photo, 16:10, zooms slowly on hover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-navy/10">
        <Image
          src={photo}
          alt={photoAlt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/10 to-transparent"
        />
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-12 sm:px-8 sm:pb-8">
        {/* Logo badge overlaps the photo's bottom edge */}
        <div className="absolute -top-10 left-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-lg ring-1 ring-gray-100 sm:left-8">
          <div className="relative h-full w-full">
            <Image src={logo} alt={logoAlt} fill sizes="80px" className="object-contain" />
          </div>
        </div>

        <h3 className="text-balance font-heading text-xl font-extrabold leading-snug text-brand-navy sm:text-2xl">{title}</h3>
        {description && <p className="mt-3 text-base leading-relaxed text-gray-600">{description}</p>}

        <ul className="mt-5 space-y-2.5">
          {highlights.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-es-surface text-es-accent-strong">
                <Icon size={16} aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>

        {/* mt-auto pins the CTA to the bottom so equal-height cards line up */}
        <span className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-6 font-bold text-es-accent-strong transition-colors group-hover:text-brand-navy">
          Explore {cta}
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  );
}
