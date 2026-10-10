import type { City, Location } from "./schema";

/** Lookup structure over the flat location list from locations.json */
export interface LocationIndex {
  bySlug: Map<string, Location>;
  byId: Map<string, Location>;
  children: Map<string, Location[]>;
}

const byOrder = (a: Location, b: Location) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name);

export function indexLocations(locations: Location[]): LocationIndex {
  const bySlug = new Map<string, Location>();
  const byId = new Map<string, Location>();
  const children = new Map<string, Location[]>();
  for (const loc of locations) {
    bySlug.set(loc.slug, loc);
    byId.set(loc.id, loc);
  }
  for (const loc of locations) {
    if (!loc.parentId) continue;
    const list = children.get(loc.parentId) ?? [];
    list.push(loc);
    children.set(loc.parentId, list);
  }
  children.forEach((list) => list.sort(byOrder));
  return { bySlug, byId, children };
}

/** Ancestors from the direct parent up to the root (cycle-safe) */
export function ancestors(index: LocationIndex, slug: string): Location[] {
  const out: Location[] = [];
  const seen = new Set<string>([slug]);
  let parentId = index.bySlug.get(slug)?.parentId ?? null;
  while (parentId && !seen.has(parentId)) {
    const parent = index.byId.get(parentId);
    if (!parent) break;
    out.push(parent);
    seen.add(parent.slug);
    parentId = parent.parentId;
  }
  return out;
}

/** Slugs of a node and every node below it */
export function descendantSlugs(index: LocationIndex, slug: string): Set<string> {
  const out = new Set<string>();
  const start = index.bySlug.get(slug);
  if (!start) return out;
  const stack = [start];
  while (stack.length) {
    const node = stack.pop()!;
    if (out.has(node.slug)) continue;
    out.add(node.slug);
    stack.push(...(index.children.get(node.id) ?? []));
  }
  return out;
}

/** True when `slug` is `ancestorSlug` or sits anywhere below it */
export function isWithin(index: LocationIndex, slug: string, ancestorSlug: string): boolean {
  if (slug === ancestorSlug) return true;
  return ancestors(index, slug).some((a) => a.slug === ancestorSlug);
}

/** A node is active when it and all its ancestors are enabled */
export function isActive(index: LocationIndex, slug: string): boolean {
  const node = index.bySlug.get(slug);
  if (!node || !node.enabled) return false;
  return ancestors(index, slug).every((a) => a.enabled);
}

export function stateOf(index: LocationIndex, slug: string): Location | null {
  const node = index.bySlug.get(slug);
  if (node?.type === "state") return node;
  return ancestors(index, slug).find((a) => a.type === "state") ?? null;
}

const isMarketType = (l: Location) => l.type === "city" || l.type === "town";

/**
 * Markets are city/town nodes not nested inside another city/town. A town
 * under Lucknow is a regional area of Lucknow, not a separate market.
 */
export function isMarket(index: LocationIndex, slug: string): boolean {
  const node = index.bySlug.get(slug);
  return !!node && isMarketType(node) && !ancestors(index, slug).some(isMarketType);
}

/** Enabled markets in config order (record counts are checked by the data source) */
export function markets(index: LocationIndex): Location[] {
  return Array.from(index.bySlug.values())
    .filter((l) => isMarket(index, l.slug) && isActive(index, l.slug))
    .sort(byOrder);
}

export function toCity(index: LocationIndex, market: Location): City {
  const state = stateOf(index, market.slug);
  return { slug: market.slug, name: market.name, stateSlug: state?.slug ?? null, stateName: state?.name ?? null };
}

/**
 * Areas listed under a city: its active descendants (localities, regional
 * towns and villages), depth-first, with the depth for indentation.
 */
export function areasOf(index: LocationIndex, citySlug: string): { location: Location; depth: number; parentSlug: string }[] {
  const out: { location: Location; depth: number; parentSlug: string }[] = [];
  const city = index.bySlug.get(citySlug);
  if (!city) return out;
  const walk = (node: Location, depth: number) => {
    for (const child of index.children.get(node.id) ?? []) {
      if (!child.enabled) continue;
      out.push({ location: child, depth, parentSlug: node.slug });
      walk(child, depth + 1);
    }
  };
  walk(city, 0);
  return out;
}

/** Regional areas are towns and villages; localities are neighbourhoods inside the city */
export const isRegional = (l: Location) => l.type === "town" || l.type === "village" || l.type === "district";
