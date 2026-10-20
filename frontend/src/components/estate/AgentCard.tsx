import { Languages, MapPin, MessageCircle, Phone } from "lucide-react";
import { SPECIALIZATIONS } from "@/config/estate/catalog";
import type { EngineContext } from "@/lib/estate/engine";
import { formatPhone } from "@/lib/estate/format";
import type { Agent } from "@/lib/estate/schema";
import ListingImage from "./ListingImage";

interface AgentCardProps {
  agent: Agent;
  ctx: EngineContext;
  onEnquire: (a: Agent) => void;
}

const MAX_AREAS = 3;

export default function AgentCard({ agent: a, ctx, onEnquire }: AgentCardProps) {
  const areas = a.areasServed.map((s) => (s === ctx.citySlug ? `All of ${ctx.locationName(s)}` : ctx.locationName(s)));
  const action = "flex min-h-[44px] items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-colors";

  return (
    <article className="flex flex-col rounded-lg border border-es-line bg-white p-5 transition duration-200 hover:border-slate-300 hover:shadow-[0_10px_30px_-12px_rgba(15,60,99,0.25)]">
      <div className="flex items-center gap-4">
        <ListingImage src={a.photo} alt={a.photo ? `Photo of ${a.name}` : ""} kind="agent" sizes="64px" zoom={false} className="h-16 w-16 shrink-0 rounded-full" />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-snug text-es-ink">{a.name}</h3>
          <p className="text-sm text-es-muted">{a.role}</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Specializations">
        {a.specializations.map((s) => (
          <li key={s} className="rounded-full bg-es-surface px-2.5 py-1 text-xs font-semibold text-es-accent-strong">
            {SPECIALIZATIONS[s]}
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm text-es-body">
        <div className="flex gap-2">
          <dt className="shrink-0">
            <MapPin size={15} aria-label="Areas served" className="mt-0.5 text-es-accent-strong" />
          </dt>
          <dd>
            {areas.slice(0, MAX_AREAS).join(", ")}
            {areas.length > MAX_AREAS && <span className="text-es-muted"> +{areas.length - MAX_AREAS} more</span>}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0">
            <Languages size={15} aria-label="Languages" className="mt-0.5 text-es-accent-strong" />
          </dt>
          <dd>{a.languages.join(", ")}</dd>
        </div>
      </dl>

      <div className={`mt-auto grid gap-2 pt-5 ${a.whatsapp ? "grid-cols-3" : "grid-cols-2"}`}>
        <a href={`tel:+91${a.phone}`} className={`${action} border border-es-line text-es-ink hover:border-es-ink`} aria-label={`Call ${a.name} on ${formatPhone(a.phone)}`}>
          <Phone size={16} aria-hidden="true" />
          Call
        </a>
        {a.whatsapp && (
          <a
            href={`https://wa.me/91${a.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${action} border border-es-line text-es-ink hover:border-es-ink`}
            aria-label={`WhatsApp ${a.name} (opens in a new tab)`}
          >
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp
          </a>
        )}
        <button type="button" onClick={() => onEnquire(a)} className={`${action} bg-es-accent-strong text-white hover:bg-es-ink`} aria-label={`Enquire with ${a.name}`}>
          Enquire
        </button>
      </div>
    </article>
  );
}
