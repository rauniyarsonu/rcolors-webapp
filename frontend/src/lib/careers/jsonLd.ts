import { COMPANY } from "../../config/company";
import type { EmploymentType, PublicJobDetail } from "./types";

/** schema.org employmentType values Google for Jobs understands */
const EMPLOYMENT_TYPE: Record<EmploymentType, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
};

/** Plain-text description: the text, then each list as "Heading:" and "- item" lines */
function describe(job: PublicJobDetail): string {
  const sections: [string, string[]][] = [
    ["Responsibilities", job.responsibilities],
    ["Requirements", job.requirements],
    ["Nice to have", job.niceToHave],
    ["Benefits", job.benefits],
  ];
  return [job.description, ...sections.filter(([, items]) => items.length > 0).map(([h, items]) => `${h}:\n${items.map((i) => `- ${i}`).join("\n")}`)]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * JobPosting structured data (Google for Jobs). Only for jobs that are accepting
 * applications; baseSalary only when the salary is public (the API sends null otherwise).
 */
export function jobPostingJsonLd(job: PublicJobDetail, siteUrl: string): Record<string, unknown> {
  const site = siteUrl.replace(/\/$/, "");
  const [locality, region] = job.location.split(",").map((s) => s.trim());
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: describe(job),
    identifier: { "@type": "PropertyValue", name: COMPANY.name, value: job.slug },
    datePosted: (job.publishedAt ?? job.updatedAt ?? new Date().toISOString()).slice(0, 10),
    employmentType: EMPLOYMENT_TYPE[job.employmentType],
    hiringOrganization: { "@type": "Organization", name: COMPANY.name, sameAs: site, logo: `${site}/images/icon.png` },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: locality, ...(region ? { addressRegion: region } : {}), addressCountry: "IN" },
    },
    directApply: true,
    url: `${site}/careers/${job.slug}`,
  };
  if (job.applicationDeadline) ld.validThrough = `${job.applicationDeadline}T23:59:59+05:30`;
  if (job.workMode === "REMOTE") {
    ld.jobLocationType = "TELECOMMUTE";
    ld.applicantLocationRequirements = { "@type": "Country", name: "India" };
  }
  if (job.salaryMin !== null || job.salaryMax !== null) {
    ld.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin !== null ? { minValue: job.salaryMin } : {}),
        ...(job.salaryMax !== null ? { maxValue: job.salaryMax } : {}),
        unitText: "YEAR",
      },
    };
  }
  if (job.experienceMinYears) {
    ld.experienceRequirements = { "@type": "OccupationalExperienceRequirements", monthsOfExperience: job.experienceMinYears * 12 };
  }
  return ld;
}
