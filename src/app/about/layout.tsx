"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">

      {/* Content */}
      <main className="flex-grow w-full pb-24">
        {children}
      </main>
    </div>
  );
}
