import { useState, useEffect } from "react";
import Link from "@/components/ui/Link";
import { useSearchParams, useRouter } from "@/lib/navigation";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import LoadState from "@/components/LoadState";
import type { PortfolioProject } from "@/lib/types";
import { useApi } from "@/lib/useApi";

const filters = [
  { id: "all", label: "All Projects" },
  { id: "construction", label: "R Colors Construction & Developers" },
  { id: "r-colors", label: "R Colors Finishing Works" },
  { id: "estate", label: "R Colors Estate" },
];

/** Reads ?business= and keeps it in sync with the filter buttons */
function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projects = useApi<PortfolioProject[]>("/api/projects");

  const initialBusiness = searchParams.get("business") || "all";
  const [activeFilter, setActiveFilter] = useState(initialBusiness);

  useEffect(() => {
    setActiveFilter(searchParams.get("business") || "all");
  }, [searchParams]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      router.push("/projects", { scroll: false });
    } else {
      router.push(`/projects?business=${filter}`, { scroll: false });
    }
  };

  if (projects.status !== "ok") return <LoadState result={projects} />;
  return <ProjectsView projectsData={projects.data} activeFilter={activeFilter} onFilterChange={handleFilterChange} />;
}

/** The page body for a given filter */
function ProjectsView({
  projectsData,
  activeFilter,
  onFilterChange,
}: {
  projectsData: PortfolioProject[];
  activeFilter: string;
  onFilterChange?: (filter: string) => void;
}) {
  const handleFilterChange = (filter: string) => onFilterChange?.(filter);
  const filteredProjects = activeFilter === "all" ? projectsData : projectsData.filter((p) => p.business === activeFilter);

  return (
    // A div, not <main>: the root layout already provides <main>
    <div className="flex w-full flex-col">
      <PageHeader titlePart1="OUR" titlePart2="PROJECTS" />

      <section data-aos="fade-up" data-aos-duration="1000" className="section-y w-full">
        <div className="site-container">
          {/* Filter Bar: one swipeable row on phones, wrapped and centered from md */}
          <div className="-mx-4 mb-8 md:mx-0 md:mb-12">
            <div role="group" aria-label="Filter projects by business" className="es-scroll-x flex snap-x scroll-px-4 gap-2 px-4 md:flex-wrap md:justify-center md:gap-4 md:overflow-visible md:scroll-px-0 md:px-0">
              {filters.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-colors md:px-6 md:text-base ${
                      active ? "bg-brand-sky text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} detailed headingLevel="h2" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-16 text-center sm:py-20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <span aria-hidden="true" className="text-2xl font-bold text-gray-400">!</span>
              </div>
              <h2 className="mb-2 font-heading text-2xl font-bold text-brand-navy">New Projects Coming Soon</h2>
              <p className="mx-auto max-w-md text-gray-500">
                We are currently updating our portfolio for this business. Please contact us to discuss your specific requirements.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-11 items-center rounded bg-brand-sky px-6 font-bold text-white transition-colors hover:bg-brand-navy"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return <ProjectsContent />;
}
