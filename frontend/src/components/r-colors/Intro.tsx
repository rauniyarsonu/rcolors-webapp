import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/construction/Reveal";

export default function Intro() {
  return (
    <section id="who-we-are" aria-labelledby="intro-title" className="section-y w-full scroll-mt-20 bg-white">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16 xl:gap-20">
          <div className="lg:col-span-6">
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

          <Reveal delay={150} className="lg:order-first lg:col-span-6">
            <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand-sky/60 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:aspect-square">
              <Image
                src="/images/finishing002.jpg"
                alt="Finished interior space completed by the R Colors team"
                fill
                sizes="(min-width: 1320px) 640px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
