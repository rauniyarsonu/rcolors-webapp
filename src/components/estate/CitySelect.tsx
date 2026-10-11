"use client";

import { ChevronDown, MapPin } from "lucide-react";
import type { City } from "@/lib/estate/schema";

interface CitySelectProps {
  cities: City[];
  /** Selected slug, or "" when a choice is still required */
  value: string;
  onChange: (slug: string) => void;
  requireSelection: boolean;
  id: string;
}

/** Native select: the most robust accessible dropdown, and it lists only enabled cities with data */
export default function CitySelect({ cities, value, onChange, requireSelection, id }: CitySelectProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        City
      </label>
      <MapPin size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-es-accent-strong" />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[52px] w-full appearance-none rounded-md border border-es-line bg-white pl-11 pr-10 text-base font-semibold text-es-ink outline-none transition-colors hover:border-slate-400 focus:border-es-accent-strong focus:ring-2 focus:ring-es-accent-strong/25"
      >
        {requireSelection && (
          <option value="" disabled>
            Select city
          </option>
        )}
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-es-muted" />
    </div>
  );
}
