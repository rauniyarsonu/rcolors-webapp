import SellForm from "./SellForm";

const STEPS = [
  { title: "Share the details", text: "Tell us what you're selling and where. It takes about a minute." },
  { title: "We verify", text: "Our team calls you, visits the property and checks the title documents." },
  { title: "Get listed", text: "Your property goes live on R Colors Estate and reaches genuine buyers." },
];

/** "Sell Your Property With Us": owners register a property for the team to verify and list */
export default function SellSection({ city }: { city: string }) {
  return (
    <section id="sell" aria-labelledby="es-sell-title" className="bg-white py-16 md:py-20">
      <div className="es-container">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-es-accent-strong">For owners</p>
            <h2 id="es-sell-title" className="mt-2 font-display text-3xl font-bold tracking-tight text-es-ink md:text-4xl">
              Sell Your Property With Us
            </h2>
            <p className="mt-4 leading-relaxed text-es-muted">
              Own a plot, house, flat or commercial space in {city}? Register it with R Colors Estate and we&apos;ll help you find the right buyer.
            </p>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-es-surface font-display font-bold text-es-accent-strong">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-es-ink">{s.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-es-muted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg border border-es-line bg-white p-6 shadow-[0_10px_30px_-18px_rgba(15,60,99,0.35)] sm:p-8 md:col-span-3">
            <SellForm city={city} />
          </div>
        </div>
      </div>
    </section>
  );
}
