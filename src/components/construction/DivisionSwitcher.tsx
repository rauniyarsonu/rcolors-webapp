import Link from "next/link";

const divisions = [
  { index: "01", name: "Construction & Developers", href: "/businesses/construction" },
  { index: "02", name: "Finishing Works", href: "/businesses/r-colors" },
  { index: "03", name: "Estate", href: "/businesses/estate" },
];

export default function DivisionSwitcher({ current }: { current: string }) {
  return (
    <nav aria-label="Our businesses" className="border-b border-cx-ink/10 bg-cx-paper">
      <div className="cx-container">
        {/* Scrolls sideways on very narrow screens, three equal segments from sm up */}
        <ul className="-mx-5 flex overflow-x-auto [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {divisions.map((division) => {
            const active = division.href === current;
            return (
              <li key={division.href} className="shrink-0 border-l border-cx-ink/10 first:border-l-0">
                <Link
                  href={division.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[64px] items-center gap-3 whitespace-nowrap border-t-2 px-5 py-3 text-sm sm:whitespace-normal font-semibold transition-colors md:px-8 ${
                    active
                      ? "border-brand-sky text-cx-ink"
                      : "border-transparent text-cx-muted hover:border-cx-ink/25 hover:text-cx-ink"
                  }`}
                >
                  <span className={`font-display text-xs ${active ? "text-brand-sky font-bold" : "text-cx-muted"}`}>
                    {division.index}
                  </span>
                  {division.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
