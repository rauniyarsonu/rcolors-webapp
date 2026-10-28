import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "./Reveal";
import ServiceCard, { type ServiceItem } from "./ServiceCard";

const services: ServiceItem[] = [
  {
    index: "01",
    title: "Residential Construction",
    tagline: "Modern homes & communities engineered for safety, comfort, and longevity",
    desc: "A home is more than physical structure — it is an investment in lifestyle and safety. We construct multi-unit residential towers, gated communities, and bespoke villas with high-grade structural reinforcement, seismic compliance, and disciplined craftsmanship.",
    image: "/images/cd01.jpg",
    imageAlt: "Modern residential multi-story apartment towers with swimming pool and landscaped grounds",
    capabilities: [
      "Multi-Story Residential Towers",
      "Gated Communities & Luxury Villas",
      "Earthquake Safety & Solid Construction Standards",
      "Complete Construction from Start to Finish",
    ],
    ctaText: "Contact us for Residential Projects",
    ctaHref: "/contact",
  },
  {
    index: "02",
    title: "Commercial Construction",
    tagline: "Functional, scalable environments built to accelerate business performance",
    desc: "From corporate headquarters and IT workspaces to expansive retail spaces, we engineer commercial infrastructure that combines visual stature with functional efficiency, high-volume durability, and modern utility integration.",
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
    title: "Builder & Development",
    tagline: "Comprehensive property creation from raw land planning to turnkey handover",
    desc: "We lead the entire development lifecycle — identifying land potential, navigating regulatory approvals, coordinating master architecture, and executing structural delivery to maximize long-term real estate value.",
    image: "/images/cd03.jpg",
    imageAlt: "Architectural blueprint and construction development site overview",
    capabilities: [
      "Land Feasibility & Master Planning",
      "Regulatory Clearances & Approvals",
      "Partner Collaberations and End-to-End Building",
      "Quality-Controlled Phased Delivery",
    ],
    ctaText: "Consult on Development",
    ctaHref: "/contact",
  },
  {
    index: "04",
    title: "Project Management Consultancy (PMC)",
    tagline: "Independent oversight guaranteeing quality standards, cost rigor & timeliness",
    desc: "Our PMC team protects client investments through disciplined site supervision, rigorous material quality testing, schedule benchmarking, and cost optimization across every contractor and trade.",
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
      className="section-y w-full scroll-mt-20 bg-gray-50"
    >

      <div className="site-container">
        {/* Section Header */}
        <div className="max-w-3xl">
          <Reveal>
            <SectionHeading id="expertise-title" eyebrow="Our Core Expertise" title="Comprehensive Construction Solutions. Engineered for Longevity." bar align="left" />
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-gray-600 md:text-lg">
              We unite engineering rigor, vetted materials, and meticulous project governance to deliver residential,
              commercial, and turnkey development projects on time and to the highest standards.
            </p>
          </Reveal>
        </div>

        {/* 4 Architectural Cards */}
        <div className="mt-10 space-y-8 md:mt-16 md:space-y-10 lg:space-y-12">
          {services.map((service, idx) => (
            <ServiceCard key={service.index} service={service} flip={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
