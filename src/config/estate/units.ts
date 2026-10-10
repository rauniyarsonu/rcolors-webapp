import type { Segment } from "./catalog";

/**
 * Area units. Standard units have a fixed size in sq ft. Bigha and biswa
 * differ by state (and sometimes district), so their size comes from
 * REGIONAL_UNIT_SIZES for the state a record sits in; there is no global value.
 */
export const AREA_UNITS = {
  sqft: { label: "sq ft", sqft: 1 },
  sqyd: { label: "sq yd", sqft: 9 },
  sqm: { label: "sq m", sqft: 10.7639104 },
  acre: { label: "acre", sqft: 43560 },
  hectare: { label: "hectare", sqft: 107639.104 },
  bigha: { label: "bigha", sqft: null },
  biswa: { label: "biswa", sqft: null },
} as const satisfies Record<string, { label: string; sqft: number | null }>;
export type AreaUnit = keyof typeof AREA_UNITS;

export const DEFAULT_AREA_UNIT: AreaUnit = "sqft";

/**
 * Size of regional units in sq ft, keyed by state slug from locations.json.
 * An optional `districts` map overrides the state value for a district or
 * city slug (the nearest ancestor wins).
 *
 * TO CONFIRM BY OWNER: Uttar Pradesh values vary by district. 27,000 sq ft per
 * bigha (and 1/20 of that per biswa) is a commonly quoted UP figure; replace it
 * with the value R Colors uses in its sale deeds.
 */
export const REGIONAL_UNIT_SIZES: Record<
  string,
  { bigha?: number; biswa?: number; districts?: Record<string, { bigha?: number; biswa?: number }> }
> = {
  "uttar-pradesh": { bigha: 27000, biswa: 1350 },
};

/** Units offered in the area filter, per Buy segment */
export const UNIT_CHOICES: Record<Segment, AreaUnit[]> = {
  all: ["sqft", "sqyd", "sqm", "acre"],
  land: ["sqft", "sqyd", "sqm", "acre", "hectare", "bigha", "biswa"],
  residential: ["sqft", "sqyd", "sqm"],
  commercial: ["sqft", "sqyd", "sqm", "acre"],
};
