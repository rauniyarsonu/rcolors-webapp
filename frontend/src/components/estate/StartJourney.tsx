import Image from "@/components/ui/Image";
import { ArrowRight } from "lucide-react";

export type JourneyAction = "land" | "projects" | "agents" | "investment";

const CARDS: { action: JourneyAction; title: string; text: string; cta: string; image: string; alt: string }[] = [
  { action: "land", title: "Browse Plots & Land", text: "Residential plots, farm land and commercial land across the city and its outskirts.", cta: "See land & plots", image: "/images/cd03.jpg", alt: "Aerial view of a planned township" },
  { action: "projects", title: "Explore Projects", text: "Upcoming, under-construction and ready projects in one place.", cta: "View projects", image: "/images/home2.jpg", alt: "Cranes over a construction site at dusk" },
  // Agents temporarily hidden from the app; uncomment to restore (and set the grid back to lg:grid-cols-4)
  // { action: "agents", title: "Talk to an Agent", text: "Speak to an advisor who knows the localities you're considering.", cta: "Find an agent", image: "/images/home4.1.jpg", alt: "Two people shaking hands over a property agreement" },
  { action: "investment", title: "Get Investment Guidance", text: "Identify high-potential properties for long-term growth.", cta: "Ask for guidance", image: "/images/home4.2.jpg", alt: "House keys being handed over after a sale" },
];

export default function StartJourney({ onAction }: { onAction: (a: JourneyAction) => void }) {
  return (
    <section aria-labelledby="es-journey" className="bg-white py-16 md:py-20">
      <div className="es-container">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-es-accent-strong">Get started</p>
        <h2 id="es-journey" className="mt-2 font-display text-3xl font-bold tracking-tight text-es-ink md:text-4xl">
          Start Your Journey
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <li key={c.action}>
              <button
                type="button"
                onClick={() => onAction(c.action)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-es-line bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(15,60,99,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="relative block aspect-[16/10] w-full overflow-hidden bg-es-line">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="font-display text-lg font-bold text-es-ink">{c.title}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-es-muted">{c.text}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-es-accent-strong">
                    {c.cta}
                    <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
