import { describe, expect, it } from "vitest";
import { hasFilters, jobsApiPath, parseCareersQuery, serializeCareersQuery } from "../query";

describe("careers query string", () => {
  it("round-trips filters", () => {
    const query = { employmentType: "FULL_TIME", location: "Lucknow, UP", q: "sales" } as const;
    const qs = serializeCareersQuery(query);
    expect(qs).toBe("type=FULL_TIME&loc=Lucknow%2C+UP&q=sales");
    expect(parseCareersQuery(new URLSearchParams(qs))).toEqual(query);
  });

  it("drops unknown and empty values", () => {
    expect(parseCareersQuery(new URLSearchParams("type=NOPE&&loc=%20%20&q=&x=1"))).toEqual({});
    expect(serializeCareersQuery({ q: "  " })).toBe("");
    expect(hasFilters({})).toBe(false);
  });

  it("builds the backend path with its parameter names", () => {
    expect(jobsApiPath({})).toBe("/api/careers/jobs");
    expect(jobsApiPath({ employmentType: "INTERNSHIP", q: "site" })).toBe("/api/careers/jobs?employmentType=INTERNSHIP&q=site");
  });
});
