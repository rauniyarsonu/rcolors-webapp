import { TrendingUp } from "lucide-react";
import type { Location } from "@/lib/estate/schema";

interface TrendingChipsProps {
  locations: Location[];
  selected: string[];
  onPick: (slug: string) => void;
}

/** Top areas of the selected city, computed from the data (never hard-coded) */
export default function TrendingChips({ locations, selected, onPick }: TrendingChipsProps) {
  if (!locations.length) return null;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <p className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-es-ink">
        <TrendingUp size={16} aria-hidden="true" className="text-es-accent-strong" />
        Trending
      </p>
      <ul className="es-scroll-x -my-1 flex gap-2 py-1" aria-label="Trending searches">
        {locations.map((l) => {
          const on = selected.length === 1 && selected[0] === l.slug;
          return (
            <li key={l.slug} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onPick(l.slug)}
                className={`min-h-[36px] rounded-full border px-3.5 text-sm transition-colors after:absolute after:-inset-1 relative ${
                  on ? "border-es-accent-strong bg-es-accent-strong text-white" : "border-es-line bg-es-surface text-es-body hover:border-es-accent-strong hover:text-es-accent-strong"
                }`}
              >
                {l.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
