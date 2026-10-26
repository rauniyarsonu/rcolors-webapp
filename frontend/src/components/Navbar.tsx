import { useState, useEffect, useRef, useCallback, useId } from "react";
import { usePathname } from "@/lib/navigation";
import Link from "@/components/ui/Link";
import Image from "@/components/ui/Image";
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

// Matches Tailwind's lg breakpoint, where the desktop nav takes over from the drawer
const DESKTOP_QUERY = "(min-width: 1024px)";

// Elements inside the drawer that can currently take focus (skips collapsed accordion links)
const getFocusable = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden",
  );

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

  // Drawer: lock scroll, move focus in, trap Tab, close on Escape or when the viewport reaches desktop width
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.overflow, body: body.style.overflow, pad: body.style.paddingRight };
    // Keep the page from shifting when a desktop-style scrollbar disappears
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    getFocusable(drawer)[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      } else if (e.key === "Tab") {
        const items = getFocusable(drawer);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!drawer.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (e: MediaQueryListEvent) => e.matches && closeDrawer(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
      body.style.paddingRight = prev.pad;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
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
  const focusRingClass = isTransparent
    ? "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy";
  const dropdownLinkClass = (href: string) =>
    `flex min-h-[44px] items-center px-6 text-[15px] font-medium transition-colors hover:text-brand-sky focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-navy ${
      pathname === href ? "text-brand-sky font-semibold" : ""
    }`;

  const navLinkClass = `relative flex min-h-[44px] min-w-11 items-center justify-center rounded-sm transition-colors ${hoverClass} ${focusRingClass}`;

  const activeBar = (show: boolean) =>
    show ? <span aria-hidden="true" className={`absolute -bottom-0.5 left-0 right-0 h-0.5 ${indicatorClass}`} /> : null;

  return (
    <header
      className={`w-full z-50 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${headerPosClass} ${headerBgClass} ${
        isCx ? "cx" : ""
      } ${isCx && isTransparent ? "cx-on-dark" : ""}`}
    >
      <div className="site-container flex h-16 items-center justify-between gap-3 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className={`flex min-w-0 shrink-0 items-center gap-2 rounded-sm sm:gap-3 xl:gap-4 ${focusRingClass}`}
          aria-label="R Colors Group home"
        >
          {/* icon.png is a 2000×2000 canvas with the mark at roughly x 480–1517, y 543–1311.
              The box frames x 450–1550, y 520–1335, and the image is scaled up inside it,
              so only transparent padding is clipped. */}
          <span className="block shrink-0 rounded-md">
            <span className="relative block aspect-[1100/815] h-10 overflow-hidden sm:h-12 lg:h-[52px]">
              <Image
                src="/images/icon.png"
                alt=""
                priority
                className="absolute left-[-40.91%] top-[-63.8%] h-[245.4%] w-[181.82%] max-w-none object-contain"
              />
            </span>
          </span>
          <span className="whitespace-nowrap font-heading text-[clamp(1.2rem,0.9rem+1.6vw,1.875rem)] font-bold tracking-tight lg:text-2xl xl:text-3xl 2xl:text-4xl">
            <span className={logoRedClass}>R </span>
            <span className={logoGreenClass}>Colors Group</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 xl:gap-8">
          {/* Desktop Nav */}
          <nav
            aria-label="Main"
            className={`hidden items-center gap-5 whitespace-nowrap text-[15px] font-semibold lg:flex xl:gap-8 xl:text-base ${textColorClass}`}
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
              align="right"
            />

            <Link href="/projects" className={navLinkClass} aria-current={pathname === "/projects" ? "page" : undefined}>
              Projects
              {activeBar(isActive("/projects"))}
            </Link>
            <Link href="/careers" className={navLinkClass} aria-current={pathname === "/careers" ? "page" : undefined}>
              Careers
              {activeBar(isActive("/careers"))}
            </Link>
            {/* From xl only: at lg (1024px) the row doesn't fit it, and "Discuss Your Project" already links to /contact */}
            <Link href="/contact" className={`${navLinkClass} hidden xl:flex`} aria-current={pathname === "/contact" ? "page" : undefined}>
              Contact
              {activeBar(isActive("/contact"))}
            </Link>
          </nav>

          <Link
            href="/contact"
            className={`hidden min-h-[44px] items-center whitespace-nowrap rounded-sm px-4 text-sm font-bold transition-colors lg:inline-flex xl:px-6 xl:text-base ${ctaClass} ${focusRingClass}`}
          >
            Discuss Your Project
          </Link>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            className={`-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm lg:hidden ${textColorClass} ${focusRingClass}`}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-drawer"
            aria-haspopup="dialog"
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
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,380px)] flex-col overflow-y-auto overscroll-contain bg-white pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] shadow-xl duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          // Visibility flips instantly on open (so focus can move in) and waits for the slide on close
          isMobileMenuOpen ? "visible translate-x-0 transition-transform" : "invisible translate-x-full transition-[transform,visibility]"
        } ${isCx ? "text-cx-ink" : "text-brand-navy"}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">Menu</span>
          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy"
            aria-label="Close menu"
            onClick={() => closeDrawer()}
          >
            <X size={26} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col font-semibold">
          <DrawerLink href="/" current={pathname === "/"} onNavigate={() => closeDrawer(false)}>
            Home
          </DrawerLink>
          <DrawerAccordion title="About Us" items={aboutItems} pathname={pathname} active={isActive("/about")} onNavigate={() => closeDrawer(false)} />
          <DrawerAccordion
            title="Our Businesses"
            items={businessItems}
            pathname={pathname}
            active={isActive("/businesses")}
            onNavigate={() => closeDrawer(false)}
          />
          <DrawerLink href="/projects" current={isActive("/projects")} onNavigate={() => closeDrawer(false)}>
            Projects
          </DrawerLink>
          <DrawerLink href="/careers" current={isActive("/careers")} onNavigate={() => closeDrawer(false)}>
            Careers
          </DrawerLink>
          <DrawerLink href="/contact" current={pathname === "/contact"} onNavigate={() => closeDrawer(false)}>
            Contact
          </DrawerLink>
        </nav>

        <div className="mt-auto p-6">
          <Link
            href="/contact"
            onClick={() => closeDrawer(false)}
            className="flex min-h-[48px] items-center justify-center rounded-sm bg-brand-sky px-6 font-bold text-white transition-colors hover:bg-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
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
  align = "left",
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
  align?: "left" | "right";
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `nav-menu-${id}`;

  // ArrowDown on the trigger opens the menu and moves focus to its first link
  const focusFirstLink = () => {
    onOpenChange(true);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus());
  };

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
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusFirstLink();
          }
        }}
      >
        {label}
        <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        {activeBar}
      </button>
      <div
        id={panelId}
        ref={panelRef}
        className={`absolute top-full z-50 pt-2 duration-200 motion-reduce:transition-none ${
          align === "right" ? "right-0 xl:left-0 xl:right-auto" : "left-0"
        } ${
          // Visible immediately on open (so ArrowDown can focus a link), hidden only after the fade on close
          open
            ? "visible translate-y-0 opacity-100 transition-[opacity,transform]"
            : "invisible -translate-y-1 opacity-0 transition-[opacity,transform,visibility]"
        }`}
      >
        <ul className={`min-w-[260px] bg-white py-2 xl:min-w-[280px] ${panelClass}`}>
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

