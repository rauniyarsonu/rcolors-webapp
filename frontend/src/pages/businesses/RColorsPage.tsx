import { Clock, Paintbrush, Ruler, ShieldCheck } from "lucide-react";
import Hero from "@/components/r-colors/Hero";
import Intro from "@/components/r-colors/Intro";
import Services from "@/components/r-colors/Services";
import ClosingCta from "@/components/construction/ClosingCta";
import Highlights, { type HighlightItem } from "@/components/construction/Highlights";

const highlights: HighlightItem[] = [
  { title: "Precision", desc: "Careful surface preparation and attention to detail on every finish.", icon: Ruler },
  { title: "Professional Workmanship", desc: "Experienced teams working to defined quality standards.", icon: Paintbrush },
  { title: "Timely Execution", desc: "Structured processes that keep each project on schedule.", icon: Clock },
  { title: "Lasting Value", desc: "Durable materials and finishes built for long-term performance.", icon: ShieldCheck },
];

export default function RColorsFinishingPage() {
  return (
    // Root layout already provides <main>
    <div className="flex flex-col">
      <Hero />
      <Intro />
      <Highlights items={highlights} />
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
