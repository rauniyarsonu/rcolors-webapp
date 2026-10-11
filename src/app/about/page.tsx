import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutNav } from "@/config/aboutNav";

export default function AboutCompanyPage() {
  return (
    <div className="w-full">
      <PageHeader
        titlePart1="ABOUT"
        titlePart2="US"
        subNavItems={aboutNav}
        subNavLabel="About"
      />

      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full">
        <div className="site-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-20">
          <div className="max-w-[65ch] space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg">

            <p>R Colors Group of Companies is a growing organization engaged in construction,
              contracting, real estate development, and property solutions. With a strong commitment
              to quality and professionalism, we focus on delivering reliable services that meet modern
              industry standards and client expectations. Our work reflects a blend of innovation,
              practical experience, and strong industry knowledge.
            </p>
            <p>
              Our team combines technical expertise with practical experience to manage projects
              efficiently from planning to completion. We believe in using quality materials, effective
              project management, and skilled workmanship to ensure durable and successful
              developments. Every project is executed with careful attention to detail, safety standards,
              and structured planning.
            </p>
            <p>
              At R Colors Group, we aim to build long-term relationships with our clients by maintaining
              transparency, timely execution, and consistent performance. Our goal is to contribute to
              modern infrastructure while creating value for communities and stakeholders. Through
              continuous improvement and dedication, we strive to deliver projects that reflect
              reliability and lasting quality.
            </p>
            <blockquote className="my-8 rounded-r-lg border-l-4 border-brand-sky bg-gray-50 py-4 pl-4 pr-4 shadow-sm sm:my-10 sm:pl-6">
              <p className="text-pretty font-heading text-xl font-semibold italic text-brand-navy sm:text-2xl">
                &quot;At R Colors Group of Companies, we believe in building more than structures. We build trust, long-term relationships, and spaces that reflect quality, strength, and modern development.&quot;
              </p>
            </blockquote>
          </div>
          {/* 4:3 when stacked; on lg it stretches to the height of the text column */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-2xl lg:aspect-auto lg:h-full lg:min-h-[32rem]">
            <Image
              src="/images/aboutus.jpg"
              alt="About R Colors Group"
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Director's Message */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-gray-50">
        <div className="site-container flex flex-col items-center gap-10 md:flex-row md:gap-12 lg:gap-24">
          <div className="aspect-square w-[min(16rem,70vw)] shrink-0 overflow-hidden rounded-full border-4 border-brand-sky shadow-xl md:w-72 lg:w-[400px]">
            <Image
              src="/images/owner.jpg"
              alt="Raj Mani Singh - Founder & Director"
              width={500}
              height={500}
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 288px, 70vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="max-w-[65ch] space-y-4 md:pl-4 lg:pl-12">
            <p className="mb-2 font-bold uppercase tracking-wider text-brand-sky">Director&apos;s Message</p>
            <h2 className="font-heading text-3xl font-bold text-brand-navy">Raj Mani Singh</h2>
            <div className="space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg">
              <p>
                Progress for me has never been just a dream; it has always been a vision that turns into reality through dedication and continuous effort. With this belief, I founded R Colors Construction &amp; Developers in 2011, with the aim of contributing to the construction industry through quality work, integrity, and strong professional values.
              </p>
              <p>
                Over the years, the company has grown steadily and established its presence in construction and development services. Our journey has been driven by commitment, hard work, and the trust of our clients and partners who have supported us at every stage.
              </p>
              <p>
                At R Colors Group of Companies, we continue to move forward with the same determination to achieve higher milestones. Our focus remains on delivering quality projects, maintaining transparency, and creating developments that provide long-term value for our clients and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-white">
        <div className="site-container max-w-4xl">
          <SectionHeading title="OUR JOURNEY" bar className="mb-12 md:mb-16" />
          <div className="relative border-l-4 md:border-l-0 border-brand-sky ml-6 md:ml-0 md:pl-0">
            {[
              { year: "2011", title: "R Colors Construction & Developers Founded", desc: "Started our journey with a commitment to quality in the construction industry." },
              { year: "Expansion", title: "R Colors Estate Launched", desc: "Expanded into real estate and property solutions." },
              { year: "Growth", title: "R Colors Finishing Business Launched", desc: "Added specialized interior, exterior, and finishing services." },
              { year: "Today", title: "R Colors Group of Companies", desc: "Operating as a unified group with 3 specialized businesses delivering complete infrastructure solutions." }
            ].map((event, idx) => (
              <div key={idx} className={`mb-10 md:mb-16 relative md:w-1/2 ${idx % 2 === 0 ? "md:mr-auto md:pr-12 md:text-right" : "md:ml-auto md:pl-12"} pl-8 md:pl-0`}>
                <div aria-hidden="true" className={`absolute top-0 w-6 h-6 rounded-full bg-brand-sky border-4 border-white shadow -left-[15px] md:-left-[15px] ${idx % 2 === 0 ? "md:-right-[15px] md:left-auto" : "md:-left-[15px]"}`}></div>
                <div className="rounded-lg border-t-4 border-brand-navy bg-white p-5 shadow-md sm:p-6">
                  <span className="text-brand-sky font-bold uppercase tracking-wider text-sm">{event.year}</span>
                  <h3 className="font-heading font-bold text-xl text-brand-navy mt-1 mb-2">{event.title}</h3>
                  <p className="text-base text-gray-600 md:text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
            <div aria-hidden="true" className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-0.5 w-1 bg-brand-sky"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
