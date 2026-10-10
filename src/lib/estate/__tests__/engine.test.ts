import { describe, expect, it } from "vitest";
import { FILTERS, type MultiFilterDef } from "../../../config/estate/filters";
import {
  applyFilters,
  createContext,
  emptyState,
  facetOptions,
  localityCounts,
  runQuery,
  sortRecords,
  suggest,
  totalPrice,
  trendingLocations,
  withSegment,
  withTab,
  type QueryState,
} from "../engine";
import { parseQuery, serializeQuery } from "../url";
import { bundle, properties } from "./fixtures";

const ctx = createContext(bundle);
const ids = (rs: { id: string }[]) => rs.map((r) => r.id).sort();
const buy = (patch: Partial<QueryState> = {}): QueryState => ({ ...emptyState("buy"), ...patch });

describe("filtering", () => {
  it("returns everything with an empty state", () => {
    expect(applyFilters(properties, buy(), ctx)).toHaveLength(properties.length);
  });

  it("filters by Buy segment (commercial land shows under Land and Commercial)", () => {
    expect(ids(applyFilters(properties, buy({ segment: "land" }), ctx))).toEqual(["p3", "p4", "p5"]);
    expect(ids(applyFilters(properties, buy({ segment: "commercial" }), ctx))).toEqual(["p5", "p6"]);
    expect(ids(applyFilters(properties, buy({ segment: "residential" }), ctx))).toEqual(["p1", "p2"]);
  });

  it("includes descendants when a parent location is selected", () => {
    expect(ids(applyFilters(properties, buy({ loc: ["gomti-nagar"] }), ctx))).toEqual(["p1", "p2", "p6"]);
    expect(ids(applyFilters(properties, buy({ loc: ["mohanlalganj"] }), ctx))).toEqual(["p4", "p5"]);
    expect(ids(applyFilters(properties, buy({ loc: ["chinhat", "village-a"] }), ctx))).toEqual(["p3", "p4"]);
    expect(applyFilters(properties, buy({ loc: ["lucknow"] }), ctx)).toHaveLength(properties.length);
  });

  it("combines multi, range and toggle filters", () => {
    const s = buy({ segment: "residential", multi: { bhk: ["3"] }, toggle: { verified: true } });
    expect(ids(applyFilters(properties, s, ctx))).toEqual(["p2"]);
    expect(ids(applyFilters(properties, buy({ range: { budget: { max: 6_000_000 } } }), ctx))).toEqual(["p1", "p3", "p4"]);
    expect(ids(applyFilters(properties, buy({ range: { budget: { min: 10_000_000 } } }), ctx))).toEqual(["p2", "p5"]);
  });

  it("multiplies per-area prices out", () => {
    expect(totalPrice(properties.find((p) => p.id === "p4")!)).toBe(4_000_000);
  });

  it("applies the area range in the chosen unit, including regional units", () => {
    // p3 is 200 sq yd = 1800 sq ft
    expect(ids(applyFilters(properties, buy({ unit: "sqyd", range: { area: { min: 150, max: 250 } } }), ctx))).toEqual(["p3"]);
    // p4 is 2 bigha; a 1–3 bigha range must catch it and nothing smaller
    expect(ids(applyFilters(properties, buy({ unit: "bigha", range: { area: { min: 1, max: 3 } } }), ctx))).toEqual(["p4"]);
  });

  it("only applies segment-specific filters inside their segment", () => {
    // facing applies to land only; on "all" it is ignored rather than hiding houses
    const s = buy({ multi: { facing: ["east"] } });
    expect(applyFilters(properties, s, ctx)).toHaveLength(properties.length);
    expect(ids(applyFilters(properties, { ...s, segment: "land" }, ctx))).toEqual(["p3"]);
  });

  it("matches keywords across title, type, locality and aliases", () => {
    expect(ids(applyFilters(properties, buy({ q: "corner shop" }), ctx))).toEqual(["p6"]);
    expect(ids(applyFilters(properties, buy({ q: "GN plot" }), ctx))).toEqual([]);
    expect(ids(applyFilters(properties, buy({ q: "mohanlalganj" }), ctx))).toEqual(["p4", "p5"]);
  });

  it("matches agents whose served area overlaps the selection", () => {
    const s: QueryState = { ...emptyState("agents"), loc: ["vibhuti-khand"] };
    // a1 serves the parent locality, a2 the whole city
    expect(ids(runQuery(bundle, s, ctx))).toEqual(["a1", "a2"]);
    expect(ids(runQuery(bundle, { ...s, multi: { spec: ["land"] } }, ctx))).toEqual(["a2"]);
    expect(ids(runQuery(bundle, { ...emptyState("agents"), search: { name: "chi" } }, ctx))).toEqual(["a3"]);
  });
});