/** Tap-to-expand group in the mobile drawer. Starts open when the current page lives inside it. */
function DrawerAccordion({
  title,
  items,
  pathname,
  active,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  active: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(active);
  const panelId = useId();

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <div className="border-b">
      <button
        type="button"
        className={`flex min-h-[52px] w-full items-center justify-between gap-3 px-6 text-left transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-navy ${
          active ? "text-brand-sky" : ""
        }`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* grid-rows 0fr -> 1fr animates to the content's natural height. Collapsed: invisible keeps links out of the tab order.
          Open: no `visible` class, so the closed drawer's hidden visibility still applies to these links. */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-2">
            {items.map((item) => (
              <DrawerLink key={item.href} href={item.href} current={pathname === item.href} nested onNavigate={onNavigate}>
                {item.name}
              </DrawerLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DrawerLink({
  href,
  current,
  nested = false,
  onNavigate,
  children,
}: {
  href: string;
  current: boolean;
  nested?: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={`flex items-center gap-3 px-6 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-navy ${
        nested ? "min-h-[48px] pl-10 font-medium" : "min-h-[52px] border-b"
      } ${current ? "text-brand-sky" : ""}`}
    >
      {current && <span aria-hidden="true" className="h-4 w-0.5 bg-brand-sky" />}
      {children}
    </Link>
  );
}
