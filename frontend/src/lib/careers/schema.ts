import { z } from "zod";
import { RESUME_RULES } from "../../config/careers";
import { normaliseIndianMobile, parsePrice } from "../estate/format";
import { NOTICE_PERIODS } from "./types";

/**
 * Client-side rules for the application form, the same as the backend's
 * ApplicationForm + ResumeRules. The backend still decides: its 400 errors are
 * shown per field too.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HTTP_URL = /^https?:\/\/[^\s/?#]+\.[^\s/?#]+\S*$/;

/** The parts of a File the size/type rules need (so tests can pass plain objects) */
export interface ResumeLike {
  name: string;
  size: number;
}

/** Error message for a résumé that can't be sent, or null */
export function resumeProblem(file: ResumeLike | null | undefined): string | null {
  if (!file) return "Please attach your CV / résumé.";
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (!file.name.includes(".") || !(RESUME_RULES.extensions as readonly string[]).includes(ext)) return "Please upload a PDF, DOC or DOCX file.";
  if (file.size === 0) return "This file is empty.";
  if (file.size > RESUME_RULES.maxBytes) return "The file is larger than 5 MB. Please upload a smaller file.";
  return null;
}

const MAGIC: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  doc: [0xd0, 0xcf, 0x11, 0xe0],
  docx: [0x50, 0x4b, 0x03, 0x04], // PK (zip)
};

/** Checks the first bytes match the extension, like the backend does, so a renamed file is caught before upload */
export async function resumeContentProblem(file: Blob & ResumeLike): Promise<string | null> {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const magic = MAGIC[ext];
  if (!magic) return null;
  const head = new Uint8Array(await file.slice(0, magic.length).arrayBuffer());
  return magic.every((b, i) => head[i] === b) ? null : `This doesn't look like a real ${ext.toUpperCase()} file.`;
}

const optionalUrl = z
  .string()
  .trim()
  .max(300, "Keep the link under 300 characters.")
  .refine((v) => v === "" || HTTP_URL.test(v), "Enter a full link starting with https://");

export const applicationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120, "Keep your name under 120 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(200, "Keep your email under 200 characters.")
    .regex(EMAIL, "Enter a valid email address, e.g. name@example.com."),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .transform((v, ctx) => {
      const phone = normaliseIndianMobile(v);
      if (!phone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a 10-digit mobile number, e.g. 98765 43210." });
        return z.NEVER;
      }
      return phone;
    }),
  currentLocation: z.string().trim().min(1, "Please enter your current city.").max(120),
  totalExperienceYears: z
    .string()
    .trim()
    .min(1, "Please enter your total experience (0 if you are a fresher).")
    .refine((v) => /^\d{1,2}(\.\d)?$/.test(v) && Number(v) <= 60, "Enter years of experience, e.g. 2 or 2.5."),
  currentCompany: z.string().trim().max(120, "Keep this under 120 characters."),
  noticePeriod: z.enum(NOTICE_PERIODS, { errorMap: () => ({ message: "Please choose your notice period." }) }),
  expectedSalary: z
    .string()
    .trim()
    .refine((v) => v === "" || parsePrice(v) !== null, "Enter a yearly amount, e.g. 450000 or 4.5 L.")
    .transform((v) => (v === "" ? null : parsePrice(v))),
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  coverLetter: z.string().trim().max(3000, "Keep your note under 3,000 characters."),
  resume: z.custom<ResumeLike | null>().superRefine((file, ctx) => {
    const problem = resumeProblem(file);
    if (problem) ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem });
  }),
  consent: z.boolean().refine((v) => v, "Please agree so we can consider your application."),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationValues = z.output<typeof applicationSchema>;
export type ApplicationField = keyof ApplicationInput;

/** Field order on the form: the first invalid one gets focus */
export const APPLICATION_FIELDS: ApplicationField[] = [
  "name",
  "email",
  "phone",
  "currentLocation",
  "totalExperienceYears",
  "currentCompany",
  "noticePeriod",
  "expectedSalary",
  "linkedinUrl",
  "portfolioUrl",
  "coverLetter",
  "resume",
  "consent",
];

/** First message per field */
export function validateApplication(input: ApplicationInput):
  | { ok: true; values: ApplicationValues }
  | { ok: false; errors: Partial<Record<ApplicationField, string>> } {
  const result = applicationSchema.safeParse(input);
  if (result.success) return { ok: true, values: result.data };
  const errors: Partial<Record<ApplicationField, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as ApplicationField;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
