/** Mirrors the backend DTOs in backend/src/main/java/com/rcolorsgroup/careers (PublicJobs, AdminViews) */

export const WORK_MODES = ["ON_SITE", "HYBRID", "REMOTE"] as const;
export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;
export const JOB_STATUSES = ["DRAFT", "OPEN", "CLOSED", "ARCHIVED"] as const;
export const NOTICE_PERIODS = ["IMMEDIATE", "DAYS_15", "DAYS_30", "DAYS_60", "DAYS_90"] as const;
export const APPLICATION_STATUSES = ["NEW", "REVIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED", "HIRED", "REJECTED"] as const;

export type WorkMode = (typeof WORK_MODES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];
export type NoticePeriod = (typeof NOTICE_PERIODS)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** A card on /careers (GET /api/careers/jobs). Salary is null unless the admin chose to show it */
export interface PublicJobSummary {
  slug: string;
  title: string;
  department: string | null;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceMinYears: number | null;
  experienceMaxYears: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  openings: number | null;
  summary: string;
  /** "2026-11-30", last day to apply */
  applicationDeadline: string | null;
  /** ISO instant */
  publishedAt: string | null;
}

/** GET /api/careers/jobs/{slug} */
export interface PublicJobDetail extends PublicJobSummary {
  updatedAt: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  /** false for a closed or expired job, whose page still renders for old links */
  acceptingApplications: boolean;
}

/** GET /api/careers/filters: only values some open job has */
export interface CareerFilters {
  locations: string[];
  employmentTypes: EmploymentType[];
}

/** {"errors": {"field": "message"}} from any 400/409/429 */
export interface ApiErrors {
  errors?: Record<string, string>;
}

// ---- Admin ----

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface AdminJob {
  id: number;
  slug: string;
  title: string;
  department: string | null;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceMinYears: number | null;
  experienceMaxYears: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  showSalary: boolean;
  openings: number | null;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  status: JobStatus;
  applicationDeadline: string | null;
  acceptingApplications: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  applicationCount: number;
  newApplicationCount: number;
}

/** POST/PUT /api/admin/jobs */
export type JobInput = Omit<
  AdminJob,
  "id" | "slug" | "acceptingApplications" | "publishedAt" | "createdAt" | "updatedAt" | "applicationCount" | "newApplicationCount" | "status"
> & { status?: JobStatus };

export interface JobRef {
  id: number;
  slug: string;
  title: string;
}

export interface ApplicationRow {
  id: number;
  /** null for a general application */
  job: JobRef | null;
  name: string;
  email: string;
  phone: string;
  currentLocation: string | null;
  totalExperienceYears: number | null;
  status: ApplicationStatus;
  createdAt: string;
}

export interface StatusChange {
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  changedAt: string;
}

export interface ApplicationDetail extends ApplicationRow {
  currentCompany: string | null;
  noticePeriod: NoticePeriod | null;
  expectedSalary: number | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  coverLetter: string | null;
  resume: { filename: string; contentType: string; sizeBytes: number };
  adminNotes: string | null;
  consent: boolean;
  history: StatusChange[];
  updatedAt: string;
}

export interface CareersSummary {
  openJobs: number;
  applicationsLast7Days: number;
  applicationsLast30Days: number;
  totalApplications: number;
  byStatus: Record<ApplicationStatus, number>;
}
