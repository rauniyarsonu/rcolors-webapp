import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import projects from "@/data/projects.json";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/ui/SectionHeading";
import BusinessCard from "@/components/home/BusinessCard";
import FeatureCard from "@/components/home/FeatureCard";
import ProjectCard from "@/components/ui/ProjectCard";
import ClientLogoMarquee from "@/components/ui/ClientLogoMarquee";
import CtaBanner from "@/components/ui/CtaBanner";

const businesses = [
  { href: "/businesses/construction", photo: "/images/Rcolors2.png", logo: "/images/logo2.jpg", logoAlt: "R Colors Construction & Developers" },
  { href: "/businesses/r-colors", photo: "/images/Rcolors1.jpg", logo: "/images/logo1.jpeg", logoAlt: "R Colors", logoWidthClass: "w-[90%]" },
  { href: "/businesses/estate", photo: "/images/Rcolors3.png", logo: "/images/logo3.jpg", logoAlt: "R Colors Estate" },
];

const features = [
  {
    title: "Commitment to Excellence",
    text: "We are driven by a strong dedication to deliver superior results in every project. Our focus on precision and quality ensures lasting and reliable structures.",
  },
  {
    title: "On-Time Project Delivery",
    text: "We value your time. Every project is planned and executed efficiently to ensure completion within committed timelines.",
  },
  {
    title: "Quality Craftsmanship",
    text: "Our skilled team and experienced professionals ensure high standards of workmanship with careful attention to every detail.",
  },
  {
    title: "Client-Focused Approach",
    text: "Your vision is our priority. We work closely with clients to understand their needs and deliver customized construction solutions.",
  },
];

export default function Home() {
  const clientImages = Array.from({ length: 22 }, (_, i) => i + 1);

  // Randomize the images for the two sliding rows
  const shuffledRow1 = [...clientImages].sort(() => Math.random() - 0.5);
  const shuffledRow2 = [...clientImages].sort(() => Math.random() - 0.5);

  const featuredProjects = projects.slice(0, 6);

  return (
    // A div, not <main>: the root layout already provides the page's <main> landmark
    <div className="flex flex-col">
      {/* 8.1 Hero Section Slider */}
      <HeroSlider />

      {/* 8.4 & 8.5 Welcome & About Us */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full">
        <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 shadow-xl lg:aspect-[3/4]">
              <Image
                src="/images/welcome1.1.jpg"
                fill
                alt="About R Colors Group"
                sizes="(min-width: 1280px) 460px, (min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="max-w-[65ch] space-y-6 lg:col-span-7 lg:max-w-none lg:pl-8">
            <SectionHeading eyebrow="Welcome To Our Business" title="Building Strong Foundations" align="left" />
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              R Colors Group of Companies is a trusted name in construction, contracting, and infrastructure development. We deliver residential, commercial, and industrial projects with quality, precision, and commitment. Our focus is on timely execution, safety standards, and long-term value creation.
            </p>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              We combine expertise, innovation, and skilled workmanship to transform ideas into reality. Every project reflects our dedication to excellence, integrity, and client satisfaction.
            </p>

            <blockquote className="my-8 rounded-r-lg border-l-4 border-brand-sky bg-gray-50 py-3 pl-4 pr-4 shadow-sm sm:pl-6">
              <p className="text-pretty font-heading text-lg italic text-brand-navy sm:text-xl">
                &quot;Your trusted partner in full-scale construction, finishing solutions, and real estate development.&quot;
              </p>
            </blockquote>

            <Link
              href="/about"
              className="inline-flex min-h-11 items-center gap-2 font-bold text-brand-sky transition-colors hover:text-brand-navy"
            >
              <span>Read More About Us</span>
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8.3 Three Businesses Strip */}
      <section id="businesses" className="section-y w-full bg-gray-50">
        <div className="site-container">
          <SectionHeading title="OUR BUSINESSES" bar className="mb-10 md:mb-16" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {businesses.map((business, index) => (
              <BusinessCard
                key={business.href}
                {...business}
                // With 2 columns the third card sits centered on its own row
                className={
                  index === businesses.length - 1
                    ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:col-span-1 lg:w-full"
                    : ""
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8.8 Why Choose Us Summary */}
      <section id="why-us" className="section-y relative w-full overflow-hidden bg-brand-navy text-white">
        {/* Decorative background element */}
        <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/2 translate-x-1/4 skew-x-12 bg-brand-sky/10" />

        <div className="site-container relative z-10">
          <SectionHeading title="Why Choose Us" bar tone="dark" className="mb-10 md:mb-16" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} title={feature.title}>
                {feature.text}
              </FeatureCard>
            ))}
          </div>
          <div className="mt-12 flex justify-center md:mt-16">
            <Link
              href="/why-us"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-brand-sky px-8 py-3 font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-white hover:text-brand-navy motion-reduce:transition-none sm:w-auto"
            >
              <span>Learn More About Us</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8.10 Featured Projects */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-gray-50">
        <div className="site-container">
          <div className="mb-10 flex flex-col items-center gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Our Portfolio" title="Featured Projects" align="responsive" />
            <Link
              href="/projects"
              className="hidden min-h-11 items-center gap-2 font-bold text-brand-navy transition-colors hover:text-brand-sky md:inline-flex"
            >
              <span>View All Projects</span>
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Mobile: full-width button after the cards (the md+ link sits beside the heading) */}
          <Link
            href="/projects"
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded border-2 border-brand-navy px-6 font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white md:hidden"
          >
            <span>View All Projects</span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 8.11 Trusted Clients */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full bg-white">
        <div className="site-container">
          <SectionHeading eyebrow="Our Network" title="Trusted Clients" bar className="mb-8 md:mb-12">
            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 md:text-lg">
              We are proud to collaborate with respected clients and development partners. Their trust reflects our commitment to quality, transparency, and long-term relationships.
            </p>
          </SectionHeading>
          <ClientLogoMarquee rows={[shuffledRow1, shuffledRow2]} />
        </div>
      </section>

      {/* 8.12 Final CTA */}
      <CtaBanner
        title="Let's Build Something Great Together"
        text="Thank you for choosing R Colors Group of Companies. Your vision inspires our work, and your satisfaction remains our highest priority."
      />
    </div>
  );
}
