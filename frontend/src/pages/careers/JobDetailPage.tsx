import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import LoadState from "@/components/LoadState";
import Seo from "@/components/Seo";
import Link from "@/components/ui/Link";
import ApplicationForm from "@/components/careers/ApplicationForm";
import JobDetailView, { ApplyLink } from "@/components/careers/JobDetailView";
import NotFoundPage from "@/pages/NotFoundPage";
import { jobPostingJsonLd } from "@/lib/careers/jsonLd";
import type { PublicJobDetail, PublicJobSummary } from "@/lib/careers/types";
import { useApi } from "@/lib/useApi";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://rcolorgroup.netlify.app").replace(/\/$/, "");

export default function JobDetailPage() {
  const { slug = "" } = useParams();
  const result = useApi<PublicJobDetail>(`/api/careers/jobs/${encodeURIComponent(slug)}`);
  const formRef = useRef<HTMLDivElement>(null);
  const [formInView, setFormInView] = useState(false);
  const accepting = result.status === "ok" && result.data.acceptingApplications;

  // The mobile "Apply now" bar hides once the form itself is on screen
  useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { rootMargin: "0px 0px -20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [accepting]);

  if (result.status === "not-found") return <NotFoundPage />;
  if (result.status !== "ok") return <LoadState result={result} />;
  const job = result.data;

  return (
    // A div, not <main>: the root layout already provides <main>
    <div className={`flex w-full flex-col bg-gray-50 ${accepting ? "pb-20 lg:pb-0" : ""}`}>
      <Seo
        meta={{
          title: `${job.title} — Careers`,
          description: job.summary || `${job.title} at R Colors Group, ${job.location}.`,
          canonical: `/careers/${job.slug}`,
          image: { src: "/images/home1.jpg", alt: "R Colors Group" },
          siteName: "R Colors Group of Companies",
        }}
      />
      {/* Google for Jobs: only while the job takes applications */}
      {accepting && <JsonLd data={jobPostingJsonLd(job, SITE_URL)} />}

      <JobDetailView job={job}>
        {accepting ? (
          <div ref={formRef} id="apply" className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-8">
            <h2 className="mb-2 font-heading text-2xl font-black text-brand-navy">Apply for this Position</h2>
            <p className="mb-6 text-gray-600">Fields marked * are required.</p>
            <ApplicationForm job={{ slug: job.slug, title: job.title }} />
          </div>
        ) : (
          <ClosedNotice slug={job.slug} />
        )}
      </JobDetailView>

      {accepting && (
        <div
          className={`fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
            formInView ? "pointer-events-none translate-y-full" : "translate-y-0"
          }`}
          aria-hidden={formInView || undefined}
        >
          <ApplyLink className="mx-auto max-w-md pr-16 sm:pr-6" />
        </div>
      )}
    </div>
  );
}

/** For an old link to a closed or expired job: say so and point to the open ones */
function ClosedNotice({ slug }: { slug: string }) {
  const others = useApi<PublicJobSummary[]>("/api/careers/jobs");
  const list = others.status === "ok" ? others.data.filter((j) => j.slug !== slug).slice(0, 3) : [];
  return (
    <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
      <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-bold text-brand-navy">
        <CircleAlert size={24} aria-hidden="true" className="shrink-0 text-amber-700" />
        This position is closed
      </h2>
      <p className="text-gray-700">It is no longer accepting applications. Have a look at our other open roles, or send us your CV for future openings.</p>
      {list.length > 0 && (
        <ul className="mt-5 space-y-2">
          {list.map((j) => (
            <li key={j.slug}>
              <Link href={`/careers/${j.slug}`} className="inline-flex min-h-11 items-center font-semibold text-es-accent-strong hover:underline">
                {j.title} <span className="ml-2 font-normal text-gray-500">· {j.location}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/careers" className="inline-flex min-h-11 items-center rounded-lg bg-es-accent-strong px-6 font-bold text-white transition-colors hover:bg-brand-navy">
          See all open positions
        </Link>
        <Link
          href="/careers/apply"
          className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-6 font-bold text-brand-navy transition-colors hover:border-brand-navy"
        >
          Send us your CV
        </Link>
      </div>
    </div>
  );
}
