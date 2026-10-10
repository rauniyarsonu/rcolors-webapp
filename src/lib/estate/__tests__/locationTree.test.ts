import { describe, expect, it } from "vitest";
import { areasOf, descendantSlugs, indexLocations, isActive, isMarket, isWithin, markets, stateOf } from "../locationTree";
import { locations } from "./fixtures";

const index = indexLocations(locations);

describe("location tree", () => {
  it("collects a node and all its descendants", () => {
    expect(descendantSlugs(index, "lucknow")).toEqual(
      new Set(["lucknow", "gomti-nagar", "vibhuti-khand", "chinhat", "hidden-area", "mohanlalganj", "village-a"]),
    );
    expect(descendantSlugs(index, "mohanlalganj")).toEqual(new Set(["mohanlalganj", "village-a"]));
    expect(descendantSlugs(index, "unknown").size).toBe(0);
  });

  it("checks containment at any depth", () => {
    expect(isWithin(index, "village-a", "lucknow")).toBe(true);
    expect(isWithin(index, "vibhuti-khand", "gomti-nagar")).toBe(true);
    expect(isWithin(index, "gomti-nagar", "gomti-nagar")).toBe(true);
    expect(isWithin(index, "chinhat", "gomti-nagar")).toBe(false);
  });

  it("treats only top-level cities/towns as markets, and only enabled ones", () => {
    expect(isMarket(index, "lucknow")).toBe(true);
    expect(isMarket(index, "mohanlalganj")).toBe(false); // a town inside Lucknow is a regional area
    expect(markets(index).map((m) => m.slug)).toEqual(["lucknow"]); // kanpur is disabled
  });

  it("inherits disabled state from ancestors", () => {
    expect(isActive(index, "hidden-area")).toBe(false);
    expect(isActive(index, "village-a")).toBe(true);
  });

  it("finds the state of a deep node", () => {
    expect(stateOf(index, "village-a")?.slug).toBe("uttar-pradesh");
  });

  it("lists enabled areas under a city with depth", () => {
    const areas = areasOf(index, "lucknow");
    expect(areas.map((a) => a.location.slug)).not.toContain("hidden-area");
    expect(areas.find((a) => a.location.slug === "village-a")).toMatchObject({ depth: 1, parentSlug: "mohanlalganj" });
  });
});
