import { CalendarClock } from "lucide-react";
import Link from "@/components/ui/Link";
import { hoverShadow } from "@/components/ui/styles";
import { BUSINESS_LABELS } from "@/config/careers";
import { deadlineSoonLabel, postedLabel } from "@/lib/careers/format";
import type { PublicJobSummary } from "@/lib/careers/types";
import JobFacts from "./JobFacts";
import { chipClass } from "./formStyles";

/** One open position on /careers; the whole card links to its detail page */
export default function JobCard({ job, headingLevel = "h3" }: { job: PublicJobSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const posted = postedLabel(job.publishedAt);
  const soon = deadlineSoonLabel(job.applicationDeadline);
  return (
    <Link
      href={`/careers/${job.slug}`}
      className={`group relative flex h-full flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-md after:shadow-xl ${hoverShadow} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy sm:p-6`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`${chipClass} bg-brand-sky/10 text-es-accent-strong`}>{BUSINESS_LABELS[job.business]}</span>
        {soon && (
          <span className={`${chipClass} bg-amber-50 text-amber-800`}>
            <CalendarClock size={14} aria-hidden="true" />
            {soon}
          </span>
        )}
      </div>
      <Heading className="font-heading text-xl font-bold text-brand-navy transition-colors group-hover:text-es-accent-strong">{job.title}</Heading>
      {job.department && <p className="mt-0.5 text-sm font-medium text-gray-500">{job.department}</p>}
      <div className="mt-4">
        <JobFacts job={job} />
      </div>
      {job.summary && <p className="mt-4 line-clamp-2 text-base text-gray-600 md:text-sm">{job.summary}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-sm">
        <span className="text-gray-500">{posted}</span>
        <span className="font-bold text-es-accent-strong group-hover:underline">
          View &amp; apply <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export function JobCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full animate-pulse flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-md motion-reduce:animate-none sm:p-6">
      <div className="mb-4 h-6 w-40 rounded-full bg-gray-100" />
      <div className="h-6 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-1/3 rounded bg-gray-100" />
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="h-4 w-24 rounded bg-gray-100" />
        <div className="h-4 w-20 rounded bg-gray-100" />
        <div className="h-4 w-24 rounded bg-gray-100" />
      </div>
      <div className="mt-5 h-4 w-full rounded bg-gray-100" />
      <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
    </div>
  );
}
