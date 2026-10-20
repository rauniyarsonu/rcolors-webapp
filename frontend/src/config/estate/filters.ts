import {
  FACINGS,
  LISTING_STATUSES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  PROPERTY_TYPES,
  SEGMENTS,
  SPECIALIZATIONS,
  type Segment,
  type Tab,
} from "./catalog";

/**
 * Declarative filter list. The FilterPanel renders itself from this array
 * and the filter engine (src/lib/estate/engine.ts) applies it, so a new
 * filter is a new entry here plus data, with no component change.
 *
 * `field` is a dotted path into the record ("attributes.bhk") or one of the
 * engine's computed fields:
 *   $price     total price in ₹ (per-area prices multiplied out); starting price for projects
 *   $area      area converted to sq ft
 *   $segments  Buy segments of the record's property type
 */

export interface FilterOption {
  value: string;
  label: string;
}

interface BaseFilter {
  /** URL query key (range filters use `params` instead) */
  key: string;
  label: string;
  appliesTo: Tab[];
  /** Buy segments that show this filter; omitted = all segments */
  appliesToSegment?: Segment[];
}

export interface SegmentedFilterDef extends BaseFilter {
  type: "segmented";
  field: string;
  options: FilterOption[];
}
export interface LocationFilterDef extends BaseFilter {
  type: "location";
  field: string;
  /** within: record location inside a selected area. overlap: any served area inside, or containing, a selection */
  match: "within" | "overlap";
}
export interface MultiFilterDef extends BaseFilter {
  type: "multi";
  field: string;
  /** Fixed options; omitted = options found in the data (with counts) */
  options?: FilterOption[];
  optionLabel?: (value: string) => string;
}
export interface RangeFilterDef extends BaseFilter {
  type: "range";
  field: string;
  /** URL keys for the lower and upper bound */
  params: [string, string];
  format: "currency" | "area" | "number";
  /** Area ranges carry their own unit (URL key `unit`) */
  unitAware?: boolean;
  suffix?: string;
}
export interface ToggleFilterDef extends BaseFilter {
  type: "toggle";
  field: string;
  toggleLabel: string;
}
export interface SearchFilterDef extends BaseFilter {
  type: "search";
  fields: string[];
  placeholder: string;
}

export type FilterDef =
  | SegmentedFilterDef
  | LocationFilterDef
  | MultiFilterDef
  | RangeFilterDef
  | ToggleFilterDef
  | SearchFilterDef;

const toOptions = (map: Record<string, string | { label: string }>): FilterOption[] =>
  Object.entries(map).map(([value, v]) => ({ value, label: typeof v === "string" ? v : v.label }));

const labelFrom = (map: Record<string, string | { label: string }>) => (value: string) => {
  const v = map[value];
  return v === undefined ? value : typeof v === "string" ? v : v.label;
};

export const FILTERS: FilterDef[] = [
  // Buy
  {
    key: "category",
    type: "segmented",
    label: "Category",
    appliesTo: ["buy"],
    field: "$segments",
    options: SEGMENTS.map((s) => ({ value: s.value, label: s.label })),
  },
  { key: "loc", type: "location", label: "Locality", appliesTo: ["buy", "projects"], field: "locationSlug", match: "within" },
  { key: "type", type: "multi", label: "Property type", appliesTo: ["buy"], field: "type", optionLabel: labelFrom(PROPERTY_TYPES) },
  { key: "budget", type: "range", label: "Budget", appliesTo: ["buy"], field: "$price", params: ["min", "max"], format: "currency" },
  { key: "area", type: "range", label: "Area", appliesTo: ["buy"], field: "$area", params: ["amin", "amax"], format: "area", unitAware: true },
  { key: "status", type: "multi", label: "Status", appliesTo: ["buy"], field: "status", options: toOptions(LISTING_STATUSES) },
  {
    key: "bhk",
    type: "multi",
    label: "BHK",
    appliesTo: ["buy"],
    appliesToSegment: ["residential"],
    field: "attributes.bhk",
    optionLabel: (v) => `${v} BHK`,
  },
  {
    key: "facing",
    type: "multi",
    label: "Facing",
    appliesTo: ["buy"],
    appliesToSegment: ["land"],
    field: "attributes.facing",
    optionLabel: labelFrom(FACINGS),
  },
  {
    key: "road",
    type: "range",
    label: "Road width",
    appliesTo: ["buy"],
    appliesToSegment: ["land"],
    field: "attributes.roadWidth",
    params: ["road", "roadMax"],
    format: "number",
    suffix: "ft",
  },
  {
    key: "corner",
    type: "toggle",
    label: "Plot features",
    toggleLabel: "Corner plots only",
    appliesTo: ["buy"],
    appliesToSegment: ["land"],
    field: "attributes.cornerPlot",
  },
  { key: "verified", type: "toggle", label: "Verification", toggleLabel: "Verified listings only", appliesTo: ["buy"], field: "verified" },

  // Projects
  { key: "ptype", type: "multi", label: "Project type", appliesTo: ["projects"], field: "type", options: toOptions(PROJECT_TYPES) },
  { key: "pstatus", type: "multi", label: "Status", appliesTo: ["projects"], field: "status", options: toOptions(PROJECT_STATUSES) },
  { key: "pbudget", type: "range", label: "Starting price", appliesTo: ["projects"], field: "$price", params: ["pmin", "pmax"], format: "currency" },

  // Agents
  { key: "loc", type: "location", label: "Areas served", appliesTo: ["agents"], field: "areasServed", match: "overlap" },
  { key: "name", type: "search", label: "Agent name", appliesTo: ["agents"], fields: ["name", "role"], placeholder: "Search by name" },
  { key: "spec", type: "multi", label: "Specialization", appliesTo: ["agents"], field: "specializations", options: toOptions(SPECIALIZATIONS) },
];

export interface SortDef {
  value: string;
  label: string;
  appliesTo: Tab[];
  /** Engine field to sort by; "$recommended" = featured first, then newest/config order */
  field: string;
  dir: 1 | -1;
}

export const SORTS: SortDef[] = [
  { value: "recommended", label: "Recommended", appliesTo: ["buy", "projects", "agents"], field: "$recommended", dir: 1 },
  { value: "newest", label: "Newest", appliesTo: ["buy"], field: "postedAt", dir: -1 },
  { value: "price-asc", label: "Price: Low to High", appliesTo: ["buy", "projects"], field: "$price", dir: 1 },
  { value: "price-desc", label: "Price: High to Low", appliesTo: ["buy", "projects"], field: "$price", dir: -1 },
  { value: "area-desc", label: "Area: Largest first", appliesTo: ["buy"], field: "$area", dir: -1 },
  { value: "locality", label: "Locality A–Z", appliesTo: ["buy", "projects", "agents"], field: "$locality", dir: 1 },
  { value: "name", label: "Name A–Z", appliesTo: ["projects", "agents"], field: "$name", dir: 1 },
];
export const DEFAULT_SORT = "recommended";

/** Filters visible for a tab + segment, in config order */
export function filtersFor(tab: Tab, segment: Segment = "all"): FilterDef[] {
  // Segment-specific filters (BHK, facing…) only show once that segment is chosen
  return FILTERS.filter((f) => f.appliesTo.includes(tab) && (!f.appliesToSegment || f.appliesToSegment.includes(segment)));
}

export function sortsFor(tab: Tab): SortDef[] {
  return SORTS.filter((s) => s.appliesTo.includes(tab));
}
