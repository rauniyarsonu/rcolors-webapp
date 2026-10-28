import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const highlights = [
  { title: "Structural Strength", desc: "Sound structural work as the base of every building we deliver." },
  { title: "Modern Design", desc: "Contemporary, functional spaces planned around how they will be used." },
  { title: "Timely Execution", desc: "Planned schedules and coordinated teams to keep work on track." },
  { title: "End-to-End Delivery", desc: "One team from planning and structure through finishing and handover." },
];

export default function Intro() {
  return (
    <section id="who-we-are" aria-labelledby="intro-title" className="bg-cx-paper pt-20 pb-8 md:pt-28 md:pb-12 lg:pt-32 lg:pb-14">
      <div className="cx-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <SectionLabel index="01" label="Who We Are" />
              <h2
                id="intro-title"
                className="mt-6 text-balance font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-cx-ink"
              >
                Engineering Excellence. Built Around Your Vision.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-cx-muted md:text-lg">
                <p>
                  R Colors Construction &amp; Development delivers high-quality residential, commercial and
                  development projects with precision and reliability. We focus on structural strength, modern
                  design and timely execution to create lasting value for our clients.
                </p>
                <p>
                  Our expertise covers end-to-end project execution, from planning and structural work to finishing
                  and final handover.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-10 inline-flex min-h-[44px] items-center gap-3 border-b border-cx-ink/30 font-semibold text-cx-ink transition-colors hover:border-brand-sky hover:text-brand-sky"
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
                  src="/images/mission.jpg"
                  alt="High-rise towers under construction with tower cranes at dusk"
                  fill
                  sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[50%_35%]"
                />
              </div>
            </figure>
          </Reveal>
        </div>

        <ul className="mt-20 grid grid-cols-1 border-t border-cx-ink/15 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
          {highlights.map((item, idx) => (
            <li
              key={item.title}
              className={`border-b border-cx-ink/10 py-7 md:py-8 lg:border-b-0 lg:px-8 lg:first:pl-0 ${idx % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
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
