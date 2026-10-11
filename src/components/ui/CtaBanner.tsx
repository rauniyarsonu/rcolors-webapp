import { MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY, telHref } from "@/config/company";

interface CtaBannerProps {
  title: React.ReactNode;
  text: string;
  href?: string;
  label?: string;
  /** Adds Call and WhatsApp buttons beside the enquiry button */
  showContact?: boolean;
}

/** Full-width sky-700 band (white text passes AA) with copy and enquiry, call and WhatsApp buttons */
export default function CtaBanner({ title, text, href = "/contact", label = "Contact Us Today", showContact = false }: CtaBannerProps) {
  const phone = COMPANY.phones[0];
  return (
    <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-es-accent-strong text-center text-white">
      <div className="site-container max-w-3xl space-y-6 md:space-y-8">
        <h2 className="text-balance font-heading text-[clamp(1.875rem,1.25rem+3vw,3rem)] font-black leading-tight">{title}</h2>
        <p className="text-pretty text-lg opacity-95 md:text-xl">{text}</p>
        <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center md:pt-4">
          <Button href={href} variant="light" arrow>
            {label}
          </Button>
          {showContact && (
            <>
              <Button href={telHref(phone)} variant="outline-light">
                <Phone size={18} aria-hidden="true" />
                Call {phone}
              </Button>
              <Button href={`https://wa.me/91${phone}`} variant="outline-light" external>
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
