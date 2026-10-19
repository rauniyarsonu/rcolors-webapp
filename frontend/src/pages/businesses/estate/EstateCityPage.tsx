import { useParams } from "react-router-dom";
import EstatePage from "@/components/estate/EstatePage";
import LoadState from "@/components/LoadState";
import Seo from "@/components/Seo";
import NotFoundPage from "@/pages/NotFoundPage";
import { ESTATE } from "@/config/estate/site";
import { emptyState } from "@/lib/estate/engine";
import type { City, CityBundle } from "@/lib/estate/schema";
import { estateMetadata } from "@/lib/estate/seo";
import { useApi } from "@/lib/useApi";

// One page per enabled city with data; anything else is a 404
export default function EstateCityPage() {
  const { city = "" } = useParams();
  const cities = useApi<City[]>("/api/estate/cities");
  const bundle = useApi<CityBundle>(`/api/estate/cities/${encodeURIComponent(city)}`);

  if (bundle.status === "not-found") return <NotFoundPage />;
  if (bundle.status !== "ok") return <LoadState result={bundle} />;
  if (cities.status !== "ok") return <LoadState result={cities} />;
  const b = bundle.data;
  return (
    <>
      <Seo meta={estateMetadata({ cityName: b.city.name, citySlug: b.city.slug })} />
      <EstatePage key={b.city.slug} bundle={b} cities={cities.data} initialState={emptyState()} basePath={`${ESTATE.basePath}/${b.city.slug}`} />
    </>
  );
}
