import { Manrope } from "next/font/google";
import Hero from "@/components/r-colors/Hero";
import Intro from "@/components/r-colors/Intro";
import Services from "@/components/r-colors/Services";
import DivisionSwitcher from "@/components/construction/DivisionSwitcher";
import ClosingCta from "@/components/construction/ClosingCta";

// Heading face for this page only, so other routes don't download it
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RColorsFinishingPage() {
  return (
    // Root layout already provides <main>; this wrapper scopes the cx tokens and font
    <div className={`cx ${manrope.variable} flex flex-col bg-cx-paper text-cx-ink`}>
      <Hero />
      <DivisionSwitcher current="/businesses/r-colors" />
      <Intro />
      <Services />
      <ClosingCta
        eyebrow="Transforming Spaces"
        title="Explore Our Finishing Projects"
        body="See how we transform spaces with our premium finishing and interior solutions."
        primary={{ href: "/projects?business=r-colors", label: "View Portfolio" }}
        secondary={{ href: "/contact", label: "Discuss Your Requirement" }}
      />
    </div>
  );
}
