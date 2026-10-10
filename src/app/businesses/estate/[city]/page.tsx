import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EstatePage from "@/components/estate/EstatePage";
import { ESTATE } from "@/config/estate/site";
import { getDataSource } from "@/lib/estate/adapters";
import { emptyState } from "@/lib/estate/engine";
import { estateMetadata } from "@/lib/estate/seo";

// One static page per enabled city with data; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getDataSource().getCities()).map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const bundle = await getDataSource().getCityBundle(params.city);
  return bundle ? estateMetadata({ cityName: bundle.city.name, citySlug: bundle.city.slug }) : {};
}

export default async function EstateCityPage({ params }: { params: { city: string } }) {
  const ds = getDataSource();
  const [cities, bundle] = await Promise.all([ds.getCities(), ds.getCityBundle(params.city)]);
  if (!bundle) notFound();
  return <EstatePage bundle={bundle} cities={cities} initialState={emptyState()} basePath={`${ESTATE.basePath}/${bundle.city.slug}`} />;
}
