import { useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "@/components/ui/Link";
import Reveal from "@/components/construction/Reveal";
import { ESTATE } from "@/config/estate/site";
import { ArrowRight, BadgeCheck, Building2, Check, Handshake, LandPlot, MessageCircle, TrendingUp, type LucideIcon } from "lucide-react";

interface EstateService {
  index: string;
  icon: LucideIcon;
  /** Tab label on small screens */
  short: string;
  title: string;
  /** One line under the title in the tab list */
  tagline: string;
  desc: string;
  points: string[];
  /** One short trust line shown with a badge */
  proof: string;
  ctaText: string;
  ctaHref: string;
}

const services: EstateService[] = [
  {
    index: "01",
    icon: Building2,
    short: "Sales",
    title: "Residential & Commercial Sales",
    tagline: "Plots, homes, flats and shops",
    desc: "Buy with confidence: every plot, home and shop we list comes with clear title and complete paperwork.",
    points: ["Plots, houses & flats", "Shops & commercial spaces", "Ready-to-move options", "Verified listings"],
    proof: "Verified listings, proper documentation",
    ctaText: "Browse Properties",
    ctaHref: "#es-results",
  },
  {
    index: "02",
    icon: Handshake,
    short: "Source Selling",
    title: "Property Source Selling & Channel Partner Services",
    tagline: "For developers and builders",
    desc: "We market your residential and commercial projects and connect you with genuine buyers for smooth, efficient deals.",
    points: ["Project marketing", "Property sourcing", "Channel sales", "Genuine buyer connections"],
    proof: "Project marketing to closing",
    ctaText: "Partner With Us",
    ctaHref: "/contact",
  },
  {
    index: "03",
    icon: TrendingUp,
    short: "Investment",
    title: "Investment Guidance",
    tagline: "Property for long-term growth",
    desc: "Grow your wealth with property: we shortlist high-potential locations and plan for strong long-term returns.",
    points: ["Investment consultancy", "High-potential property selection", "Long-term growth planning", "Expert market insights"],
    proof: "Strategic, long-term planning",
    ctaText: "Get Investment Advice",
    ctaHref: "/contact",
  },
  {
    index: "04",
    icon: LandPlot,
    short: "Land Development",
    title: "Partnership & Land Development",
    tagline: "For landowners and developers",
    desc: "Own land? We bring landowners and developers together to create profitable development opportunities and joint ventures.",
    points: ["Joint development partnerships", "Landowner & developer tie-ups", "Profitable development opportunities", "Joint venture planning"],
    proof: "Landowner & developer tie-ups",
    ctaText: "Discuss Your Land",
    ctaHref: "/contact",
  },
];

const PANEL_ID = "services-panel";
const whatsappHref = `https://wa.me/91${ESTATE.company.phones[0]}`;

export default function Services() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const service = services[active];

  // Roving tabindex: arrows/Home/End move and activate; the list is vertical on desktop, horizontal on mobile
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = services.length - 1;
    const forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
    const next = forward ? (i === last ? 0 : i + 1) : back ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    refs.current[next]?.focus();
    setActive(next);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="section-y w-full scroll-mt-20 bg-gray-50">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-3xl">
            <SectionHeading
              id="services-title"
              eyebrow="Our Services"
              title="Complete Real Estate Solutions, Under One Roof."
              subtitle="Buying, selling, investing or developing land, one team handles it end to end."
              bar
              align="left"
            />
          </Reveal>
          <a
            href="#es-results"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-es-accent-strong transition-colors hover:text-brand-navy"
          >
            View all properties
            <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </div>

        <Reveal className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:gap-8">
          <div role="tablist" aria-label="Our services" className="es-scroll-x -mx-4 flex gap-2 px-4 lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-0">
            {services.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.index}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  id={`services-tab-${s.index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={PANEL_ID}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`group relative flex min-h-12 shrink-0 items-center gap-4 rounded-xl border px-5 text-left transition-all duration-300 motion-reduce:transition-none lg:p-6 ${
                    selected
                      ? "border-brand-sky bg-sky-50 shadow-lg shadow-brand-sky/20 ring-1 ring-brand-sky lg:translate-x-3 motion-reduce:lg:translate-x-0"
                      : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-es-accent-strong/40 hover:shadow-md motion-reduce:hover:translate-y-0"
                  }`}
                >
                  {/* Pointer from the active tab into the panel */}
                  <span
                    aria-hidden="true"
                    className={`absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-brand-sky bg-sky-50 transition-opacity duration-300 lg:block ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 lg:flex ${
                      selected ? "bg-brand-sky text-white" : "bg-gray-100 text-es-accent-strong group-hover:bg-brand-sky/15"
                    }`}
                  >
                    <s.icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold lg:hidden ${selected ? "text-es-accent-strong" : "text-gray-600"}`}>{s.short}</span>
                    <span className={`hidden font-heading text-lg font-bold leading-snug lg:block text-brand-navy`}>
                      {s.title}
                    </span>
                    <span className={`mt-1 hidden text-sm lg:block ${selected ? "text-gray-600" : "text-gray-500"}`}>{s.tagline}</span>
                  </span>
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className={`hidden shrink-0 transition-all duration-300 lg:block ${
                      selected ? "translate-x-0 text-es-accent-strong opacity-100" : "-translate-x-2 text-gray-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-labelledby={`services-tab-${service.index}`}
            tabIndex={0}
            className="relative overflow-hidden rounded-2xl bg-brand-navy p-7 text-white shadow-xl sm:p-10 lg:col-span-7 lg:p-12"
          >
            {/* Gold line that sweeps across each time a service is picked */}
            <span
              key={`sweep-${service.index}`}
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left animate-sweep-x bg-gradient-to-r from-brand-gold to-brand-sky motion-reduce:animate-none"
            />
            {/* Soft glow for depth */}
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-brand-sky/20 blur-3xl" />

            <div key={service.index} className="relative flex h-full animate-fade-up flex-col motion-reduce:animate-none">
              <service.icon size={40} strokeWidth={1.25} aria-hidden="true" className="text-brand-sky" />

              <h3 className="mt-6 text-balance font-heading text-2xl font-bold leading-snug sm:text-3xl">{service.title}</h3>
              <p className="mt-4 max-w-[56ch] leading-relaxed text-gray-300">{service.desc}</p>

              <ul className="mt-8 grid gap-x-8 gap-y-4 border-t border-white/10 pt-8 sm:grid-cols-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm font-medium text-gray-100">
                    <Check size={16} strokeWidth={2.5} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-gold" />
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-8 inline-flex items-center gap-2 text-sm text-gray-300">
                <BadgeCheck size={18} aria-hidden="true" className="text-brand-gold" />
                {service.proof}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                <CtaLink
                  href={service.ctaHref}
                  className="group/cta inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-6 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-sky hover:text-white"
                >
                  {service.ctaText}
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover/cta:translate-x-1 motion-reduce:transition-none" />
                </CtaLink>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-bold text-white transition-colors hover:border-[#25D366] hover:bg-[#25D366]"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Same-page anchors use a plain <a>; routes go through the router Link */
function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return href.startsWith("#") ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
