/**
 * npm run add-city -- --name "Kanpur" --state "Uttar Pradesh" [--slug kanpur] [--type city|town]
 * Adds a disabled city to locations.json, scaffolds its data folder and image folder.
 */
import fs from "node:fs";
import path from "node:path";
import { CITIES_DIR, CITY_FILES, LOCATIONS_PATH, PUBLIC_DIR, readJson, writeJson } from "./fsData";
import type { Location } from "../../src/lib/estate/schema";
import { slugify } from "../../src/lib/estate/slug";
import { fail, parseArgs, requireArg } from "./args";

const USAGE = 'npm run add-city -- --name "Kanpur" --state "Uttar Pradesh" [--slug kanpur] [--type city|town]';
const args = parseArgs();
const name = requireArg(args, "name", USAGE);
const stateName = requireArg(args, "state", USAGE);
const slug = typeof args.slug === "string" ? slugify(args.slug) : slugify(name);
const type = args.type === "town" ? "town" : "city";

const locations = readJson(LOCATIONS_PATH) as Location[];
if (locations.some((l) => l.slug === slug)) fail(`A location with slug "${slug}" already exists. Pass --slug to choose another.`);

let state = locations.find((l) => l.type === "state" && (l.slug === slugify(stateName) || l.name.toLowerCase() === stateName.toLowerCase()));
if (!state) {
  state = { id: slugify(stateName), slug: slugify(stateName), name: stateName, type: "state", parentId: null, enabled: true, order: locations.filter((l) => l.type === "state").length + 1 };
  locations.push(state);
  console.log(`+ state "${stateName}" (${state.slug})`);
}

const siblings = locations.filter((l) => l.parentId === state!.id);
locations.push({
  id: slug,
  slug,
  name,
  type,
  parentId: state.id,
  enabled: false,
  order: siblings.reduce((m, l) => Math.max(m, l.order ?? 0), 0) + 1,
});
writeJson(LOCATIONS_PATH, locations);
console.log(`+ ${type} "${name}" (${slug}) in locations.json, enabled: false`);

const dir = path.join(CITIES_DIR, slug);
for (const kind of CITY_FILES) {
  const file = path.join(dir, `${kind}.json`);
  if (!fs.existsSync(file)) writeJson(file, []);
}
console.log(`+ backend/src/main/resources/data/estate/cities/${slug}/{${CITY_FILES.join(",")}}.json`);

const imgDir = path.join(PUBLIC_DIR, "images/estate", slug);
fs.mkdirSync(imgDir, { recursive: true });
if (!fs.readdirSync(imgDir).length) fs.writeFileSync(path.join(imgDir, ".gitkeep"), "");
console.log(`+ frontend/public/images/estate/${slug}/`);

console.log(`
Next:
  1. npm run add-locality -- --city ${slug} --name "<Locality>"
  2. Add records (or npm run import:csv -- --city ${slug} --type properties --file data.csv)
  3. Set "enabled": true for "${slug}" in backend/src/main/resources/data/estate/locations.json
  4. npm run validate:data
`);
