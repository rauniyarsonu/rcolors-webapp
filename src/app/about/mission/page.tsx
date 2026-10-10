"use client";

import { Handshake, Award, Lightbulb, ShieldCheck, MessageSquareCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export default function MissionVisionPage() {
  return (
    <div className="w-full">
      <PageHeader
        titlePart1="MISSION &"
        titlePart2="VISION"
        subNavItems={[
          { name: 'About Company', href: '/about' },
          { name: 'Mission & Vision', href: '/about/mission' },
          { name: 'Clients', href: '/about/clients' },
        ]}
      />

      <section className="w-full py-20 px-4 bg-[#f4f4f4]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center max-w-4xl mb-16" data-aos="fade-up">
            <h3 className="text-2xl font-medium text-brand-navy mb-4">Mission</h3>
            <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-brand-navy leading-tight">
              Building sustainable infrastructure with absolute precision, unmatched integrity, and superior craftsmanship.
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center max-w-6xl">
            <div className="relative h-[400px] lg:h-[600px] w-full" data-aos="fade-right">
              <Image
                src="/images/mission.jpg"
                alt="Construction"
                fill
                className="object-cover"
              />
            </div>
            <div data-aos="fade-left" className="flex flex-col items-center lg:items-start justify-center space-y-6 lg:pl-6">
              {/* Vision Card */}
              <div className="bg-white p-6 md:p-8 w-full max-w-md shadow-sm">
                <h3 className="text-lg md:text-xl font-medium text-brand-navy mb-2">Vision</h3>
                <h2 className="text-lg md:text-xl font-black text-brand-navy leading-tight mb-3">
                  Encompassing legacy of ethics and empowerment as makers to the nation.
                </h2>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  We aim to lead construction and infrastructure through innovation, reliability, and sustainability, creating inspiring spaces, modern solutions, and lasting value for a stronger, smarter, and sustainable future.
                </p>
              </div>

              {/* Purpose Card */}
              <div className="bg-white p-6 md:p-8 w-full max-w-md shadow-sm">
                <h3 className="text-lg md:text-xl font-medium text-brand-navy mb-2">Purpose</h3>
                <h2 className="text-lg md:text-xl font-black text-brand-navy leading-tight mb-3">
                  Creating spaces that improve everyday living and support business growth.
                </h2>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  At R Colors Group of Companies, we create quality spaces that enhance living, drive business growth, and deliver strong, innovative, and lasting value for clients and communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-20 bg-gray-50 text-brand-navy px-4 relative">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-black text-brand-navy mb-4">OUR CORE VALUES</h2>
              <div className="w-24 h-1 bg-brand-sky mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Integrity", desc: "We uphold the highest ethical standards in all our business dealings, ensuring transparency, honesty, and accountability across all businesses.", icon: Handshake },
                { title: "Quality Excellence", desc: "We are committed to delivering superior quality in construction, contracting, and infrastructure projects through skilled workmanship and strict quality control.", icon: Award },
                { title: "Innovation", desc: "Through R Colors Estate, we adopt modern engineering practices, advanced technologies, and innovative solutions to meet evolving industry needs.", icon: Lightbulb },
                { title: "Safety", desc: "Safety is our top priority. We implement strict safety measures to ensure secure working environments for our employees, partners, and clients.", icon: ShieldCheck },
                { title: "Client Commitment", desc: "We focus on understanding client requirements and delivering projects on time with complete satisfaction.", icon: MessageSquareCheck },
              ].map((value, idx) => (
                <div key={idx} className="bg-brand-navy rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-brand-sky" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg md:text-xl mb-2">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
              <div className="bg-brand-sky rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-center items-start text-white">
                <h3 className="font-heading font-bold text-lg md:text-xl mb-2">See it in action</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">Explore the projects built on these values.</p>
                <Link href="/projects" className="inline-flex items-center gap-2 bg-white text-brand-navy font-semibold text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  View projects <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
