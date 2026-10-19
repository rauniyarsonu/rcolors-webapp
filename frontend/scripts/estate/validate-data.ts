/**
 * npm run validate:data
 * Checks every estate data file. Runs before `vite build` (prebuild), so bad data can't ship.
 */
import { imageExists, readRawData } from "./fsData";
import { listCities } from "../../src/lib/estate/datasource";
import { formatIssues, validateData } from "../../src/lib/estate/validate";

let raw;
try {
  raw = readRawData();
} catch (e) {
  console.error(`\n✖ ${(e as Error).message}\n`);
  process.exit(1);
}

const { issues, data } = validateData(raw, { imageExists });
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

if (issues.length) console.log(`\n${formatIssues(issues)}\n`);

const cityNames = errors.length ? [] : listCities(data).map((c) => c.name);
const counts = Object.entries(data.cities).map(
  ([slug, c]) => `${slug}: ${c.properties.length} listings, ${c.projects.length} projects, ${c.agents.length} agents`,
);
const samples = Object.values(data.cities).reduce(
  (n, c) => n + [...c.properties, ...c.projects, ...c.agents].filter((r) => r.isSample).length,
  0,
);
const unconfirmed = data.locations.filter((l) => l.toConfirm).length;

console.log("Estate data");
counts.forEach((line) => console.log(`  ${line}`));
if (!errors.length) console.log(`  City dropdown: ${cityNames.join(", ") || "(empty)"}`);
if (samples) console.log(`  ${samples} [SAMPLE] records still need replacing`);
if (unconfirmed) console.log(`  ${unconfirmed} locations are marked toConfirm (TO CONFIRM BY OWNER)`);

if (errors.length) {
  console.error(`\n✖ ${errors.length} error(s), ${warnings.length} warning(s). Fix the errors above.\n`);
  process.exit(1);
}
console.log(`\n✔ Data is valid${warnings.length ? ` (${warnings.length} warning(s))` : ""}\n`);
