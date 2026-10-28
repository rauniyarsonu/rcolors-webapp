/**
 * Vocabulary for estate records. Adding a property type, status or
 * specialization is an edit here: the zod schemas, filters, cards and
 * CSV importer all read these maps.
 */

/** "projects" and "agents" stay in the Tab type so the data layer keeps compiling while those tabs are hidden */
export type Tab = "buy" | "projects" | "agents";
export const TABS: readonly { key: Tab; label: string }[] = [
  { key: "buy", label: "Buy" },
  // Projects temporarily hidden from the app; uncomment to restore
  // { key: "projects", label: "Projects" },
  // Agents temporarily hidden from the app; uncomment to restore
  // { key: "agents", label: "Agents" },
];

/** First-level segmented control on the Buy tab */
export const SEGMENTS = [
  { value: "all", label: "All" },
  { value: "land", label: "Land & Plots" },
  { value: "residential", label: "Houses & Flats" },
  { value: "commercial", label: "Commercial" },
] as const;
export type Segment = (typeof SEGMENTS)[number]["value"];

/** Enquiry form "Interested In" options (values kept from the original form) */
export const ENQUIRY_INTERESTS = [
  { value: "plot", label: "Residential Plot" },
  { value: "ready", label: "Ready-to-Move Home" },
  { value: "commercial", label: "Commercial Space" },
  { value: "investment", label: "Investment Opportunity" },
  { value: "partnership", label: "Joint Development / Partnership" },
] as const;
export type EnquiryInterest = (typeof ENQUIRY_INTERESTS)[number]["value"];

interface PropertyTypeDef {
  label: string;
  category: "land" | "property";
  /** Buy-tab segments this type appears under ("all" is implied) */
  segments: Exclude<Segment, "all">[];
  /** Pre-selected "Interested In" value when enquiring about this type */
  interest: EnquiryInterest;
}

export const PROPERTY_TYPES = {
  "residential-plot": { label: "Residential Plot", category: "land", segments: ["land"], interest: "plot" },
  "agricultural-land": { label: "Agricultural / Farm Land", category: "land", segments: ["land"], interest: "investment" },
  "commercial-land": { label: "Commercial Land", category: "land", segments: ["land", "commercial"], interest: "commercial" },
  "industrial-land": { label: "Industrial Land", category: "land", segments: ["land", "commercial"], interest: "commercial" },
  apartment: { label: "Apartment / Flat", category: "property", segments: ["residential"], interest: "ready" },
  "independent-house": { label: "Independent House", category: "property", segments: ["residential"], interest: "ready" },
  villa: { label: "Villa", category: "property", segments: ["residential"], interest: "ready" },
  "builder-floor": { label: "Builder Floor", category: "property", segments: ["residential"], interest: "ready" },
  shop: { label: "Shop / Showroom", category: "property", segments: ["commercial"], interest: "commercial" },
  office: { label: "Office Space", category: "property", segments: ["commercial"], interest: "commercial" },
  warehouse: { label: "Warehouse", category: "property", segments: ["commercial"], interest: "commercial" },
} satisfies Record<string, PropertyTypeDef>;
export type PropertyType = keyof typeof PROPERTY_TYPES;

export const LISTING_STATUSES = {
  ready: "Ready to Move",
  "under-development": "Under Development",
} as const;

export const PROJECT_TYPES = {
  residential: { label: "Residential", interest: "ready" },
  commercial: { label: "Commercial", interest: "commercial" },
  plotted: { label: "Plotted Development", interest: "plot" },
  "mixed-use": { label: "Mixed Use", interest: "investment" },
} satisfies Record<string, { label: string; interest: EnquiryInterest }>;

export const PROJECT_STATUSES = {
  upcoming: "Upcoming",
  "under-construction": "Under Construction",
  ready: "Ready to Move",
} as const;

export const SPECIALIZATIONS = {
  residential: "Residential",
  commercial: "Commercial",
  land: "Plots / Land",
  investment: "Investment",
} as const;

export const FACINGS = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  "north-east": "North-East",
  "north-west": "North-West",
  "south-east": "South-East",
  "south-west": "South-West",
} as const;

export const FURNISHING = {
  unfurnished: "Unfurnished",
  "semi-furnished": "Semi-furnished",
  furnished: "Furnished",
} as const;

export const LOCATION_TYPE_LABELS = {
  state: "State",
  district: "District",
  city: "City",
  town: "Town",
  locality: "Locality",
  village: "Village",
} as const;

/** Prefix every sample record's title/name carries; validate:data enforces it */
export const SAMPLE_PREFIX = "[SAMPLE]";

export const keysOf = <T extends object>(obj: T) => Object.keys(obj) as [keyof T & string, ...(keyof T & string)[]];