describe("sorting", () => {
  it("sorts by price both ways", () => {
    expect(sortRecords(properties, "price-asc", "buy", ctx).map((p) => p.id)).toEqual(["p3", "p4", "p1", "p6", "p2", "p5"]);
    expect(sortRecords(properties, "price-desc", "buy", ctx)[0].id).toBe("p5");
  });

  it("puts featured first, then newest, for Recommended", () => {
    const sorted = sortRecords(properties, "recommended", "buy", ctx);
    expect(sorted[0].id).toBe("p3");
    expect(sorted[1].id).toBe("p1");
  });

  it("sorts by area and locality", () => {
    expect(sortRecords(properties, "area-desc", "buy", ctx)[0].id).toBe("p4"); // 2 bigha
    expect(sortRecords(properties, "locality", "buy", ctx)[0].locationSlug).toBe("chinhat");
  });

  it("falls back to Recommended for a sort that doesn't apply", () => {
    expect(sortRecords(properties, "name", "buy", ctx)[0].id).toBe("p3");
  });
});

describe("facets and counts", () => {
  it("counts multi options ignoring the filter's own selection", () => {
    const bhk = FILTERS.find((f) => f.key === "bhk") as MultiFilterDef;
    const opts = facetOptions(bhk, bundle, buy({ segment: "residential", multi: { bhk: ["2"] } }), ctx);
    expect(opts).toEqual([
      { value: "2", label: "2 BHK", count: 1 },
      { value: "3", label: "3 BHK", count: 1 },
    ]);
  });

  it("counts records per locality, including descendants, for the active tab", () => {
    const counts = Object.fromEntries(localityCounts(bundle, buy(), ctx).map((c) => [c.location.slug, c.count]));
    expect(counts).toMatchObject({ "gomti-nagar": 3, "vibhuti-khand": 1, chinhat: 1, mohanlalganj: 2, "village-a": 1 });
    const projectCounts = Object.fromEntries(localityCounts(bundle, emptyState("projects"), ctx).map((c) => [c.location.slug, c.count]));
    expect(projectCounts).toMatchObject({ "gomti-nagar": 1, mohanlalganj: 1, chinhat: 0 });
  });

  it("derives trending localities from the data", () => {
    expect(trendingLocations(bundle, ctx, 2).map((l) => l.slug)).toEqual(["gomti-nagar", "mohanlalganj"]);
  });
});

describe("typeahead", () => {
  it("suggests areas by name and alias, landmarks and projects", () => {
    expect(suggest("gom", bundle, ctx)[0]).toMatchObject({ kind: "location", slug: "gomti-nagar" });
    expect(suggest("gn", bundle, ctx)[0]).toMatchObject({ kind: "location", slug: "gomti-nagar" });
    expect(suggest("ambed", bundle, ctx)[0]).toMatchObject({ kind: "landmark", slug: "gomti-nagar" });
    expect(suggest("alpha", bundle, ctx)[0]).toMatchObject({ kind: "project", projectId: "prj1" });
    expect(suggest("g", bundle, ctx)).toEqual([]);
  });
});

describe("state transitions", () => {
  it("keeps locality and keyword across tabs but drops tab-specific filters", () => {
    const s = buy({ loc: ["chinhat"], q: "plot", multi: { type: ["residential-plot"] }, sort: "area-desc" });
    const next = withTab(s, "projects");
    expect(next).toMatchObject({ tab: "projects", loc: ["chinhat"], q: "plot", multi: {}, sort: "recommended" });
  });

  it("drops filters and units that don't fit a new segment", () => {
    const s = buy({ segment: "land", unit: "bigha", multi: { facing: ["east"] }, range: { area: { min: 1 }, budget: { max: 5 } } });
    const next = withSegment(s, "residential");
    expect(next.multi).toEqual({});
    expect(next.unit).toBe("sqft");
    expect(next.range).toEqual({ budget: { max: 5 } });
  });
});

describe("URL state", () => {
  it("round-trips through the query string", () => {
    const s = buy({
      segment: "land",
      loc: ["gomti-nagar", "chinhat"],
      q: "corner",
      multi: { facing: ["east", "north"] },
      range: { budget: { min: 2_500_000, max: 10_000_000 }, area: { min: 100 } },
      toggle: { verified: true },
      unit: "sqyd",
      sort: "price-asc",
    });
    const qs = serializeQuery(s);
    expect(qs).toContain("loc=gomti-nagar,chinhat");
    expect(qs).toContain("min=2500000");
    expect(parseQuery(new URLSearchParams(qs))).toEqual(s);
  });

  it("omits defaults and ignores junk", () => {
    expect(serializeQuery(emptyState())).toBe("");
    const s = parseQuery(new URLSearchParams("tab=rent&sort=nope&unit=furlong&min=-5&bhk="));
    expect(s).toEqual(emptyState("buy"));
  });
});
