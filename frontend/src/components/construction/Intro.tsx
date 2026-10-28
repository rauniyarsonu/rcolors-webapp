import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const highlights = [
  { title: "Structural Strength", desc: "Sound structural work as the base of every building we deliver." },
  { title: "Modern Design", desc: "Contemporary, functional spaces planned around how they will be used." },
  { title: "Timely Execution", desc: "Planned schedules and coordinated teams to keep work on track." },
  { title: "End-to-End Delivery", desc: "One team from planning and structure through finishing and handover." },
];

export default function Intro() {
  return (
    <section id="who-we-are" aria-labelledby="intro-title" className="section-y w-full scroll-mt-20 bg-white">
      <div className="site-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <SectionHeading id="intro-title" eyebrow="Who We Are" title="Engineering Excellence. Built Around Your Vision." bar align="left" />
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 max-w-[62ch] space-y-5 text-base leading-relaxed text-gray-600 md:text-lg">
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
            <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand-sky/60 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:aspect-[4/5]">
              <Image
                src="/images/mission.jpg"
                alt="High-rise towers under construction with tower cranes at dusk"
                fill
                sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_35%] transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
            </figure>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {highlights.map((item, idx) => (
            <li
              key={item.title}
              className="group h-full rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-sky/60 hover:bg-white hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Reveal delay={idx * 80}>
                <span className="font-heading text-sm font-black text-es-accent-strong transition-colors duration-300 group-hover:text-brand-sky">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold text-brand-navy transition-colors duration-300 group-hover:text-es-accent-strong">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{item.desc}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
