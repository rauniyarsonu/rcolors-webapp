import { Phone, Mail, MapPin, Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      <PageHeader 
        titlePart1="CONTACT" 
        titlePart2="US" 
      />

      {/* Main Content */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-heading font-black text-brand-navy mb-6">Get In Touch</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Thank you for choosing R Colors Group of Companies. We truly value your trust and the opportunity to present our expertise in construction, contracting, and infrastructure development. Your vision inspires our work, and your satisfaction remains our highest priority.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-sky/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-brand-sky" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-lg">Head Office</h4>
                    <p className="text-gray-600">Flat No. 1004, BCC Tower, Arjunganj–Shultanpur Road, Lucknow, Uttar Pradesh, India</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-sky/10 flex items-center justify-center shrink-0">
                    <Phone className="text-brand-sky" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-lg">Phone Number</h4>
                    <p className="text-gray-600">6389144470 | 9579662353</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-sky/10 flex items-center justify-center shrink-0">
                    <Mail className="text-brand-sky" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-lg">Email Address</h4>
                    <a href="mailto:rcolourconstruction@gmail.com" className="text-brand-sky hover:underline">rcolourconstruction@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14241.972300063162!2d81.01186715!3d26.8242491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be300539c065f%3A0xe54e6012cc4329d4!2sArjunganj%2C%20Lucknow%2C%20Uttar%20Pradesh%20226002!5e0!3m2!1sen!2sin!4v1716301234567!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
            <h3 className="text-2xl font-heading font-black text-brand-navy mb-6">Send Us A Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input type="text" id="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-sky focus:border-brand-sky outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" id="phone" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-sky focus:border-brand-sky outline-none transition-colors" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" id="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-sky focus:border-brand-sky outline-none transition-colors" placeholder="johndoe@example.com" />
              </div>

              <div>
                <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">Interested Business / Subject *</label>
                <select id="business" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-sky focus:border-brand-sky outline-none transition-colors bg-white">
                  <option value="">Select a business</option>
                  <option value="general">General Inquiry</option>
                  <option value="construction">Construction & Developers</option>
                  <option value="r-colors">R Colors Finishing Works</option>
                  <option value="estate">R Colors Estate (Real Estate)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                <textarea id="message" rows={5} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-sky focus:border-brand-sky outline-none transition-colors resize-none" placeholder="Tell us about your requirement..."></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-sky text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-navy transition-colors">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </section>

    </main>
  );
}
