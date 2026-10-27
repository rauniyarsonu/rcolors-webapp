import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Briefcase, ExternalLink, FileText, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { logout, useAdminSession } from "@/lib/admin/auth";
import { Loading } from "./ui";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase, end: false },
  { to: "/admin/applications", label: "Applications", icon: FileText, end: false },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-sky ${
    isActive ? "bg-white/15 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
  }`;

/**
 * Admin chrome: a sidebar from md up, a top bar with a toggle menu below.
 * Rendered instead of the public Navbar/Footer (see App.tsx).
 */
export default function AdminLayout() {
  const session = useAdminSession();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = (
    <>
      {nav.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
          <item.icon size={18} aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
      <a href="/careers" target="_blank" rel="noopener noreferrer" className={linkClass({ isActive: false })}>
        <ExternalLink size={18} aria-hidden="true" />
        View careers page
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button type="button" onClick={logout} className={`${linkClass({ isActive: false })} w-full text-left`}>
        <LogOut size={18} aria-hidden="true" />
        Log out
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 md:flex-row">
      {/* Sidebar (md+) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-brand-navy p-4 text-white md:flex">
        <div className="mb-6 px-3 pt-2">
          <p className="font-heading text-lg font-black">
            <span className="text-brand-red">R</span> Colors <span className="text-brand-sky">Admin</span>
          </p>
          {session && <p className="mt-1 truncate text-xs text-gray-400">Signed in as {session.username}</p>}
        </div>
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {links}
        </nav>
      </aside>

      {/* Top bar (below md) */}
      <header className="sticky top-0 z-30 bg-brand-navy text-white md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <p className="font-heading font-black">
            <span className="text-brand-red">R</span> Colors <span className="text-brand-sky">Admin</span>
          </p>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="admin-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-sky"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
        {menuOpen && (
          <nav id="admin-menu" aria-label="Admin" className="flex flex-col gap-1 border-t border-white/10 px-3 pb-3 pt-2">
            {links}
          </nav>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-10 lg:py-8">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
