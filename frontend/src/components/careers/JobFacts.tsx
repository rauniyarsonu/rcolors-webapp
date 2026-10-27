import { Briefcase, Building2, Clock, IndianRupee, MapPin, Users } from "lucide-react";
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/config/careers";
import { experienceLabel, salaryLabel } from "@/lib/careers/format";
import type { PublicJobSummary } from "@/lib/careers/types";

type Fact = { icon: typeof MapPin; label: string; value: string };

/** Location, work mode, type, experience, salary (when public) and openings, skipping the empty ones */
export function jobFacts(job: PublicJobSummary, { openings = false } = {}): Fact[] {
  const experience = experienceLabel(job.experienceMinYears, job.experienceMaxYears);
  const salary = salaryLabel(job.salaryMin, job.salaryMax);
  const facts: (Fact | null)[] = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Building2, label: "Work mode", value: WORK_MODE_LABELS[job.workMode] },
    { icon: Briefcase, label: "Job type", value: EMPLOYMENT_TYPE_LABELS[job.employmentType] },
    experience ? { icon: Clock, label: "Experience", value: experience } : null,
    salary ? { icon: IndianRupee, label: "Salary", value: salary } : null,
    openings && job.openings && job.openings > 1 ? { icon: Users, label: "Openings", value: `${job.openings} positions` } : null,
  ];
  return facts.filter((f): f is Fact => f !== null);
}

/** Inline list of facts with icons (cards and the detail header) */
export default function JobFacts({ job, tone = "light", openings = false }: { job: PublicJobSummary; tone?: "light" | "dark"; openings?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${tone === "dark" ? "text-gray-200" : "text-gray-600"}`}>
      {jobFacts(job, { openings }).map((f) => (
        <li key={f.label} className="flex items-center gap-1.5">
          <f.icon size={16} aria-hidden="true" className={`shrink-0 ${tone === "dark" ? "text-brand-sky" : "text-es-accent-strong"}`} />
          <span className="sr-only">{f.label}: </span>
          {f.value}
        </li>
      ))}
    </ul>
  );
}
