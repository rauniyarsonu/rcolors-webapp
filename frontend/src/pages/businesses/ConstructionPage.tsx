import { manrope } from "@/lib/fonts";
import Hero from "@/components/construction/Hero";
import Intro from "@/components/construction/Intro";
import Expertise from "@/components/construction/Expertise";
import ClosingCta from "@/components/construction/ClosingCta";

export default function ConstructionBusinessPage() {
  return (
    // Root layout already provides <main>; this wrapper scopes the cx tokens and font
    <div className={`cx ${manrope.variable} flex flex-col bg-cx-paper text-cx-ink`}>
      <Hero />
      <Intro />
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
