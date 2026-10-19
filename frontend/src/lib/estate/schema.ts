import { z } from "zod";
import {
  FACINGS,
  FURNISHING,
  LISTING_STATUSES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  PROPERTY_TYPES,
  SPECIALIZATIONS,
  keysOf,
} from "../../config/estate/catalog";
import { AREA_UNITS } from "../../config/estate/units";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase slug like gomti-nagar");
const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "may only contain letters, digits, - and _");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date like 2026-01-31");
/** 10-digit Indian mobile number, stored without +91 or spaces */
export const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const phone = z.string().regex(INDIAN_MOBILE, "must be a 10-digit Indian mobile number without +91 or spaces");
/** Site-relative image path under /public */
const imagePath = z.string().regex(/^\/images\/[^\s]+\.(?:jpe?g|png|webp|avif)$/i, "must be a path like /images/estate/lucknow/photo.jpg");
const price = z.number().positive().max(1e11, "looks wrong: over ₹10,000 crore");

export const LOCATION_TYPES = ["state", "district", "city", "town", "locality", "village"] as const;

export const LocationSchema = z
  .object({
    id: slug,
    slug,
    name: z.string().min(1),
    type: z.enum(LOCATION_TYPES),
    parentId: slug.nullable(),
    enabled: z.boolean(),
    order: z.number().int().default(0),
    nearby: z.array(slug).optional(),
    coordinates: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
    aliases: z.array(z.string().min(1)).optional(),
    /** Landmarks the typeahead matches to this location */
    landmarks: z.array(z.string().min(1)).optional(),
    /** Pin to "Trending searches" regardless of listing count */
    trending: z.boolean().optional(),
    /** Suggested by the developer, not yet confirmed by the owner */
    toConfirm: z.boolean().optional(),
  })
  .strict();

export const PropertyAttributesSchema = z
  .object({
    // Land
    facing: z.enum(keysOf(FACINGS)).optional(),
    roadWidth: z.number().positive().optional(),
    cornerPlot: z.boolean().optional(),
    boundaryWall: z.boolean().optional(),
    landUse: z.string().optional(),
    distanceFromHighway: z.number().nonnegative().optional(),
    titleDocsVerified: z.boolean().optional(),
    // Built property
    bhk: z.number().int().positive().max(20).optional(),
    bathrooms: z.number().int().nonnegative().max(20).optional(),
    floor: z.number().int().min(-2).max(200).optional(),
    totalFloors: z.number().int().positive().max(200).optional(),
    furnishing: z.enum(keysOf(FURNISHING)).optional(),
    ageYears: z.number().nonnegative().max(200).optional(),
    possession: z.string().optional(),
  })
  .strict();

export const PropertySchema = z
  .object({
    id,
    citySlug: slug,
    locationSlug: slug,
    title: z.string().min(3),
    category: z.enum(["land", "property"]),
    type: z.enum(keysOf(PROPERTY_TYPES)),
    price,
    /** total (default) or price per areaUnit */
    priceUnit: z.enum(["total", "per-area"]).optional(),
    areaValue: z.number().positive(),
    areaUnit: z.enum(keysOf(AREA_UNITS)),
    status: z.enum(keysOf(LISTING_STATUSES)),
    images: z.array(imagePath),
    verified: z.boolean(),
    /** Required when verified is true: the date R Colors checked the documents */
    verifiedOn: isoDate.optional(),
    description: z.string(),
    postedAt: isoDate,
    featured: z.boolean().optional(),
    agentId: id.optional(),
    projectId: id.optional(),
    isSample: z.boolean().optional(),
    attributes: PropertyAttributesSchema.default({}),
  })
  .strict()
  .superRefine((p, ctx) => {
    if (PROPERTY_TYPES[p.type].category !== p.category) {
      ctx.addIssue({ code: "custom", path: ["category"], message: `type "${p.type}" belongs to category "${PROPERTY_TYPES[p.type].category}"` });
    }
    if (p.verified && !p.verifiedOn) {
      ctx.addIssue({ code: "custom", path: ["verifiedOn"], message: "verified is true but verifiedOn (date of verification) is missing" });
    }
  });

export const ProjectSchema = z
  .object({
    id,
    citySlug: slug,
    locationSlug: slug,
    name: z.string().min(3),
    developer: z.string().min(1),
    type: z.enum(keysOf(PROJECT_TYPES)),
    status: z.enum(keysOf(PROJECT_STATUSES)),
    startingPrice: price,
    sizeRange: z.string().min(1),
    images: z.array(imagePath),
    description: z.string(),
    /** UP-RERA registration number, only if real */
    reraId: z.string().optional(),
    featured: z.boolean().optional(),
    isSample: z.boolean().optional(),
  })
  .strict();

export const AgentSchema = z
  .object({
    id,
    name: z.string().min(2),
    role: z.string().min(2),
    photo: imagePath.optional(),
    phone,
    whatsapp: phone.optional(),
    email: z.string().email().optional(),
    specializations: z.array(z.enum(keysOf(SPECIALIZATIONS))).min(1),
    areasServed: z.array(slug).min(1),
    languages: z.array(z.string().min(2)).min(1),
    featured: z.boolean().optional(),
    isSample: z.boolean().optional(),
  })
  .strict();

export type Location = z.infer<typeof LocationSchema>;
export type LocationType = Location["type"];
export type Property = z.infer<typeof PropertySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Agent = z.infer<typeof AgentSchema>;

/** A market (city/town) shown in the city dropdown */
export interface City {
  slug: string;
  name: string;
  stateSlug: string | null;
  stateName: string | null;
}

/** Everything the portal needs for one city, serialisable for the client */
export interface CityBundle {
  city: City;
  /** Active nodes of the city's subtree plus its ancestors */
  locations: Location[];
  properties: Property[];
  projects: Project[];
  agents: Agent[];
}

/** Raw (unparsed) contents of one city folder */
export interface RawCityFiles {
  properties: unknown;
  projects: unknown;
  agents: unknown;
}
