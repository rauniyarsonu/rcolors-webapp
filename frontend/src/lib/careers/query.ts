/**
 * /careers filters <-> query string, like lib/estate/url.ts: defaults are
 * omitted, unknown values ignored, so ?type=FULL_TIME&loc=Lucknow%2C+UP&q=sales
 * is a shareable view and the bare /careers shows everything.
 */
import { EMPLOYMENT_TYPES, type EmploymentType } from "./types";

export interface CareersQuery {
  employmentType?: EmploymentType;
  location?: string;
  q?: string;
}

const oneOf = <T extends string>(list: readonly T[], v: string | null): T | undefined =>
  v !== null && (list as readonly string[]).includes(v) ? (v as T) : undefined;

const text = (v: string | null) => {
  const t = (v ?? "").trim().slice(0, 100);
  return t || undefined;
};

export function parseCareersQuery(params: URLSearchParams): CareersQuery {
  const out: CareersQuery = {};
  const employmentType = oneOf(EMPLOYMENT_TYPES, params.get("type"));
  const location = text(params.get("loc"));
  const q = text(params.get("q"));
  if (employmentType) out.employmentType = employmentType;
  if (location) out.location = location;
  if (q) out.q = q;
  return out;
}

/** Stable key order, no empty values */
export function serializeCareersQuery(query: CareersQuery): string {
  const params = new URLSearchParams();
  if (query.employmentType) params.set("type", query.employmentType);
  if (query.location?.trim()) params.set("loc", query.location.trim());
  if (query.q?.trim()) params.set("q", query.q.trim());
  return params.toString();
}

/** The backend list endpoint for these filters (its own parameter names) */
export function jobsApiPath(query: CareersQuery): string {
  const params = new URLSearchParams();
  if (query.employmentType) params.set("employmentType", query.employmentType);
  if (query.location) params.set("location", query.location);
  if (query.q) params.set("q", query.q);
  const qs = params.toString();
  return qs ? `/api/careers/jobs?${qs}` : "/api/careers/jobs";
}

export const hasFilters = (query: CareersQuery) => Boolean(query.employmentType || query.location || query.q);
