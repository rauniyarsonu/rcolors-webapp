import { useMemo } from "react";
import { Briefcase } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Seo from "@/components/Seo";
import LoadState from "@/components/LoadState";
import Link from "@/components/ui/Link";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBanner from "@/components/ui/CtaBanner";
import JobCard, { JobCardSkeleton } from "@/components/careers/JobCard";
import JobFilters from "@/components/careers/JobFilters";
import { CAREERS_PAGE } from "@/config/careers";
import { hasFilters, jobsApiPath, parseCareersQuery, serializeCareersQuery, type CareersQuery } from "@/lib/careers/query";
import type { CareerFilters, PublicJobSummary } from "@/lib/careers/types";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useApi } from "@/lib/useApi";

const GENERAL_APPLICATION = "/careers/apply";

export default function CareersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // The query string is the only filter state, so filtered views are shareable and back/forward restore them
  const query = useMemo(() => parseCareersQuery(searchParams), [searchParams]);
  const jobs = useApi<PublicJobSummary[]>(jobsApiPath(query));
  const filters = useApi<CareerFilters>("/api/careers/filters");

  const setQuery = (next: CareersQuery, opts: { replace?: boolean } = {}) => {
    const qs = serializeCareersQuery(next);
    const href = qs ? `/careers?${qs}` : "/careers";
    if (opts.replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };

  const filtered = hasFilters(query);
  const options = filters.status === "ok" ? filters.data : null;
  const noJobsAtAll = !filtered && jobs.status === "ok" && jobs.data.length === 0;

  return (
    // A div, not <main>: the root layout already provides <main>
    <div className="flex w-full flex-col">
      <Seo
        meta={{
          title: CAREERS_PAGE.seo.title,
          description: CAREERS_PAGE.seo.description,
          canonical: "/careers",
          image: { src: "/images/home1.jpg", alt: "R Colors Group team at work" },
          siteName: "R Colors Group of Companies",
        }}
      />
      <PageHeader titlePart1={CAREERS_PAGE.header.titlePart1} titlePart2={CAREERS_PAGE.header.titlePart2} />

      {/* Why work with us */}
      <section className="section-y w-full bg-gray-50">
        <div className="site-container">
          <div data-aos="fade-up">
            <SectionHeading eyebrow={CAREERS_PAGE.intro.eyebrow} title={CAREERS_PAGE.intro.title} subtitle={CAREERS_PAGE.intro.text} bar className="mb-10 md:mb-14" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {CAREERS_PAGE.perks.map((perk, idx) => (
              <div key={perk.title} className="rounded-xl border-t-4 border-brand-sky bg-white p-6 shadow-lg" data-aos="fade-up" data-aos-delay={idx * 100}>
                <perk.icon className="mb-4 text-brand-sky" size={36} aria-hidden="true" />
                <h3 className="mb-2 text-lg font-bold text-brand-navy">{perk.title}</h3>
                <p className="text-base text-gray-600">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section id="open-positions" aria-labelledby="open-positions-title" className="section-y w-full scroll-mt-24">
        <div className="site-container">
          <SectionHeading id="open-positions-title" eyebrow={CAREERS_PAGE.listHeading.eyebrow} title={CAREERS_PAGE.listHeading.title} bar className="mb-8 md:mb-10" />

          {!noJobsAtAll && <JobFilters query={query} options={options} onChange={setQuery} />}

          {jobs.status === "loading" ? (
            <div aria-busy="true" aria-label="Loading open positions" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {[0, 1, 2, 3].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.status === "ok" ? (
            jobs.data.length > 0 ? (
              <>
                <p aria-live="polite" className="mb-4 text-sm font-medium text-gray-600">
                  {jobs.data.length} open {jobs.data.length === 1 ? "position" : "positions"}
                </p>
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                  {jobs.data.map((job) => (
                    <li key={job.slug}>
                      <JobCard job={job} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div aria-live="polite" className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-16 text-center sm:py-20">
                <div aria-hidden="true" className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <Briefcase size={28} className="text-gray-400" />
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold text-brand-navy">{filtered ? CAREERS_PAGE.noMatches : CAREERS_PAGE.empty.title}</h3>
                <p className="mx-auto max-w-md text-gray-500">{CAREERS_PAGE.empty.text}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {filtered && (
                    <button
                      type="button"
                      onClick={() => setQuery({})}
                      className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-6 font-bold text-brand-navy transition-colors hover:border-brand-navy"
                    >
                      Clear filters
                    </button>
                  )}
                  <Link
                    href={GENERAL_APPLICATION}
                    className="inline-flex min-h-11 items-center rounded-lg bg-es-accent-strong px-6 font-bold text-white transition-colors hover:bg-brand-navy"
                  >
                    {CAREERS_PAGE.cta.label}
                  </Link>
                </div>
              </div>
            )
          ) : (
            <LoadState result={jobs} />
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow={CAREERS_PAGE.cta.eyebrow}
        title={CAREERS_PAGE.cta.title}
        text={CAREERS_PAGE.cta.text}
        href={GENERAL_APPLICATION}
        label={CAREERS_PAGE.cta.label}
        badges={CAREERS_PAGE.cta.badges}
      />
    </div>
  );
}
