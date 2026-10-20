import Link from "@/components/ui/Link";
import Image from "@/components/ui/Image";
import { hoverShadow } from "./styles";

const FALLBACK_IMAGE = "/images/R Colors Company Profile Final (2)_page-0012.jpg";

const businessNames: Record<string, string> = {
  construction: "R Colors Construction & Developers",
  "r-colors": "R Colors Finishing Works",
  estate: "R Colors Estate",
};

const metaItemClass = "before:inline-block before:w-5 before:text-center before:content-['•']";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    business: string;
    category: string;
    location?: string | null;
    description: string;
    coverImage?: string | null;
  };
  href?: string;
  /** Portfolio-page variant: border, 3-line description and a "View Details" footer */
  detailed?: boolean;
  /** Use h2 when the card grid sits directly under the page h1 */
  headingLevel?: "h2" | "h3";
}

export const businessName = (business: string) => businessNames[business] ?? business;

export default function ProjectCard({ project, href = "/projects", detailed = false, headingLevel = "h3" }: ProjectCardProps) {
  const Heading = headingLevel;
  return (
    <Link
      href={href}
      className={`group relative flex h-full flex-col rounded-lg bg-white shadow-md after:shadow-xl ${hoverShadow} ${
        detailed ? "border border-gray-100" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-200">
        <Image
          src={project.coverImage || FALLBACK_IMAGE}
          alt={project.name}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"
        />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-brand-navy/10 transition-opacity group-hover:opacity-0" />
        <span className="absolute right-4 top-4 z-20 max-w-[calc(100%-2rem)] truncate rounded-full bg-brand-sky px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
          {project.category}
        </span>
      </div>
      <div className="flex flex-grow flex-col p-5 sm:p-6">
        <Heading className="mb-1 font-heading text-xl font-bold text-brand-navy">{project.name}</Heading>
        {/* Every item starts with a "•"; the row is shifted left and clipped, so a bullet
            that lands at the start of a line (first item or after wrapping) is hidden */}
        <div className="mb-3 overflow-hidden text-sm text-gray-500">
          <p className="-ml-5 flex flex-wrap gap-y-0.5">
            <span className={metaItemClass}>{businessName(project.business)}</span>
            {project.location && <span className={`${metaItemClass} whitespace-nowrap`}>{project.location}</span>}
          </p>
        </div>
        <p className={`text-base text-gray-600 md:text-sm ${detailed ? "mb-4 line-clamp-3" : "line-clamp-2"}`}>{project.description}</p>
        {detailed && (
          <span className="mt-auto text-sm font-bold text-brand-sky group-hover:underline">
            View Details <span aria-hidden="true">→</span>
          </span>
        )}
      </div>
    </Link>
  );
}
