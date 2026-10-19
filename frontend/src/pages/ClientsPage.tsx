import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import type { Client } from "@/lib/types";
import { useApi } from "@/lib/useApi";

export default function ClientsPage() {
  const clientsData = useApi<Client[]>("/api/clients").data ?? [];

  return (
    // A div, not <main>: the root layout already provides the page's <main> landmark
    <div className="flex w-full flex-col">
      {/* Header Banner */}
      <section
        data-aos="fade-up"
        data-aos-duration="1000"
        className="relative flex min-h-[max(16rem,40vh)] w-full flex-col items-center justify-center overflow-hidden bg-brand-navy py-12 text-center supports-[height:100svh]:min-h-[max(16rem,40svh)]"
      >
        <Image
          src="/images/R Colors Company Profile Final (2)_page-0015.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 mix-blend-overlay"
        />
        <div className="site-container relative z-20 max-w-4xl space-y-4">
          <h1 className="text-balance break-words font-heading text-[clamp(2rem,1.2rem+3.6vw,3.75rem)] font-black leading-tight text-white">
            OUR TRUSTED <span className="text-brand-sky">CLIENTS</span>
          </h1>
          <div aria-hidden="true" className="mx-auto mt-6 h-1 w-24 bg-brand-sky"></div>
        </div>
      </section>

      {/* Intro Copy */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full">
        <div className="site-container max-w-4xl text-center">
          <p className="text-pretty text-lg leading-relaxed text-gray-700 md:text-xl">
            We are proud to collaborate with respected clients and development partners across construction and real estate sectors. Their trust and continued association reflect our commitment to quality, transparency, and long-term professional relationships.
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full pb-12 sm:pb-16 lg:pb-24">
        <div className="site-container">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {clientsData.map((client) => (
              <li
                key={client.id}
                className="group flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:h-32 md:h-36 lg:p-6"
              >
                {/*
                  When real logos are available, uncomment this and use it:
                  {client.logo ? (
                    <Image src={client.logo} alt={client.name} width={120} height={80} sizes="160px" className="max-h-full w-auto object-contain" />
                  ) : (
                    <span className="font-heading font-bold text-center text-gray-400 group-hover:text-brand-navy transition-colors">{client.name}</span>
                  )}
                */}
                <span className="text-balance break-words text-center font-heading text-base font-bold text-gray-500 transition-colors group-hover:text-brand-navy">
                  {client.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full border-t border-gray-200 bg-gray-50">
        <div className="site-container max-w-3xl space-y-6 text-center">
          <h2 className="font-heading text-3xl font-black text-brand-navy">Become a Partner</h2>
          <p className="text-lg text-gray-600">
            Join our growing list of trusted clients and partners. Let&apos;s build something exceptional together.
          </p>
          <Link
            href="/contact"
            className="flex min-h-12 w-full items-center justify-center rounded bg-brand-sky px-8 py-4 font-bold text-white transition-colors hover:bg-brand-navy sm:inline-flex sm:w-auto"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
