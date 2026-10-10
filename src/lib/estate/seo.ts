import type { Metadata } from "next";
import { ESTATE } from "../../config/estate/site";

/** Page metadata for the estate routes; canonical is always the clean path (no query) */
export function estateMetadata(opts: { cityName: string; citySlug: string; localityName?: string; localitySlug?: string }): Metadata {
  const where = opts.localityName ? `${opts.localityName}, ${opts.cityName}` : opts.cityName;
  const title = `Properties & Land in ${where} | ${ESTATE.brand}`;
  const description = `Search plots, land, homes, commercial property, projects and agents in ${where} with ${ESTATE.brand}, part of ${ESTATE.company.parentName}.`;
  const canonical = `${ESTATE.basePath}/${opts.citySlug}${opts.localitySlug ? `/${opts.localitySlug}` : ""}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: ESTATE.company.parentName,
      locale: "en_IN",
      images: [{ url: ESTATE.heroImage.src, alt: ESTATE.heroImage.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ESTATE.heroImage.src] },
  };
}
