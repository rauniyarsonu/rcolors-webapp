/**
 * npm run import:csv -- --city lucknow --type properties --file listings.csv [--replace] [--dry-run]
 * Converts a CSV (columns: docs/ADDING-DATA.md, templates: backend/src/main/resources/data/estate/templates/)
 * into the city's JSON. Rows with an existing id update that record; new ids are added.
 * --replace swaps the whole file. Nothing is written unless the full dataset validates.
 */
import fs from "node:fs";
import path from "node:path";
import { CITIES_DIR, imageExists, readRawData, writeJson } from "./fsData";
import { csvToRecords, type CsvKind } from "../../src/lib/estate/csv";
import { formatIssues, validateData } from "../../src/lib/estate/validate";
import { fail, parseArgs, requireArg } from "./args";

const USAGE = "npm run import:csv -- --city lucknow --type properties|projects|agents --file data.csv [--replace] [--dry-run]";
const args = parseArgs();
const city = requireArg(args, "city", USAGE);
const kind = requireArg(args, "type", USAGE) as CsvKind;
const file = requireArg(args, "file", USAGE);
if (!["properties", "projects", "agents"].includes(kind)) fail(`--type must be properties, projects or agents`);
if (!fs.existsSync(file)) fail(`File not found: ${file}`);

const raw = readRawData();
if (!raw.cities[city]) fail(`No data folder for "${city}". Run: npm run add-city -- --name "<City>" --state "<State>"`);

const { records, errors } = csvToRecords(kind, fs.readFileSync(file, "utf8"), city);
if (errors.length) fail(`${file}\n  ${errors.join("\n  ")}`);

const existing = (Array.isArray(raw.cities[city][kind]) ? raw.cities[city][kind] : []) as { id: string }[];
let next: unknown[];
let added = 0;
let updated = 0;
if (args.replace) {
  next = records;
  added = records.length;
} else {
  const byId = new Map(existing.map((r) => [r.id, r as unknown]));
  for (const r of records) {
    if (byId.has(r.id as string)) updated++;
    else added++;
    byId.set(r.id as string, r);
  }
  next = Array.from(byId.values());
}

raw.cities[city][kind] = next;
const { issues } = validateData(raw, { imageExists });
const problems = issues.filter((i) => i.level === "error");
if (problems.length) fail(`Import rejected, nothing was written:\n${formatIssues(problems)}`);

const target = path.join(CITIES_DIR, city, `${kind}.json`);
if (args["dry-run"]) {
  console.log(`\n✔ Dry run: ${added} new, ${updated} updated. ${path.relative(process.cwd(), target)} not changed.\n`);
} else {
  writeJson(target, next);
  console.log(`\n✔ ${path.relative(process.cwd(), target)}: ${added} new, ${updated} updated (${next.length} total)\n`);
}
