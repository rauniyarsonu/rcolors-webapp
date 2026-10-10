import { describe, expect, it } from "vitest";
import { csvToRecords, parseCsv, toCsv } from "../csv";
import { buildBundle, listCities } from "../datasource";
import { validateData, type RawData } from "../validate";
import { agents, locations, projects, prop, properties } from "./fixtures";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const base = (): RawData => ({ locations: clone(locations), cities: { lucknow: clone({ properties, projects, agents }) } });
const run = (raw: RawData, imageExists = () => true) => validateData(raw, { imageExists });
const errors = (raw: RawData, imageExists?: () => boolean) =>
  run(raw, imageExists).issues.filter((i) => i.level === "error").map((i) => i.message);

describe("validate:data", () => {
  it("accepts the fixture data", () => {
    expect(errors(base())).toEqual([]);
  });

  it("rejects unknown and out-of-city location slugs", () => {
    const raw = base();
    (raw.cities.lucknow.properties as unknown[]).push(prop("x1", { locationSlug: "nowhere" }));
    expect(errors(raw).join()).toMatch(/unknown locationSlug "nowhere"/);
  });

  it("rejects duplicate ids across files", () => {
    const raw = base();
    (raw.cities.lucknow.properties as unknown[]).push(prop("prj1"));
    expect(errors(raw).join()).toMatch(/duplicate id "prj1"/);
  });

  it("rejects missing images, verified without a date, and bad phones", () => {
    const raw = base();
    const list = raw.cities.lucknow.properties as Record<string, unknown>[];
    list[0].images = ["/images/estate/lucknow/missing.jpg"];
    list[1].verifiedOn = undefined;
    (raw.cities.lucknow.agents as Record<string, unknown>[])[0].phone = "+91 98765";
    const msgs = errors(raw, () => false).join("\n");
    expect(msgs).toMatch(/image not found/);
    expect(msgs).toMatch(/verifiedOn/);
    expect(msgs).toMatch(/10-digit Indian mobile/);
  });

  it("rejects orphaned agentId / projectId and invalid units/prices", () => {
    const raw = base();
    (raw.cities.lucknow.properties as unknown[]).push(
      prop("x1", { agentId: "ghost" }),
      prop("x2", { projectId: "ghost" }),
      { ...prop("x3"), areaUnit: "furlong" },
      { ...prop("x4"), price: -1 },
    );
    const msgs = errors(raw).join("\n");
    expect(msgs).toMatch(/agentId "ghost"/);
    expect(msgs).toMatch(/projectId "ghost"/);
    expect(msgs).toMatch(/x3.*areaUnit/);
    expect(msgs).toMatch(/x4.*price/);
  });

  it("requires [SAMPLE] titles and isSample to agree", () => {
    const raw = base();
    (raw.cities.lucknow.properties as unknown[]).push(prop("x1", { isSample: true }), prop("x2", { title: "[SAMPLE] thing" }));
    const msgs = errors(raw).join("\n");
    expect(msgs).toMatch(/x1.*isSample is true/);
    expect(msgs).toMatch(/x2.*isSample isn't true/);
  });

  it("rejects a city folder without a location and a regional unit without a configured size", () => {
    const raw = base();
    raw.cities.atlantis = { properties: [], projects: [], agents: [] };
    (raw.locations as Record<string, unknown>[]).push({ id: "elsewhere", slug: "elsewhere", name: "Elsewhere", type: "state", parentId: null, enabled: true, order: 9 });
    (raw.locations as Record<string, unknown>[]).push({ id: "town-x", slug: "town-x", name: "Town X", type: "town", parentId: "elsewhere", enabled: true, order: 1 });
    raw.cities["town-x"] = { properties: [prop("x1", { citySlug: "town-x", locationSlug: "town-x", areaUnit: "bigha" })], projects: [], agents: [] };
    const msgs = errors(raw).join("\n");
    expect(msgs).toMatch(/folder "atlantis"/);
    expect(msgs).toMatch(/"bigha" has no size configured for elsewhere/);
  });
});

describe("data source", () => {
  it("lists only enabled markets with records, and hides disabled areas", () => {
    const raw = base();
    raw.cities.kanpur = { properties: [prop("k1", { citySlug: "kanpur", locationSlug: "kanpur" })], projects: [], agents: [] };
    (raw.cities.lucknow.properties as unknown[]).push(prop("x1", { locationSlug: "hidden-area" }));
    const { data } = run(raw);
    expect(listCities(data).map((c) => c.slug)).toEqual(["lucknow"]);
    expect(buildBundle(data, "lucknow")!.properties.map((p) => p.id)).not.toContain("x1");
    expect(buildBundle(data, "kanpur")).toBeNull();

    // Enabling Kanpur is a data-only change
    (data.locations.find((l) => l.slug === "kanpur")!).enabled = true;
    expect(listCities(data).map((c) => c.slug).sort()).toEqual(["kanpur", "lucknow"]);
  });
});

describe("CSV import", () => {
  it("parses quoted fields, escaped quotes and CRLF", () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\n\n')).toEqual([["a", "b"], ["x, y", 'say "hi"']]);
    expect(parseCsv(toCsv([["a,b", 'q"'], ["1", "2"]]))).toEqual([["a,b", 'q"'], ["1", "2"]]);
  });

  it("converts rows into valid records", () => {
    const csv = [
      "id,locationSlug,title,type,price,areaValue,areaUnit,status,images,verified,verifiedOn,facing,bhk",
      "c1,chinhat,Plot,residential-plot,45 L,150,sqyd,ready,,yes,2026-01-01,east,",
      "c2,gomti-nagar,Flat,apartment,1.2 Cr,1200,sqft,ready,/images/a.jpg|/images/b.jpg,no,,,3",
    ].join("\n");
    const { records, errors: errs } = csvToRecords("properties", csv, "lucknow", "2026-02-02");
    expect(errs).toEqual([]);
    expect(records[0]).toMatchObject({ id: "c1", citySlug: "lucknow", category: "land", price: 4_500_000, verified: true, postedAt: "2026-02-02", attributes: { facing: "east" } });
    expect(records[1]).toMatchObject({ category: "property", price: 12_000_000, images: ["/images/a.jpg", "/images/b.jpg"], attributes: { bhk: 3 } });

    const raw = base();
    (raw.cities.lucknow.properties as unknown[]).push(...records);
    expect(errors(raw)).toEqual([]);
  });

  it("reports unknown columns, missing required values and bad cells with line numbers", () => {
    expect(csvToRecords("agents", "id,name,ownerAadhaar\n1,x,y", "lucknow").errors[0]).toMatch(/unknown column\(s\): ownerAadhaar/);
    const r = csvToRecords("projects", "id,locationSlug,name,developer,type,status,startingPrice,sizeRange\np1,,N,D,residential,ready,cheap,x", "lucknow");
    expect(r.errors).toEqual(["line 2: locationSlug is required", 'line 2, startingPrice: "cheap" is not a price (use 4500000, 45 L or 1.2 Cr)']);
  });
});
