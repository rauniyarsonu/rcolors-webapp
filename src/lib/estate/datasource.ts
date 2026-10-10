/**
 * The only contract the estate UI depends on. The JSON adapter
 * (adapters/json.ts) implements it today; a CMS, Google Sheets, Firebase or
 * REST adapter only needs to implement these methods and be returned from
 * getDataSource() in adapters/index.ts.
 */
import { createContext, emptyState, runQuery, type QueryState } from "./engine";
import { ancestors, descendantSlugs, indexLocations, isActive, markets, toCity } from "./locationTree";
import type { Agent, City, CityBundle, Location, Project, Property } from "./schema";
import type { ParsedData } from "./validate";

export interface ListingQuery {
  citySlug: string;
  state?: Partial<QueryState>;
}

export interface DataSource {
  /** Markets for the city dropdown: enabled and holding at least one record */
  getCities(): Promise<City[]>;
  /** The city's active location subtree plus its ancestors */
  getLocations(citySlug: string): Promise<Location[]>;
  searchListings(query: ListingQuery): Promise<Property[]>;
  getListing(id: string): Promise<Property | null>;
  getProjects(query: ListingQuery): Promise<Project[]>;
  getAgents(query: ListingQuery): Promise<Agent[]>;
  /** Everything one city page needs, in one serialisable object */
  getCityBundle(citySlug: string): Promise<CityBundle | null>;
}

/** Builds a bundle from validated data: hides records whose location (or ancestor) is disabled */
export function buildBundle(data: ParsedData, citySlug: string): CityBundle | null {
  const index = indexLocations(data.locations);
  const node = index.bySlug.get(citySlug);
  const files = data.cities[citySlug];
  if (!node || !files || !isActive(index, citySlug)) return null;

  const subtree = descendantSlugs(index, citySlug);
  const visible = (slug: string) => subtree.has(slug) && isActive(index, slug);
  const locations = [...ancestors(index, citySlug).reverse(), ...data.locations.filter((l) => subtree.has(l.slug) && isActive(index, l.slug))];

  return {
    city: toCity(index, node),
    locations,
    properties: files.properties.filter((p) => visible(p.locationSlug)),
    projects: files.projects.filter((p) => visible(p.locationSlug)),
    agents: files.agents.filter((a) => a.areasServed.some(visible)),
  };
}

export function listCities(data: ParsedData): City[] {
  const index = indexLocations(data.locations);
  return markets(index)
    .filter((m) => {
      const b = buildBundle(data, m.slug);
      return !!b && b.properties.length + b.projects.length + b.agents.length > 0;
    })
    .map((m) => toCity(index, m));
}

/** Generic DataSource over already-validated data (used by file-based adapters) */
export function createStaticDataSource(load: () => ParsedData): DataSource {
  const bundle = async (slug: string) => buildBundle(load(), slug);
  const query = async <T extends "buy" | "projects" | "agents">(q: ListingQuery, tab: T) => {
    const b = await bundle(q.citySlug);
    if (!b) return [];
    const state: QueryState = { ...emptyState(tab), ...q.state, tab };
    return runQuery<T>(b, state, createContext(b));
  };
  return {
    getCities: async () => listCities(load()),
    getLocations: async (slug) => (await bundle(slug))?.locations ?? [],
    searchListings: (q) => query(q, "buy"),
    getListing: async (id) => {
      for (const city of Object.keys(load().cities)) {
        const hit = (await bundle(city))?.properties.find((p) => p.id === id);
        if (hit) return hit;
      }
      return null;
    },
    getProjects: (q) => query(q, "projects"),
    getAgents: (q) => query(q, "agents"),
    getCityBundle: bundle,
  };
}
