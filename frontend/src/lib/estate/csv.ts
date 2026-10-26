/**
 * CSV → record conversion for `npm run import:csv`. Column lists double as
 * the documentation in docs/ADDING-DATA.md and the templates in
 * backend/src/main/resources/data/estate/templates/. Records are schema-checked afterwards by validateData.
 */
import { PROPERTY_TYPES } from "../../config/estate/catalog";
import { parsePrice } from "./format";

export type CsvKind = "properties" | "projects" | "agents";
type ColumnType = "string" | "number" | "price" | "boolean" | "list";
interface Column {
  name: string;
  type: ColumnType;
  /** Stored under record.attributes instead of the top level */
  attr?: boolean;
  required?: boolean;
}

const c = (name: string, type: ColumnType = "string", extra: Partial<Column> = {}): Column => ({ name, type, ...extra });

export const CSV_COLUMNS: Record<CsvKind, Column[]> = {
  properties: [
    c("id", "string", { required: true }),
    c("locationSlug", "string", { required: true }),
    c("title", "string", { required: true }),
    c("category"),
    c("type", "string", { required: true }),
    c("price", "price", { required: true }),
    c("priceUnit"),
    c("areaValue", "number", { required: true }),
    c("areaUnit", "string", { required: true }),
    c("status", "string", { required: true }),
    c("images", "list"),
    c("verified", "boolean"),
    c("verifiedOn"),
    c("description"),
    c("postedAt"),
    c("featured", "boolean"),
    c("agentId"),
    c("projectId"),
    c("isSample", "boolean"),
    c("facing", "string", { attr: true }),
    c("roadWidth", "number", { attr: true }),
    c("cornerPlot", "boolean", { attr: true }),
    c("boundaryWall", "boolean", { attr: true }),
    c("landUse", "string", { attr: true }),
    c("distanceFromHighway", "number", { attr: true }),
    c("titleDocsVerified", "boolean", { attr: true }),
    c("bhk", "number", { attr: true }),
    c("bathrooms", "number", { attr: true }),
    c("floor", "number", { attr: true }),
    c("totalFloors", "number", { attr: true }),
    c("furnishing", "string", { attr: true }),
    c("ageYears", "number", { attr: true }),
    c("possession", "string", { attr: true }),
  ],
  projects: [
    c("id", "string", { required: true }),
    c("locationSlug", "string", { required: true }),
    c("name", "string", { required: true }),
    c("developer", "string", { required: true }),
    c("type", "string", { required: true }),
    c("status", "string", { required: true }),
    c("startingPrice", "price", { required: true }),
    c("sizeRange", "string", { required: true }),
    c("images", "list"),
    c("description"),
    c("reraId"),
    c("featured", "boolean"),
    c("isSample", "boolean"),
  ],
  agents: [
    c("id", "string", { required: true }),
    c("name", "string", { required: true }),
    c("role", "string", { required: true }),
    c("photo"),
    c("phone", "string", { required: true }),
    c("whatsapp"),
    c("email"),
    c("specializations", "list", { required: true }),
    c("areasServed", "list", { required: true }),
    c("languages", "list", { required: true }),
    c("featured", "boolean"),
    c("isSample", "boolean"),
  ],
};

/** RFC 4180 parser: quoted fields, escaped quotes, commas/newlines inside quotes, CRLF, BOM */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

const csvCell = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export const toCsv = (rows: string[][]) => rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";

function convert(raw: string, type: ColumnType): { value?: unknown; error?: string } {
  const v = raw.trim();
  if (v === "") return {};
  switch (type) {
    case "string":
      return { value: v };
    case "number": {
      const n = Number(v.replace(/,/g, ""));
      return Number.isFinite(n) ? { value: n } : { error: `"${v}" is not a number` };
    }
    case "price": {
      const n = parsePrice(v);
      return n !== null && n > 0 ? { value: n } : { error: `"${v}" is not a price (use 4500000, 45 L or 1.2 Cr)` };
    }
    case "boolean": {
      if (/^(true|yes|y|1)$/i.test(v)) return { value: true };
      if (/^(false|no|n|0)$/i.test(v)) return { value: false };
      return { error: `"${v}" is not yes/no` };
    }
    case "list":
      return { value: v.split("|").map((s) => s.trim()).filter(Boolean) };
  }
}

export interface CsvResult {
  records: Record<string, unknown>[];
  errors: string[];
}

/** Converts CSV text to records for one city. Doesn't schema-check: run validateData on the result. */
export function csvToRecords(kind: CsvKind, text: string, citySlug: string, today = new Date().toISOString().slice(0, 10)): CsvResult {
  const columns = CSV_COLUMNS[kind];
  const rows = parseCsv(text);
  const errors: string[] = [];
  if (!rows.length) return { records: [], errors: ["the file is empty"] };

  const header = rows[0].map((h) => h.trim());
  const known = new Set(columns.map((col) => col.name));
  const unknown = header.filter((h) => !known.has(h));
  if (unknown.length) errors.push(`unknown column(s): ${unknown.join(", ")}. Allowed: ${columns.map((col) => col.name).join(", ")}`);
  const missing = columns.filter((col) => col.required && !header.includes(col.name)).map((col) => col.name);
  if (missing.length) errors.push(`missing required column(s): ${missing.join(", ")}`);
  if (errors.length) return { records: [], errors };

  const records: Record<string, unknown>[] = [];
  rows.slice(1).forEach((cells, r) => {
    const line = r + 2;
    const record: Record<string, unknown> = {};
    const attributes: Record<string, unknown> = {};
    header.forEach((name, i) => {
      const col = columns.find((x) => x.name === name)!;
      const { value, error } = convert(cells[i] ?? "", col.type);
      if (error) errors.push(`line ${line}, ${name}: ${error}`);
      else if (value === undefined && col.required) errors.push(`line ${line}: ${name} is required`);
      else if (value !== undefined) (col.attr ? attributes : record)[name] = value;
    });
    if (kind !== "agents") record.citySlug = citySlug;
    if (kind === "properties") {
      const type = record.type as keyof typeof PROPERTY_TYPES | undefined;
      if (!record.category && type && PROPERTY_TYPES[type]) record.category = PROPERTY_TYPES[type].category;
      record.verified ??= false;
      record.postedAt ??= today;
      record.attributes = attributes;
    }
    if (kind !== "agents") {
      record.images ??= [];
      record.description ??= "";
    }
    records.push(record);
  });
  return { records, errors };
}
