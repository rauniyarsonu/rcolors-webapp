import { useState } from "react";
import { BadgeCheck, Check, Link as LinkIcon, MapPin, Phone } from "lucide-react";
import { FACINGS, FURNISHING, LISTING_STATUSES, PROJECT_STATUSES, PROJECT_TYPES, PROPERTY_TYPES } from "@/config/estate/catalog";
import type { AreaUnit } from "@/config/estate/units";
import { totalPrice, type EngineContext } from "@/lib/estate/engine";
import { formatArea, formatDate, formatNumber, formatPhone, formatPrice, formatPriceLong } from "@/lib/estate/format";
import { ancestors } from "@/lib/estate/locationTree";
import type { CityBundle, Project, Property } from "@/lib/estate/schema";
import ListingImage from "./ListingImage";
import { areaText } from "./PropertyCard";

const yesNo = (v?: boolean) => (v === undefined ? undefined : v ? "Yes" : "No");

function Gallery({ images, kind, title }: { images: string[]; kind: "land" | "property" | "project"; title: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <ListingImage src={images[i]} alt={images.length ? `${title}, photo ${i + 1} of ${images.length}` : title} kind={kind} sizes="(min-width: 900px) 880px, 100vw" zoom={false} className="aspect-[16/9] w-full" />
      {images.length > 1 && (
        <div className="es-scroll-x flex gap-2 px-5 pt-3 md:px-6">
          {images.map((src, n) => (
            <button
              key={src + n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              aria-pressed={n === i}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded border-2 ${n === i ? "border-es-accent-strong" : "border-transparent"}`}
            >
              <ListingImage src={src} alt="" sizes="80px" zoom={false} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Facts({ rows }: { rows: [string, string | undefined][] }) {
  const shown = rows.filter((r): r is [string, string] => !!r[1]);
  return (
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {shown.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-es-line py-2.5 text-sm">
          <dt className="text-es-muted">{k}</dt>
          <dd className="text-right font-medium text-es-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard unavailable: the URL bar still holds the shareable link */
        }
      }}
      className="flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-es-line px-4 text-sm font-semibold text-es-ink hover:border-es-ink"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}

const placeLine = (slug: string, ctx: EngineContext) =>
  [ctx.locationName(slug), ...ancestors(ctx.index, slug).filter((a) => a.type !== "state").map((a) => a.name)].join(", ");

interface PropertyDetailProps {
  property: Property;
  bundle: CityBundle;
  ctx: EngineContext;
  unit: AreaUnit;
  onEnquire: () => void;
  onViewProject: (id: string) => void;
}

export function PropertyDetail({ property: p, bundle, ctx, unit, onEnquire, onViewProject }: PropertyDetailProps) {
  const type = PROPERTY_TYPES[p.type];
  const a = p.attributes;
  const price = totalPrice(p);
  const sqft = ctx.areaSqft(p);
  const agent = p.agentId ? bundle.agents.find((x) => x.id === p.agentId) : undefined;
  const project = p.projectId ? bundle.projects.find((x) => x.id === p.projectId) : undefined;

  return (
    <div>
      <Gallery images={p.images} kind={type.category} title={p.title} />
      <div className="space-y-6 px-5 py-5 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-es-surface px-2 py-1 text-xs font-semibold text-es-ink">{type.label}</span>
              {p.verified && (
                <span className="flex items-center gap-1 rounded bg-es-accent-strong px-2 py-1 text-xs font-semibold text-white">
                  <BadgeCheck size={14} aria-hidden="true" />
                  Verified{p.verifiedOn ? ` on ${formatDate(p.verifiedOn)}` : ""}
                </span>
              )}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-es-muted">
              <MapPin size={15} aria-hidden="true" />
              {placeLine(p.locationSlug, ctx)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-es-ink">
              <span aria-hidden="true">{formatPrice(price)}</span>
              <span className="sr-only">{formatPriceLong(price)}</span>
            </p>
            {sqft ? <p className="text-sm text-es-muted">≈ ₹{formatNumber(Math.round(price / sqft), 0)} per sq ft</p> : null}
          </div>
        </div>

        {p.description && <p className="leading-relaxed text-es-body">{p.description}</p>}

        <Facts
          rows={[
            ["Area", areaText(p, ctx, unit === p.areaUnit ? "sqft" : unit)],
            ["Price", p.priceUnit === "per-area" ? `${formatPrice(p.price)} per ${formatArea(1, p.areaUnit).replace(/^1 /, "")}` : undefined],
            ["Status", LISTING_STATUSES[p.status]],
            ["BHK", a.bhk ? String(a.bhk) : undefined],
            ["Bathrooms", a.bathrooms ? String(a.bathrooms) : undefined],
            ["Floor", a.floor !== undefined ? (a.floor === 0 ? "Ground" : String(a.floor)) + (a.totalFloors ? ` of ${a.totalFloors}` : "") : a.totalFloors ? `${a.totalFloors} floors` : undefined],
            ["Furnishing", a.furnishing ? FURNISHING[a.furnishing] : undefined],
            ["Age", a.ageYears !== undefined ? `${a.ageYears} years` : undefined],
            ["Possession", a.possession],
            ["Facing", a.facing ? FACINGS[a.facing] : undefined],
            ["Road width", a.roadWidth ? `${a.roadWidth} ft` : undefined],
            ["Corner plot", yesNo(a.cornerPlot)],
            ["Boundary wall", yesNo(a.boundaryWall)],
            ["Land use", a.landUse],
            ["From highway", a.distanceFromHighway !== undefined ? `${a.distanceFromHighway} km` : undefined],
            ["Title documents checked", yesNo(a.titleDocsVerified)],
            ["Listed on", formatDate(p.postedAt)],
            ["Listing ID", p.id],
          ]}
        />

        {project && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-es-line p-4">
            <p className="text-sm text-es-body">
              Part of <strong className="text-es-ink">{project.name}</strong>
            </p>
            <button type="button" onClick={() => onViewProject(project.id)} className="min-h-[44px] text-sm font-semibold text-es-accent-strong hover:underline">
              View project
            </button>
          </div>
        )}

        {agent && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-es-surface p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-es-muted">Listed by</p>
              <p className="font-semibold text-es-ink">{agent.name}</p>
              <p className="text-sm text-es-muted">{agent.role}</p>
            </div>
            <a href={`tel:+91${agent.phone}`} className="flex min-h-[44px] items-center gap-2 rounded-md border border-es-line bg-white px-4 text-sm font-semibold text-es-ink hover:border-es-ink">
              <Phone size={16} aria-hidden="true" />
              {formatPhone(agent.phone)}
            </a>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onEnquire} className="min-h-[48px] flex-1 rounded-md bg-es-accent-strong px-6 font-bold text-white hover:bg-es-ink">
            Enquire about this {type.category === "land" ? "land" : "property"}
          </button>
          <CopyLink />
        </div>
      </div>
    </div>
  );
}

interface ProjectDetailProps {
  project: Project;
  bundle: CityBundle;
  ctx: EngineContext;
  onEnquire: () => void;
  onShowListings: (project: Project) => void;
}

export function ProjectDetail({ project: p, bundle, ctx, onEnquire, onShowListings }: ProjectDetailProps) {
  const listings = bundle.properties.filter((x) => x.projectId === p.id).length;
  return (
    <div>
      <Gallery images={p.images} kind="project" title={p.name} />
      <div className="space-y-6 px-5 py-5 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-es-surface px-2 py-1 text-xs font-semibold text-es-ink">{PROJECT_TYPES[p.type].label}</span>
              <span className="rounded bg-es-surface px-2 py-1 text-xs font-semibold text-es-ink">{PROJECT_STATUSES[p.status]}</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-es-muted">
              <MapPin size={15} aria-hidden="true" />
              {placeLine(p.locationSlug, ctx)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-es-muted">Starting from</p>
            <p className="font-display text-3xl font-bold text-es-ink">
              <span aria-hidden="true">{formatPrice(p.startingPrice)}</span>
              <span className="sr-only">{formatPriceLong(p.startingPrice)}</span>
            </p>
          </div>
        </div>
        {p.description && <p className="leading-relaxed text-es-body">{p.description}</p>}
        <Facts
          rows={[
            ["Developer", p.developer],
            ["Sizes", p.sizeRange],
            ["Status", PROJECT_STATUSES[p.status]],
            ["RERA registration", p.reraId],
            ["Project ID", p.id],
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onEnquire} className="min-h-[48px] flex-1 rounded-md bg-es-accent-strong px-6 font-bold text-white hover:bg-es-ink">
            Enquire about this project
          </button>
          {listings > 0 && (
            <button type="button" onClick={() => onShowListings(p)} className="min-h-[44px] rounded-md border border-es-line px-4 text-sm font-semibold text-es-ink hover:border-es-ink">
              See {listings} listing{listings > 1 ? "s" : ""} here
            </button>
          )}
          <CopyLink />
        </div>
      </div>
    </div>
  );
}
