"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

type NavItem = { name: string; href: string };
type MenuId = "about" | "businesses";

const aboutItems: NavItem[] = [
  { name: "About Company", href: "/about" },
  { name: "Mission & Vision", href: "/about/mission" },
  { name: "Clients", href: "/about/clients" },
];

const businessItems: NavItem[] = [
  { name: "Construction & Developers", href: "/businesses/construction" },
  { name: "Finishing Works", href: "/businesses/r-colors" },
  { name: "Estate", href: "/businesses/estate" },
];

// Routes whose first section is a full-bleed hero the header sits on top of
const overlayRoutes = ["/", "/businesses/construction", "/businesses/r-colors"];
// Routes that use the cx (architectural paper/ink) chrome
const cxRoutes = ["/businesses/construction", "/businesses/r-colors"];
// Prefixes whose every page opens with a full-bleed hero (estate city and locality pages)
const overlayPrefixes = ["/businesses/estate"];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const isOverlay =
    overlayRoutes.includes(pathname) ||
    overlayPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isCx = cxRoutes.some((route) => pathname.startsWith(route));
  const isTransparent = isOverlay && !isScrolled && !isMobileMenuOpen;

  useEffect(() => {
    if (!isOverlay) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOverlay]);

  // Close all menus on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const closeDrawer = useCallback((returnFocus = true) => {
    setIsMobileMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Drawer: lock scroll, move focus in, trap Tab, close on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      } else if (e.key === "Tab") {
        const items = focusables();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen, closeDrawer]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Visual theme: construction and finishing routes use the cx tokens, every other route keeps the brand look
  const headerPosClass = isOverlay ? "fixed top-0 left-0 right-0" : "sticky top-0";
  const headerBgClass = isTransparent
    ? "bg-transparent"
    : isCx
      ? "bg-cx-paper border-b border-cx-ink/10"
      : "bg-white shadow-md";
  const textColorClass = isTransparent ? "text-white" : isCx ? "text-cx-ink" : "text-brand-navy";
  const hoverClass = "hover:text-brand-sky";
  const indicatorClass = "bg-brand-sky";
  const logoRedClass = isTransparent ? "text-white" : "text-brand-red";
  const logoGreenClass = isTransparent ? "text-white" : "text-brand-green";
  const ctaClass = isTransparent
    ? "bg-brand-sky text-white hover:bg-white hover:text-brand-navy shadow-sm"
    : "bg-brand-sky text-white hover:bg-brand-navy shadow-sm";
  const dropdownLinkClass = (href: string) =>
    `flex min-h-[44px] items-center px-6 text-[15px] font-medium transition-colors hover:text-brand-sky ${
      pathname === href ? "text-brand-sky font-semibold" : ""
    }`;

  const navLinkClass = `relative flex min-h-[44px] items-center transition-colors ${hoverClass}`;

  const activeBar = (show: boolean) =>
    show ? <span aria-hidden="true" className={`absolute -bottom-0.5 left-0 right-0 h-0.5 ${indicatorClass}`} /> : null;

  return (
    <header
      className={`w-full z-50 transition-colors duration-300 ${headerPosClass} ${headerBgClass} ${
        isCx ? "cx" : ""
      } ${isCx && isTransparent ? "cx-on-dark" : ""}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:h-20 xl:px-12">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-4" aria-label="R Colors Group home">
          <span
            className={`relative block h-[46px] w-[64px] shrink-0 overflow-hidden rounded-md sm:h-[56px] sm:w-[78px] ${
              isCx ? "bg-white" : ""
            }`}
          >
            <Image src="/images/icon.png" alt="" fill sizes="78px" className="object-cover" />
          </span>
          <span className="whitespace-nowrap font-heading text-[1.35rem] font-bold tracking-tight sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
            <span className={logoRedClass}>R </span>
            <span className={logoGreenClass}>Colors Group</span>
          </span>
        </Link>

        <div className="flex items-center">
          {/* Desktop Nav */}
          <nav
            aria-label="Main"
            className={`mr-6 hidden items-center gap-6 whitespace-nowrap text-[15px] font-semibold lg:flex xl:mr-8 xl:gap-8 xl:text-base ${textColorClass}`}
          >
            <Link href="/" className={navLinkClass} aria-current={pathname === "/" ? "page" : undefined}>
              Home
              {activeBar(pathname === "/")}
            </Link>

            <NavDropdown
              id="about"
              label="About Us"
              items={aboutItems}
              open={openMenu === "about"}
              onOpenChange={(open) => setOpenMenu(open ? "about" : null)}
              triggerClass={navLinkClass}
              linkClass={dropdownLinkClass}
              pathname={pathname}
              activeBar={activeBar(isActive("/about"))}
              panelClass={isCx ? "border border-cx-ink/10 text-cx-ink" : "shadow-2xl text-black"}
            />

            <NavDropdown
              id="businesses"
              label="Our Businesses"
              items={businessItems}
              open={openMenu === "businesses"}
              onOpenChange={(open) => setOpenMenu(open ? "businesses" : null)}
              triggerClass={navLinkClass}
              linkClass={dropdownLinkClass}
              pathname={pathname}
              activeBar={activeBar(isActive("/businesses"))}
              panelClass={isCx ? "border border-cx-ink/10 text-cx-ink" : "shadow-2xl text-black"}
            />

            <Link href="/projects" className={navLinkClass} aria-current={pathname === "/projects" ? "page" : undefined}>
              Projects
              {activeBar(isActive("/projects"))}
            </Link>
            <Link href="/contact" className={navLinkClass} aria-current={pathname === "/contact" ? "page" : undefined}>
              Contact
              {activeBar(isActive("/contact"))}
            </Link>
          </nav>

          <Link
            href="/contact"
            className={`hidden min-h-[44px] items-center whitespace-nowrap rounded-sm px-5 text-sm font-bold transition-colors xl:inline-flex xl:px-6 xl:text-base ${ctaClass}`}
          >
            Discuss Your Project
          </Link>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            className={`-mr-2 flex h-11 w-11 items-center justify-center lg:hidden ${textColorClass}`}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => closeDrawer(false)}
      />
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-white shadow-xl duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          // Visibility flips instantly on open (so focus can move in) and waits for the slide on close
          isMobileMenuOpen ? "visible translate-x-0 transition-transform" : "invisible translate-x-full transition-[transform,visibility]"
        } ${isCx ? "text-cx-ink" : "text-brand-navy"}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">Menu</span>
          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center"
            aria-label="Close menu"
            onClick={() => closeDrawer()}
          >
            <X size={26} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col font-semibold">
          <DrawerLink href="/" current={pathname === "/"} isCx={isCx} onNavigate={() => closeDrawer(false)}>
            Home
          </DrawerLink>
          <DrawerGroup title="About Us">
            {aboutItems.map((item) => (
              <DrawerLink key={item.href} href={item.href} current={pathname === item.href} isCx={isCx} nested onNavigate={() => closeDrawer(false)}>
                {item.name}
              </DrawerLink>
            ))}
          </DrawerGroup>
          <DrawerGroup title="Our Businesses">
            {businessItems.map((item) => (
              <DrawerLink key={item.href} href={item.href} current={pathname === item.href} isCx={isCx} nested onNavigate={() => closeDrawer(false)}>
                {item.name}
              </DrawerLink>
            ))}
          </DrawerGroup>
          <DrawerLink href="/projects" current={pathname === "/projects"} isCx={isCx} onNavigate={() => closeDrawer(false)}>
            Projects
          </DrawerLink>
          <DrawerLink href="/contact" current={pathname === "/contact"} isCx={isCx} onNavigate={() => closeDrawer(false)}>
            Contact
          </DrawerLink>
        </nav>

        <div className="mt-auto p-6">
          <Link
            href="/contact"
            onClick={() => closeDrawer(false)}
            className="flex min-h-[48px] items-center justify-center rounded-sm px-6 font-bold transition-colors bg-brand-sky text-white hover:bg-brand-navy"
          >
            Discuss Your Project
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavDropdown({
  id,
  label,
  items,
  open,
  onOpenChange,
  triggerClass,
  linkClass,
  pathname,
  activeBar,
  panelClass,
}: {
  id: string;
  label: string;
  items: NavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClass: string;
  linkClass: (href: string) => string;
  pathname: string;
  activeBar: React.ReactNode;
  panelClass: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = `nav-menu-${id}`;

  return (
    <div
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpenChange(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onOpenChange(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onOpenChange(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          onOpenChange(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${triggerClass} gap-1`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        {activeBar}
      </button>
      <div
        id={panelId}
        className={`absolute left-0 top-full z-50 pt-2 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className={`min-w-[280px] bg-white py-2 ${panelClass}`}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkClass(item.href)}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => onOpenChange(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DrawerGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b py-3">
      <p className="px-6 pb-1 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">{title}</p>
      {children}
    </div>
  );
}

function DrawerLink({
  href,
  current,
  isCx,
  nested = false,
  onNavigate,
  children,
}: {
  href: string;
  current: boolean;
  isCx: boolean;
  nested?: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const activeColor = "text-brand-sky";
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={`flex min-h-[48px] items-center gap-3 px-6 transition-colors hover:bg-gray-50 ${
        nested ? "pl-10 font-medium" : "border-b"
      } ${current ? activeColor : ""}`}
    >
      {current && <span aria-hidden="true" className="h-4 w-0.5 bg-brand-sky" />}
      {children}
    </Link>
  );
}
