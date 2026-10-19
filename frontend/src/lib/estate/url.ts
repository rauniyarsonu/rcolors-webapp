/**
 * Query-string <-> QueryState. Keys come from the filter config, so a new
 * filter gets URL support automatically. Defaults are omitted, which keeps
 * URLs short and makes the bare page URL the default view.
 *
 *   ?tab=buy&category=land&loc=gomti-nagar,chinhat&q=corner&type=residential-plot
 *   &min=2500000&max=10000000&amin=100&amax=300&unit=sqyd&status=ready&bhk=2,3
 *   &facing=east&road=30&corner=1&verified=1&sort=price-asc&view=lko-p-001
 */
import { SEGMENTS, TABS, type Segment, type Tab } from "../../config/estate/catalog";
import { FILTERS, SORTS } from "../../config/estate/filters";
import { DEFAULT_AREA_UNIT } from "../../config/estate/units";
import { emptyState, type QueryState } from "./engine";
import { isAreaUnit } from "./units";

const list = (v: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const num = (v: string | null) => {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseQuery(params: URLSearchParams): QueryState {
  const tabParam = params.get("tab");
  const tab: Tab = TABS.some((t) => t.key === tabParam) ? (tabParam as Tab) : "buy";
  const state = emptyState(tab);

  const category = params.get("category");
  if (tab === "buy" && SEGMENTS.some((s) => s.value === category)) state.segment = category as Segment;

  state.loc = Array.from(new Set(list(params.get("loc"))));
  state.q = (params.get("q") ?? "").slice(0, 100);
  const sort = params.get("sort");
  if (sort && SORTS.some((s) => s.value === sort && s.appliesTo.includes(tab))) state.sort = sort;
  const unit = params.get("unit");
  if (unit && isAreaUnit(unit)) state.unit = unit;
  const view = params.get("view");
  if (view) state.view = view;

  for (const def of FILTERS) {
    if (!def.appliesTo.includes(tab)) continue;
    if (def.type === "multi") {
      const values = list(params.get(def.key));
      if (values.length) state.multi[def.key] = values;
    } else if (def.type === "range") {
      const min = num(params.get(def.params[0]));
      const max = num(params.get(def.params[1]));
      if (min !== undefined || max !== undefined) state.range[def.key] = { min, max };
    } else if (def.type === "toggle") {
      if (params.get(def.key) === "1") state.toggle[def.key] = true;
    } else if (def.type === "search") {
      const v = params.get(def.key);
      if (v) state.search[def.key] = v.slice(0, 60);
    }
  }
  return state;
}

export function serializeQuery(state: QueryState): string {
  const p = new URLSearchParams();
  if (state.tab !== "buy") p.set("tab", state.tab);
  if (state.tab === "buy" && state.segment !== "all") p.set("category", state.segment);
  if (state.loc.length) p.set("loc", state.loc.join(","));
  if (state.q.trim()) p.set("q", state.q.trim());

  for (const def of FILTERS) {
    if (!def.appliesTo.includes(state.tab)) continue;
    if (def.type === "multi" && state.multi[def.key]?.length) p.set(def.key, state.multi[def.key].join(","));
    if (def.type === "range") {
      const r = state.range[def.key];
      if (r?.min !== undefined) p.set(def.params[0], String(r.min));
      if (r?.max !== undefined) p.set(def.params[1], String(r.max));
    }
    if (def.type === "toggle" && state.toggle[def.key]) p.set(def.key, "1");
    if (def.type === "search" && state.search[def.key]?.trim()) p.set(def.key, state.search[def.key].trim());
  }
  if (state.unit !== DEFAULT_AREA_UNIT) p.set("unit", state.unit);
  if (state.sort !== emptyState().sort) p.set("sort", state.sort);
  if (state.view) p.set("view", state.view);

  // Commas read better than %2C in shared links
  return p.toString().replace(/%2C/g, ",");
}
