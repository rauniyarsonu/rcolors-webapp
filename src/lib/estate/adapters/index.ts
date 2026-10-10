import type { DataSource } from "../datasource";
import { createJsonDataSource } from "./json";

let instance: DataSource | null = null;

/** Swap the adapter here (CMS, Sheets, REST…) without touching any component. Server-only. */
export function getDataSource(): DataSource {
  instance ??= createJsonDataSource();
  return instance;
}
