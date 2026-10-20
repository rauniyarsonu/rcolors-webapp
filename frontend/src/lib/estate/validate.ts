/**
 * Whole-dataset validation: schema checks per record plus cross-file rules
 * (slugs exist, ids unique, references resolve, images exist, units convert).
 * Pure apart from the injected `imageExists`, so tests can run it in memory.
 */
import { z } from "zod";
import { SAMPLE_PREFIX } from "../../config/estate/catalog";
import { AREA_UNITS } from "../../config/estate/units";
import { ancestors, indexLocations, isActive, isMarket, isWithin, stateOf } from "./locationTree";
import { AgentSchema, LocationSchema, ProjectSchema, PropertySchema, type Agent, type Location, type Project, type Property, type RawCityFiles } from "./schema";
import { unitSizeSqft } from "./units";

export interface Issue {
  level: "error" | "warning";
  file: string;
  message: string;
}

export interface ParsedCity {
  properties: Property[];
  projects: Project[];
  agents: Agent[];
}
export interface ParsedData {
  locations: Location[];
  cities: Record<string, ParsedCity>;
}

export interface RawData {
  locations: unknown;
  cities: Record<string, RawCityFiles>;
}

/** Where the data files live, relative to the repository root (used in messages) */
export const DATA_ROOT = "backend/src/main/resources/data/estate";
export const LOCATIONS_FILE = `${DATA_ROOT}/locations.json`;
export const cityFile = (city: string, kind: keyof RawCityFiles) => `${DATA_ROOT}/cities/${city}/${kind}.json`;

const zodMessage = (e: z.ZodError) => e.issues.map((i) => `${i.path.length ? i.path.join(".") + ": " : ""}${i.message}`).join("; ");

function parseList<S extends z.ZodTypeAny>(raw: unknown, schema: S, file: string, label: (item: unknown, i: number) => string, issues: Issue[]): z.infer<S>[] {
  if (!Array.isArray(raw)) {
    issues.push({ level: "error", file, message: "must contain a JSON array" });
    return [];
  }
  const out: z.infer<S>[] = [];
  raw.forEach((item, i) => {
    const res = schema.safeParse(item);
    if (res.success) out.push(res.data);
    else issues.push({ level: "error", file, message: `${label(item, i)}: ${zodMessage(res.error)}` });
  });
  return out;
}

const labelOf = (item: unknown, i: number) => {
  const id = item && typeof item === "object" && "id" in item ? String((item as { id: unknown }).id) : null;
  return id ? `record "${id}"` : `record #${i + 1}`;
};

