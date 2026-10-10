import { AREA_UNITS, REGIONAL_UNIT_SIZES, type AreaUnit } from "../../config/estate/units";

/**
 * Size of one `unit` in sq ft. Regional units (bigha, biswa) look up the
 * state, with a district/city override taking precedence. Returns null when
 * the size isn't configured for that place.
 */
export function unitSizeSqft(unit: AreaUnit, place?: { stateSlug?: string | null; districtSlugs?: string[] }): number | null {
  const fixed = AREA_UNITS[unit].sqft;
  if (fixed !== null) return fixed;
  if (unit !== "bigha" && unit !== "biswa") return null;
  const state = place?.stateSlug ? REGIONAL_UNIT_SIZES[place.stateSlug] : undefined;
  if (!state) return null;
  for (const d of place?.districtSlugs ?? []) {
    const override = state.districts?.[d]?.[unit];
    if (override) return override;
  }
  return state[unit] ?? null;
}

export function toSqft(value: number, unit: AreaUnit, place?: Parameters<typeof unitSizeSqft>[1]): number | null {
  const size = unitSizeSqft(unit, place);
  return size === null ? null : value * size;
}

export function fromSqft(sqft: number, unit: AreaUnit, place?: Parameters<typeof unitSizeSqft>[1]): number | null {
  const size = unitSizeSqft(unit, place);
  return size === null ? null : sqft / size;
}

export function convertArea(value: number, from: AreaUnit, to: AreaUnit, place?: Parameters<typeof unitSizeSqft>[1]): number | null {
  if (from === to) return value;
  const sqft = toSqft(value, from, place);
  return sqft === null ? null : fromSqft(sqft, to, place);
}

export const isAreaUnit = (value: string): value is AreaUnit => Object.prototype.hasOwnProperty.call(AREA_UNITS, value);
