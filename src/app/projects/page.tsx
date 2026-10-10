"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import projectsData from "@/data/projects.json";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
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

  const filteredProjects = activeFilter === "all" 
    ? projectsData 
    : projectsData.filter(p => p.business === activeFilter);

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "construction", label: "Construction & Developers" },
    { id: "r-colors", label: "R Colors (Finishing)" },
    { id: "estate", label: "Estate" }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      <PageHeader 
        titlePart1="OUR" 
        titlePart2="PROJECTS" 
      />

      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-12 px-4 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors text-sm md:text-base ${
                activeFilter === filter.id 
                  ? "bg-brand-sky text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                <div className="h-64 relative overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <Image src={project.coverImage || "/images/R Colors Company Profile Final (2)_page-0012.jpg"} alt={project.name} fill className="object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 bg-brand-sky text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {project.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-brand-navy mb-1">{project.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <span className="capitalize">{project.business.replace('-', ' ')}</span>
                      {project.location && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{project.location}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{project.description}</p>
                  </div>
                  <div className="mt-auto">
                     <span className="text-brand-sky font-bold text-sm group-hover:underline">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl font-bold">!</span>
            </div>
            <h3 className="text-2xl font-heading font-bold text-brand-navy mb-2">New Projects Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We are currently updating our portfolio for this business. Please contact us to discuss your specific requirements.
            </p>
            <Link href="/contact" className="inline-block mt-6 bg-brand-sky text-white px-6 py-2 rounded font-bold hover:bg-brand-navy transition-colors">
              Contact Us
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
