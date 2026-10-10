import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Col */}
        <div className="flex flex-col space-y-4" data-aos="fade-up" data-aos-duration="1000">
          <div className="flex items-center gap-3">
            <div className="font-heading font-black text-2xl text-white">
              <span className="text-brand-red">R Colors</span> Group of Companies
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-4">
            R Colors Group of Companies — A trusted name in construction, contracting, and real estate development.
          </p>
          <div className="flex space-x-4 mt-6">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-sky transition-colors font-bold text-sm">
              FB
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-sky transition-colors font-bold text-sm">
              IG
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-sky transition-colors font-bold text-sm">
              IN
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div data-aos="fade-up" data-aos-duration="1200">
          <h4 className="font-heading font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-sky">
            Quick Links
          </h4>
          <ul className="space-y-3 text-gray-300">
            <li><Link href="/" className="hover:text-brand-sky transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-brand-sky transition-colors">About Us</Link></li>
            <li><Link href="/projects" className="hover:text-brand-sky transition-colors">Projects</Link></li>
            <li><Link href="/clients" className="hover:text-brand-sky transition-colors">Our Clients</Link></li>
            <li><Link href="/contact" className="hover:text-brand-sky transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Businesses */}
        <div data-aos="fade-up" data-aos-duration="1400">
          <h4 className="font-heading font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-sky">
            Our Businesses
          </h4>
          <ul className="space-y-3 text-gray-300">
            <li><Link href="/businesses/construction" className="hover:text-brand-sky transition-colors">Construction & Developers</Link></li>
            <li><Link href="/businesses/r-colors" className="hover:text-brand-sky transition-colors">R Colors Finishing Works</Link></li>
            <li><Link href="/businesses/estate" className="hover:text-brand-sky transition-colors">R Colors Estate</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div data-aos="fade-up" data-aos-duration="1600">
          <h4 className="font-heading font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-sky">
            Contact Info
          </h4>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start space-x-3">
              <MapPin size={20} className="text-brand-sky shrink-0 mt-1" />
              <span>Flat No. 1004, BCC Tower, Arjunganj–Shultanpur Road, Lucknow, UP, India</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={20} className="text-brand-sky shrink-0" />
              <span>6389144470 <br/> 9579662353</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={20} className="text-brand-sky shrink-0" />
              <a href="mailto:rcolourconstruction@gmail.com" className="min-w-0 [overflow-wrap:anywhere] hover:text-brand-sky transition-colors">rcolourconstruction@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-white/20 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} R Colors Group of Companies. All rights reserved.</p>
      </div>
    </footer>
  );
}
