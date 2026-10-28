import { Handshake, Award, Lightbulb, ShieldCheck, MessageSquareCheck, ArrowRight } from "lucide-react";
import Link from "@/components/ui/Link";
import Image from "@/components/ui/Image";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { hoverShadow } from "@/components/ui/styles";
import { aboutNav } from "@/config/aboutNav";

const statements = [
  {
    label: "Vision",
    title: "Encompassing legacy of ethics and empowerment as makers to the nation.",
    text: "We aim to lead construction and infrastructure through innovation, reliability, and sustainability, creating inspiring spaces, modern solutions, and lasting value for a stronger, smarter, and sustainable future.",
  },
  {
    label: "Purpose",
    title: "Creating spaces that improve everyday living and support business growth.",
    text: "At R Colors Group of Companies, we create quality spaces that enhance living, drive business growth, and deliver strong, innovative, and lasting value for clients and communities.",
  },
];

const values = [
  { title: "Integrity", desc: "We uphold the highest ethical standards in all our business dealings, ensuring transparency, honesty, and accountability across all businesses.", icon: Handshake },
  { title: "Quality Excellence", desc: "We are committed to delivering superior quality in construction, contracting, and infrastructure projects through skilled workmanship and strict quality control.", icon: Award },
  { title: "Innovation", desc: "Through R Colors Estate, we adopt modern engineering practices, advanced technologies, and innovative solutions to meet evolving industry needs.", icon: Lightbulb },
  { title: "Safety", desc: "Safety is our top priority. We implement strict safety measures to ensure secure working environments for our employees, partners, and clients.", icon: ShieldCheck },
  { title: "Client Commitment", desc: "We focus on understanding client requirements and delivering projects on time with complete satisfaction.", icon: MessageSquareCheck },
];

const liftCard = `relative rounded-lg shadow-md after:shadow-2xl ${hoverShadow} transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0`;

export default function MissionVisionPage() {
  return (
    <div className="w-full">
      <PageHeader titlePart1="MISSION &" titlePart2="VISION" subNavItems={aboutNav} subNavLabel="About" />

      {/* overflow-x-clip: the fade-left/right reveal starts 100px off to the side and must not widen the page */}
      <section className="section-y w-full overflow-x-clip bg-[#f4f4f4]">
        <div className="site-container flex flex-col items-center">
          <div className="mb-10 max-w-4xl text-center md:mb-16" data-aos="fade-up">
            <p className="mb-4 text-2xl font-medium text-brand-navy">Mission</p>
            <h2 className="text-balance text-[clamp(1.625rem,1.2rem+1.6vw,2.25rem)] font-bold leading-tight text-brand-navy lg:text-3xl">
              Building sustainable infrastructure with absolute precision, unmatched integrity, and superior craftsmanship.
            </h2>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-6">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-square" data-aos="fade-right">
              <Image
                src="/images/mandv001.jpg"
                alt="Construction"
                fill
                sizes="(min-width: 1280px) 576px, (min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* Vision + Purpose: stacked on phones, side by side on tablets, stacked beside the image on laptops */}
            <div data-aos="fade-left" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 lg:pl-6">
              {statements.map((s) => (
                <div key={s.label} className="w-full bg-white p-6 shadow-sm md:p-8 lg:max-w-md">
                  <p className="mb-2 text-lg font-medium text-brand-navy md:text-xl">{s.label}</p>
                  <h3 className="mb-3 text-lg font-black leading-tight text-brand-navy md:text-xl">{s.title}</h3>
                  <p className="text-base leading-relaxed text-gray-700">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-aos="fade-up" data-aos-duration="1000" className="section-y relative w-full bg-gray-50 text-brand-navy">
        <div className="site-container relative z-10">
          <SectionHeading title="OUR CORE VALUES" bar className="mb-10 md:mb-12" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className={`${liftCard} flex flex-col bg-brand-navy p-6`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <value.icon className="h-6 w-6 text-brand-sky" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold text-white md:text-xl">{value.title}</h3>
                <p className="text-base leading-relaxed text-gray-300 md:text-sm">{value.desc}</p>
              </div>
            ))}
            <div className={`${liftCard} flex flex-col items-start justify-center bg-brand-sky p-6 text-white`}>
              <h3 className="mb-2 font-heading text-lg font-bold md:text-xl">See it in action</h3>
              <p className="mb-4 text-base leading-relaxed text-white/80 md:text-sm">Explore the projects built on these values.</p>
              <Link
                href="/projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-brand-navy transition-colors hover:bg-gray-100"
              >
                View projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
