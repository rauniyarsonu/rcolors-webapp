import Image from "@/components/ui/Image";
import { CheckCircle, Shield, Award, Users, Zap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBanner from "@/components/ui/CtaBanner";
import { hoverShadow } from "@/components/ui/styles";

const promises = [
  {
    icon: Award,
    title: "Commitment to Excellence",
    desc: "We are driven by a strong dedication to deliver superior results in every project. Our focus on precision and quality ensures lasting and reliable structures.",
  },
  {
    icon: Zap,
    title: "On-Time Project Delivery",
    desc: "We value your time. Every project is planned and executed efficiently to ensure completion within committed timelines.",
  },
  {
    icon: Shield,
    title: "Quality Craftsmanship",
    desc: "Our skilled team and experienced professionals ensure high standards of workmanship with careful attention to every detail.",
  },
  {
    icon: Users,
    title: "Client-Focused Approach",
    desc: "Your vision is our priority. We work closely with clients to understand their needs and deliver customized construction solutions.",
  },
];

const coreValues = [
  { title: "Integrity", desc: "Upholding the highest ethical standards, ensuring transparency." },
  { title: "Excellence", desc: "Delivering top-tier results in every project." },
  { title: "Innovation", desc: "Embracing modern techniques and sustainable practices." },
  { title: "Teamwork", desc: "Collaborating seamlessly to achieve shared success." },
];

export default function WhyUsPage() {
  return (
    // A div, not <main>: the root layout already provides <main>. The header is sticky here, so no top padding.
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative flex min-h-[max(20rem,40vh)] w-full items-center justify-center overflow-hidden bg-brand-navy py-16 supports-[height:100svh]:min-h-[max(20rem,40svh)]">
        <Image src="/images/home3.jpg" alt="Why Choose R Colors Group" fill priority sizes="100vw" className="z-0 object-cover opacity-30" />
        <div className="site-container relative z-10 max-w-4xl text-center">
          <h1 className="mb-4 text-balance font-heading text-[clamp(2.25rem,1.5rem+3.2vw,3.75rem)] font-black leading-tight text-white drop-shadow-lg sm:mb-6">
            Why Choose Us
          </h1>
          <p className="text-pretty text-[clamp(1.125rem,1rem+0.8vw,1.5rem)] font-light text-gray-200 drop-shadow-md">
            Building trust through excellence, commitment, and superior craftsmanship.
          </p>
        </div>
      </section>

      {/* Commitment to Excellence Section */}
      <section className="section-y w-full bg-gray-50">
        <div className="site-container">
          <div data-aos="fade-up">
            <SectionHeading eyebrow="Our Promise" title="Commitment To Excellence" bar className="mb-10 md:mb-16" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {promises.map((item, idx) => (
              <div
                key={item.title}
                className={`group relative rounded-xl border-t-4 border-brand-sky bg-white p-6 shadow-lg after:rounded-xl after:shadow-2xl ${hoverShadow} transition-transform duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                  <item.icon className="mb-4 text-brand-sky" size={40} aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-brand-navy">{item.title}</h3>
                <p className="text-base text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-y relative w-full overflow-hidden bg-brand-navy text-white">
        {/* Decorative background element */}
        <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/2 translate-x-1/4 skew-x-12 bg-brand-sky/10"></div>

        <div className="site-container relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-aos="fade-right">
            <p className="mb-2 font-bold uppercase tracking-wider text-brand-sky">Our Principles</p>
            <h2 className="mb-6 font-heading text-3xl font-black md:mb-8 md:text-4xl">Our Core Values</h2>
            <p className="mb-8 max-w-[65ch] text-base leading-relaxed text-gray-300 sm:text-lg">
              Our core values form the foundation of everything we do. They guide our decisions, shape our culture, and ensure we consistently deliver exceptional results to our clients.
            </p>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {coreValues.map((value) => (
                <li key={value.title} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 shrink-0 text-brand-sky" size={24} aria-hidden="true" />
                  <div>
                    <strong className="block text-lg text-white">{value.title}</strong>
                    <p className="mt-1 text-base text-gray-400 sm:text-sm">{value.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 4:3 when stacked; on lg it fills the row height beside the text */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl lg:aspect-auto lg:h-full lg:min-h-[500px]" data-aos="fade-left">
            <Image src="/images/home2.jpg" alt="Core Values" fill sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/30"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaBanner
        title="Ready To Start Your Project?"
        text="Partner with us to turn your vision into reality. We are here to answer your questions and provide the best solutions."
      />
    </div>
  );
}
