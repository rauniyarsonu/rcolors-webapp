import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

export interface HighlightItem {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface HighlightsProps {
  items: HighlightItem[];
}

/** Navy band of key strengths, in the homepage "Why Choose Us" style: glass cards, icon on top */
export default function Highlights({ items }: HighlightsProps) {
  return (
    <section aria-label="Why choose us" className="section-y relative w-full overflow-hidden bg-brand-navy text-white">
      {/* Decorative background elements */}
      <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/2 translate-x-1/4 skew-x-12 bg-brand-sky/10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <ul className="site-container relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
        {items.map(({ title, desc, icon: Icon }, idx) => (
          <li key={title}>
            <Reveal delay={idx * 80} className="h-full">
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition-[transform,background-color,border-color] duration-300 hover:-translate-y-2 hover:border-brand-sky/50 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-sky/15 text-white ring-1 ring-inset ring-brand-sky/30 transition-colors duration-300 group-hover:bg-brand-sky"
                >
                  <Icon size={26} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-balance font-heading text-lg font-bold leading-snug text-white sm:text-xl">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-300">{desc}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
