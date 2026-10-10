import { createStaticDataSource, type DataSource } from "../datasource";
import { imageExists, readRawData } from "../fsData";
import { formatIssues, validateData, type ParsedData } from "../validate";

/**
 * Reads src/data/estate at build time. Invalid data fails the build with the
 * same messages `npm run validate:data` prints.
 */
export function createJsonDataSource(): DataSource {
  let cache: ParsedData | null = null;
  const load = () => {
    if (cache) return cache;
    const { issues, data } = validateData(readRawData(), { imageExists });
    const errors = issues.filter((i) => i.level === "error");
    if (errors.length) throw new Error(`Estate data is invalid:\n${formatIssues(errors)}`);
    cache = data;
    return data;
  };
  return createStaticDataSource(load);
}
