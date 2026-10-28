import EstatePage from "@/components/estate/EstatePage";
import EstateAbout from "@/components/estate/EstateAbout";
import EstateHero from "@/components/estate/EstateHero";
import LoadState from "@/components/LoadState";
import Seo from "@/components/Seo";
import { emptyState } from "@/lib/estate/engine";
import type { City, CityBundle } from "@/lib/estate/schema";
import { estateMetadata } from "@/lib/estate/seo";
import { useApi } from "@/lib/useApi";
import { ESTATE } from "@/config/estate/site";

// The hub shows the first enabled city; its canonical is that city's page
export default function EstateBusinessPage() {
  const cities = useApi<City[]>("/api/estate/cities");
  const first = cities.data?.[0];
  const bundle = useApi<CityBundle>(first ? `/api/estate/cities/${first.slug}` : null);

  if (cities.status !== "ok") return <LoadState result={cities} />;

  // No enabled city with data yet: keep the company content
  if (!first || bundle.status === "not-found") {
    return (
      <>
        <EstateHero />
        <EstateAbout />
      </>
    );
  }
  if (bundle.status !== "ok") return <LoadState result={bundle} />;

  return (
    <>
      <Seo meta={estateMetadata({ cityName: first.name, citySlug: first.slug })} />
      <EstatePage bundle={bundle.data} cities={cities.data} initialState={emptyState()} basePath={ESTATE.basePath} />
    </>
  );
}
