import { ESTATE } from "@/config/estate/site";
import type { QueryState } from "@/lib/estate/engine";
import { areasOf, indexLocations } from "@/lib/estate/locationTree";
import type { City, CityBundle } from "@/lib/estate/schema";
import ClosingCta from "@/components/construction/ClosingCta";
import EstateAbout from "./EstateAbout";
import EstatePortal from "./EstatePortal";

interface EstatePageProps {
  bundle: CityBundle;
  cities: City[];
  initialState: QueryState;
  basePath: string;
  heroTitle?: string;
}

/** Areas that have a static landing page (at least one listing or project) */
export function landingAreas(bundle: CityBundle) {
  const index = indexLocations(bundle.locations);
  const used = new Set([...bundle.properties, ...bundle.projects].map((r) => r.locationSlug));
  return areasOf(index, bundle.city.slug)
    .map((a) => a.location)
    .filter((l) => used.has(l.slug));
}

/** Server shell shared by the hub, city and locality routes */
export default function EstatePage({ bundle, cities, initialState, basePath, heroTitle }: EstatePageProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: ESTATE.company.name,
    parentOrganization: { "@type": "Organization", name: ESTATE.company.parentName },
    address: {
      "@type": "PostalAddress",
      streetAddress: ESTATE.company.streetAddress,
      addressLocality: ESTATE.company.locality,
      addressRegion: ESTATE.company.region,
      addressCountry: ESTATE.company.country,
    },
    telephone: ESTATE.company.phones.map((p) => `+91${p}`),
    email: ESTATE.company.email,
    areaServed: cities.map((c) => c.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EstatePortal bundle={bundle} cities={cities} initialState={initialState} basePath={basePath} heroTitle={heroTitle}>
        <EstateAbout />
      </EstatePortal>
      <ClosingCta
        eyebrow="Find Your Next Property"
        title="Ready to Make Your Move?"
        body="Browse verified plots, homes and commercial spaces, or talk to our team about buying, selling or investing."
        primary={{ href: "#es-results", label: "Browse Properties" }}
        secondary={{ href: "/contact", label: "Talk to an Advisor" }}
      />
    </>
  );
}
