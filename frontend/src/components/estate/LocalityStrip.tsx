import { LOCATION_TYPE_LABELS } from "@/config/estate/catalog";
import type { AreaCount } from "@/lib/estate/engine";
import { isRegional } from "@/lib/estate/locationTree";

interface LocalityStripProps {
  cityName: string;
  areas: AreaCount[];
  selected: string[];
  onToggle: (slug: string) => void;
  onAll: () => void;
}

/** Horizontally scrollable multi-select chips with live counts for the active tab */
export default function LocalityStrip({ cityName, areas, selected, onToggle, onAll }: LocalityStripProps) {
  // Results first, then config order; areas without results stay reachable at the end
  const ordered = [...areas].sort((a, b) => Number(b.count > 0) - Number(a.count > 0) || b.count - a.count);
  const chip = (on: boolean) =>
    `flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
      on ? "border-es-accent-strong bg-es-accent-strong text-white" : "border-es-line bg-white text-es-body hover:border-es-accent-strong hover:text-es-accent-strong"
    }`;

  return (
    <nav aria-labelledby="es-locality-strip" className="border-b border-es-line bg-white">
      <div className="es-container flex items-center gap-4 py-3">
        <h2 id="es-locality-strip" className="hidden shrink-0 text-sm font-bold text-es-ink md:block">
          Browse by locality
        </h2>
        <ul className="es-scroll-x -mx-4 flex flex-1 gap-2 px-4 md:mx-0 md:px-0">
          <li className="shrink-0">
            <button type="button" aria-pressed={selected.length === 0} onClick={onAll} className={chip(selected.length === 0)}>
              All {cityName}
            </button>
          </li>
          {ordered.map(({ location, count }) => {
            const on = selected.includes(location.slug);
            return (
              <li key={location.slug} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle(location.slug)}
                  className={`${chip(on)} ${!on && count === 0 ? "text-es-muted" : ""}`}
                >
                  {location.name}
                  {isRegional(location) && (
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${on ? "bg-white/20" : "bg-es-surface text-es-accent-strong"}`}>
                      {LOCATION_TYPE_LABELS[location.type]}
                    </span>
                  )}
                  <span className={on ? "text-white/90" : "text-es-muted"}>({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
