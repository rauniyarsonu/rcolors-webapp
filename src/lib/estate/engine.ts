/**
 * Pure, in-memory search engine for one city bundle. Every function here is
 * side-effect free so it can run on the server (DataSource.searchListings),
 * in the browser (instant filtering) and in unit tests.
 */
import { LOCATION_TYPE_LABELS, PROJECT_TYPES, PROPERTY_TYPES, SEGMENTS, type Segment, type Tab } from "../../config/estate/catalog";
import { DEFAULT_SORT, FILTERS, SORTS, filtersFor, type FilterDef, type FilterOption, type MultiFilterDef, type RangeFilterDef } from "../../config/estate/filters";
import { DEFAULT_AREA_UNIT, UNIT_CHOICES, type AreaUnit } from "../../config/estate/units";
import { ancestors, areasOf, indexLocations, isWithin, stateOf, type LocationIndex } from "./locationTree";
import type { Agent, CityBundle, Location, Project, Property } from "./schema";
import { toSqft } from "./units";

export type AnyRecord = Property | Project | Agent;
export interface TabRecords {
  buy: Property;
  projects: Project;
  agents: Agent;
}

export interface QueryState {
  tab: Tab;
  segment: Segment;
  /** Selected location slugs (any depth) */
  loc: string[];
  /** Free-text keyword */
  q: string;
  sort: string;
  /** Unit for the area filter and area display */
  unit: AreaUnit;
  multi: Record<string, string[]>;
  range: Record<string, { min?: number; max?: number }>;
  toggle: Record<string, boolean>;
  search: Record<string, string>;
  /** Id of the listing/project open in the detail view */
  view?: string;
}

export function emptyState(tab: Tab = "buy"): QueryState {
  return { tab, segment: "all", loc: [], q: "", sort: DEFAULT_SORT, unit: DEFAULT_AREA_UNIT, multi: {}, range: {}, toggle: {}, search: {} };
}

export interface EngineContext {
  index: LocationIndex;
  citySlug: string;
  locationName: (slug: string) => string;
  /** Area in sq ft, or null when the unit can't be converted for that place */
  areaSqft: (p: Property) => number | null;
  /** Converts a filter value in `unit` to sq ft using the city's state */
  filterAreaToSqft: (value: number, unit: AreaUnit) => number | null;
  /** Lower-cased searchable text per location: name, aliases, landmarks, ancestors */
  locationText: (slug: string) => string;
  projectName: (id?: string) => string | undefined;
}

const placeOf = (index: LocationIndex, slug: string) => ({
  stateSlug: stateOf(index, slug)?.slug ?? null,
  districtSlugs: [slug, ...ancestors(index, slug).map((a) => a.slug)],
});

export function createContext(bundle: CityBundle): EngineContext {
  const index = indexLocations(bundle.locations);
  const areaCache = new Map<string, number | null>();
  const textCache = new Map<string, string>();
  const projects = new Map(bundle.projects.map((p) => [p.id, p.name]));
  const cityPlace = placeOf(index, bundle.city.slug);

  return {
    index,
    citySlug: bundle.city.slug,
    locationName: (slug) => index.bySlug.get(slug)?.name ?? slug,
    areaSqft: (p) => {
      if (!areaCache.has(p.id)) areaCache.set(p.id, toSqft(p.areaValue, p.areaUnit, placeOf(index, p.locationSlug)));
      return areaCache.get(p.id) ?? null;
    },
    filterAreaToSqft: (value, unit) => toSqft(value, unit, cityPlace),
    locationText: (slug) => {
      if (!textCache.has(slug)) {
        const node = index.bySlug.get(slug);
        const parts = node ? [node.name, ...(node.aliases ?? []), ...(node.landmarks ?? []), ...ancestors(index, slug).map((a) => a.name)] : [slug];
        textCache.set(slug, parts.join(" ").toLowerCase());
      }
      return textCache.get(slug)!;
    },
    projectName: (id) => (id ? projects.get(id) : undefined),
  };
}

export function recordsFor<T extends Tab>(bundle: CityBundle, tab: T): TabRecords[T][] {
  const map = { buy: bundle.properties, projects: bundle.projects, agents: bundle.agents };
  return map[tab] as TabRecords[T][];
}

export const totalPrice = (p: Property) => (p.priceUnit === "per-area" ? p.price * p.areaValue : p.price);

const getPath = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj);

const isProperty = (r: AnyRecord): r is Property => "areaValue" in r;
const isProject = (r: AnyRecord): r is Project => "startingPrice" in r;

