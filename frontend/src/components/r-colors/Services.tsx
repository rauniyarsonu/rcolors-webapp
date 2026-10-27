import SectionLabel from "@/components/construction/SectionLabel";
import Reveal from "@/components/construction/Reveal";
import ServiceCard, { type ServiceItem } from "@/components/construction/ServiceCard";

const base = { total: "08", ctaText: "Inquire for Service", ctaHref: "/contact" };

const services: ServiceItem[] = [
  {
    ...base,
    index: "01",
    title: "Interior & Exterior Painting",
    desc: "We provide high-quality interior and exterior painting services for residential and commercial projects. Our finishes enhance both protection and visual appeal. Using premium materials and modern application techniques, we ensure smooth surfaces and long-lasting durability. Our team focuses on precision, surface preparation, and timely completion for flawless results.",
    scopeBadge: "Residential & Commercial",
    image: "/images/Rcolors-1.jpg",
    imageAlt: "Interior and exterior painting work by R Colors",
    capabilities: ["Premium Paints & Materials", "Thorough Surface Preparation", "Smooth, Long-Lasting Finishes"],
  },
  {
    ...base,
    index: "02",
    title: "POP & Gypsum Work",
    desc: "We deliver elegant POP and gypsum solutions for ceilings and decorative interiors. Our designs enhance structural appeal while adding a refined and modern finish to every space. From false ceilings to customized patterns, we ensure accurate installation and clean finishing. Our team focuses on detailed craftsmanship, proper alignment, and durable materials to maintain long-term strength and aesthetic consistency.",
    scopeBadge: "Ceilings & Decorative Interiors",
    image: "/images/Rcolors-2.jpg",
    imageAlt: "POP and gypsum false ceiling installation",
    capabilities: ["False Ceilings", "Customized Decorative Patterns", "Accurate Alignment & Clean Finishing"],
  },
  {
    ...base,
    index: "03",
    title: "Tiles & Marble Installation",
    desc: "We specialize in precise tile and marble installation for floors and walls. Our work combines strength with refined finishing and elegant surface detailing. Our team ensures proper alignment, secure fitting, and smooth surface finishing. We focus on durability, neat execution, and long-lasting performance to achieve premium results.",
    scopeBadge: "Floors & Walls",
    image: "/images/Rcolors-3.jpg",
    imageAlt: "Tile and marble flooring installation",
    capabilities: ["Floor & Wall Tiling", "Marble Installation", "Secure Fitting & Proper Alignment"],
  },
  {
    ...base,
    index: "04",
    title: "Waterproofing Solutions",
    desc: "We provide reliable waterproofing services to protect buildings from leakage and moisture damage. Our solutions increase structural lifespan. Using advanced materials and proven industry methods, we seal vulnerable areas effectively and precisely. Our approach ensures long-term protection and reduced future maintenance concerns.",
    scopeBadge: "Leakage & Moisture Protection",
    image: "/images/Rcolors-4.jpg",
    imageAlt: "Waterproofing treatment applied to a building surface",
    capabilities: ["Leakage & Moisture Prevention", "Advanced Sealing Materials", "Reduced Future Maintenance"],
  },
  {
    ...base,
    index: "05",
    title: "Furniture & Interior Work",
    desc: "We offer customized furniture and interior finishing solutions tailored to client requirements. Our work balances functionality and design. From modular units to complete interior setups, we use premium quality materials and skilled workmanship. We ensure long-term durability, smart space optimization, and elegant overall presentation.",
    scopeBadge: "Custom & Modular Interiors",
    image: "/images/Rcolors-5.jpg",
    imageAlt: "Custom furniture and finished interior",
    capabilities: ["Customized Furniture", "Modular Units & Full Interior Setups", "Smart Space Optimization"],
  },
  {
    ...base,
    index: "06",
    title: "Electrical Services",
    desc: "We handle safe and efficient electrical installations for residential and commercial projects. Our systems ensure reliable performance. Our team follows proper wiring standards and safety protocols with strict quality supervision. We deliver structured planning and smooth execution for long-term operational safety and dependable functionality.",
    scopeBadge: "Residential & Commercial",
    image: "/images/Rcolors-6.jpg",
    imageAlt: "Electrical wiring and installation work",
    capabilities: ["Standard-Compliant Wiring", "Safety Protocols & Supervision", "Structured Installation Planning"],
  },
  {
    ...base,
    index: "07",
    title: "Plumbing Services",
    desc: "We provide professional plumbing solutions for new construction and renovation projects. Our installations ensure efficient water flow and drainage. With careful planning and quality fittings, we prevent leakage and future maintenance issues effectively. Our work supports durability, safety standards, and seamless system functionality.",
    scopeBadge: "New Build & Renovation",
    image: "/images/Rcolors-7.jpg",
    imageAlt: "Plumbing installation and fittings",
    capabilities: ["Water Supply & Drainage", "Quality Fittings", "Leak Prevention"],
  },
  {
    ...base,
    index: "08",
    title: "Renovation & Repair Services",
    desc: "We offer renovation and repair solutions to upgrade and restore existing spaces. Our services improve structural strength and overall appearance. From surface corrections to complete refurbishment, we manage projects with precision and care at every stage. Our goal is to deliver enhanced value, improved functionality, and renewed durability.",
    scopeBadge: "Upgrade & Restore",
    image: "/images/Rcolors-8.jpg",
    imageAlt: "Renovated interior space after refurbishment",
    capabilities: ["Surface Corrections", "Complete Refurbishment", "Structural & Visual Upgrades"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden bg-cx-paper pb-20 md:pb-28 lg:pb-32"
    >
      {/* Subtle architectural background grid line accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(var(--cx-ink)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--cx-ink)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      <div className="cx-container border-t border-cx-ink/10 pt-12 md:pt-16 lg:pt-20">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="02" label="Our Services" />
            <h2
              id="services-title"
              className="mt-6 text-balance font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-cx-ink"
            >
              Comprehensive Interior &amp; Finishing Solutions.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-24 space-y-12 md:space-y-16 lg:space-y-20">
          {services.map((service, idx) => (
            <ServiceCard
              key={service.index}
              service={service}
              flip={idx % 2 === 1}
              capabilitiesLabel="Key Capabilities"
              ctaStyle="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
