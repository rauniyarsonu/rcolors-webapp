import Link from "@/components/ui/Link";
import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY, telHref } from "@/config/company";
import BackToTop from "@/components/BackToTop";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Careers", href: "/careers" },
  { name: "Our Clients", href: "/clients" },
  { name: "Contact Us", href: "/contact" },
];

const businessLinks = [
  { name: "Construction & Developers", href: "/businesses/construction" },
  { name: "R Colors Finishing Works", href: "/businesses/r-colors" },
  { name: "R Colors Estate", href: "/businesses/estate" },
];

const socials = [
  { short: "FB", label: "Facebook" },
  { short: "IG", label: "Instagram" },
  { short: "IN", label: "LinkedIn" },
];

const { phones, email } = COMPANY;
const [emailUser, emailDomain] = email.split("@");

const linkClass = "inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-brand-sky";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative mb-4 pb-2 font-heading text-lg font-bold after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-brand-sky after:content-[''] sm:mb-6">
      {children}
    </h2>
  );
}

function LinkList({ links }: { links: { name: string; href: string }[] }) {
  return (
    <ul className="text-gray-300">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={linkClass}>
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-navy pt-12 text-white sm:pt-16">
      {/* lg: four columns, with extra width for the contact column so the address and email wrap less */}
      <div className="site-container grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_1fr_1.3fr] lg:gap-8 xl:gap-12">
        {/* Brand Col */}
        <div className="flex flex-col gap-4" data-aos="fade-up" data-aos-duration="1000">
          <p className="text-balance font-heading text-2xl font-black text-white">
            <span className="text-brand-red">R</span>{" "}
            <span className="text-brand-sky">Colors</span> Group of Companies
          </p>
          <p className="text-sm text-gray-300 sm:mt-2">
            R Colors Group of Companies — A trusted name in construction, contracting, and real estate development.
          </p>
          <ul className="mt-2 flex flex-wrap gap-3 sm:mt-4">
            {socials.map((social) => (
              <li key={social.short}>
                <Link
                  href="#"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition-colors hover:bg-brand-sky"
                >
                  <span aria-hidden="true">{social.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <nav aria-label="Quick links" data-aos="fade-up" data-aos-duration="1200">
          <FooterHeading>Quick Links</FooterHeading>
          <LinkList links={quickLinks} />
        </nav>

        {/* Businesses */}
        <nav aria-label="Our businesses" data-aos="fade-up" data-aos-duration="1400">
          <FooterHeading>Our Businesses</FooterHeading>
          <LinkList links={businessLinks} />
        </nav>

        {/* Contact Info */}
        <div data-aos="fade-up" data-aos-duration="1600">
          <FooterHeading>Contact Info</FooterHeading>
          <address className="space-y-3 not-italic text-gray-300">
            <p className="flex items-start gap-3">
              <MapPin size={20} aria-hidden="true" className="mt-1 shrink-0 text-brand-sky" />
              <span className="min-w-0 break-words">{COMPANY.address.short}</span>
            </p>
            <div className="flex items-start gap-3">
              <Phone size={20} aria-hidden="true" className="mt-3 shrink-0 text-brand-sky" />
              <ul className="min-w-0">
                {phones.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className={linkClass}>
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="flex items-start gap-3">
              <Mail size={20} aria-hidden="true" className="mt-3 shrink-0 text-brand-sky" />
              {/* <wbr> lets a narrow column wrap the address at "@" instead of mid-word */}
              <a href={`mailto:${email}`} className={`${linkClass} min-w-0 break-words`}>
                {emailUser}
                <wbr />@{emailDomain}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="site-container mt-12 sm:mt-16">
        <div className="border-t border-white/20 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-center text-sm text-gray-400">
          <p className="text-balance">&copy; {new Date().getFullYear()} R Colors Group of Companies. All rights reserved.</p>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
