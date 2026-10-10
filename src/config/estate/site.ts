/**
 * Site-level settings for the estate portal. Nothing here names a city:
 * cities come from src/data/estate (see docs/ADDING-DATA.md).
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

  /** Netlify Forms: the form is declared in public/__forms.html and posted there with fetch */
  enquiry: {
    formName: "estate-enquiry",
    endpoint: "/__forms.html",
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
    email: "rcolourconstruction@gmail.com",
  },
} as const;
