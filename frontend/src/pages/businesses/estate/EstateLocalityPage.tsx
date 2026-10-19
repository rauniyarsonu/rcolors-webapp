import { useParams } from "react-router-dom";
import EstatePage, { landingAreas } from "@/components/estate/EstatePage";
import LoadState from "@/components/LoadState";
import Seo from "@/components/Seo";
import NotFoundPage from "@/pages/NotFoundPage";
import { ESTATE } from "@/config/estate/site";
import { emptyState } from "@/lib/estate/engine";
import type { City, CityBundle } from "@/lib/estate/schema";
import { estateMetadata } from "@/lib/estate/seo";
import { useApi } from "@/lib/useApi";

// SEO landing pages for every area that has listings or projects
export default function EstateLocalityPage() {
  const params = useParams();
  const cities = useApi<City[]>("/api/estate/cities");
  const bundle = useApi<CityBundle>(`/api/estate/cities/${encodeURIComponent(params.city ?? "")}`);

  if (bundle.status === "not-found") return <NotFoundPage />;
  if (bundle.status !== "ok") return <LoadState result={bundle} />;
  if (cities.status !== "ok") return <LoadState result={cities} />;
  const b = bundle.data;
  const locality = landingAreas(b).find((l) => l.slug === params.locality);
  if (!locality) return <NotFoundPage />;
  return (
    <>
      <Seo meta={estateMetadata({ cityName: b.city.name, citySlug: b.city.slug, localityName: locality.name, localitySlug: locality.slug })} />
      <EstatePage
        key={`${b.city.slug}/${locality.slug}`}
        bundle={b}
        cities={cities.data}
        initialState={{ ...emptyState(), loc: [locality.slug] }}
        basePath={`${ESTATE.basePath}/${b.city.slug}`}
        heroTitle={`Property & Land in ${locality.name}, ${b.city.name}`}
      />
    </>
  );
}
