import { describe, expect, it } from "vitest";
import { filenameFrom } from "../adminApi";

describe("filenameFrom", () => {
  it("reads plain and UTF-8 filenames from Content-Disposition", () => {
    expect(filenameFrom('attachment; filename="My CV.pdf"')).toBe("My CV.pdf");
    expect(filenameFrom("attachment; filename=\"=?UTF-8?Q?x?=\"; filename*=UTF-8''R%C3%A9sum%C3%A9.pdf")).toBe("Résumé.pdf");
    expect(filenameFrom(null)).toBeNull();
  });
});
