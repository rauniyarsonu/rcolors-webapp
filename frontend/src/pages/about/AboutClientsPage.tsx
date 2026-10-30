import { MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ClientLogoMarquee, { CLIENT_LOGO_ROWS } from "@/components/ui/ClientLogoMarquee";
import Marquee from "@/components/ui/Marquee";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutNav } from "@/config/aboutNav";

export default function ClientsPage() {

  const testimonials = [
    {
      id: 1,
      company: "Shukhwani Developers",
      location: "Pimple Saudagar, Pune",
      heading: "Flawless 10-Day Slab Cycles",
      content: "They handled the 1st to 7th floor civil execution with complete ownership. Maintained a strict 10-day slab cycle, enforced site safety, and required minimal supervision. Clean, dependable turnkey work."
    },
    {
      id: 2,
      company: "Malpani Group",
      location: "Kalewadi, Pune",
      heading: "Seamless High-Rise Logistics",
      content: "Executing 12 floors in a tight urban location is tough, but their logistics and concrete quality control were seamless. Delivered flawless column alignment across all levels right on schedule."
    },
    {
      id: 3,
      company: "Kasturi Developers",
      location: "Warje, Pune",
      heading: "Pinpoint Line-Level Accuracy",
      content: "Premium finishing starts with straight civil cores. Their 1st to 6th floor execution showed perfect line-level accuracy and beam geometry, making our MEP and plastering work effortless."
    },
    {
      id: 4,
      company: "Rohan Group",
      location: "Wakad, Pune",
      heading: "Near-Zero Re-Work Record",
      content: "Rohan Group has zero tolerance for quality lapses. Across all 10 floors, their shuttering and dimensional accuracy were so precise that re-work was practically zero. Excellent concrete finishing throughout."
    },
    {
      id: 5,
      company: "Balaji Construction",
      location: "Rajajipuram, Lucknow",
      heading: "Our Go-To Execution Partner",
      content: "After Tower A, bringing them on for BCC Gravity’s 1st to 6th floors was an easy choice. Reliable slab cycles, strict safety protocols, and quick adaptation to structural revisions."
    },
    {
      id: 6,
      company: "Rainbow Housing",
      location: "Bawdhan, Pune",
      heading: "Under 2% Material Wastage",
      content: "Their team kept labor productivity consistent across the entire 12-storey scope. Material wastage was strictly under 2%, and their daily progress tracking kept our engineering team in complete sync."
    },
    {
      id: 7,
      company: "Akashganga Infra",
      location: "Kandwa, Varanasi",
      heading: "Ahead of Baseline Schedule",
      content: "Executing 49 flats with high speed and structural integrity requires exceptional site management. They completed the masonry and RCC structure ahead of our baseline schedule."
    },
    {
      id: 8,
      company: "Balaji Construction",
      location: "Arjunganj, Lucknow",
      heading: "Zero MEP Slab Re-Coring",
      content: "Managing structural work for an 80-flat block takes serious capacity. They balanced speed with quality, coordinating smoothly with our MEP teams to ensure zero slab re-coring."
    },
    {
      id: 9,
      company: "Omaxe Limited",
      location: "Arjunganj, Lucknow",
      heading: "Stellar High-Rise Competence",
      content: "Executing high-rise civil work up to 20 floors demands deep technical competence in crane logistics and safety. They handled the vertical progression smoothly with stellar QA standards."
    },
    {
      id: 10,
      company: "NIP Housing",
      location: "DLW, Varanasi",
      heading: "Aggressive Targets, Uncompromised Quality",
      content: "On Grand Wood (12 floors), they consistently met aggressive weekly slab targets without compromising material testing or safety. A top-tier execution partner for high-rise projects."
    }
  ];

  const getInitials = (company: string) =>
    company
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("");

  const testimonialCards = testimonials.map((testimonial) => (
    <article
      key={testimonial.id}
      className="group relative flex h-full w-[min(85vw,24rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-7 shadow-[0_1px_3px_rgba(15,60,99,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-12px_rgba(15,60,99,0.25)] sm:p-8"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-navy to-brand-sky" aria-hidden="true" />

      <h3 className="mb-3 text-lg font-bold leading-snug text-brand-navy sm:text-xl">{testimonial.heading}</h3>

      <p className="mb-8 flex-grow text-[15px] leading-relaxed text-gray-600">{testimonial.content}</p>

      <footer className="mt-auto flex items-center gap-4 border-t border-gray-100 pt-5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-sm font-bold tracking-wide text-white"
          aria-hidden="true"
        >
          {getInitials(testimonial.company)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-brand-navy">{testimonial.company}</p>
          <p className="mt-0.5 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0 text-brand-sky" aria-hidden="true" />
            <span className="truncate">{testimonial.location}</span>
          </p>
        </div>
      </footer>
    </article>
  ));

  return (
    <div className="w-full">
      <PageHeader titlePart1="OUR" titlePart2="CLIENTS" subNavItems={aboutNav} subNavLabel="About" />
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-white">
        <div className="site-container">
          <p className="mx-auto mb-8 max-w-2xl text-center text-base text-gray-600 md:mb-12 md:text-lg">
            We are proud to collaborate with respected clients and development partners. Their trust reflects our commitment to quality, transparency, and long-term relationships.
          </p>

          <ClientLogoMarquee rows={CLIENT_LOGO_ROWS} />

          {/* Testimonials Section */}
          <div className="mt-16 md:mt-24" data-aos="fade-up" data-aos-duration="1000">
            <SectionHeading title="Client Success Stories" className="mb-8 md:mb-12">
              <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
                Don&apos;t just take our word for it. Here&apos;s what our esteemed partners have to say about our execution and commitment to quality.
              </p>
            </SectionHeading>
            <Marquee rows={[{ items: testimonialCards }]} secondsPerItem={12} />
          </div>
        </div>
      </section>
    </div>
  );
}
