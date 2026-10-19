import type { PageMeta } from "../../components/Seo";
import { ESTATE } from "../../config/estate/site";

/** Page metadata for the estate routes; canonical is always the clean path (no query) */
export function estateMetadata(opts: { cityName: string; citySlug: string; localityName?: string; localitySlug?: string }): PageMeta {
  const where = opts.localityName ? `${opts.localityName}, ${opts.cityName}` : opts.cityName;
  const title = `Properties & Land in ${where} | ${ESTATE.brand}`;
  const description = `Search plots, land, homes, commercial property, projects and agents in ${where} with ${ESTATE.brand}, part of ${ESTATE.company.parentName}.`;
  const canonical = `${ESTATE.basePath}/${opts.citySlug}${opts.localitySlug ? `/${opts.localitySlug}` : ""}`;
  return { title, description, canonical, siteName: ESTATE.company.parentName, image: ESTATE.heroImage };
}