/** Value of a config field (dotted path or computed $field) on a record */
export function fieldValue(record: AnyRecord, field: string, ctx: EngineContext): unknown {
  switch (field) {
    case "$price":
      return isProperty(record) ? totalPrice(record) : isProject(record) ? record.startingPrice : undefined;
    case "$area":
      return isProperty(record) ? ctx.areaSqft(record) : undefined;
    case "$segments":
      return isProperty(record) ? PROPERTY_TYPES[record.type].segments : undefined;
    case "$name":
      return "title" in record ? record.title : record.name;
    case "$locality": {
      const slug = "locationSlug" in record ? record.locationSlug : record.areasServed[0];
      return ctx.locationName(slug);
    }
    default:
      return getPath(record, field);
  }
}

const asList = (v: unknown): unknown[] => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);

function locationDefFor(tab: Tab) {
  return FILTERS.find((f): f is Extract<FilterDef, { type: "location" }> => f.type === "location" && f.appliesTo.includes(tab));
}

function matchesLocation(record: AnyRecord, selected: string[], tab: Tab, ctx: EngineContext): boolean {
  if (!selected.length) return true;
  const def = locationDefFor(tab);
  if (!def) return true;
  const values = asList(fieldValue(record, def.field, ctx)).map(String);
  return values.some((v) =>
    selected.some((s) => isWithin(ctx.index, v, s) || (def.match === "overlap" && isWithin(ctx.index, s, v))),
  );
}

function matchesFilter(record: AnyRecord, def: FilterDef, state: QueryState, ctx: EngineContext): boolean {
  switch (def.type) {
    case "segmented":
      return state.segment === "all" || asList(fieldValue(record, def.field, ctx)).includes(state.segment);
    case "location":
      return matchesLocation(record, state.loc, state.tab, ctx);
    case "multi": {
      const wanted = state.multi[def.key];
      if (!wanted?.length) return true;
      return asList(fieldValue(record, def.field, ctx)).some((v) => wanted.includes(String(v)));
    }
    case "range": {
      const r = state.range[def.key];
      if (!r || (r.min === undefined && r.max === undefined)) return true;
      const value = fieldValue(record, def.field, ctx);
      if (typeof value !== "number") return false;
      const bound = (b?: number) => (b === undefined ? undefined : def.unitAware ? ctx.filterAreaToSqft(b, state.unit) ?? undefined : b);
      const min = bound(r.min);
      const max = bound(r.max);
      // 0.5% tolerance absorbs unit-conversion rounding at the edges
      return (min === undefined || value >= min * 0.995) && (max === undefined || value <= max * 1.005);
    }
    case "toggle":
      return !state.toggle[def.key] || fieldValue(record, def.field, ctx) === true;
    case "search": {
      const term = state.search[def.key]?.trim().toLowerCase();
      if (!term) return true;
      return def.fields.some((f) => String(fieldValue(record, f, ctx) ?? "").toLowerCase().includes(term));
    }
  }
}

/** Text a keyword search looks at for one record */
function keywordText(record: AnyRecord, ctx: EngineContext): string {
  const parts: string[] = [];
  if (isProperty(record)) {
    parts.push(record.title, record.description, PROPERTY_TYPES[record.type].label, ctx.locationText(record.locationSlug), ctx.projectName(record.projectId) ?? "");
  } else if (isProject(record)) {
    parts.push(record.name, record.developer, record.description, PROJECT_TYPES[record.type].label, ctx.locationText(record.locationSlug));
  } else {
    parts.push(record.name, record.role, ...record.languages, ...record.areasServed.map((s) => ctx.locationText(s)));
  }
  return parts.join(" ").toLowerCase();
}

export function matchesKeyword(record: AnyRecord, q: string, ctx: EngineContext): boolean {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const text = keywordText(record, ctx);
  return tokens.every((t) => text.includes(t));
}

/** Filters active for the state's tab/segment, optionally leaving one out (for facet counts) */
function activeDefs(state: QueryState, excludeKey?: string): FilterDef[] {
  return filtersFor(state.tab, state.segment).filter((d) => d.key !== excludeKey);
}

export function applyFilters<T extends AnyRecord>(records: T[], state: QueryState, ctx: EngineContext, excludeKey?: string): T[] {
  const defs = activeDefs(state, excludeKey);
  return records.filter((r) => defs.every((d) => matchesFilter(r, d, state, ctx)) && matchesKeyword(r, state.q, ctx));
}

