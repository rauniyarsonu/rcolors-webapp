import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import ServiceCard, { type ServiceItem } from "./ServiceCard";

const services: ServiceItem[] = [
  {
    index: "01",
    total: "04",
    title: "Residential Construction",
    tagline: "Modern homes & communities engineered for safety, comfort, and longevity",
    desc: "A home is more than physical structure — it is an investment in lifestyle and safety. We construct multi-unit residential towers, gated communities, and bespoke villas with high-grade structural reinforcement, seismic compliance, and disciplined craftsmanship.",
    scopeBadge: "Civil & Structural Residential",
    image: "/images/cd01.jpg",
    imageAlt: "Modern residential multi-story apartment towers with swimming pool and landscaped grounds",
    capabilities: [
      "Multi-Story Residential Towers",
      "Gated Communities & Luxury Villas",
      "Seismic & Structural Safety Compliance",
      "Turnkey Civil Execution & Handover",
    ],
    ctaText: "Explore Residential Projects",
    ctaHref: "/projects?business=construction",
  },
  {
    index: "02",
    total: "04",
    title: "Commercial Construction",
    tagline: "Functional, scalable environments built to accelerate business performance",
    desc: "From corporate headquarters and IT workspaces to expansive retail spaces, we engineer commercial infrastructure that combines visual stature with functional efficiency, high-volume durability, and modern utility integration.",
    scopeBadge: "Commercial & Corporate Infrastructure",
    image: "/images/cd02.jpg",
    imageAlt: "Contemporary glass-facade corporate commercial building reflecting sky",
    capabilities: [
      "Corporate Headquarters & IT Parks",
      "Retail Centers & Commercial Plazas",
      "Advanced MEP & Fire Safety Systems",
      "Fast-Track Phased Execution",
    ],
    ctaText: "Explore Commercial Projects",
    ctaHref: "/projects?business=construction",
  },
  {
    index: "03",
    total: "04",
    title: "Builder & Development",
    tagline: "Comprehensive property creation from raw land planning to turnkey handover",
    desc: "We lead the entire development lifecycle — identifying land potential, navigating regulatory approvals, coordinating master architecture, and executing structural delivery to maximize long-term real estate value.",
    scopeBadge: "Land Acquisition to Key Handover",
    image: "/images/cd03.jpg",
    imageAlt: "Architectural blueprint and construction development site overview",
    capabilities: [
      "Land Feasibility & Master Planning",
      "Regulatory Clearances & Approvals",
      "Joint Venture & Turnkey Development",
      "Quality-Controlled Phased Delivery",
    ],
    ctaText: "Consult on Development",
    ctaHref: "/contact",
  },
  {
    index: "04",
    total: "04",
    title: "Project Management Consultancy (PMC)",
    tagline: "Independent oversight guaranteeing quality standards, cost rigor & timeliness",
    desc: "Our PMC team protects client investments through disciplined site supervision, rigorous material quality testing, schedule benchmarking, and cost optimization across every contractor and trade.",
    scopeBadge: "Independent QA/QC & Audit",
    image: "/images/cd04.jpg",
    imageAlt: "Civil engineers reviewing blueprints and project execution plans on site",
    capabilities: [
      "Site Supervision & Daily QA/QC Audits",
      "Milestone Scheduling & CPM Tracking",
      "BOQ Verification & Cost Optimization",
      "Contractor & Vendor Coordination",
    ],
    ctaText: "Inquire for PMC Services",
    ctaHref: "/contact",
  },
];

export default function Expertise() {
  return (
    <section
      id="expertise"
      aria-labelledby="expertise-title"
      className="relative bg-cx-paper py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Subtle architectural background grid line accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(var(--cx-ink)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--cx-ink)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      <div className="cx-container">
        {/* Section Header */}
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="02" label="Our Core Expertise" />
            <h2
              id="expertise-title"
              className="mt-6 text-balance font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-cx-ink"
            >
              Comprehensive Construction Solutions. Engineered for Longevity.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 text-[17px] leading-relaxed text-cx-muted md:text-lg max-w-[62ch]">
              We unite engineering rigor, vetted materials, and meticulous project governance to deliver residential,
              commercial, and turnkey development projects on time and to the highest standards.
            </p>
          </Reveal>
        </div>

        {/* 4 Architectural Cards */}
        <div className="mt-16 md:mt-24 space-y-12 md:space-y-16 lg:space-y-20">
          {services.map((service, idx) => (
            <ServiceCard key={service.index} service={service} flip={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
