import { filtersFor, type FilterDef, type RangeFilterDef } from "@/config/estate/filters";
import { AREA_UNITS, type AreaUnit } from "@/config/estate/units";
import type { EngineContext, QueryState } from "@/lib/estate/engine";
import { formatNumber, formatPrice } from "@/lib/estate/format";

export interface Chip {
  id: string;
  label: string;
  remove: (s: QueryState) => QueryState;
}

export function formatRangeValue(def: RangeFilterDef, n: number, unit: AreaUnit): string {
  if (def.format === "currency") return formatPrice(n);
  if (def.format === "area") return `${formatNumber(n, 2)} ${AREA_UNITS[unit].label}`;
  return `${formatNumber(n, 2)}${def.suffix ? ` ${def.suffix}` : ""}`;
}

export function multiLabel(def: Extract<FilterDef, { type: "multi" }>, value: string): string {
  return def.options?.find((o) => o.value === value)?.label ?? def.optionLabel?.(value) ?? value;
}

/** Removable chips for every active filter, in config order */
export function activeChips(state: QueryState, ctx: EngineContext): Chip[] {
  const chips: Chip[] = state.loc.map((slug) => ({
    id: `loc-${slug}`,
    label: ctx.locationName(slug),
    remove: (s) => ({ ...s, loc: s.loc.filter((x) => x !== slug) }),
  }));
  if (state.q) chips.push({ id: "q", label: `“${state.q}”`, remove: (s) => ({ ...s, q: "" }) });

  for (const def of filtersFor(state.tab, state.segment)) {
    if (def.type === "multi") {
      for (const v of state.multi[def.key] ?? []) {
        chips.push({
          id: `${def.key}-${v}`,
          label: multiLabel(def, v),
          remove: (s) => ({ ...s, multi: { ...s.multi, [def.key]: (s.multi[def.key] ?? []).filter((x) => x !== v) } }),
        });
      }
    } else if (def.type === "range") {
      const r = state.range[def.key];
      if (!r || (r.min === undefined && r.max === undefined)) continue;
      const f = (n: number) => formatRangeValue(def, n, state.unit);
      const text = r.min !== undefined && r.max !== undefined ? `${f(r.min)} – ${f(r.max)}` : r.min !== undefined ? `${f(r.min)}+` : `Up to ${f(r.max!)}`;
      chips.push({
        id: def.key,
        label: `${def.label}: ${text}`,
        remove: (s) => {
          const range = { ...s.range };
          delete range[def.key];
          return { ...s, range };
        },
      });
    } else if (def.type === "toggle" && state.toggle[def.key]) {
      chips.push({ id: def.key, label: def.toggleLabel, remove: (s) => ({ ...s, toggle: { ...s.toggle, [def.key]: false } }) });
    } else if (def.type === "search" && state.search[def.key]?.trim()) {
      chips.push({ id: def.key, label: `${def.label}: ${state.search[def.key]}`, remove: (s) => ({ ...s, search: { ...s.search, [def.key]: "" } }) });
    }
  }
  return chips;
}