export function sortRecords<T extends AnyRecord>(records: T[], sortValue: string, tab: Tab, ctx: EngineContext): T[] {
  const def = SORTS.find((s) => s.value === sortValue && s.appliesTo.includes(tab)) ?? SORTS.find((s) => s.value === DEFAULT_SORT)!;
  const indexed = records.map((r, i) => ({ r, i }));
  const cmp = (a: unknown, b: unknown): number => {
    const aMissing = a === undefined || a === null;
    const bMissing = b === undefined || b === null;
    if (aMissing || bMissing) return aMissing === bMissing ? 0 : aMissing ? 1 : -1; // missing values last
    if (typeof a === "number" && typeof b === "number") return (a - b) * def.dir;
    return String(a).localeCompare(String(b)) * def.dir;
  };
  indexed.sort((x, y) => {
    if (def.field === "$recommended") {
      const f = Number(!!y.r.featured) - Number(!!x.r.featured);
      if (f) return f;
      if ("postedAt" in x.r && "postedAt" in y.r) return y.r.postedAt.localeCompare(x.r.postedAt) || x.i - y.i;
      return x.i - y.i;
    }
    return cmp(fieldValue(x.r, def.field, ctx), fieldValue(y.r, def.field, ctx)) || x.i - y.i;
  });
  return indexed.map((x) => x.r);
}

/** Filter + keyword + sort in one call */
export function runQuery<T extends Tab>(bundle: CityBundle, state: QueryState, ctx: EngineContext): TabRecords[T][] {
  const records = recordsFor(bundle, state.tab) as AnyRecord[];
  return sortRecords(applyFilters(records, state, ctx), state.sort, state.tab, ctx) as TabRecords[T][];
}

/** Records of the tab inside the current segment only (stable base for options and bounds) */
function segmentBase(bundle: CityBundle, state: QueryState, ctx: EngineContext): AnyRecord[] {
  const records = recordsFor(bundle, state.tab) as AnyRecord[];
  const seg = FILTERS.find((f) => f.type === "segmented" && f.appliesTo.includes(state.tab));
  return seg ? records.filter((r) => matchesFilter(r, seg, state, ctx)) : records;
}

export interface FacetOption extends FilterOption {
  count: number;
}

/** Options for a multi filter with counts that respect every other active filter */
export function facetOptions(def: MultiFilterDef, bundle: CityBundle, state: QueryState, ctx: EngineContext): FacetOption[] {
  const records = recordsFor(bundle, state.tab) as AnyRecord[];
  const base = applyFilters(records, state, ctx, def.key);
  const counts = new Map<string, number>();
  for (const r of base) for (const v of Array.from(new Set(asList(fieldValue(r, def.field, ctx)).map(String)))) counts.set(v, (counts.get(v) ?? 0) + 1);

  let options = def.options;
  if (!options) {
    const values = new Set<string>(state.multi[def.key] ?? []);
    for (const r of segmentBase(bundle, state, ctx)) for (const v of asList(fieldValue(r, def.field, ctx))) values.add(String(v));
    const sorted = Array.from(values).sort((a, b) => (isFinite(+a) && isFinite(+b) ? +a - +b : a.localeCompare(b)));
    options = sorted.map((value) => ({ value, label: def.optionLabel ? def.optionLabel(value) : value }));
  }
  return options.map((o) => ({ ...o, count: counts.get(o.value) ?? 0 }));
}

