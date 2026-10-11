/** Group-wide contact details used by the footer and the contact page */
export const COMPANY = {
  name: "R Colors Group of Companies",
  phones: ["6389144470", "9579662353"],
  email: "rcolourconstruction@gmail.com",
  address: {
    short: "Flat No. 1004, BCC Tower, Arjunganj–Shultanpur Road, Lucknow, UP, India",
    full: "Flat No. 1004, BCC Tower, Arjunganj–Shultanpur Road, Lucknow, Uttar Pradesh, India",
  },
  contactForm: {
    /** Registered for Netlify Forms in public/__forms.html; keep field names in sync */
    formName: "contact",
    endpoint: "/__forms.html",
  },
} as const;

/** tel: href for a 10-digit Indian mobile number */
export const telHref = (phone: string) => `tel:+91${phone}`;
