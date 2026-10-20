import { describe, expect, it } from "vitest";
import { REGIONAL_UNIT_SIZES } from "../../../config/estate/units";
import { formatArea, formatPrice, normaliseIndianMobile, parsePrice } from "../format";
import { convertArea, toSqft, unitSizeSqft } from "../units";

const up = { stateSlug: "uttar-pradesh" };

describe("area units", () => {
  it("converts fixed units", () => {
    expect(toSqft(100, "sqyd")).toBe(900);
    expect(convertArea(1, "acre", "sqyd")).toBeCloseTo(4840, 5);
    expect(convertArea(1, "hectare", "acre")).toBeCloseTo(2.4711, 3);
    expect(convertArea(500, "sqft", "sqft")).toBe(500);
  });

  it("uses the state's bigha/biswa size and never a global default", () => {
    const bigha = REGIONAL_UNIT_SIZES["uttar-pradesh"].bigha!;
    expect(unitSizeSqft("bigha", up)).toBe(bigha);
    expect(toSqft(2, "bigha", up)).toBe(2 * bigha);
    expect(convertArea(1, "bigha", "biswa", up)).toBeCloseTo(20, 5);
    expect(unitSizeSqft("bigha")).toBeNull();
    expect(unitSizeSqft("bigha", { stateSlug: "nowhere" })).toBeNull();
  });

  it("prefers a district override", () => {
    REGIONAL_UNIT_SIZES["test-state"] = { bigha: 1000, districts: { "test-district": { bigha: 2000 } } };
    expect(unitSizeSqft("bigha", { stateSlug: "test-state", districtSlugs: ["some-village", "test-district"] })).toBe(2000);
    expect(unitSizeSqft("bigha", { stateSlug: "test-state", districtSlugs: ["elsewhere"] })).toBe(1000);
    delete REGIONAL_UNIT_SIZES["test-state"];
  });
});

describe("formatting", () => {
  it("formats rupees in lakh and crore", () => {
    expect(formatPrice(4_500_000)).toBe("₹45 L");
    expect(formatPrice(11_500_000)).toBe("₹1.15 Cr");
    expect(formatPrice(10_000_000)).toBe("₹1 Cr");
    expect(formatPrice(95_000)).toBe("₹95,000");
  });

  it("parses typed prices", () => {
    expect(parsePrice("85 L")).toBe(8_500_000);
    expect(parsePrice("1.2 Cr")).toBe(12_000_000);
    expect(parsePrice("₹45,00,000")).toBe(4_500_000);
    expect(parsePrice("abc")).toBeNull();
  });

  it("formats areas and normalises phones", () => {
    expect(formatArea(1650, "sqft")).toBe("1,650 sq ft");
    expect(formatArea(1.5, "acre")).toBe("1.5 acre");
    expect(normaliseIndianMobile("+91 98765 43210")).toBe("9876543210");
    expect(normaliseIndianMobile("09876543210")).toBe("9876543210");
    expect(normaliseIndianMobile("12345")).toBeNull();
    expect(normaliseIndianMobile("5876543210")).toBeNull();
  });
});
