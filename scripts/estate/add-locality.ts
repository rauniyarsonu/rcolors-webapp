/**
 * npm run add-locality -- --city lucknow --name "Gomti Nagar"
 *   [--type locality|village|town|district] [--parent <slug>] [--slug <slug>]
 *   [--aliases "GN|Gomtinagar"] [--landmarks "Ambedkar Park"] [--nearby "aliganj|chinhat"]
 * Regional areas: --type town or --type village, optionally under a town with --parent.
 */
import { LOCATIONS_PATH, readJson, writeJson } from "../../src/lib/estate/fsData";
import { indexLocations, isMarket, isWithin } from "../../src/lib/estate/locationTree";
import { LOCATION_TYPES, type Location } from "../../src/lib/estate/schema";
import { slugify } from "../../src/lib/estate/slug";
import { fail, parseArgs, requireArg } from "./args";

const USAGE = 'npm run add-locality -- --city lucknow --name "Gomti Nagar" [--type locality|village|town] [--parent <slug>]';
const args = parseArgs();
const city = requireArg(args, "city", USAGE);
const name = requireArg(args, "name", USAGE);
const type = (typeof args.type === "string" ? args.type : "locality") as Location["type"];
if (!LOCATION_TYPES.includes(type) || type === "state" || type === "city") fail(`--type must be one of: locality, village, town, district`);

const locations = readJson(LOCATIONS_PATH) as Location[];
const index = indexLocations(locations);
if (!index.bySlug.has(city) || !isMarket(index, city)) fail(`Unknown city "${city}". Add it first: npm run add-city -- --name "<City>" --state "<State>"`);

const parentSlug = typeof args.parent === "string" ? args.parent : city;
const parent = index.bySlug.get(parentSlug);
if (!parent || !isWithin(index, parentSlug, city)) fail(`--parent "${parentSlug}" is not ${city} or a location inside it`);

let slug = typeof args.slug === "string" ? slugify(args.slug) : slugify(name);
if (index.bySlug.has(slug) && typeof args.slug !== "string") slug = `${slug}-${city}`;
if (index.bySlug.has(slug)) fail(`Slug "${slug}" is already used. Pass --slug to choose another.`);

const split = (v: string | true | undefined) => (typeof v === "string" ? v.split("|").map((s) => s.trim()).filter(Boolean) : undefined);
const nearby = split(args.nearby);
for (const n of nearby ?? []) if (!index.bySlug.has(n)) fail(`--nearby "${n}" is not a known location slug`);

const siblings = locations.filter((l) => l.parentId === parent!.id);
const node: Location = {
  id: slug,
  slug,
  name,
  type,
  parentId: parent!.id,
  enabled: true,
  order: siblings.reduce((m, l) => Math.max(m, l.order ?? 0), 0) + 1,
};
const aliases = split(args.aliases);
const landmarks = split(args.landmarks);
if (aliases) node.aliases = aliases;
if (landmarks) node.landmarks = landmarks;
if (nearby) node.nearby = nearby;

locations.push(node);
writeJson(LOCATIONS_PATH, locations);
console.log(`+ ${type} "${name}" (${slug}) under ${parent!.name}`);
console.log(`  Use "locationSlug": "${slug}" in records. Then: npm run validate:data\n`);
