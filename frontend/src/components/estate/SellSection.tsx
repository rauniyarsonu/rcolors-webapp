import { BadgeCheck, Phone } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { ESTATE } from "@/config/estate/site";
import { formatPhone } from "@/lib/estate/format";
import SellForm from "./SellForm";

const STEPS = [
  { title: "Share the details", text: "Tell us what you're selling and where. It takes about a minute." },
  { title: "We verify", text: "Our team calls you, visits the property and checks the title documents." },
  { title: "Get listed", text: "Your property goes live on R Colors Estate and reaches genuine buyers." },
];

/** "Sell Your Property With Us": owners register a property for the team to verify and list */
export default function SellSection({ city }: { city: string }) {
  return (
    <section id="sell" aria-labelledby="es-sell-title" className="section-y bg-es-surface">
      <div className="site-container">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-es-line bg-white shadow-[0_24px_60px_-30px_rgba(15,60,99,0.45)] lg:grid-cols-5">
          <div className="es-on-dark relative isolate flex flex-col overflow-hidden bg-brand-navy p-8 text-white sm:p-10 lg:col-span-2">
            <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-sky/25 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

            <SectionHeading id="es-sell-title" eyebrow="For Owners" title="Sell Your Property With Us" bar align="left" tone="dark" />
            <p className="mt-6 leading-relaxed text-white/80">
              Own a plot, house, flat or commercial space in {city}? Register it with R Colors Estate and we&apos;ll help you find the right buyer.
            </p>

            <ol className="mt-10">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-white/20" />}
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-sky/50 bg-brand-sky/15 font-display text-sm font-bold text-brand-sky"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1.5">
                    <span className="block font-semibold">{s.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/70">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10 border-t border-white/15 pt-6 lg:mt-auto">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <BadgeCheck size={18} aria-hidden="true" className="text-brand-sky" />
                Free to register, no obligation to sell
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Prefer to talk?</p>
              <ul className="mt-2 flex flex-wrap gap-x-6">
                {ESTATE.company.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:+91${p}`} className="flex min-h-[44px] items-center gap-2 font-semibold hover:text-sky-300">
                      <Phone size={16} aria-hidden="true" className="text-brand-sky" />
                      {formatPhone(p)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:col-span-3">
            <SellForm city={city} />
          </div>
        </div>
      </div>
    </section>
  );
}
