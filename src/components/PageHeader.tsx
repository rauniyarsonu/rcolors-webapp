"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SubNavItem {
  name: string;
  href: string;
}

interface PageHeaderProps {
  titlePart1: string;
  titlePart2?: string;
  subNavItems?: SubNavItem[];
}

export default function PageHeader({ titlePart1, titlePart2, subNavItems }: PageHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* Dark blue banner */}
      <div className="w-full bg-brand-navy py-6 md:py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-wider relative z-10 text-center">
          {titlePart1} {titlePart2 && <span className="text-brand-sky">{titlePart2}</span>}
        </h1>
        {/* Small underline */}
        <div className="w-20 h-1 bg-brand-sky mt-6 relative z-10"></div>
      </div>

      {/* Sub-navigation bar */}
      {subNavItems && subNavItems.length > 0 && (
        <div className="w-full bg-white shadow-sm border-b relative z-20">
          <div className="max-w-6xl mx-auto px-4">
            <ul className="flex flex-wrap justify-center gap-4 md:gap-10 py-4">
              {subNavItems.map((item) => {
                // Exact match for the active state
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`font-semibold text-sm md:text-base px-2 py-2 transition-colors duration-200 border-b-[3px] uppercase tracking-wider ${
                        isActive 
                          ? 'text-brand-sky border-brand-sky' 
                          : 'text-gray-500 border-transparent hover:text-brand-navy hover:border-gray-300'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
