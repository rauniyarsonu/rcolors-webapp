"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

export interface MarqueeRow {
  /** Pre-rendered items; each needs a stable `key` */
  items: React.ReactNode[];
  /** Scroll right instead of left */
  reverse?: boolean;
}

interface MarqueeProps {
  rows: MarqueeRow[];
  /** Spacing after every item (a margin, not flex gap, so both copies are the same width) */
  itemSpacingClass?: string;
  /** Constant speed regardless of item count */
  secondsPerItem?: number;
  /** Used in the pause button label, e.g. "logos" -> "Pause logos" */
  name: string;
  className?: string;
}

/**
 * Infinite horizontal marquee. Each row renders its items exactly twice and slides by -50%,
 * so the loop is seamless. Pauses on hover, via the pause button (tap/keyboard), and
 * stays still for visitors who prefer reduced motion.
 */
export default function Marquee({ rows, itemSpacingClass = "mr-4 sm:mr-6", secondsPerItem = 5, name, className = "" }: MarqueeProps) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={`group ${className}`} data-state={paused ? "paused" : "running"}>
      <div className="relative -mx-4 overflow-hidden py-4 sm:mx-0">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex w-max ${row.reverse ? "animate-marquee-right" : "animate-marquee-left"} ${
              rowIndex < rows.length - 1 ? "mb-4 sm:mb-6" : ""
            } group-hover:[animation-play-state:paused] group-data-[state=paused]:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]`}
            style={{ animationDuration: `${row.items.length * secondsPerItem}s` }}
          >
            {[0, 1].map((copy) => (
              // The second copy only exists for the loop; hide it from assistive tech
              <ul key={copy} className="flex" aria-hidden={copy === 1 ? true : undefined}>
                {row.items.map((item, i) => (
                  <li key={i} className={`flex shrink-0 ${itemSpacingClass}`}>
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>

      {/* Tap/keyboard equivalent of hover-to-pause. Hidden when motion is already off. */}
      <div className="mt-4 flex justify-center motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-sky hover:text-brand-sky"
        >
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          {paused ? `Play ${name}` : `Pause ${name}`}
        </button>
      </div>
    </div>
  );
}
