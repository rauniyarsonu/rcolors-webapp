import { apiUrl } from "../../lib/api";

/**
 * Site-level settings for the estate portal. Nothing here names a city:
 * cities come from the backend API (data: backend/src/main/resources/data/estate, see docs/ADDING-DATA.md).
 */
export const ESTATE = {
  basePath: "/businesses/estate",
  brand: "R Colors Estate",

  /** When true, the city dropdown starts empty and results stay hidden until a city is chosen. */
  REQUIRE_CITY_SELECTION: false,

  /** Results shown per "Load more" step */
  PAGE_SIZE: 12,
  /** How many trending chips to show under the search box */
  TRENDING_LIMIT: 6,

  heroImage: {
    src: "/images/home1.jpg",
    alt: "Residential high-rise towers rising above a green neighbourhood",
  },
  /** Shown on cards when a record has no images yet */
  placeholderLabel: "Photos coming soon",

  /** Posted (form-urlencoded) to the Spring Boot backend: EnquiryController */
  enquiry: {
    formName: "estate-enquiry",
    endpoint: apiUrl("/api/estate/enquiries"),
  },

  /**
   * Verified company details, copied from the shared footer. Used for the
   * call links in the enquiry panel and for RealEstateAgent JSON-LD only.
   */
  company: {
    name: "R Colors Estate",
    parentName: "R Colors Group of Companies",
    streetAddress: "Flat No. 1004, BCC Tower, Arjunganj–Shultanpur Road",
    locality: "Lucknow",
    region: "Uttar Pradesh",
    country: "IN",
    phones: ["6389144470", "9579662353"],
    email: "rcolorsgroup@gmail.com",
  },
} as const;
