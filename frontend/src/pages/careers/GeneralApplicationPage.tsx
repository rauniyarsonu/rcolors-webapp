import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Seo from "@/components/Seo";
import Link from "@/components/ui/Link";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { CAREERS_PAGE } from "@/config/careers";

/** "Don't see a fit? Send us your CV": an application without a job */
export default function GeneralApplicationPage() {
  const copy = CAREERS_PAGE.general;
  return (
    // A div, not <main>: the root layout already provides <main>
    <div className="flex w-full flex-col bg-gray-50">
      <Seo
        meta={{
          title: "Send Us Your CV",
          description: copy.text,
          canonical: "/careers/apply",
          image: { src: "/images/home1.jpg", alt: "R Colors Group" },
          siteName: "R Colors Group of Companies",
        }}
      />
      <PageHeader titlePart1={copy.titlePart1} titlePart2={copy.titlePart2} />
      <section className="section-y w-full">
        <div className="site-container max-w-3xl">
          <Link href="/careers" className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-es-accent-strong hover:underline">
            <ArrowLeft size={16} className="mr-2" aria-hidden="true" /> See open positions
          </Link>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-8">
            <h2 className="mb-2 font-heading text-2xl font-black text-brand-navy">{copy.heading}</h2>
            <p className="mb-6 text-gray-600">{copy.text}</p>
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
