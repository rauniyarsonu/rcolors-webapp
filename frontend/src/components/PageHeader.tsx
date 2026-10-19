import React from "react";
import Link from "@/components/ui/Link";
import { usePathname } from "@/lib/navigation";

export interface SubNavItem {
  name: string;
  href: string;
}

interface PageHeaderProps {
  titlePart1: string;
  titlePart2?: string;
  subNavItems?: SubNavItem[];
  /** Accessible name for the sub-navigation landmark */
  subNavLabel?: string;
}

export default function PageHeader({ titlePart1, titlePart2, subNavItems, subNavLabel = "Section" }: PageHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* Dark blue banner */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-brand-navy py-7 sm:py-9 lg:py-10">
        <h1 className="site-container relative z-10 text-balance break-words text-center font-heading text-[clamp(1.75rem,1.1rem+2.8vw,3rem)] font-black uppercase leading-tight tracking-wider text-white">
          {titlePart1} {titlePart2 && <span className="text-brand-sky">{titlePart2}</span>}
        </h1>
        {/* Small underline */}
        <div aria-hidden="true" className="relative z-10 mt-5 h-1 w-20 bg-brand-sky sm:mt-6"></div>
      </div>

      {/* Sub-navigation bar */}
      {subNavItems && subNavItems.length > 0 && (
        <nav aria-label={subNavLabel} className="relative z-20 w-full border-b bg-white shadow-sm">
          <ul className="site-container flex flex-wrap justify-center gap-x-4 py-2 sm:gap-x-10">
            {subNavItems.map((item) => {
              // Exact match for the active state
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center border-b-[3px] px-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 md:text-base ${
                      isActive ? "border-brand-sky text-brand-sky" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-brand-navy"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
