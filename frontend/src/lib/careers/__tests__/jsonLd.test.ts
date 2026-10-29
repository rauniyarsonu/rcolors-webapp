import { describe, expect, it } from "vitest";
import { deadlineSoonLabel, experienceLabel, postedLabel, salaryLabel } from "../format";
import { jobPostingJsonLd } from "../jsonLd";
import type { PublicJobDetail } from "../types";

const job: PublicJobDetail = {
  slug: "site-engineer",
  title: "Site Engineer",
  department: "Site Engineering",
  location: "Lucknow, UP",
  workMode: "ON_SITE",
  employmentType: "CONTRACT",
  experienceMinYears: 2,
  experienceMaxYears: 5,
  salaryMin: null,
  salaryMax: null,
  openings: 1,
  summary: "Run a site",
  applicationDeadline: "2026-11-30",
  publishedAt: "2026-10-20T10:00:00Z",
  updatedAt: "2026-10-21T10:00:00Z",
  description: "You will run a site.",
  responsibilities: ["Supervise work"],
  requirements: [],
  niceToHave: [],
  benefits: ["Paid leave"],
  acceptingApplications: true,
};

describe("JobPosting JSON-LD", () => {
  it("omits the salary when it isn't shown", () => {
    const ld = jobPostingJsonLd(job, "https://example.com/");
    expect(ld).not.toHaveProperty("baseSalary");
    expect(ld.datePosted).toBe("2026-10-20");
    expect(ld.validThrough).toBe("2026-11-30T23:59:59+05:30");
    expect(ld.url).toBe("https://example.com/careers/site-engineer");
    expect(ld.jobLocation).toMatchObject({ address: { addressLocality: "Lucknow", addressRegion: "UP", addressCountry: "IN" } });
    expect(ld.description).toContain("Responsibilities:\n- Supervise work");
    expect(ld.description).not.toContain("Requirements");
  });

  it("includes the salary when shown and maps employment types", () => {
    const ld = jobPostingJsonLd({ ...job, salaryMin: 300000, salaryMax: 500000, employmentType: "INTERNSHIP", workMode: "REMOTE" }, "https://example.com");
    expect(ld.baseSalary).toEqual({
      "@type": "MonetaryAmount",
      currency: "INR",
      value: { "@type": "QuantitativeValue", minValue: 300000, maxValue: 500000, unitText: "YEAR" },
    });
    expect(ld.employmentType).toBe("INTERN");
    expect(ld.jobLocationType).toBe("TELECOMMUTE");
    expect(jobPostingJsonLd({ ...job, employmentType: "CONTRACT" }, "x").employmentType).toBe("CONTRACTOR");
    expect(jobPostingJsonLd({ ...job, employmentType: "FULL_TIME" }, "x").employmentType).toBe("FULL_TIME");
    expect(jobPostingJsonLd({ ...job, employmentType: "PART_TIME" }, "x").employmentType).toBe("PART_TIME");
  });
});

describe("job labels", () => {
  const now = new Date(2026, 9, 26, 15, 0);

  it("formats experience and salary", () => {
    expect(experienceLabel(2, 5)).toBe("2–5 years");
    expect(experienceLabel(3, null)).toBe("3+ years");
    expect(experienceLabel(0, null)).toBe("Freshers welcome");
    expect(experienceLabel(null, null)).toBeNull();
    expect(salaryLabel(360000, 540000)).toBe("₹3.6 L – ₹5.4 L / year");
    expect(salaryLabel(null, 900000)).toBe("Up to ₹9 L / year");
    expect(salaryLabel(null, null)).toBeNull();
  });

  it("says how long ago a job was posted and when the deadline is close", () => {
    expect(postedLabel(new Date(2026, 9, 26, 9).toISOString(), now)).toBe("Posted today");
    expect(postedLabel(new Date(2026, 9, 23, 9).toISOString(), now)).toBe("Posted 3 days ago");
    expect(deadlineSoonLabel("2026-10-26", now)).toBe("Last day to apply");
    expect(deadlineSoonLabel("2026-11-02", now)).toMatch(/^Apply by/);
    expect(deadlineSoonLabel("2026-11-03", now)).toBeNull();
    expect(deadlineSoonLabel("2026-10-25", now)).toBeNull();
  });
});
