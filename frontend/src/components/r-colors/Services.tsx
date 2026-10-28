import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/construction/Reveal";
import ServiceCard, { type ServiceItem } from "@/components/construction/ServiceCard";

const base = { ctaText: "Inquire for Service", ctaHref: "/contact" };

const services: ServiceItem[] = [
  {
    ...base,
    index: "01",
    title: "Interior & Exterior Painting",
    desc: "We provide high-quality interior and exterior painting services for residential and commercial projects. Our finishes enhance both protection and visual appeal. Using premium materials and modern application techniques, we ensure smooth surfaces and long-lasting durability. Our team focuses on precision, surface preparation, and timely completion for flawless results.",
    image: "/images/Rcolors-1.jpg",
    imageAlt: "Interior and exterior painting work by R Colors",
    capabilities: ["Premium Paints & Materials", "Expert Surface Detailing", "Smooth, Long-Lasting Finishes"],
  },
  {
    ...base,
    index: "02",
    title: "POP & Gypsum Work",
    desc: "We deliver elegant POP and gypsum solutions for ceilings and decorative interiors. Our designs enhance structural appeal while adding a refined and modern finish to every space. From false ceilings to customised patterns, we ensure accurate installation and clean finishing. Our team focuses on detailed craftsmanship, proper alignment, and durable materials to maintain long-term strength and aesthetic consistency.",
    image: "/images/Rcolors-2.jpg",
    imageAlt: "POP and gypsum false ceiling installation",
    capabilities: ["False Ceilings", "Customised Decorative Patterns", "Accurate Alignment & Clean Finishing"],
  },
  {
    ...base,
    index: "03",
    title: "Tiles & Marble Installation",
    desc: "We specialize in precise tile and marble installation for floors and walls. Our work combines strength with refined finishing and elegant surface detailing. Our team ensures proper alignment, secure fitting, and smooth surface finishing. We focus on durability, neat execution, and long-lasting performance to achieve premium results.",
    image: "/images/Rcolors-3.jpg",
    imageAlt: "Tile and marble flooring installation",
    capabilities: ["Floor & Wall Tiling", "Marble Installation", "Secure Fitting & Proper Alignment"],
  },
  {
    ...base,
    index: "04",
    title: "Waterproofing Solutions",
    desc: "We provide reliable waterproofing services to protect buildings from leakage and moisture damage. Our solutions increase structural lifespan. Using advanced materials and proven industry methods, we seal vulnerable areas effectively and precisely. Our approach ensures long-term protection and reduced future maintenance concerns.",
    image: "/images/waterproofing001.jpeg",
    imageAlt: "Waterproofing treatment applied to a building surface",
    capabilities: ["Leakage & Moisture Prevention", "Advanced Sealing Materials", "Reduced Future Maintenance"],
  },
  {
    ...base,
    index: "05",
    title: "Furniture & Interior Work",
    desc: "We offer customised furniture and interior finishing solutions tailored to client requirements. Our work balances functionality and design. From modular units to complete interior setups, we use premium quality materials and skilled workmanship. We ensure long-term durability, smart space optimization, and elegant overall presentation.",
    image: "/images/Rcolors-5.jpg",
    imageAlt: "Custom furniture and finished interior",
    capabilities: ["Customised Furniture", "Modular Units & Full Interior Setups", "Smart Space Optimization"],
  },
  {
    ...base,
    index: "06",
    title: "Electrical Services",
    desc: "We handle safe and efficient electrical installations for residential and commercial projects. Our systems ensure reliable performance. Our team follows proper wiring standards and safety protocols with strict quality supervision. We deliver structured planning and smooth execution for long-term operational safety and dependable functionality.",
    image: "/images/Rcolors-6.jpg",
    imageAlt: "Electrical wiring and installation work",
    capabilities: ["Standard-Compliant Wiring", "Safety Protocols & Supervision", "Structured Installation Planning"],
  },
  {
    ...base,
    index: "07",
    title: "Plumbing Services",
    desc: "We provide professional plumbing solutions for new construction and renovation projects. Our installations ensure efficient water flow and drainage. With careful planning and quality fittings, we prevent leakage and future maintenance issues effectively. Our work supports durability, safety standards, and seamless system functionality.",
    image: "/images/Rcolors-7.jpg",
    imageAlt: "Plumbing installation and fittings",
    capabilities: ["Water Supply & Drainage", "Quality Fittings", "Leak Prevention"],
  },
  {
    ...base,
    index: "08",
    title: "Renovation & Repair Services",
    desc: "We offer renovation and repair solutions to upgrade and restore existing spaces. Our services improve structural strength and overall appearance. From surface corrections to complete refurbishment, we manage projects with precision and care at every stage. Our goal is to deliver enhanced value, improved functionality, and renewed durability.",
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
      className="section-y w-full scroll-mt-20 bg-gray-50"
    >

      <div className="site-container">
        <div className="max-w-3xl">
          <Reveal>
            <SectionHeading id="services-title" eyebrow="Our Services" title="Comprehensive Interior & Finishing Solutions." bar align="left" />
          </Reveal>
        </div>

        <div className="mt-10 space-y-8 md:mt-16 md:space-y-10 lg:space-y-12">
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
