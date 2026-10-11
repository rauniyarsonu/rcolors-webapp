import Link from "next/link";

interface CtaBannerProps {
  title: React.ReactNode;
  text: string;
  href?: string;
  label?: string;
}

/** Full-width sky band with a heading, a line of copy and a navy button (home, why-us) */
export default function CtaBanner({ title, text, href = "/contact", label = "Contact Us Today" }: CtaBannerProps) {
  return (
    <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-brand-sky text-center text-white">
      <div className="site-container max-w-3xl space-y-6 md:space-y-8">
        <h2 className="text-balance font-heading text-[clamp(1.875rem,1.25rem+3vw,3rem)] font-black leading-tight">{title}</h2>
        <p className="text-pretty text-lg font-light opacity-90 md:text-xl">{text}</p>
        <div className="pt-2 md:pt-4">
          <Link
            href={href}
            className="flex min-h-12 w-full items-center justify-center rounded bg-brand-navy px-8 py-4 text-base font-bold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-white hover:text-brand-navy motion-reduce:transition-none sm:inline-flex sm:w-auto md:px-10 md:text-lg"
          >
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
