import { Manrope } from "next/font/google";
import Hero from "@/components/construction/Hero";
import DivisionSwitcher from "@/components/construction/DivisionSwitcher";
import Intro from "@/components/construction/Intro";
import Expertise from "@/components/construction/Expertise";
import ClosingCta from "@/components/construction/ClosingCta";

// Heading face for this page only, so other routes don't download it
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function ConstructionBusinessPage() {
  return (
    // Root layout already provides <main>; this wrapper scopes the cx tokens and font
    <div className={`cx ${manrope.variable} flex flex-col bg-cx-paper text-cx-ink`}>
      <Hero />
      <DivisionSwitcher current="/businesses/construction" />
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
