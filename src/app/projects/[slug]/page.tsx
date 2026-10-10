import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import projectsData from "@/data/projects.json";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projectsData.find(p => p.id === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-24 bg-gray-50">
      {/* Header Banner */}
      <section data-aos="fade-up" data-aos-duration="1000" className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end px-4 overflow-hidden">
        <Image 
          src={project.coverImage || "/images/R Colors Company Profile Final (2)_page-0012.jpg"} 
          alt={project.name} 
          fill 
          className="object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto w-full pb-12">
          <Link href="/projects" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft size={16} className="mr-2" /> Back to Projects
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-brand-sky text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {project.category}
            </span>
            <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {project.status}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-2">
            {project.name}
          </h1>
          
          {project.location && (
            <div className="flex items-center text-gray-200">
              <MapPin size={18} className="mr-2 text-brand-sky" />
              <span className="text-lg">{project.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-brand-navy mb-4">Project Overview</h2>
              <div className="w-16 h-1 bg-brand-sky mb-6"></div>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {project.description}
              </p>
              
              {/* Fallback description if none provided beyond the short one */}
              {project.description.length < 100 && (
                <p className="text-gray-700 leading-relaxed text-lg mt-4">
                  This project highlights R Colors Group&apos;s commitment to quality and excellence. Delivered with precision and attention to detail, it stands as a testament to our expertise in the {project.business.replace('-', ' ')} sector.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-heading font-bold text-brand-navy mb-4 border-b pb-2">Project Details</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Business</span>
                  <span className="font-semibold text-brand-navy capitalize">{project.business.replace('-', ' ')}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="font-semibold text-brand-navy capitalize">{project.category}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className="font-semibold text-brand-navy capitalize">{project.status}</span>
                </li>
                {project.location && (
                  <li className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Location</span>
                    <span className="font-semibold text-brand-navy">{project.location}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-brand-navy p-6 rounded-2xl shadow-sm text-white text-center">
              <h3 className="text-xl font-heading font-bold mb-3">Interested in a similar project?</h3>
              <p className="text-gray-300 text-sm mb-6">Contact our team to discuss your requirements.</p>
              <Link href="/contact" className="block w-full bg-brand-sky text-white py-3 rounded font-bold hover:bg-white hover:text-brand-navy transition-colors">
                Enquire Now
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
