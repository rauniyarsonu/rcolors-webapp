import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EstatePage, { landingAreas } from "@/components/estate/EstatePage";
import { ESTATE } from "@/config/estate/site";
import { getDataSource } from "@/lib/estate/adapters";
import { emptyState } from "@/lib/estate/engine";
import { estateMetadata } from "@/lib/estate/seo";

// Static SEO landing pages for every area that has listings or projects
export const dynamicParams = false;

export async function generateStaticParams() {
  const ds = getDataSource();
  const params: { city: string; locality: string }[] = [];
  for (const city of await ds.getCities()) {
    const bundle = await ds.getCityBundle(city.slug);
    if (bundle) for (const l of landingAreas(bundle)) params.push({ city: city.slug, locality: l.slug });
  }
  return params;
}

async function load(params: { city: string; locality: string }) {
  const bundle = await getDataSource().getCityBundle(params.city);
  const locality = bundle && landingAreas(bundle).find((l) => l.slug === params.locality);
  return bundle && locality ? { bundle, locality } : null;
}

export async function generateMetadata({ params }: { params: { city: string; locality: string } }): Promise<Metadata> {
  const hit = await load(params);
  return hit ? estateMetadata({ cityName: hit.bundle.city.name, citySlug: hit.bundle.city.slug, localityName: hit.locality.name, localitySlug: hit.locality.slug }) : {};
}

export default async function EstateLocalityPage({ params }: { params: { city: string; locality: string } }) {
  const [hit, cities] = await Promise.all([load(params), getDataSource().getCities()]);
  if (!hit) notFound();
  const { bundle, locality } = hit;
  return (
    <EstatePage
      bundle={bundle}
      cities={cities}
      initialState={{ ...emptyState(), loc: [locality.slug] }}
      basePath={`${ESTATE.basePath}/${bundle.city.slug}`}
      heroTitle={`Property & Land in ${locality.name}, ${bundle.city.name}`}
    />
  );
}
