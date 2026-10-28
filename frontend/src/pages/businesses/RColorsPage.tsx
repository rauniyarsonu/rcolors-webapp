import Hero from "@/components/r-colors/Hero";
import Intro from "@/components/r-colors/Intro";
import Services from "@/components/r-colors/Services";
import ClosingCta from "@/components/construction/ClosingCta";

export default function RColorsFinishingPage() {
  return (
    // Root layout already provides <main>
    <div className="flex flex-col">
      <Hero />
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
