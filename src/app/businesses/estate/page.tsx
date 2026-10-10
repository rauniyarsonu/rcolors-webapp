import type { Metadata } from "next";
import EstatePage from "@/components/estate/EstatePage";
import EnquirySection from "@/components/estate/EnquirySection";
import WhyEstate from "@/components/estate/WhyEstate";
import { getDataSource } from "@/lib/estate/adapters";
import { emptyState } from "@/lib/estate/engine";
import { estateMetadata } from "@/lib/estate/seo";
import { ESTATE } from "@/config/estate/site";

// The hub shows the first enabled city; its canonical is that city's page
export async function generateMetadata(): Promise<Metadata> {
  const [city] = await getDataSource().getCities();
  if (!city) return { title: `${ESTATE.brand} | ${ESTATE.company.parentName}` };
  return estateMetadata({ cityName: city.name, citySlug: city.slug });
}

export default async function EstateBusinessPage() {
  const ds = getDataSource();
  const cities = await ds.getCities();
  const bundle = cities[0] ? await ds.getCityBundle(cities[0].slug) : null;

  // No enabled city with data yet: keep the company content and the enquiry form working
  if (!bundle) {
    return (
      <div className="pt-16 lg:pt-20">
        <WhyEstate />
        <EnquirySection />
      </div>
    );
  }

  return <EstatePage bundle={bundle} cities={cities} initialState={emptyState()} basePath={ESTATE.basePath} />;
}
