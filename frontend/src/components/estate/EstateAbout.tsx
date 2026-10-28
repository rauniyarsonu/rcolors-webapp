import { BadgeCheck, FileCheck, KeyRound, TrendingUp } from "lucide-react";
import Highlights, { type HighlightItem } from "@/components/construction/Highlights";
import Intro from "./Intro";
import Services from "./Services";

const highlights: HighlightItem[] = [
  { title: "Verified Listings", desc: "Every plot, home and shop is checked by our team before it reaches buyers.", icon: BadgeCheck },
  { title: "Proper Documentation", desc: "Clear titles and paperwork handled with care at every step of the deal.", icon: FileCheck },
  { title: "Investment Insight", desc: "Guidance on high-potential properties for long-term growth and returns.", icon: TrendingUp },
  { title: "Search to Keys", desc: "One team from your first search through negotiation and handover.", icon: KeyRound },
];

/** Company content in the construction / R Colors style: intro, highlights band and service rows */
export default function EstateAbout() {
  return (
    <>
      <Intro />
      <Highlights items={highlights} />
      <Services />
    </>
  );
}
