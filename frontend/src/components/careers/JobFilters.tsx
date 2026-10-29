import { useEffect, useId, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounced } from "@/components/estate/useQueryState";
import { EMPLOYMENT_TYPE_LABELS } from "@/config/careers";
import { hasFilters, type CareersQuery } from "@/lib/careers/query";
import type { CareerFilters, EmploymentType } from "@/lib/careers/types";

const selectClass =
  "w-full min-h-12 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors hover:border-gray-400 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky";

interface JobFiltersProps {
  query: CareersQuery;
  options: CareerFilters | null;
  /** `replace` while typing, so each keystroke isn't a history entry */
  onChange: (next: CareersQuery, opts?: { replace?: boolean }) => void;
}

/** Search box + location / type dropdowns for /careers */
export default function JobFilters({ query, options, onChange }: JobFiltersProps) {
  const uid = useId();
  const [text, setText] = useState(query.q ?? "");
  const pushText = useDebounced((q: string) => onChange({ ...query, q: q.trim() || undefined }, { replace: true }), 350);

  // Back/forward or "Clear filters" changes the URL: show its search text
  useEffect(() => setText(query.q ?? ""), [query.q]);

  // Keep a value from a shared link selectable even if no open job has it any more
  const locations = options ? [...options.locations] : [];
  if (query.location && !locations.includes(query.location)) locations.push(query.location);
  const types = [...(options?.employmentTypes ?? [])];
  if (query.employmentType && !types.includes(query.employmentType)) types.push(query.employmentType);

  return (
    <form role="search" aria-label="Filter open positions" onSubmit={(e) => e.preventDefault()} className="mb-8 md:mb-10">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor={`${uid}-q`} className="sr-only">
            Search by job title or department
          </label>
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id={`${uid}-q`}
            type="search"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              pushText(e.target.value);
            }}
            placeholder="Search job title or department"
            className={`${selectClass} pl-11`}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-loc`} className="sr-only">
            Location
          </label>
          <select
            id={`${uid}-loc`}
            value={query.location ?? ""}
            onChange={(e) => onChange({ ...query, location: e.target.value || undefined })}
            className={selectClass}
          >
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-type`} className="sr-only">
            Job type
          </label>
          <select
            id={`${uid}-type`}
            value={query.employmentType ?? ""}
            onChange={(e) => onChange({ ...query, employmentType: (e.target.value || undefined) as EmploymentType | undefined })}
            className={selectClass}
          >
            <option value="">All job types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {EMPLOYMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>
      {hasFilters(query) && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-es-accent-strong hover:underline"
        >
          <X size={16} aria-hidden="true" />
          Clear filters
        </button>
      )}
    </form>
  );
}
