import { AREA_UNITS, type AreaUnit } from "../../config/estate/units";

const trim = (n: number, digits: number) => n.toFixed(digits).replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");

/** ₹ in Indian notation: ₹85 L, ₹1.25 Cr, ₹45,000 */
export function formatPrice(rupees: number): string {
  if (rupees >= 1e7) return `₹${trim(rupees / 1e7, 2)} Cr`;
  if (rupees >= 1e5) return `₹${trim(rupees / 1e5, 2)} L`;
  return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
}

/** Long form for screen readers and detail views: "₹1.25 crore" */
export function formatPriceLong(rupees: number): string {
  if (rupees >= 1e7) return `₹${trim(rupees / 1e7, 2)} crore`;
  if (rupees >= 1e5) return `₹${trim(rupees / 1e5, 2)} lakh`;
  return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
}

export function formatNumber(n: number, maxDigits = 2): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: maxDigits });
}

export function formatArea(value: number, unit: AreaUnit): string {
  const digits = value >= 100 ? 0 : 2;
  return `${formatNumber(value, digits)} ${AREA_UNITS[unit].label}`;
}

/** Parse "1.5 cr", "85 lakh", "85L", "4500000" into rupees */
export function parsePrice(input: string): number | null {
  const m = input.trim().toLowerCase().replace(/[₹,\s]/g, "").match(/^(\d+(?:\.\d+)?)(cr|crore|crores|l|lac|lakh|lakhs|k)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const mult = !m[2] ? 1 : m[2].startsWith("c") ? 1e7 : m[2] === "k" ? 1e3 : 1e5;
  return Math.round(n * mult);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** "6389144470" → "+91 63891 44470" */
export function formatPhone(tenDigits: string): string {
  return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}

/** Normalise user input to 10 digits, or null if it isn't an Indian mobile */
export function normaliseIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
