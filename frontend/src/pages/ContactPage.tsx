import { Phone, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import { COMPANY, telHref } from "@/config/company";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14241.972300063162!2d81.01186715!3d26.8242491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be300539c065f%3A0xe54e6012cc4329d4!2sArjunganj%2C%20Lucknow%2C%20Uttar%20Pradesh%20226002!5e0!3m2!1sen!2sin!4v1716301234567!5m2!1sen!2sin";

const linkClass = "inline-flex min-h-11 items-center text-brand-sky transition-colors hover:text-brand-navy hover:underline";

function InfoItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-sky/10">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    // A div, not <main>: the root layout already provides <main>
    <div className="flex w-full flex-col">
      <PageHeader titlePart1="CONTACT" titlePart2="US" />

      {/* Main Content */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full">
        <div className="site-container grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Info & Map */}
          <div className="space-y-10 lg:space-y-12">
            <div>
              <h2 className="mb-6 font-heading text-3xl font-black text-brand-navy">Get In Touch</h2>
              <p className="mb-8 max-w-[65ch] text-base leading-relaxed text-gray-600 sm:text-lg">
                Thank you for choosing R Colors Group of Companies. We truly value your trust and the opportunity to present our expertise in construction, contracting, and infrastructure development. Your vision inspires our work, and your satisfaction remains our highest priority.
              </p>

              <address className="space-y-6 not-italic">
                <InfoItem icon={<MapPin className="text-brand-sky" size={24} />} title="Head Office">
                  <p className="break-words text-gray-600">{COMPANY.address.full}</p>
                </InfoItem>

                <InfoItem icon={<Phone className="text-brand-sky" size={24} />} title="Phone Number">
                  <p className="flex flex-wrap items-center gap-x-3">
                    {COMPANY.phones.map((phone, i) => (
                      <span key={phone} className="inline-flex items-center gap-x-3">
                        {i > 0 && <span aria-hidden="true" className="text-gray-400">|</span>}
                        <a href={telHref(phone)} className={linkClass}>
                          {phone}
                        </a>
                      </span>
                    ))}
                  </p>
                </InfoItem>

                <InfoItem icon={<Mail className="text-brand-sky" size={24} />} title="Email Address">
                  {/* <wbr> lets a narrow column wrap the address at "@" instead of mid-word */}
                  <a href={`mailto:${COMPANY.email}`} className={`${linkClass} break-words`}>
                    {COMPANY.email.split("@")[0]}
                    <wbr />@{COMPANY.email.split("@")[1]}
                  </a>
                </InfoItem>
              </address>
            </div>

            {/* Embedded Google Map: fixed 16:9 ratio at every width */}
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
              <iframe
                title="R Colors Group head office location on Google Maps"
                src={MAP_SRC}
                className="h-full w-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-8">
            <h2 className="mb-6 font-heading text-2xl font-black text-brand-navy">Send Us A Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
