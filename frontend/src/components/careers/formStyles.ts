/** Field styles shared by the careers application form and the admin forms (same look as ContactForm) */

// text-base (16px) keeps iOS Safari from zooming in when a field is focused
export const inputClass = (invalid: boolean) =>
  `w-full min-h-12 rounded-lg border bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky ${
    invalid ? "border-red-600" : "border-gray-300 hover:border-gray-400"
  }`;

export const labelClass = "mb-2 block text-sm font-medium text-gray-700";

export const errorTextClass = "mt-1.5 flex items-center gap-1.5 text-sm text-red-700";

export const hintClass = "mt-1.5 text-sm text-gray-500";

/** Small pill for job metadata (business, type) */
export const chipClass = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide";
