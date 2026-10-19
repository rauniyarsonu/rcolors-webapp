import type { Agent, CityBundle, Location, Project, Property } from "../schema";

const loc = (slug: string, type: Location["type"], parentId: string | null, extra: Partial<Location> = {}): Location => ({
  id: slug,
  slug,
  name: slug.replace(/(^|-)(\w)/g, (_, s, c) => `${s ? " " : ""}${c.toUpperCase()}`),
  type,
  parentId,
  enabled: true,
  order: 0,
  ...extra,
});

export const locations: Location[] = [
  loc("uttar-pradesh", "state", null),
  loc("lucknow", "city", "uttar-pradesh"),
  loc("gomti-nagar", "locality", "lucknow", { aliases: ["GN"], landmarks: ["Ambedkar Park"], nearby: ["chinhat"] }),
  loc("vibhuti-khand", "locality", "gomti-nagar"),
  loc("chinhat", "locality", "lucknow"),
  loc("hidden-area", "locality", "lucknow", { enabled: false }),
  loc("mohanlalganj", "town", "lucknow"),
  loc("village-a", "village", "mohanlalganj"),
  loc("kanpur", "city", "uttar-pradesh", { enabled: false }),
];

export const prop = (id: string, extra: Partial<Property> = {}): Property => ({
  id,
  citySlug: "lucknow",
  locationSlug: "gomti-nagar",
  title: `Listing ${id}`,
  category: "property",
  type: "apartment",
  price: 5_000_000,
  areaValue: 1000,
  areaUnit: "sqft",
  status: "ready",
  images: [],
  verified: false,
  description: "",
  postedAt: "2026-01-01",
  attributes: {},
  ...extra,
});

export const properties: Property[] = [
  prop("p1", { type: "apartment", price: 6_000_000, attributes: { bhk: 2 }, postedAt: "2026-03-01" }),
  prop("p2", { type: "apartment", price: 12_000_000, attributes: { bhk: 3 }, locationSlug: "vibhuti-khand", verified: true, verifiedOn: "2026-01-01" }),
  prop("p3", {
    category: "land",
    type: "residential-plot",
    price: 4_000_000,
    areaValue: 200,
    areaUnit: "sqyd",
    locationSlug: "chinhat",
    attributes: { facing: "east", roadWidth: 30, cornerPlot: true },
    featured: true,
  }),
  prop("p4", { category: "land", type: "agricultural-land", price: 2_000_000, priceUnit: "per-area", areaValue: 2, areaUnit: "bigha", locationSlug: "village-a" }),
  prop("p5", { category: "land", type: "commercial-land", price: 30_000_000, areaValue: 5000, locationSlug: "mohanlalganj", attributes: { facing: "north" } }),
  prop("p6", { type: "shop", price: 9_000_000, areaValue: 300, title: "Corner shop near market" }),
];

export const projects: Project[] = [
  { id: "prj1", citySlug: "lucknow", locationSlug: "gomti-nagar", name: "Alpha Residency", developer: "Dev", type: "residential", status: "ready", startingPrice: 5_000_000, sizeRange: "2-3 BHK", images: [], description: "" },
  { id: "prj2", citySlug: "lucknow", locationSlug: "mohanlalganj", name: "Green Plots", developer: "Dev", type: "plotted", status: "upcoming", startingPrice: 1_500_000, sizeRange: "plots", images: [], description: "" },
];

export const agents: Agent[] = [
  { id: "a1", name: "Asha", role: "Advisor", phone: "9876543210", specializations: ["residential"], areasServed: ["gomti-nagar"], languages: ["Hindi"] },
  { id: "a2", name: "Bharat", role: "Consultant", phone: "9876543211", specializations: ["land", "investment"], areasServed: ["lucknow"], languages: ["Hindi", "English"] },
  { id: "a3", name: "Chitra", role: "Advisor", phone: "9876543212", specializations: ["land"], areasServed: ["village-a"], languages: ["Hindi"] },
];

export const bundle: CityBundle = {
  city: { slug: "lucknow", name: "Lucknow", stateSlug: "uttar-pradesh", stateName: "Uttar Pradesh" },
  locations: locations.filter((l) => l.slug !== "kanpur" && l.enabled),
  properties,
  projects,
  agents,
};
