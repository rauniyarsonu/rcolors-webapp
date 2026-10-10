"use client";

import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export default function AboutCompanyPage() {
  return (
    <div className="w-full">
      <PageHeader
        titlePart1="ABOUT"
        titlePart2="US"
        subNavItems={[
          { name: 'About Company', href: '/about' },
          { name: 'Mission & Vision', href: '/about/mission' },
          { name: 'Clients', href: '/about/clients' },
        ]}
      />

      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">

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
            <blockquote className="border-l-4 border-brand-sky pl-6 py-4 my-10 bg-gray-50 rounded-r-lg shadow-sm">
              <p className="text-2xl italic font-heading text-brand-navy font-semibold">
                &quot;At R Colors Group of Companies, we believe in building more than structures. We build trust, long-term relationships, and spaces that reflect quality, strength, and modern development.&quot;
              </p>
            </blockquote>
          </div>
          <div className="relative w-full h-[500px] lg:h-[850px] rounded-lg overflow-hidden shadow-2xl">
            <Image src="/images/aboutus.jpg" alt="About R Colors Group" fill className="object-cover object-center" />
          </div>
        </div>
      </section>

      {/* Director's Message */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-20 bg-gray-50 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden border-4 border-brand-sky shrink-0 shadow-xl">
            <Image src="/images/owner.jpg" alt="Raj Mani Singh - Founder & Director" width={500} height={500} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 md:pl-8 lg:pl-12">
            <h4 className="text-brand-sky font-bold uppercase tracking-wider mb-2">Director&apos;s Message</h4>
            <h2 className="text-3xl font-heading font-bold text-brand-navy">Raj Mani Singh</h2>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
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
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-brand-navy mb-4">OUR JOURNEY</h2>
            <div className="w-24 h-1 bg-brand-sky mx-auto"></div>
          </div>
          <div className="relative border-l-4 md:border-l-0 border-brand-sky ml-6 md:ml-0 md:pl-0">
            {[
              { year: "2011", title: "R Colors Construction & Developers Founded", desc: "Started our journey with a commitment to quality in the construction industry." },
              { year: "Expansion", title: "R Colors Estate Launched", desc: "Expanded into real estate and property solutions." },
              { year: "Growth", title: "R Colors Finishing Business Launched", desc: "Added specialized interior, exterior, and finishing services." },
              { year: "Today", title: "R Colors Group of Companies", desc: "Operating as a unified group with 3 specialized businesses delivering complete infrastructure solutions." }
            ].map((event, idx) => (
              <div key={idx} className={`mb-10 md:mb-16 relative md:w-1/2 ${idx % 2 === 0 ? "md:mr-auto md:pr-12 md:text-right" : "md:ml-auto md:pl-12"} pl-8 md:pl-0`}>
                <div className={`absolute top-0 w-6 h-6 rounded-full bg-brand-sky border-4 border-white shadow -left-[15px] md:-left-[15px] ${idx % 2 === 0 ? "md:-right-[15px] md:left-auto" : "md:-left-[15px]"}`}></div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-navy">
                  <span className="text-brand-sky font-bold uppercase tracking-wider text-sm">{event.year}</span>
                  <h3 className="font-heading font-bold text-xl text-brand-navy mt-1 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-0.5 w-1 bg-brand-sky"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
