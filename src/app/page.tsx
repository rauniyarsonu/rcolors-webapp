import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import projects from "@/data/projects.json";
import clientsData from "@/data/clients.json";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  const clientImages = Array.from({ length: 22 }, (_, i) => i + 1);

  // Randomize the images for the two sliding rows
  const shuffledRow1 = [...clientImages].sort(() => Math.random() - 0.5);
  const shuffledRow2 = [...clientImages].sort(() => Math.random() - 0.5);

  const featuredProjects = projects.slice(0, 6);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 8.1 Hero Section Slider */}
      <HeroSlider />


      {/* 8.4 & 8.5 Welcome & About Us */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 md:py-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex justify-start">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-gray-100">
              <Image src="/images/welcome1.1.jpg" fill alt="About R Colors Group" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6 lg:pl-8">
            <h4 className="text-brand-sky font-bold uppercase tracking-wider text-sm md:text-base">Welcome To Our Business</h4>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy leading-tight">Building Strong Foundations</h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              R Colors Group of Companies is a trusted name in construction, contracting, and infrastructure development. We deliver residential, commercial, and industrial projects with quality, precision, and commitment. Our focus is on timely execution, safety standards, and long-term value creation.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We combine expertise, innovation, and skilled workmanship to transform ideas into reality. Every project reflects our dedication to excellence, integrity, and client satisfaction.
            </p>

            <blockquote className="border-l-4 border-brand-sky pl-6 py-2 my-8 bg-gray-50 rounded-r-lg shadow-sm">
              <p className="text-xl italic font-heading text-brand-navy">
                &quot;Your trusted partner in full-scale construction, finishing solutions, and real estate development.&quot;
              </p>
            </blockquote>

            <Link href="/about" className="inline-flex items-center space-x-2 text-brand-sky font-bold hover:text-brand-navy transition-colors">
              <span>Read More About Us</span>
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8.3 Three Businesses Strip */}
      <section id="businesses" className="w-full py-16 md:py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy mb-4">OUR BUSINESSES</h2>
            {/* skjljsldkjjlskjdjflksjdlfkj fsdjlkfjsdlkfjjajslkf */}
            <div className="w-20 md:w-24 h-1 bg-brand-sky mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business 1 */}
            <Link href="/businesses/construction" className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 relative bg-brand-navy/10 overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors z-10"></div>
                {/* Fallback pattern bg */}
                <div className="absolute inset-0 bg-[url('/images/Rcolors2.png')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <div className="p-8 text-center flex-grow flex flex-col justify-center">
                <div className="relative h-28 w-full mx-auto mb-3">
                  <Image src="/images/logo2.jpg" alt="R Colors Construction & Developers" fill className="object-contain" />
                </div>
                {/* <p className="text-brand-sky font-semibold uppercase tracking-wider text-sm">Building & Development</p> */}
              </div>
            </Link>

            {/* Business 2 */}
            <Link href="/businesses/r-colors" className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 relative bg-brand-navy/10 overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors z-10"></div>
                <div className="absolute inset-0 bg-[url('/images/Rcolors1.jpg')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <div className="p-8 text-center flex-grow flex flex-col justify-center">
                <div className="relative h-28 w-[90%] mx-auto mb-3">
                  <Image src="/images/logo1.jpeg" alt="R Colors" fill className="object-contain" />
                </div>
                {/* <p className="text-brand-sky font-semibold uppercase tracking-wider text-sm">Finishing Works</p> */}
              </div>
            </Link>

            {/* Business 3 */}
            <Link href="/businesses/estate" className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 relative bg-brand-navy/10 overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors z-10"></div>
                <div className="absolute inset-0 bg-[url('/images/Rcolors3.png')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <div className="p-8 text-center flex-grow flex flex-col justify-center">
                <div className="relative h-28 w-full mx-auto mb-3">
                  <Image src="/images/logo3.jpg" alt="R Colors Estate" fill className="object-contain" />
                </div>
                {/* <p className="text-brand-sky font-semibold uppercase tracking-wider text-sm">Real Estate & Sales Purchase</p> */}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8.8 & 8.9 Core Values & Why Choose Us Summary */}
      {/* 8.8 Why Choose Us Summary */}
      <section id="why-us" className="w-full py-16 md:py-20 bg-brand-navy text-white px-4 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-sky/10 transform skew-x-12 translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black mb-4">Why Choose Us</h2>
            <div className="w-20 md:w-24 h-1 bg-brand-sky mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 hover:-translate-y-2 transition-transform duration-300 flex flex-col space-y-4">
              <CheckCircle className="text-brand-sky" size={40} />
              <h3 className="font-bold text-xl">Commitment to Excellence</h3>
              <p className="text-gray-300 text-sm leading-relaxed">We are driven by a strong dedication to deliver superior results in every project. Our focus on precision and quality ensures lasting and reliable structures.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 hover:-translate-y-2 transition-transform duration-300 flex flex-col space-y-4">
              <CheckCircle className="text-brand-sky" size={40} />
              <h3 className="font-bold text-xl">On-Time Project Delivery</h3>
              <p className="text-gray-300 text-sm leading-relaxed">We value your time. Every project is planned and executed efficiently to ensure completion within committed timelines.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 hover:-translate-y-2 transition-transform duration-300 flex flex-col space-y-4">
              <CheckCircle className="text-brand-sky" size={40} />
              <h3 className="font-bold text-xl">Quality Craftsmanship</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Our skilled team and experienced professionals ensure high standards of workmanship with careful attention to every detail.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 hover:-translate-y-2 transition-transform duration-300 flex flex-col space-y-4">
              <CheckCircle className="text-brand-sky" size={40} />
              <h3 className="font-bold text-xl">Client-Focused Approach</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Your vision is our priority. We work closely with clients to understand their needs and deliver customized construction solutions.</p>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <Link href="/why-us" className="inline-flex items-center space-x-2 bg-brand-sky text-white px-8 py-3 rounded font-bold hover:bg-white hover:text-brand-navy transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              <span>Learn More About Us</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8.10 Featured Projects */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 md:py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 text-center md:text-left gap-4">
            <div>
              <h4 className="text-brand-sky font-bold uppercase tracking-wider mb-2 text-sm md:text-base">Our Portfolio</h4>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">Featured Projects</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center space-x-2 text-brand-navy font-bold hover:text-brand-sky transition-colors">
              <span>View All Projects</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link href={`/projects`} key={project.id} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="h-56 relative overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors z-10"></div>
                  {/* Using coverImage if valid, else placeholder style */}
                  <Image src={project.coverImage || "/images/R Colors Company Profile Final (2)_page-0012.jpg"} alt={project.name} fill className="object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 bg-brand-sky text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-brand-navy mb-1">{project.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <span className="capitalize">{project.business.replace('-', ' ')}</span>
                    {project.location && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{project.location}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8.11 Trusted Clients */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h4 className="text-brand-sky font-bold uppercase tracking-wider mb-2 text-sm md:text-base">Our Network</h4>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">Trusted Clients</h2>
            <div className="w-20 md:w-24 h-1 bg-brand-sky mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              We are proud to collaborate with respected clients and development partners. Their trust reflects our commitment to quality, transparency, and long-term relationships.
            </p>
          </div>
          <div className="relative w-full overflow-hidden max-w-full group py-4">
            {/* First Row - Sliding Left */}
            <div className="flex w-max animate-marquee-left group-hover:[animation-play-state:paused] mb-6 gap-6 pl-6">
              {[...shuffledRow1, ...shuffledRow1, ...shuffledRow1].map((imgNum, idx) => (
                <div
                  key={`row1-${imgNum}-${idx}`}
                  className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center h-36 w-60 hover:shadow-lg transition-all duration-300 flex-shrink-0"
                >
                  <div className="relative w-full h-20 mb-2">
                    <Image src={`/images/${imgNum}.jpg`} alt={`Client ${imgNum}`} fill sizes="240px" className="object-contain transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row - Sliding Right */}
            <div className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused] gap-6 pl-6">
              {[...shuffledRow2, ...shuffledRow2, ...shuffledRow2].map((imgNum, idx) => (
                <div
                  key={`row2-${imgNum}-${idx}`}
                  className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center h-36 w-60 hover:shadow-lg transition-all duration-300 flex-shrink-0"
                >
                  <div className="relative w-full h-20 mb-2">
                    <Image src={`/images/${imgNum}.jpg`} alt={`Client ${imgNum}`} fill sizes="240px" className="object-contain transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8.12 Final CTA */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 md:py-24 bg-brand-sky text-white px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-5xl font-heading font-black leading-tight">Let&apos;s Build Something Great Together</h2>
          <p className="text-lg md:text-xl font-light opacity-90 px-2 md:px-0">
            Thank you for choosing R Colors Group of Companies. Your vision inspires our work, and your satisfaction remains our highest priority.
          </p>
          <div className="pt-4">
            <Link href="/contact" className="inline-block bg-brand-navy text-white px-8 md:px-10 py-4 rounded font-bold text-base md:text-lg hover:bg-white hover:text-brand-navy transition-all duration-300 shadow-xl transform hover:-translate-y-1">
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
