import { BadgeCheck, Bath, BedDouble, Compass, MapPin, Route, Ruler } from "lucide-react";
import { FACINGS, LISTING_STATUSES, PROPERTY_TYPES } from "@/config/estate/catalog";
import type { AreaUnit } from "@/config/estate/units";
import { totalPrice, type EngineContext } from "@/lib/estate/engine";
import { formatArea, formatPrice, formatPriceLong } from "@/lib/estate/format";
import type { Property } from "@/lib/estate/schema";
import ListingImage from "./ListingImage";

export const CARD_SIZES = "(min-width: 1280px) 300px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw";

/** "200 sq yd" plus a converted figure when the visitor picked another unit */
export function areaText(p: Property, ctx: EngineContext, unit: AreaUnit) {
  const native = formatArea(p.areaValue, p.areaUnit);
  if (unit === p.areaUnit) return native;
  const sqft = ctx.areaSqft(p);
  const size = ctx.filterAreaToSqft(1, unit);
  return sqft && size ? `${native} (≈ ${formatArea(sqft / size, unit)})` : native;
}

interface PropertyCardProps {
  property: Property;
  ctx: EngineContext;
  cityName: string;
  unit: AreaUnit;
  onView: (id: string) => void;
  onEnquire: (p: Property) => void;
}

export default function PropertyCard({ property: p, ctx, cityName, unit, onView, onEnquire }: PropertyCardProps) {
  const type = PROPERTY_TYPES[p.type];
  const a = p.attributes;
  const price = totalPrice(p);
  const facts: { icon: typeof Ruler; text: string }[] = [{ icon: Ruler, text: areaText(p, ctx, unit) }];
  if (a.bhk) facts.push({ icon: BedDouble, text: `${a.bhk} BHK` });
  if (a.bathrooms) facts.push({ icon: Bath, text: `${a.bathrooms} Bath` });
  if (a.facing) facts.push({ icon: Compass, text: `${FACINGS[a.facing]} facing` });
  if (a.roadWidth && type.category === "land") facts.push({ icon: Route, text: `${a.roadWidth} ft road` });

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-es-line bg-white transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_-12px_rgba(15,60,99,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative">
        {/* Mouse shortcut to the details; keyboard users get the "View details" button */}
        <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => onView(p.id)} className="block w-full">
          <ListingImage src={p.images[0]} alt="" kind={type.category} sizes={CARD_SIZES} className="aspect-[4/3] w-full" />
        </button>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
          <span className="rounded bg-white/95 px-2 py-1 text-xs font-semibold text-es-ink shadow-sm">{type.label}</span>
          {p.verified && (
            <span className="flex items-center gap-1 rounded bg-es-accent-strong px-2 py-1 text-xs font-semibold text-white shadow-sm">
              <BadgeCheck size={14} aria-hidden="true" />
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-xl font-bold text-es-ink">
          <span aria-hidden="true">{formatPrice(price)}</span>
          <span className="sr-only">{formatPriceLong(price)}</span>
          {p.priceUnit === "per-area" && <span className="ml-1.5 text-xs font-medium text-es-muted">({formatPrice(p.price)} per {formatArea(1, p.areaUnit).replace(/^1 /, "")})</span>}
        </p>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-es-ink">{p.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-es-muted">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          {ctx.locationName(p.locationSlug)}, {cityName}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-es-body" aria-label="Key details">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5">
              <Icon size={14} aria-hidden="true" className="text-es-accent-strong" />
              {text}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-medium text-es-muted">{LISTING_STATUSES[p.status]}</p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            onClick={() => onView(p.id)}
            className="min-h-[44px] rounded-md border border-es-line text-sm font-semibold text-es-ink transition-colors hover:border-es-ink"
            aria-label={`View details: ${p.title}`}
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => onEnquire(p)}
            className="min-h-[44px] rounded-md bg-es-accent-strong text-sm font-semibold text-white transition-colors hover:bg-es-ink"
            aria-label={`Enquire about ${p.title}`}
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
