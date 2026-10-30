import { Building2, MapPin } from "lucide-react";
import Image from "@/components/ui/Image";
import { hoverShadow } from "./styles";

const businessNames: Record<string, string> = {
  construction: "R Colors Construction & Developers",
  "r-colors": "R Colors Finishing Works",
  estate: "R Colors Estate",
};

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    business: string;
    location?: string | null;
    company?: string;
    logo?: string | null;
    workDone?: string;
    period?: string;
  };
  /** Portfolio-page variant: adds a border */
  detailed?: boolean;
  /** Use h2 when the card grid sits directly under the page h1 */
  headingLevel?: "h2" | "h3";
}

export const businessName = (business: string) => businessNames[business] ?? business;

/** First letters of the first two capitalised words: "Paras Group" → "PG" */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export default function ProjectCard({ project, detailed = false, headingLevel = "h3" }: ProjectCardProps) {
  const Heading = headingLevel;
  const company = project.company || businessName(project.business);

  return (
    <article
      className={`group relative flex h-full flex-col rounded-lg bg-white p-5 shadow-md after:shadow-xl sm:p-6 ${hoverShadow} ${
        detailed ? "border border-gray-100" : ""
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-2">
        {project.period && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{project.period}</span>}
        <span className="ml-auto rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">Completed</span>
      </div>

      {/* Logo box is wider than tall: most client logos are wordmarks */}
      <div className="mb-5 flex items-center gap-4">
        {project.logo ? (
          <div className="relative h-[72px] w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <Image src={project.logo} alt={`${company} logo`} fill sizes="112px" className="object-contain px-2 py-1.5" />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy to-brand-sky font-heading text-2xl font-extrabold tracking-wide text-white"
          >
            {initials(company)}
          </div>
        )}
        <div className="min-w-0">
          <Heading className="font-heading text-lg font-bold leading-snug text-brand-navy sm:text-xl">{project.name}</Heading>
          <p className="mt-0.5 text-sm text-gray-500">{company}</p>
        </div>
      </div>

      <dl className="mt-auto flex flex-col gap-2.5 border-t border-dashed border-gray-300 pt-4 text-sm sm:text-base">
        {project.location && (
          <div className="flex items-center gap-2.5 text-gray-600">
            <dt className="shrink-0">
              <MapPin size={18} className="text-es-accent-strong" />
              <span className="sr-only">Location</span>
            </dt>
            <dd>{project.location}</dd>
          </div>
        )}
        {project.workDone && (
          <div className="flex items-center gap-2.5 font-bold text-gray-800">
            <dt className="shrink-0">
              <Building2 size={18} className="text-es-accent-strong" />
              <span className="sr-only">Work done</span>
            </dt>
            <dd>{project.workDone}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
