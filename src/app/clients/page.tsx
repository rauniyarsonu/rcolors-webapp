import clientsData from "@/data/clients.json";

export default function ClientsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      {/* Header Banner */}
      <section data-aos="fade-up" data-aos-duration="1000" className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 bg-[url('/images/R%20Colors%20Company%20Profile%20Final%20(2)_page-0015.jpg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="relative z-20 max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white">
            OUR TRUSTED <span className="text-brand-sky">CLIENTS</span>
          </h1>
          <div className="w-24 h-1 bg-brand-sky mx-auto mt-6"></div>
        </div>
      </section>

      {/* Intro Copy */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            We are proud to collaborate with respected clients and development partners across construction and real estate sectors. Their trust and continued association reflect our commitment to quality, transparency, and long-term professional relationships.
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {clientsData.map((client) => (
              <div 
                key={client.id} 
                className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center h-32 md:h-40 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* 
                  When real logos are available, uncomment this and use it:
                  {client.logo ? (
                    <Image src={client.logo} alt={client.name} width={120} height={80} className="object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
                  ) : (
                    <span className="font-heading font-bold text-center text-gray-400 group-hover:text-brand-navy transition-colors">{client.name}</span>
                  )}
                */}
                <span className="font-heading font-bold text-center text-gray-500 group-hover:text-brand-navy transition-colors">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-heading font-black text-brand-navy">Become a Partner</h2>
          <p className="text-gray-600 text-lg">
            Join our growing list of trusted clients and partners. Let&apos;s build something exceptional together.
          </p>
          <a href="/contact" className="inline-block bg-brand-sky text-white px-8 py-4 rounded font-bold hover:bg-brand-navy transition-colors">
            Contact Us Today
          </a>
        </div>
      </section>
    </main>
  );
}