export function validateData(raw: RawData, opts: { imageExists: (sitePath: string) => boolean }): { issues: Issue[]; data: ParsedData } {
  const issues: Issue[] = [];
  const err = (file: string, message: string) => issues.push({ level: "error", file, message });
  const warn = (file: string, message: string) => issues.push({ level: "warning", file, message });

  /* ---------- locations ---------- */
  const locations = parseList(raw.locations, LocationSchema, LOCATIONS_FILE, labelOf, issues);
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const l of locations) {
    if (ids.has(l.id)) err(LOCATIONS_FILE, `duplicate location id "${l.id}"`);
    if (slugs.has(l.slug)) err(LOCATIONS_FILE, `duplicate location slug "${l.slug}" (slugs must be unique across all cities; e.g. "rampur-sitapur")`);
    ids.add(l.id);
    slugs.add(l.slug);
  }
  const index = indexLocations(locations);
  for (const l of locations) {
    if (l.parentId === null && l.type !== "state") err(LOCATIONS_FILE, `"${l.slug}" has no parentId; only states may be top-level`);
    if (l.parentId !== null && !index.byId.has(l.parentId)) err(LOCATIONS_FILE, `"${l.slug}" has unknown parentId "${l.parentId}"`);
    if (l.parentId === l.id || ancestors(index, l.slug).some((a) => a.slug === l.slug)) err(LOCATIONS_FILE, `"${l.slug}" is its own ancestor (cycle)`);
    for (const n of l.nearby ?? []) if (!index.bySlug.has(n)) err(LOCATIONS_FILE, `"${l.slug}" lists unknown nearby slug "${n}"`);
  }

  /* ---------- cities ---------- */
  const cities: Record<string, ParsedCity> = {};
  const recordIds = new Map<string, string>();
  const claimId = (id: string, file: string) => {
    const prev = recordIds.get(id);
    if (prev) err(file, `duplicate id "${id}" (also used in ${prev}); ids must be unique across all cities and record types`);
    else recordIds.set(id, file);
  };
  const checkImages = (images: string[] | undefined, file: string, who: string) => {
    for (const img of images ?? []) if (!opts.imageExists(img)) err(file, `${who}: image not found: frontend/public${img}`);
  };
  const checkSample = (isSample: boolean | undefined, label: string, file: string, who: string) => {
    const prefixed = label.startsWith(SAMPLE_PREFIX);
    if (isSample && !prefixed) err(file, `${who}: isSample is true but the title/name doesn't start with "${SAMPLE_PREFIX}"`);
    if (!isSample && prefixed) err(file, `${who}: title/name starts with "${SAMPLE_PREFIX}" but isSample isn't true`);
  };

  for (const [citySlug, files] of Object.entries(raw.cities)) {
    const cityNode = index.bySlug.get(citySlug);
    const folder = `${DATA_ROOT}/cities/${citySlug}/`;
    if (!cityNode) {
      err(folder, `folder "${citySlug}" has no matching location in locations.json (run: npm run add-city)`);
      continue;
    }
    if (!isMarket(index, citySlug)) {
      err(folder, `"${citySlug}" must be a city or town that isn't nested inside another city/town`);
      continue;
    }
    const inCity = (slug: string) => index.bySlug.has(slug) && isWithin(index, slug, citySlug);

    const pFile = cityFile(citySlug, "properties");
    const prjFile = cityFile(citySlug, "projects");
    const aFile = cityFile(citySlug, "agents");
    const properties = parseList(files.properties, PropertySchema, pFile, labelOf, issues);
    const projects = parseList(files.projects, ProjectSchema, prjFile, labelOf, issues);
    const agents = parseList(files.agents, AgentSchema, aFile, labelOf, issues);
    const projectIds = new Set(projects.map((p) => p.id));
    const agentIds = new Set(agents.map((a) => a.id));

    for (const p of properties) {
      const who = `property "${p.id}"`;
      claimId(p.id, pFile);
      if (p.citySlug !== citySlug) err(pFile, `${who}: citySlug "${p.citySlug}" doesn't match folder "${citySlug}"`);
      if (!index.bySlug.has(p.locationSlug)) err(pFile, `${who}: unknown locationSlug "${p.locationSlug}" (run: npm run add-locality)`);
      else if (!inCity(p.locationSlug)) err(pFile, `${who}: locationSlug "${p.locationSlug}" is not inside ${citySlug}`);
      else if (!isActive(index, p.locationSlug)) warn(pFile, `${who}: location "${p.locationSlug}" is disabled, so this record is hidden`);
      if (p.agentId && !agentIds.has(p.agentId)) err(pFile, `${who}: agentId "${p.agentId}" not found in ${aFile}`);
      if (p.projectId && !projectIds.has(p.projectId)) err(pFile, `${who}: projectId "${p.projectId}" not found in ${prjFile}`);
      if (AREA_UNITS[p.areaUnit].sqft === null && index.bySlug.has(p.locationSlug)) {
        const place = { stateSlug: stateOf(index, p.locationSlug)?.slug ?? null, districtSlugs: [p.locationSlug, ...ancestors(index, p.locationSlug).map((a) => a.slug)] };
        if (unitSizeSqft(p.areaUnit, place) === null) {
          err(pFile, `${who}: "${p.areaUnit}" has no size configured for ${place.stateSlug ?? "this state"} in frontend/src/config/estate/units.ts (REGIONAL_UNIT_SIZES)`);
        }
      }
      if (p.priceUnit === "per-area" && p.price > 1e7) warn(pFile, `${who}: per-area price ₹${p.price} looks too high; is it a total price?`);
      if (p.category === "land" && p.attributes.bhk) err(pFile, `${who}: land records can't have bhk`);
      checkImages(p.images, pFile, who);
      checkSample(p.isSample, p.title, pFile, who);
    }
    for (const p of projects) {
      const who = `project "${p.id}"`;
      claimId(p.id, prjFile);
      if (p.citySlug !== citySlug) err(prjFile, `${who}: citySlug "${p.citySlug}" doesn't match folder "${citySlug}"`);
      if (!index.bySlug.has(p.locationSlug)) err(prjFile, `${who}: unknown locationSlug "${p.locationSlug}"`);
      else if (!inCity(p.locationSlug)) err(prjFile, `${who}: locationSlug "${p.locationSlug}" is not inside ${citySlug}`);
      checkImages(p.images, prjFile, who);
      checkSample(p.isSample, p.name, prjFile, who);
    }
    for (const a of agents) {
      const who = `agent "${a.id}"`;
      claimId(a.id, aFile);
      for (const s of a.areasServed) {
        if (!index.bySlug.has(s)) err(aFile, `${who}: unknown area "${s}" in areasServed`);
        else if (!inCity(s)) err(aFile, `${who}: area "${s}" is not inside ${citySlug}`);
      }
      checkImages(a.photo ? [a.photo] : [], aFile, who);
      checkSample(a.isSample, a.name, aFile, who);
    }

    if (isActive(index, citySlug) && properties.length + projects.length + agents.length === 0) {
      warn(folder, `${citySlug} is enabled but has no records, so it won't appear in the city dropdown`);
    }
    cities[citySlug] = { properties, projects, agents };
  }

  return { issues, data: { locations, cities } };
}

export function formatIssues(issues: Issue[]): string {
  return issues.map((i) => `${i.level === "error" ? "✖" : "⚠"} ${i.file}\n    ${i.message}`).join("\n");
}
