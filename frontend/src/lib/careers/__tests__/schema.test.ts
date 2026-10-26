import { describe, expect, it } from "vitest";
import { resumeContentProblem, resumeProblem, validateApplication, type ApplicationInput } from "../schema";

const MB = 1024 * 1024;

const valid: ApplicationInput = {
  name: "  Asha Verma ",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  currentLocation: "Lucknow",
  totalExperienceYears: "2.5",
  currentCompany: "",
  noticePeriod: "DAYS_30",
  expectedSalary: "4.5 L",
  linkedinUrl: "https://www.linkedin.com/in/asha",
  portfolioUrl: "",
  coverLetter: "",
  resume: { name: "Asha CV.pdf", size: 200_000 },
  consent: true,
};

describe("application schema", () => {
  it("accepts a valid application and normalises the phone and salary", () => {
    const result = validateApplication(valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.phone).toBe("9876543210");
    expect(result.values.name).toBe("Asha Verma");
    expect(result.values.expectedSalary).toBe(450_000);
    expect(validateApplication({ ...valid, phone: "09876543210" }).ok).toBe(true);
  });

  it("rejects phones that aren't Indian mobiles", () => {
    for (const phone of ["12345", "5876543210", "98765 4321"]) {
      const result = validateApplication({ ...valid, phone });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.phone).toMatch(/10-digit/);
    }
  });

  it("requires consent", () => {
    const result = validateApplication({ ...valid, consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(["consent"]);
  });

  it("checks experience, links and email", () => {
    const result = validateApplication({ ...valid, totalExperienceYears: "2.55", linkedinUrl: "javascript:alert(1)", email: "nope" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["email", "linkedinUrl", "totalExperienceYears"]);
  });
});

describe("résumé rules", () => {
  it("allows PDF, DOC and DOCX up to 5 MB", () => {
    expect(resumeProblem({ name: "cv.pdf", size: 5 * MB })).toBeNull();
    expect(resumeProblem({ name: "CV.DOCX", size: 1 })).toBeNull();
    expect(resumeProblem({ name: "cv.doc", size: 1 })).toBeNull();
    expect(resumeProblem({ name: "cv.pdf", size: 5 * MB + 1 })).toMatch(/5 MB/);
    expect(resumeProblem({ name: "cv.txt", size: 10 })).toMatch(/PDF, DOC or DOCX/);
    expect(resumeProblem({ name: "pdf", size: 10 })).toMatch(/PDF, DOC or DOCX/);
    expect(resumeProblem(null)).toMatch(/attach/);
  });

  it("catches a text file renamed to .pdf by its first bytes", async () => {
    const fake = Object.assign(new Blob(["just text"]), { name: "cv.pdf" });
    const real = Object.assign(new Blob(["%PDF-1.4 ..."]), { name: "cv.pdf" });
    const docx = Object.assign(new Blob([new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0])]), { name: "cv.docx" });
    expect(await resumeContentProblem(fake)).toMatch(/real PDF/);
    expect(await resumeContentProblem(real)).toBeNull();
    expect(await resumeContentProblem(docx)).toBeNull();
  });
});
