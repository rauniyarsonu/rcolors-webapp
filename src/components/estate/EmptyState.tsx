"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  body: string;
  nearbyNames: string[];
  onNearby?: () => void;
  onClear?: () => void;
  onEnquire: () => void;
}

export default function EmptyState({ title, body, nearbyNames, onNearby, onClear, onEnquire }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-es-surface text-es-accent-strong">
        <SearchX size={26} aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-xl font-bold text-es-ink">{title}</h3>
      <p className="mt-2 max-w-md text-es-muted">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onNearby && nearbyNames.length > 0 && (
          <button type="button" onClick={onNearby} className="min-h-[44px] rounded-md bg-es-accent-strong px-5 text-sm font-semibold text-white hover:bg-es-ink">
            Show nearby: {nearbyNames.slice(0, 3).join(", ")}
          </button>
        )}
        {onClear && (
          <button type="button" onClick={onClear} className="min-h-[44px] rounded-md border border-es-line px-5 text-sm font-semibold text-es-ink hover:border-es-ink">
            Clear filters
          </button>
        )}
        <button type="button" onClick={onEnquire} className="min-h-[44px] rounded-md border border-es-line px-5 text-sm font-semibold text-es-ink hover:border-es-ink">
          Enquire
        </button>
      </div>
    </div>
  );
}
