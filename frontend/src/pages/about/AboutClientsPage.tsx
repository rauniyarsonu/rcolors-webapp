import { Quote, MapPin, Building2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ClientLogoMarquee from "@/components/ui/ClientLogoMarquee";
import Marquee from "@/components/ui/Marquee";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutNav } from "@/config/aboutNav";

export default function ClientsPage() {
  const clientImages = Array.from({ length: 22 }, (_, i) => i + 1);

  const testimonials = [
    {
      id: 1,
      name: "Milind Kulkarni",
      role: "Project Head",
      company: "Shukhwani Developers",
      project: "Palm Breeze (1st–7th Floor)",
      location: "Pimple Saudagar, Pune",
      heading: '"Flawless 10-Day Slab Cycles"',
      content: "They handled the 1st to 7th floor civil execution with complete ownership. Maintained a strict 10-day slab cycle, enforced site safety, and required minimal supervision. Clean, dependable turnkey work."
    },
    {
      id: 2,
      name: "Aniruddha Malpani",
      role: "Vice President (Projects)",
      company: "Malpani Group",
      project: "Malpani Greens (1st–12th Floor)",
      location: "Kalewadi, Pune",
      heading: '"Seamless High-Rise Logistics"',
      content: "Executing 12 floors in a tight urban location is tough, but their logistics and concrete quality control were seamless. Delivered flawless column alignment across all levels right on schedule."
    },
    {
      id: 3,
      name: "Abhijit Kasturi",
      role: "Director – Operations",
      company: "Kasturi Developers",
      project: "Kasturi Classic (1st–6th Floor)",
      location: "Warje, Pune",
      heading: '"Pinpoint Line-Level Accuracy"',
      content: "Premium finishing starts with straight civil cores. Their 1st to 6th floor execution showed perfect line-level accuracy and beam geometry, making our MEP and plastering work effortless."
    },
    {
      id: 4,
      name: "Suresh Deshmukh",
      role: "Senior VP – Quality",
      company: "Rohan Group",
      project: "Rohan Tarang II A (1st–10th Floor)",
      location: "Wakad, Pune",
      heading: '"Near-Zero Re-Work Record"',
      content: "Rohan Group has zero tolerance for quality lapses. Across all 10 floors, their shuttering and dimensional accuracy were so precise that re-work was practically zero. Excellent concrete finishing throughout."
    },
    {
      id: 5,
      name: "Vikas Singh",
      role: "Project Director",
      company: "Balaji Construction",
      project: "BCC Gravity (1st–6th Floor)",
      location: "Rajajipuram, Lucknow",
      heading: '"Our Go-To Execution Partner"',
      content: "After Tower A, bringing them on for BCC Gravity’s 1st to 6th floors was an easy choice. Reliable slab cycles, strict safety protocols, and quick adaptation to structural revisions."
    },
    {
      id: 6,
      name: "D. S. Patil",
      role: "GM (Technical)",
      company: "Rainbow Housing",
      project: "Pebbles (1st–12th Floor)",
      location: "Bawdhan, Pune",
      heading: '"Under 2% Material Wastage"',
      content: "Their team kept labor productivity consistent across the entire 12-storey scope. Material wastage was strictly under 2%, and their daily progress tracking kept our engineering team in complete sync."
    },
    {
      id: 7,
      name: "R. K. Upadhyay",
      role: "Chief Project Officer",
      company: "Akashganga Infra",
      project: "Akashganga (49 Flats Structural Scope)",
      location: "Kandwa, Varanasi",
      heading: '"Ahead of Baseline Schedule"',
      content: "Executing 49 flats with high speed and structural integrity requires exceptional site management. They completed the masonry and RCC structure ahead of our baseline schedule."
    },
    {
      id: 8,
      name: "Alok Srivastava",
      role: "GM (Projects)",
      company: "Balaji Construction",
      project: "BCC Tower A Block (80 Flats)",
      location: "Arjunganj, Lucknow",
      heading: '"Zero MEP Slab Re-Coring"',
      content: "Managing structural work for an 80-flat block takes serious capacity. They balanced speed with quality, coordinating smoothly with our MEP teams to ensure zero slab re-coring."
    },
    {
      id: 9,
      name: "Rajiv Tandon",
      role: "VP (Contracts)",
      company: "Omaxe Limited",
      project: "Omaxe R 2 (1st–20th Floor)",
      location: "Arjunganj, Lucknow",
      heading: '"Stellar High-Rise Competence"',
      content: "Executing high-rise civil work up to 20 floors demands deep technical competence in crane logistics and safety. They handled the vertical progression smoothly with stellar QA standards."
    },
    {
      id: 10,
      name: "Vinay Rai",
      role: "Managing Director",
      company: "NIP Housing",
      project: "Grand Wood (1st–12th Floor)",
      location: "DLW, Varanasi",
      heading: '"Aggressive Targets, Uncompromised Quality"',
      content: "On Grand Wood (12 floors), they consistently met aggressive weekly slab targets without compromising material testing or safety. A top-tier execution partner for high-rise projects."
    }
  ];

  const testimonialCards = testimonials.map((testimonial) => (
    <article
      key={testimonial.id}
      className="relative flex w-[min(85vw,26rem)] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <span className="inline-flex min-w-0 items-center rounded-md border border-brand-sky/20 bg-brand-sky/10 px-3 py-1.5 text-xs font-semibold text-brand-sky">
          <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{testimonial.location}</span>
        </span>
        <Quote className="-mr-2 -mt-2 h-12 w-12 shrink-0 text-brand-sky/30" aria-hidden="true" />
      </div>

      <h3 className="mb-4 text-xl font-bold leading-snug text-brand-navy sm:text-[22px]">{testimonial.heading}</h3>

      <p className="relative z-10 mb-8 flex-grow text-base italic leading-relaxed text-gray-600 sm:text-[15px]">&ldquo;{testimonial.content}&rdquo;</p>

      <div className="mt-auto border-t border-gray-100 pt-5">
        <p className="font-bold text-brand-navy">{testimonial.name}</p>
        <p className="mt-0.5 text-sm font-medium text-brand-sky">{testimonial.role}</p>
        <p className="mt-0.5 text-sm text-gray-500">{testimonial.company}</p>
        <p className="mt-2 flex items-center text-xs text-gray-500">
          <Building2 className="mr-1.5 h-3.5 w-3.5 shrink-0 text-brand-sky" aria-hidden="true" />
          {testimonial.project}
        </p>
      </div>
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

          <ClientLogoMarquee rows={[clientImages, clientImages]} />

          {/* Testimonials Section */}
          <div className="mt-16 md:mt-24" data-aos="fade-up" data-aos-duration="1000">
            <SectionHeading title="Client Success Stories" className="mb-8 md:mb-12">
              <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
                Don&apos;t just take our word for it. Here&apos;s what our esteemed partners have to say about our execution and commitment to quality.
              </p>
            </SectionHeading>
            <Marquee name="testimonials" rows={[{ items: testimonialCards }]} secondsPerItem={12} />
          </div>
        </div>
      </section>
    </div>
  );
}
