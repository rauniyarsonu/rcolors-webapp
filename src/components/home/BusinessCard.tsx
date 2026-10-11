import Link from "next/link";
import Image from "next/image";
import { hoverShadow } from "@/components/ui/styles";

interface BusinessCardProps {
  href: string;
  photo: string;
  logo: string;
  logoAlt: string;
  /** Narrower logo box for wide logos */
  logoWidthClass?: string;
  className?: string;
}

/** Photo + division logo card. Hover lift and shadow animate transform/opacity only. */
export default function BusinessCard({ href, photo, logo, logoAlt, logoWidthClass = "w-full", className = "" }: BusinessCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-lg bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 after:shadow-2xl ${hoverShadow} ${className}`}
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg bg-brand-navy/10">
        <Image
          src={photo}
          alt=""
          fill
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/20 transition-opacity group-hover:opacity-0" />
      </div>
      <div className="flex flex-grow flex-col justify-center p-6 text-center sm:p-8">
        <div className={`relative mx-auto h-24 sm:h-28 ${logoWidthClass}`}>
          <Image
            src={logo}
            alt={logoAlt}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 1024px) 26vw, (min-width: 640px) 40vw, 80vw"
            className="object-contain"
          />
        </div>
      </div>
    </Link>
  );
}
