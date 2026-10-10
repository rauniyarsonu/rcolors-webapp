import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/construction/Reveal";
import SectionLabel from "@/components/construction/SectionLabel";

const highlights = [
  { title: "Precision", desc: "Careful surface preparation and attention to detail on every finish." },
  { title: "Professional Workmanship", desc: "Experienced teams working to defined quality standards." },
  { title: "Timely Execution", desc: "Structured processes that keep each project on schedule." },
  { title: "Lasting Value", desc: "Durable materials and finishes built for long-term performance." },
];

export default function Intro() {
  return (
    <section id="who-we-are" aria-labelledby="intro-title" className="bg-cx-paper py-24 md:py-32 lg:py-40">
      <div className="cx-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <SectionLabel index="01" label="Who We Are" />
              <h2
                id="intro-title"
                className="mt-6 text-balance font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-cx-ink"
              >
                Quality Finishing That Lasts. Engineered for Modern Living.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 max-w-[62ch] text-[17px] leading-relaxed text-cx-muted md:text-lg">
                <p>
                  R Colors delivers high-quality finishing and interior solutions designed to enhance durability,
                  functionality, and aesthetic appeal. We ensure precision, professional workmanship, and timely
                  execution across all projects. With experienced teams and structured processes, we focus on
                  delivering reliable results that meet client expectations. Our commitment to quality standards and
                  attention to detail ensures every project reflects excellence and long-term value.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-10 inline-flex min-h-[44px] items-center gap-3 border-b border-cx-ink/30 font-semibold text-cx-ink transition-colors hover:border-brand-sky hover:text-cx-accent-strong"
              >
                Talk to our team
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
            <figure className="relative mr-4 md:mr-6">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-4 translate-y-4 border border-brand-sky/70 md:translate-x-6 md:translate-y-6"
              />
              <div className="relative aspect-[4/5] overflow-hidden bg-cx-concrete">
                <Image
                  src="/images/Rcolors1.jpg"
                  alt="Finished interior space completed by the R Colors team"
                  fill
                  sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </Reveal>
        </div>

        <ul className="mt-20 grid grid-cols-1 border-t border-cx-ink/15 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
          {highlights.map((item, idx) => (
            <li
              key={item.title}
              className={`border-b border-cx-ink/10 py-7 md:py-8 lg:border-b-0 lg:px-8 lg:first:pl-0 ${
                idx % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
              } ${idx > 0 ? "lg:border-l" : ""}`}
            >
              <Reveal delay={idx * 80}>
                <span className="font-display text-sm font-bold text-brand-sky">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-cx-ink">{item.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-cx-muted">{item.desc}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
