/**
 * Node-only file access for the JSON adapter and the npm scripts.
 * Never import this from a client component.
 */
import fs from "node:fs";
import path from "node:path";
import type { RawCityFiles } from "./schema";
import type { RawData } from "./validate";

export const ROOT_DIR = process.cwd();
export const DATA_DIR = path.join(ROOT_DIR, "src/data/estate");
export const CITIES_DIR = path.join(DATA_DIR, "cities");
export const LOCATIONS_PATH = path.join(DATA_DIR, "locations.json");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");
export const CITY_FILES: (keyof RawCityFiles)[] = ["properties", "projects", "agents"];

export function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`Could not read ${path.relative(ROOT_DIR, file)}: ${(e as Error).message}`);
  }
}

export function writeJson(file: string, value: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

/** City folders are discovered, never registered: every folder under cities/ is a city */
export function cityFolders(): string[] {
  if (!fs.existsSync(CITIES_DIR)) return [];
  return fs
    .readdirSync(CITIES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort();
}

export function readRawData(): RawData {
  const cities: RawData["cities"] = {};
  for (const city of cityFolders()) {
    const files = {} as RawCityFiles;
    for (const kind of CITY_FILES) {
      const file = path.join(CITIES_DIR, city, `${kind}.json`);
      files[kind] = fs.existsSync(file) ? readJson(file) : [];
    }
    cities[city] = files;
  }
  return { locations: readJson(LOCATIONS_PATH), cities };
}

export const imageExists = (sitePath: string) => fs.existsSync(path.join(PUBLIC_DIR, decodeURI(sitePath)));
