import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Shield, Award, Users, Target, Zap } from "lucide-react";

export default function WhyUsPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home3.jpg"
            alt="Why Choose R Colors Group"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 drop-shadow-lg">
            Why Choose Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-md">
            Building trust through excellence, commitment, and superior craftsmanship.
          </p>
        </div>
      </section>

      {/* Commitment to Excellence Section */}
      <section className="w-full py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h4 className="text-brand-sky font-bold uppercase tracking-wider mb-2">Our Promise</h4>
            <h2 className="text-4xl font-heading font-black text-brand-navy">Commitment To Excellence</h2>
            <div className="w-24 h-1 bg-brand-sky mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="text-brand-sky mb-4" size={40} />,
                title: "Commitment to Excellence",
                desc: "We are driven by a strong dedication to deliver superior results in every project. Our focus on precision and quality ensures lasting and reliable structures."
              },
              {
                icon: <Zap className="text-brand-sky mb-4" size={40} />,
                title: "On-Time Project Delivery",
                desc: "We value your time. Every project is planned and executed efficiently to ensure completion within committed timelines."
              },
              {
                icon: <Shield className="text-brand-sky mb-4" size={40} />,
                title: "Quality Craftsmanship",
                desc: "Our skilled team and experienced professionals ensure high standards of workmanship with careful attention to every detail."
              },
              {
                icon: <Users className="text-brand-sky mb-4" size={40} />,
                title: "Client-Focused Approach",
                desc: "Your vision is our priority. We work closely with clients to understand their needs and deliver customized construction solutions."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-brand-sky group"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-brand-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full py-24 bg-brand-navy text-white px-4 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-sky/10 transform skew-x-12 translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <h4 className="text-brand-sky font-bold uppercase tracking-wider mb-2">Our Principles</h4>
            <h2 className="text-4xl font-heading font-black mb-8">Our Core Values</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Our core values form the foundation of everything we do. They guide our decisions, shape our culture, and ensure we consistently deliver exceptional results to our clients.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Integrity", desc: "Upholding the highest ethical standards, ensuring transparency." },
                { title: "Excellence", desc: "Delivering top-tier results in every project." },
                { title: "Innovation", desc: "Embracing modern techniques and sustainable practices." },
                { title: "Teamwork", desc: "Collaborating seamlessly to achieve shared success." }
              ].map((value, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="text-brand-sky shrink-0 mt-1" size={24} />
                  <div>
                    <strong className="text-white text-lg block">{value.title}</strong>
                    <p className="text-gray-400 text-sm mt-1">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl" data-aos="fade-left">
            <Image
              src="/images/home2.jpg"
              alt="Core Values"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-navy/30"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-brand-sky text-white px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-heading font-black">Ready To Start Your Project?</h2>
          <p className="text-xl font-light opacity-90">
            Partner with us to turn your vision into reality. We are here to answer your questions and provide the best solutions.
          </p>
          <Link href="/contact" className="inline-block bg-brand-navy text-white px-10 py-4 rounded font-bold text-lg hover:bg-white hover:text-brand-navy transition-all duration-300 shadow-xl transform hover:-translate-y-1">
            Contact Us Today
          </Link>
        </div>
      </section>
    </main>
  );
}
