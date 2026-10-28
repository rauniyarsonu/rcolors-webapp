import { Building2, Clock, KeyRound, PencilRuler } from "lucide-react";
import Hero from "@/components/construction/Hero";
import Intro from "@/components/construction/Intro";
import Expertise from "@/components/construction/Expertise";
import ClosingCta from "@/components/construction/ClosingCta";
import Highlights, { type HighlightItem } from "@/components/construction/Highlights";

const highlights: HighlightItem[] = [
  { title: "Structural Strength", desc: "Sound structural work as the base of every building we deliver.", icon: Building2 },
  { title: "Modern Design", desc: "Contemporary, functional spaces planned around how they will be used.", icon: PencilRuler },
  { title: "Timely Execution", desc: "Planned schedules and coordinated teams to keep work on track.", icon: Clock },
  { title: "End-to-End Delivery", desc: "One team from planning and structure through finishing and handover.", icon: KeyRound },
];

export default function ConstructionBusinessPage() {
  return (
    // Root layout already provides <main>
    <div className="flex flex-col">
      <Hero />
      <Intro />
      <Highlights items={highlights} />
      <Expertise />

      <ClosingCta
        eyebrow="Proven Track Record"
        title="See Our Work in Action"
        body="Explore our portfolio of completed and ongoing residential landmarks, commercial spaces, and infrastructure developments."
        primary={{ href: "/projects?business=construction", label: "View Construction Projects" }}
        secondary={{ href: "/contact", label: "Discuss Your Requirement" }}
      />
    </div>
  );
}
