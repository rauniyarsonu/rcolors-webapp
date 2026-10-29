import { ArrowLeft, CalendarClock, CheckCircle2 } from "lucide-react";
import Link from "@/components/ui/Link";
import { EMPLOYMENT_TYPE_LABELS } from "@/config/careers";
import { daysUntil, deadlineSoonLabel, formatDay, postedLabel } from "@/lib/careers/format";
import type { PublicJobDetail } from "@/lib/careers/types";
import JobFacts, { jobFacts } from "./JobFacts";
import { chipClass } from "./formStyles";

interface JobDetailViewProps {
  job: PublicJobDetail;
  /** Admin preview: no back link, the Apply button doesn't go anywhere */
  preview?: boolean;
  /** Below the job text in the main column: the application form or the "closed" notice */
  children?: React.ReactNode;
}

const sections = [
  { key: "responsibilities", title: "Responsibilities" },
  { key: "requirements", title: "Requirements" },
  { key: "niceToHave", title: "Nice to Have" },
  { key: "benefits", title: "What We Offer" },
] as const;

/** The body of /careers/:slug, shared with the admin editor's preview. All text renders as text, never HTML */
export default function JobDetailView({ job, preview = false, children }: JobDetailViewProps) {
  const soon = job.acceptingApplications ? deadlineSoonLabel(job.applicationDeadline) : null;
  const posted = postedLabel(job.publishedAt);
  const left = daysUntil(job.applicationDeadline);

  return (
    <>
      {/* Header */}
      <section className="w-full bg-brand-navy py-10 text-white sm:py-12">
        <div className="site-container">
          {!preview && (
            <Link href="/careers" className="mb-4 inline-flex min-h-11 items-center text-sm text-gray-300 transition-colors hover:text-white sm:mb-6">
              <ArrowLeft size={16} className="mr-2" aria-hidden="true" /> All open positions
            </Link>
          )}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`${chipClass} border border-white/30 bg-white/10 text-white`}>{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</span>
            {!job.acceptingApplications && <span className={`${chipClass} bg-amber-100 text-amber-900`}>Closed</span>}
            {soon && (
              <span className={`${chipClass} bg-amber-100 text-amber-900`}>
                <CalendarClock size={14} aria-hidden="true" />
                {soon}
              </span>
            )}
          </div>
          <h1 className="mb-2 text-balance break-words font-heading text-[clamp(1.875rem,1.2rem+3vw,3.25rem)] font-black leading-tight">
            {job.title || "Untitled position"}
          </h1>
          {job.department && <p className="mb-5 text-lg text-gray-300">{job.department}</p>}
          <JobFacts job={job} tone="dark" openings />
        </div>
      </section>

      <section className="section-y w-full">
        <div className="site-container grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-navy">About the Role</h2>
              <div aria-hidden="true" className="mb-6 h-1 w-16 bg-brand-sky" />
              {job.summary && <p className="mb-4 max-w-[65ch] text-lg font-medium leading-relaxed text-gray-800">{job.summary}</p>}
              <p className="max-w-[65ch] whitespace-pre-line break-words text-base leading-relaxed text-gray-700 sm:text-lg">{job.description}</p>
            </div>

            {sections.map(({ key, title }) =>
              job[key].length > 0 ? (
                <div key={key} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-5 font-heading text-xl font-bold text-brand-navy sm:text-2xl">{title}</h2>
                  <ul className="space-y-3">
                    {job[key].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-gray-700">
                        <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-es-accent-strong" />
                        <span className="min-w-0 break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}

            {children}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-b pb-2 font-heading text-xl font-bold text-brand-navy">Job Overview</h2>
              <dl className="space-y-4">
                {jobFacts(job, { openings: true }).map((f) => (
                  <div key={f.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <dt className="font-medium text-gray-500">{f.label}</dt>
                    <dd className="min-w-0 break-words text-right font-semibold text-brand-navy">{f.value}</dd>
                  </div>
                ))}
                {job.applicationDeadline && (
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <dt className="font-medium text-gray-500">Apply by</dt>
                    <dd className="text-right font-semibold text-brand-navy">{formatDay(job.applicationDeadline)}</dd>
                  </div>
                )}
              </dl>
              {posted && <p className="mt-4 border-t pt-4 text-sm text-gray-500">{posted}</p>}
            </div>

            <div className="hidden rounded-2xl bg-brand-navy p-6 text-center text-white shadow-sm lg:block">
              {job.acceptingApplications ? (
                <>
                  <h2 className="mb-3 font-heading text-xl font-bold">Interested in this role?</h2>
                  <p className="mb-6 text-sm text-gray-300">
                    {left !== null && left <= 7 ? "Applications close soon. " : ""}It takes about five minutes.
                  </p>
                  <ApplyLink preview={preview} className="w-full" />
                </>
              ) : (
                <>
                  <h2 className="mb-3 font-heading text-xl font-bold">This position is closed</h2>
                  <Link href="/careers" className="font-bold text-brand-sky hover:underline">
                    See open positions
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/** "Apply now": jumps to the form (#apply) */
export function ApplyLink({ preview = false, className = "" }: { preview?: boolean; className?: string }) {
  return (
    <a
      href={preview ? undefined : "#apply"}
      aria-disabled={preview || undefined}
      className={`flex min-h-12 items-center justify-center rounded-lg bg-brand-sky px-6 font-bold text-brand-navy transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      Apply now
    </a>
  );
}