/** Min/max of a range field across the tab (area in the chosen unit) for slider bounds */
export function rangeBounds(def: RangeFilterDef, bundle: CityBundle, state: QueryState, ctx: EngineContext): { min: number; max: number } | null {
  const values = segmentBase(bundle, state, ctx)
    .map((r) => fieldValue(r, def.field, ctx))
    .filter((v): v is number => typeof v === "number");
  if (!values.length) return null;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (def.unitAware) {
    const size = ctx.filterAreaToSqft(1, state.unit);
    if (!size) return null;
    min /= size;
    max /= size;
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
}

export interface AreaCount {
  location: Location;
  depth: number;
  parentSlug: string;
  count: number;
}

/** Every active area under the city with the number of matching records (ignoring the locality filter) */
export function localityCounts(bundle: CityBundle, state: QueryState, ctx: EngineContext): AreaCount[] {
  const records = recordsFor(bundle, state.tab) as AnyRecord[];
  const base = applyFilters(records, state, ctx, "loc");
  return areasOf(ctx.index, ctx.citySlug).map(({ location, depth, parentSlug }) => ({
    location,
    depth,
    parentSlug,
    count: base.filter((r) => matchesLocation(r, [location.slug], state.tab, ctx)).length,
  }));
}

/** Trending: locations flagged `trending`, then the busiest by listings + projects */
export function trendingLocations(bundle: CityBundle, ctx: EngineContext, limit: number): Location[] {
  const counts = new Map<string, number>();
  for (const r of [...bundle.properties, ...bundle.projects]) {
    for (const a of [r.locationSlug, ...ancestors(ctx.index, r.locationSlug).map((l) => l.slug)]) {
      if (a === ctx.citySlug) break;
      counts.set(a, (counts.get(a) ?? 0) + 1);
    }
  }
  return areasOf(ctx.index, ctx.citySlug)
    .map((a) => a.location)
    .filter((l) => l.trending || (counts.get(l.slug) ?? 0) > 0)
    .sort((a, b) => Number(!!b.trending) - Number(!!a.trending) || (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export type Suggestion =
  | { kind: "location"; id: string; label: string; detail: string; slug: string }
  | { kind: "landmark"; id: string; label: string; detail: string; slug: string }
  | { kind: "project"; id: string; label: string; detail: string; projectId: string };

/** Typeahead over the city's areas (names, aliases), landmarks and project names */
export function suggest(query: string, bundle: CityBundle, ctx: EngineContext, limit = 8): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const score = (text: string) => {
    const t = text.toLowerCase();
    if (t.startsWith(q)) return 0;
    if (t.split(/[\s/-]+/).some((w) => w.startsWith(q))) return 1;
    return t.includes(q) ? 2 : -1;
  };
  const scored: { s: number; item: Suggestion }[] = [];
  for (const { location } of areasOf(ctx.index, ctx.citySlug)) {
    const names = [location.name, ...(location.aliases ?? [])];
    const best = Math.min(...names.map(score).filter((s) => s >= 0));
    if (Number.isFinite(best)) {
      scored.push({
        s: best,
        item: { kind: "location", id: `loc-${location.slug}`, label: location.name, detail: `${LOCATION_TYPE_LABELS[location.type]}, ${bundle.city.name}`, slug: location.slug },
      });
    }
    for (const landmark of location.landmarks ?? []) {
      const s = score(landmark);
      if (s >= 0) scored.push({ s: s + 0.5, item: { kind: "landmark", id: `lm-${location.slug}-${landmark}`, label: landmark, detail: `Landmark in ${location.name}`, slug: location.slug } });
    }
  }
  for (const p of bundle.projects) {
    const s = score(p.name);
    if (s >= 0) scored.push({ s: s + 0.25, item: { kind: "project", id: `prj-${p.id}`, label: p.name, detail: `Project in ${ctx.locationName(p.locationSlug)}`, projectId: p.id } });
  }
  return scored
    .sort((a, b) => a.s - b.s || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map((x) => x.item);
}

/* ---------- state transitions (pure) ---------- */

/** Drops values for filters that don't apply to the state's tab/segment */
function prune(state: QueryState): QueryState {
  const keys = new Set(filtersFor(state.tab, state.segment).map((d) => d.key));
  const pick = <V,>(rec: Record<string, V>) => Object.fromEntries(Object.entries(rec).filter(([k]) => keys.has(k)));
  const sortOk = SORTS.some((s) => s.value === state.sort && s.appliesTo.includes(state.tab));
  const unitOk = UNIT_CHOICES[state.segment].includes(state.unit);
  return {
    ...state,
    multi: pick(state.multi),
    range: unitOk ? pick(state.range) : pick(Object.fromEntries(Object.entries(state.range).filter(([k]) => !isUnitAware(k)))),
    toggle: pick(state.toggle),
    search: pick(state.search),
    sort: sortOk ? state.sort : DEFAULT_SORT,
    unit: unitOk ? state.unit : DEFAULT_AREA_UNIT,
  };
}

const isUnitAware = (key: string) => FILTERS.some((f) => f.key === key && f.type === "range" && f.unitAware);

/** Switch tab, keeping locality and keyword (they apply to every tab) */
export function withTab(state: QueryState, tab: Tab): QueryState {
  if (tab === state.tab) return state;
  return prune({ ...state, tab, segment: tab === "buy" ? state.segment : "all", view: undefined });
}

export function withSegment(state: QueryState, segment: Segment): QueryState {
  return prune({ ...state, segment });
}

export function countActiveFilters(state: QueryState): number {
  return (
    state.loc.length +
    (state.q ? 1 : 0) +
    Object.values(state.multi).reduce((n, v) => n + v.length, 0) +
    Object.values(state.range).filter((r) => r.min !== undefined || r.max !== undefined).length +
    Object.values(state.toggle).filter(Boolean).length +
    Object.values(state.search).filter((s) => s.trim()).length
  );
}

export function clearFilters(state: QueryState): QueryState {
  return { ...emptyState(state.tab), segment: state.segment, sort: state.sort, unit: state.unit };
}

export const segmentLabel = (segment: Segment) => SEGMENTS.find((s) => s.value === segment)?.label ?? segment;
