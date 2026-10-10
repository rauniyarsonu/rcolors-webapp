"use client";

import { Building, MapPin, Ruler } from "lucide-react";
import { PROJECT_STATUSES, PROJECT_TYPES } from "@/config/estate/catalog";
import type { EngineContext } from "@/lib/estate/engine";
import { formatPrice, formatPriceLong } from "@/lib/estate/format";
import type { Project } from "@/lib/estate/schema";
import ListingImage from "./ListingImage";
import { CARD_SIZES } from "./PropertyCard";

const STATUS_STYLE: Record<Project["status"], string> = {
  upcoming: "bg-white/95 text-es-ink",
  "under-construction": "bg-amber-100 text-amber-900",
  ready: "bg-emerald-100 text-emerald-900",
};

interface ProjectCardProps {
  project: Project;
  ctx: EngineContext;
  cityName: string;
  onView: (id: string) => void;
  onEnquire: (p: Project) => void;
}

export default function ProjectCard({ project: p, ctx, cityName, onView, onEnquire }: ProjectCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-es-line bg-white transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_-12px_rgba(15,60,99,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative">
        <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => onView(p.id)} className="block w-full">
          <ListingImage src={p.images[0]} alt="" kind="project" sizes={CARD_SIZES} className="aspect-[4/3] w-full" />
        </button>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap justify-between gap-2">
          <span className="rounded bg-white/95 px-2 py-1 text-xs font-semibold text-es-ink shadow-sm">{PROJECT_TYPES[p.type].label}</span>
          <span className={`rounded px-2 py-1 text-xs font-semibold shadow-sm ${STATUS_STYLE[p.status]}`}>{PROJECT_STATUSES[p.status]}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-es-ink">{p.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-es-body">
          <Building size={14} aria-hidden="true" className="shrink-0 text-es-accent-strong" />
          {p.developer}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-es-muted">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          {ctx.locationName(p.locationSlug)}, {cityName}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-es-line pt-3">
          <div>
            <p className="text-xs text-es-muted">Starting from</p>
            <p className="font-display text-lg font-bold text-es-ink">
              <span aria-hidden="true">{formatPrice(p.startingPrice)}</span>
              <span className="sr-only">{formatPriceLong(p.startingPrice)}</span>
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-right text-[13px] text-es-body">
            <Ruler size={14} aria-hidden="true" className="shrink-0 text-es-accent-strong" />
            {p.sizeRange}
          </p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            onClick={() => onView(p.id)}
            className="min-h-[44px] rounded-md border border-es-line text-sm font-semibold text-es-ink transition-colors hover:border-es-ink"
            aria-label={`View details: ${p.name}`}
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onEnquire(p)}
            className="min-h-[44px] rounded-md bg-es-accent-strong text-sm font-semibold text-white transition-colors hover:bg-es-ink"
            aria-label={`Enquire about ${p.name}`}
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
