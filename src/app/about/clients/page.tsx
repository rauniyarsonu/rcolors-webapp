"use client";

import Image from "next/image";
import { Quote, MapPin, Building2 } from "lucide-react";
import clientsData from "@/data/clients.json";
import PageHeader from "@/components/PageHeader";

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

  return (
    <div className="w-full">
      <PageHeader
        titlePart1="OUR"
        titlePart2="CLIENTS"
        subNavItems={[
          { name: 'About Company', href: '/about' },
          { name: 'Mission & Vision', href: '/about/mission' },
          { name: 'Clients', href: '/about/clients' },
        ]}
      />
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are proud to collaborate with respected clients and development partners. Their trust reflects our commitment to quality, transparency, and long-term relationships.
            </p>
          </div>

          {/* Marquee rows */}
          <div className="relative w-full overflow-hidden max-w-full group py-4">
            {/* Row 1 — slides left */}
            <div className="flex w-max animate-marquee-left group-hover:[animation-play-state:paused] mb-6 gap-6 pl-6">
              {[...clientImages, ...clientImages, ...clientImages].map((imgNum, idx) => (
                <div key={`r1-${imgNum}-${idx}`} className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center h-36 w-60 hover:shadow-lg transition-all duration-300 flex-shrink-0">
                  <div className="relative w-full h-20 mb-2">
                    <Image src={`/images/${imgNum}.jpg`} alt={`Client ${imgNum}`} fill sizes="240px" className="object-contain transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 — slides right */}
            <div className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused] gap-6 pl-6">
              {[...clientImages, ...clientImages, ...clientImages].map((imgNum, idx) => (
                <div key={`r2-${imgNum}-${idx}`} className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center h-36 w-60 hover:shadow-lg transition-all duration-300 flex-shrink-0">
                  <div className="relative w-full h-20 mb-2">
                    <Image src={`/images/${imgNum}.jpg`} alt={`Client ${imgNum}`} fill sizes="240px" className="object-contain transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Testimonials Section */}
          <div className="mt-24" data-aos="fade-up" data-aos-duration="1000">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-brand-navy mb-4">Client Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don&apos;t just take our word for it. Here&apos;s what our esteemed partners have to say about our execution and commitment to quality.
              </p>
            </div>

            {/* Sliding Testimonials container */}
            <div className="relative w-full overflow-x-auto max-w-full group py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              <style dangerouslySetInnerHTML={{ __html: `.testimonial-scroll::-webkit-scrollbar { display: none; }` }} />
              <div className="flex w-max animate-marquee-left group-hover:[animation-play-state:paused] gap-6 pl-6">
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
                <div key={`test-${testimonial.id}-${idx}`} className="w-[320px] md:w-[420px] flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-brand-sky/10 text-brand-sky border border-brand-sky/20">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {testimonial.location}
                    </span>
                    <Quote className="text-brand-sky/30 group-hover:text-brand-sky/50 transition-colors w-12 h-12 -mt-2 -mr-2" />
                  </div>
                  
                  <h3 className="text-[22px] font-bold text-brand-navy mb-4 leading-snug">
                    {testimonial.heading}
                  </h3>
                  
                  <p className="text-gray-600 italic mb-8 relative z-10 flex-grow text-[15px] leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  
                  <div className="mt-auto border-t border-gray-100 pt-5">
                    <h4 className="font-bold text-brand-navy">{testimonial.name}</h4>
                    <p className="text-[13px] text-brand-sky font-medium mt-0.5">{testimonial.role}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{testimonial.company}</p>
                    <p className="text-[11px] text-gray-400 mt-2 flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1.5 text-brand-sky" />
                      {testimonial.project}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
