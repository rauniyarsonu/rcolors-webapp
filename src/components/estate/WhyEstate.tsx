import { Building2, CircleCheck, Handshake, Map, TrendingUp } from "lucide-react";

const EXPERTISE = [
  "Residential Plot Sales",
  "Ready-to-Move Property Sales",
  "Commercial Property Deals",
  "Source Selling & Project Marketing",
  "Investment Consultancy",
  "Joint Development Partnerships",
  "Property Sourcing & Channel Sales",
];

const SERVICES = [
  {
    title: "Residential & Commercial Sales",
    desc: "We deal in plots, houses, flats, shops, and commercial spaces with proper documentation and verified listings.",
    icon: Building2,
  },
  {
    title: "Property Source Selling & Channel Partner Services",
    desc: "We work with developers and builders to market and sell residential and commercial projects, connecting genuine buyers for smooth and efficient deals.",
    icon: Handshake,
  },
  {
    title: "Investment Guidance",
    desc: "We help clients identify high-potential properties for long-term growth and strong returns with strategic planning and expert insights.",
    icon: TrendingUp,
  },
  {
    title: "Partnership & Land Development",
    desc: "We work with landowners and developers to create profitable development opportunities and joint ventures.",
    icon: Map,
  },
];

/** The original page's intro, expertise list and four service blocks, as a clean text grid */
export default function WhyEstate() {
  return (
    <section aria-labelledby="es-why" className="border-t border-es-line bg-white py-16 md:py-20">
      <div className="es-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-es-accent-strong">Why R Colors Estate</p>
            <h2 id="es-why" className="mt-2 font-display text-3xl font-bold tracking-tight text-es-ink md:text-4xl">
              Connecting You to the Right Property Solutions
            </h2>
            <p className="mt-5 leading-relaxed text-es-body">
              R Colors Estate specializes in property sales, plot development, and real estate partnerships. We connect buyers, investors, and developers through transparent and
              reliable property solutions.
            </p>
            <p className="mt-4 leading-relaxed text-es-body">
              Whether you are looking for a residential plot, commercial space, or investment opportunity, our experienced team ensures a seamless and professional experience.
            </p>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-es-ink">Our Expertise</h3>
            <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {EXPERTISE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-es-body">
                  <CircleCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-es-accent-strong" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-lg border border-es-line bg-es-line sm:grid-cols-2">
            {SERVICES.map(({ title, desc, icon: Icon }) => (
              <li key={title} className="flex flex-col bg-white p-6 md:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-es-surface text-es-accent-strong">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-es-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-es-muted">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
