import { Award, HardHat, TrendingUp, Users } from "lucide-react";
import type { ApplicationStatus, EmploymentType, JobStatus, NoticePeriod, WorkMode } from "../lib/careers/types";

/**
 * Careers page copy and labels. Edit the text here; the pages read it.
 * (Tailwind doesn't scan src/config, so keep CSS classes in the components.)
 */
export const CAREERS_PAGE = {
  header: { titlePart1: "JOIN", titlePart2: "OUR TEAM" },
  seo: {
    title: "Careers",
    description:
      "Build your career with R Colors Group in Lucknow: open positions in construction, finishing works and real estate. Apply online with your CV.",
  },
  intro: {
    eyebrow: "Careers at R Colors Group",
    title: "Quality You Can See, Service You Can Trust",
    text: "Every project we deliver is the work of engineers, supervisors, craftspeople and advisors who take pride in doing it right. Join a growing group where your work is visible, your ideas are heard, and quality is never negotiable.",
  },
  perks: [
    {
      icon: HardHat,
      title: "Real Projects, Real Responsibility",
      desc: "Work on residential, commercial and industrial sites from day one, with experienced seniors beside you.",
    },
    {
      icon: TrendingUp,
      title: "Grow With the Group",
      desc: "Construction, finishing works and real estate under one roof means room to learn and move across businesses.",
    },
    {
      icon: Award,
      title: "Quality You Can Be Proud Of",
      desc: "We are known for precision and on-time delivery. You will learn to work to the same standard.",
    },
    {
      icon: Users,
      title: "A Team That Has Your Back",
      desc: "Transparent, respectful and collaborative: the same values we promise our clients, we practise with each other.",
    },
  ],
  listHeading: { eyebrow: "Open Positions", title: "Find Your Role" },
  empty: {
    title: "No open positions right now",
    text: "We are always happy to hear from good people. Send us your CV and we'll contact you when a role that fits opens up.",
  },
  noMatches: "No positions match these filters.",
  cta: {
    eyebrow: "Always hiring talent",
    title: "Don't See a Fit? Send Us Your CV",
    text: "Tell us what you do best. We keep every CV on file and reach out when a matching role opens.",
    label: "Send us your CV",
    badges: ["We read every application", "Your data stays private", "Reply when a role fits"],
  },
  general: {
    titlePart1: "SEND US",
    titlePart2: "YOUR CV",
    heading: "General Application",
    text: "Not sure which role fits? Tell us about yourself and attach your CV. We'll get in touch when a suitable position opens.",
  },
} as const;

export const CONSENT_TEXT = "I agree that R Colors Group may store and use my details to evaluate my application.";

/** Résumé rules, the same as the backend's ResumeRules */
export const RESUME_RULES = {
  maxBytes: 5 * 1024 * 1024,
  extensions: ["pdf", "doc", "docx"],
  accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  hint: "PDF, DOC or DOCX, up to 5 MB",
} as const;

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  ON_SITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const NOTICE_PERIOD_LABELS: Record<NoticePeriod, string> = {
  IMMEDIATE: "Immediate",
  DAYS_15: "15 days",
  DAYS_30: "30 days",
  DAYS_60: "60 days",
  DAYS_90: "90 days",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "New",
  REVIEWED: "Reviewed",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  HIRED: "Hired",
  REJECTED: "Rejected",
};
