import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/construction/Reveal";

const highlights = [
  { title: "Precision", desc: "Careful surface preparation and attention to detail on every finish." },
  { title: "Professional Workmanship", desc: "Experienced teams working to defined quality standards." },
  { title: "Timely Execution", desc: "Structured processes that keep each project on schedule." },
  { title: "Lasting Value", desc: "Durable materials and finishes built for long-term performance." },
];

export default function Intro() {
  return (
    <section id="who-we-are" aria-labelledby="intro-title" className="section-y w-full scroll-mt-20 bg-white">
      <div className="site-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <SectionHeading id="intro-title" eyebrow="Who We Are" title="Quality Finishing That Lasts. Engineered for Modern Living." bar align="left" />
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 max-w-[62ch] text-base leading-relaxed text-gray-600 md:text-lg">
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
                className="group mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-es-accent-strong transition-colors hover:text-brand-navy"
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
            <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-xl lg:aspect-[4/5]">
              <Image
                src="/images/Rcolors1.jpg"
                alt="Finished interior space completed by the R Colors team"
                fill
                sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {highlights.map((item, idx) => (
            <li key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <Reveal delay={idx * 80}>
                <span className="font-heading text-sm font-black text-es-accent-strong">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold text-brand-navy">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{item.desc}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
