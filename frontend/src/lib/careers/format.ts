import { formatPrice } from "../estate/format";

const DAY = 86_400_000;

/** "2026-10-30" as a local date (no timezone shift) */
const localDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function experienceLabel(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  const lo = min ?? 0;
  if (max === null) return lo === 0 ? "Freshers welcome" : `${lo}+ years`;
  if (max === 0) return "Fresher";
  if (lo === max) return `${lo} ${lo === 1 ? "year" : "years"}`;
  return `${lo}–${max} years`;
}

/** Annual salary range: "₹3.6 L – ₹5.4 L / year" */
export function salaryLabel(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return min === max ? `${formatPrice(min)} / year` : `${formatPrice(min)} – ${formatPrice(max)} / year`;
  return min !== null ? `From ${formatPrice(min)} / year` : `Up to ${formatPrice(max!)} / year`;
}

/** "Posted today", "Posted 3 days ago", "Posted 2 weeks ago" */
export function postedLabel(publishedAt: string | null, now = new Date()): string | null {
  if (!publishedAt) return null;
  const days = Math.round((startOfDay(now).getTime() - startOfDay(new Date(publishedAt)).getTime()) / DAY);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 14) return `Posted ${days} days ago`;
  if (days < 60) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted ${Math.floor(days / 30)} months ago`;
}

/** Days left to apply (0 = today is the last day), or null without a deadline */
export function daysUntil(deadline: string | null, now = new Date()): number | null {
  if (!deadline) return null;
  return Math.round((localDate(deadline).getTime() - startOfDay(now).getTime()) / DAY);
}

export function formatDay(iso: string): string {
  return localDate(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** "Apply by 30 Oct 2026" when the deadline is within a week, else null */
export function deadlineSoonLabel(deadline: string | null, now = new Date()): string | null {
  const days = daysUntil(deadline, now);
  if (days === null || days < 0 || days > 7) return null;
  return days === 0 ? "Last day to apply" : `Apply by ${formatDay(deadline!)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
