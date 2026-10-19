import Link from "@/components/ui/Link";
import { MapPin } from "lucide-react";
import DivisionSwitcher from "@/components/construction/DivisionSwitcher";
import { ESTATE } from "@/config/estate/site";
import type { QueryState } from "@/lib/estate/engine";
import { areasOf, indexLocations } from "@/lib/estate/locationTree";
import type { City, CityBundle } from "@/lib/estate/schema";
import EstatePortal from "./EstatePortal";
import WhyEstate from "./WhyEstate";

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
  const links = landingAreas(bundle);
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
        <WhyEstate />
        {links.length > 0 && (
          <nav aria-labelledby="es-explore" className="border-t border-es-line bg-white py-12">
            <div className="es-container">
              <h2 id="es-explore" className="font-display text-xl font-bold text-es-ink">
                Explore {bundle.city.name} by locality
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                {links.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`${ESTATE.basePath}/${bundle.city.slug}/${l.slug}`}
                      className="flex min-h-[44px] items-center gap-2 text-sm text-es-body hover:text-es-accent-strong hover:underline"
                    >
                      <MapPin size={14} aria-hidden="true" className="shrink-0 text-es-accent-strong" />
                      Property in {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </EstatePortal>
      <DivisionSwitcher current="/businesses/estate" />
    </>
  );
}
