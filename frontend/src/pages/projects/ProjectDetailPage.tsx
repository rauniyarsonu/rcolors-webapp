import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import { useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { businessName } from "@/components/ui/ProjectCard";
import LoadState from "@/components/LoadState";
import NotFoundPage from "@/pages/NotFoundPage";
import type { PortfolioProject } from "@/lib/types";
import { useApi } from "@/lib/useApi";

export default function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const result = useApi<PortfolioProject>(`/api/projects/${encodeURIComponent(slug)}`);

  if (result.status === "not-found") return <NotFoundPage />;
  if (result.status !== "ok") return <LoadState result={result} />;
  const project = result.data;

  const details = [
    { label: "Business", value: businessName(project.business) },
    { label: "Category", value: project.category, capitalize: true },
    { label: "Status", value: project.status, capitalize: true },
    ...(project.location ? [{ label: "Location", value: project.location }] : []),
  ];

  return (
    // A div, not <main>: the root layout already provides <main>
    <div className="flex w-full flex-col bg-gray-50">
      {/* Header Banner */}
      <section
        data-aos="fade-up"
        data-aos-duration="1000"
        className="relative flex min-h-[max(22rem,50vh)] w-full flex-col justify-end overflow-hidden supports-[height:100svh]:min-h-[max(22rem,50svh)]"
      >
        <Image
          src={project.coverImage || "/images/R Colors Company Profile Final (2)_page-0012.jpg"}
          alt={project.name}
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent"></div>

        <div className="site-container relative z-20 pb-10 pt-16 sm:pb-12">
          <Link href="/projects" className="mb-4 inline-flex min-h-11 items-center text-sm text-gray-300 transition-colors hover:text-white sm:mb-6">
            <ArrowLeft size={16} className="mr-2" aria-hidden="true" /> Back to Projects
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">{project.category}</span>
            <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {project.status}
            </span>
          </div>

          <h1 className="mb-2 text-balance break-words font-heading text-[clamp(2rem,1.2rem+3.8vw,3.75rem)] font-black leading-tight text-white">
            {project.name}
          </h1>

          {project.location && (
            <p className="flex items-center text-gray-200">
              <MapPin size={18} className="mr-2 shrink-0 text-brand-sky" aria-hidden="true" />
              <span className="text-lg">{project.location}</span>
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full">
        <div className="site-container grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-navy">Project Overview</h2>
              <div aria-hidden="true" className="mb-6 h-1 w-16 bg-brand-sky"></div>
              <p className="max-w-[65ch] whitespace-pre-wrap text-base leading-relaxed text-gray-700 sm:text-lg">{project.description}</p>

              {/* Fallback description if none provided beyond the short one */}
              {project.description.length < 100 && (
                <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-gray-700 sm:text-lg">
                  This project highlights R Colors Group&apos;s commitment to quality and excellence. Delivered with precision and attention to detail, it stands as a testament to our expertise in the{" "}
                  {businessName(project.business)} sector.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-b pb-2 font-heading text-xl font-bold text-brand-navy">Project Details</h2>
              <dl className="space-y-4">
                {details.map((d) => (
                  <div key={d.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <dt className="font-medium text-gray-500">{d.label}</dt>
                    <dd className={`min-w-0 break-words text-right font-semibold text-brand-navy ${d.capitalize ? "capitalize" : ""}`}>{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl bg-brand-navy p-6 text-center text-white shadow-sm">
              <h2 className="mb-3 font-heading text-xl font-bold">Interested in a similar project?</h2>
              <p className="mb-6 text-sm text-gray-300">Contact our team to discuss your requirements.</p>
              <Link
                href="/contact"
                className="flex min-h-12 w-full items-center justify-center rounded bg-brand-sky font-bold text-white transition-colors hover:bg-white hover:text-brand-navy"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
