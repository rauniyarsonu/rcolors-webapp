"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { LOCATION_TYPE_LABELS } from "@/config/estate/catalog";
import { filtersFor, type FilterDef, type LocationFilterDef, type MultiFilterDef, type RangeFilterDef, type SearchFilterDef, type ToggleFilterDef } from "@/config/estate/filters";
import { AREA_UNITS, UNIT_CHOICES, type AreaUnit } from "@/config/estate/units";
import { facetOptions, localityCounts, rangeBounds, type AreaCount, type EngineContext, type QueryState } from "@/lib/estate/engine";
import { formatPrice, parsePrice } from "@/lib/estate/format";
import type { CityBundle } from "@/lib/estate/schema";
import { useDebounced } from "./useQueryState";

export type Update = (fn: (s: QueryState) => QueryState, opts?: { replace?: boolean }) => void;

interface FilterPanelProps {
  bundle: CityBundle;
  ctx: EngineContext;
  state: QueryState;
  update: Update;
}

/**
 * Renders every filter that config/estate/filters.ts declares for the
 * current tab and segment. Each filter type maps to one generic control, so
 * new filters need no changes here.
 */
export default function FilterPanel({ bundle, ctx, state, update }: FilterPanelProps) {
  const defs = filtersFor(state.tab, state.segment).filter((d) => d.type !== "segmented");
  return (
    <div className="divide-y divide-es-line">
      {defs.map((def) => (
        <FilterField key={`${state.tab}-${def.key}`} def={def} bundle={bundle} ctx={ctx} state={state} update={update} />
      ))}
    </div>
  );
}

function FilterField(props: { def: FilterDef } & FilterPanelProps) {
  const { def } = props;
  switch (def.type) {
    case "location":
      return <LocationField {...props} def={def} />;
    case "multi":
      return <MultiField {...props} def={def} />;
    case "range":
      return <RangeField {...props} def={def} />;
    case "toggle":
      return <ToggleField {...props} def={def} />;
    case "search":
      return <SearchField {...props} def={def} />;
    default:
      return null;
  }
}

const Section = ({ legend, children, aside }: { legend: string; children: React.ReactNode; aside?: React.ReactNode }) => (
  <fieldset className="min-w-0 py-5 first:pt-0">
    <legend className="float-left flex min-h-[36px] items-center text-sm font-bold text-es-ink">{legend}</legend>
    {aside && <div className="float-right flex min-h-[36px] items-center">{aside}</div>}
    <div className="clear-both pt-2">{children}</div>
  </fieldset>
);

/* ---------- location tree ---------- */

function LocationField({ def, bundle, ctx, state, update }: { def: LocationFilterDef } & FilterPanelProps) {
  const uid = useId();
  const [filter, setFilter] = useState("");
  const areas = useMemo(() => localityCounts(bundle, state, ctx), [bundle, state, ctx]);

  // Group by parent; results first within each group
  const children = useMemo(() => {
    const map = new Map<string, AreaCount[]>();
    for (const a of areas) map.set(a.parentSlug, [...(map.get(a.parentSlug) ?? []), a]);
    map.forEach((list) => list.sort((a, b) => Number(b.count > 0) - Number(a.count > 0)));
    return map;
  }, [areas]);

  const term = filter.trim().toLowerCase();
  const matches = (a: AreaCount): boolean =>
    !term ||
    a.location.name.toLowerCase().includes(term) ||
    (a.location.aliases ?? []).some((x) => x.toLowerCase().includes(term)) ||
    (children.get(a.location.slug) ?? []).some(matches);

  const toggle = (slug: string) =>
    update((s) => ({ ...s, loc: s.loc.includes(slug) ? s.loc.filter((x) => x !== slug) : [...s.loc, slug] }));

  const renderLevel = (parent: string, depth: number): React.ReactNode => {
    const list = (children.get(parent) ?? []).filter(matches);
    if (!list.length) return null;
    return (
      <ul className={depth ? "ml-4 border-l border-es-line pl-2" : ""}>
        {list.map((a) => {
          const checked = state.loc.includes(a.location.slug);
          const id = `${uid}-${a.location.slug}`;
          return (
            <li key={a.location.slug}>
              <label htmlFor={id} className="flex min-h-[40px] cursor-pointer items-center gap-3 rounded px-1.5 hover:bg-es-surface">
                <input id={id} type="checkbox" checked={checked} onChange={() => toggle(a.location.slug)} className="peer sr-only" />
                <CheckBox checked={checked} />
                <span className={`flex-1 text-sm ${a.count ? "text-es-body" : "text-es-muted"}`}>
                  {a.location.name}
                  {a.location.type !== "locality" && <span className="ml-1.5 text-xs text-es-muted">{LOCATION_TYPE_LABELS[a.location.type]}</span>}
                </span>
                <span className="text-xs tabular-nums text-es-muted">{a.count}</span>
              </label>
              {renderLevel(a.location.slug, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Section
      legend={def.label}
      aside={
        state.loc.length ? (
          <button type="button" onClick={() => update((s) => ({ ...s, loc: [] }))} className="min-h-[32px] text-xs font-semibold text-es-accent-strong hover:underline">
            Clear
          </button>
        ) : null
      }
    >
      <div className="relative mb-2">
        <label htmlFor={`${uid}-q`} className="sr-only">
          Find a locality
        </label>
        <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-es-muted" />
        <input
          id={`${uid}-q`}
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Find a locality or village"
          className="h-11 w-full rounded-md border border-es-line pl-9 pr-3 text-sm outline-none focus:border-es-accent-strong focus:ring-2 focus:ring-es-accent-strong/25"
        />
      </div>
      <div className="max-h-72 overflow-y-auto pr-1">{renderLevel(ctx.citySlug, 0) ?? <p className="py-2 text-sm text-es-muted">No matching areas</p>}</div>
    </Section>
  );
}

const CheckBox = ({ checked }: { checked: boolean }) => (
  <span
    aria-hidden="true"
    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-es-accent-strong peer-focus-visible:ring-offset-1 ${
      checked ? "border-es-accent-strong bg-es-accent-strong text-white" : "border-slate-400 bg-white"
    }`}
  >
    {checked && <Check size={14} strokeWidth={3} />}
  </span>
);

/* ---------- multi select (pills) ---------- */

function MultiField({ def, bundle, ctx, state, update }: { def: MultiFilterDef } & FilterPanelProps) {
  const uid = useId();
  const options = useMemo(() => facetOptions(def, bundle, state, ctx), [def, bundle, state, ctx]);
  const selected = state.multi[def.key] ?? [];
  if (!options.length) return null;

  const toggle = (value: string) =>
    update((s) => {
      const cur = s.multi[def.key] ?? [];
      return { ...s, multi: { ...s.multi, [def.key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] } };
    });

  return (
    <Section legend={def.label}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          const id = `${uid}-${o.value}`;
          return (
            <div key={o.value}>
              <input id={id} type="checkbox" checked={on} onChange={() => toggle(o.value)} className="peer sr-only" />
              <label
                htmlFor={id}
                className={`flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-es-accent-strong peer-focus-visible:ring-offset-2 ${
                  on
                    ? "border-es-accent-strong bg-es-accent-strong/10 font-semibold text-es-accent-strong"
                    : `border-es-line bg-white hover:border-es-accent-strong ${o.count ? "text-es-body" : "text-es-muted"}`
                }`}
              >
                {on && <Check size={14} aria-hidden="true" />}
                {o.label}
                <span className="text-xs tabular-nums opacity-80">({o.count})</span>
              </label>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- range (typed inputs + dual slider) ---------- */

const niceStep = (span: number) => {
  if (span <= 0) return 1;
  const raw = span / 100;
  const pow = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10;
};

const shortPrice = (n: number) => formatPrice(n).replace("₹", "");

function RangeField({ def, bundle, ctx, state, update }: { def: RangeFilterDef } & FilterPanelProps) {
  const uid = useId();
  const current = state.range[def.key] ?? {};
  const bounds = useMemo(() => rangeBounds(def, bundle, state, ctx), [def, bundle, state, ctx]);
  const toText = (n?: number) => (n === undefined ? "" : def.format === "currency" ? shortPrice(n) : String(n));
  const [text, setText] = useState({ min: toText(current.min), max: toText(current.max) });
  const [slide, setSlide] = useState<{ min?: number; max?: number }>(current);

  // Re-sync when the value changes elsewhere (chip removed, back button, unit change)
  useEffect(() => {
    setText({ min: toText(current.min), max: toText(current.max) });
    setSlide(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.min, current.max, state.unit]);

  const parse = (v: string) => {
    if (!v.trim()) return undefined;
    const n = def.format === "currency" ? parsePrice(v) : Number(v.replace(/,/g, ""));
    return n !== null && Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const commit = (next: { min?: number; max?: number }) =>
    update(
      (s) => {
        const range = { ...s.range };
        let { min, max } = next;
        if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
        if (min === undefined && max === undefined) delete range[def.key];
        else range[def.key] = { min, max };
        return { ...s, range };
      },
      { replace: true },
    );
  const commitSoon = useDebounced(commit, 450);

  const onText = (side: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = { ...text, [side]: e.target.value };
    setText(t);
    commitSoon({ min: parse(t.min), max: parse(t.max) });
  };

  const step = bounds ? niceStep(bounds.max - bounds.min) : 1;
  const lo = bounds ? Math.floor(bounds.min / step) * step : 0;
  const hi = bounds ? Math.ceil(bounds.max / step) * step : 0;
  const sMin = Math.max(lo, Math.min(slide.min ?? lo, hi));
  const sMax = Math.min(hi, Math.max(slide.max ?? hi, lo));
  const pct = (v: number) => (hi > lo ? ((v - lo) / (hi - lo)) * 100 : 0);
  const fmt = (n: number) => (def.format === "currency" ? formatPrice(n) : `${n.toLocaleString("en-IN")}${def.format === "area" ? ` ${AREA_UNITS[state.unit].label}` : def.suffix ? ` ${def.suffix}` : ""}`);

  const onSlide = (side: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const next = side === "min" ? { ...slide, min: Math.min(v, sMax) } : { ...slide, max: Math.max(v, sMin) };
    // The full extent means "no limit" on that side
    const clean = { min: next.min !== undefined && next.min > lo ? next.min : undefined, max: next.max !== undefined && next.max < hi ? next.max : undefined };
    setSlide(next);
    setText({ min: toText(clean.min), max: toText(clean.max) });
    commitSoon(clean);
  };

  const unitChoices = def.unitAware ? UNIT_CHOICES[state.segment] : [];
  const changeUnit = (unit: AreaUnit) =>
    update((s) => {
      const from = ctx.filterAreaToSqft(1, s.unit);
      const to = ctx.filterAreaToSqft(1, unit);
      const r = s.range[def.key];
      const conv = (n?: number) => (n === undefined || !from || !to ? undefined : Math.round(((n * from) / to) * 100) / 100);
      const range = { ...s.range };
      if (r) range[def.key] = { min: conv(r.min), max: conv(r.max) };
      return { ...s, unit, range };
    });

  const inputCls = "h-11 w-full rounded-md border border-es-line px-3 text-sm outline-none focus:border-es-accent-strong focus:ring-2 focus:ring-es-accent-strong/25";
  const hint = def.format === "currency" ? "e.g. 45 L or 1.2 Cr" : undefined;

  return (
    <Section
      legend={def.label}
      aside={
        unitChoices.length > 1 ? (
          <>
            <label htmlFor={`${uid}-unit`} className="sr-only">
              Area unit
            </label>
            <select
              id={`${uid}-unit`}
              value={state.unit}
              onChange={(e) => changeUnit(e.target.value as AreaUnit)}
              className="h-9 rounded-md border border-es-line bg-white px-2 text-sm font-medium text-es-ink outline-none focus:border-es-accent-strong"
            >
              {unitChoices.map((u) => (
                <option key={u} value={u}>
                  {AREA_UNITS[u].label}
                </option>
              ))}
            </select>
          </>
        ) : def.suffix ? (
          <span className="text-xs text-es-muted">in {def.suffix}</span>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${uid}-min`} className="mb-1 block text-xs font-medium text-es-muted">
            Min{def.format === "currency" ? " (₹)" : ""}
          </label>
          <input id={`${uid}-min`} inputMode="decimal" value={text.min} onChange={onText("min")} placeholder="No min" aria-describedby={hint ? `${uid}-hint` : undefined} className={inputCls} />
        </div>
        <div>
          <label htmlFor={`${uid}-max`} className="mb-1 block text-xs font-medium text-es-muted">
            Max{def.format === "currency" ? " (₹)" : ""}
          </label>
          <input id={`${uid}-max`} inputMode="decimal" value={text.max} onChange={onText("max")} placeholder="No max" aria-describedby={hint ? `${uid}-hint` : undefined} className={inputCls} />
        </div>
      </div>
      {hint && (
        <p id={`${uid}-hint`} className="mt-1.5 text-xs text-es-muted">
          {hint}
        </p>
      )}
      {bounds && hi > lo && (
        <div className="mt-3">
          <div className="relative h-11">
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-es-line" />
            <div aria-hidden="true" className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-es-accent-strong" style={{ left: `${pct(sMin)}%`, right: `${100 - pct(sMax)}%` }} />
            <input type="range" className="es-range" min={lo} max={hi} step={step} value={sMin} onChange={onSlide("min")} aria-label={`${def.label} minimum`} aria-valuetext={fmt(sMin)} />
            <input type="range" className="es-range" min={lo} max={hi} step={step} value={sMax} onChange={onSlide("max")} aria-label={`${def.label} maximum`} aria-valuetext={fmt(sMax)} />
          </div>
          <div aria-hidden="true" className="flex justify-between text-xs text-es-muted">
            <span>{fmt(lo)}</span>
            <span>{fmt(hi)}</span>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ---------- toggle ---------- */

function ToggleField({ def, state, update }: { def: ToggleFilterDef } & FilterPanelProps) {
  const uid = useId();
  const on = !!state.toggle[def.key];
  return (
    <Section legend={def.label}>
      <label htmlFor={uid} className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3">
        <span className="text-sm text-es-body">{def.toggleLabel}</span>
        <input id={uid} type="checkbox" role="switch" checked={on} onChange={() => update((s) => ({ ...s, toggle: { ...s.toggle, [def.key]: !on } }))} className="peer sr-only" />
        <span
          aria-hidden="true"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-es-accent-strong peer-focus-visible:ring-offset-2 ${on ? "bg-es-accent-strong" : "bg-slate-300"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
        </span>
      </label>
    </Section>
  );
}

/* ---------- text search ---------- */

function SearchField({ def, state, update }: { def: SearchFilterDef } & FilterPanelProps) {
  const uid = useId();
  const value = state.search[def.key] ?? "";
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const commitSoon = useDebounced((v: string) => update((s) => ({ ...s, search: { ...s.search, [def.key]: v } }), { replace: true }), 300);
  return (
    <Section legend={def.label}>
      <label htmlFor={uid} className="sr-only">
        {def.label}
      </label>
      <div className="relative">
        <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-es-muted" />
        <input
          id={uid}
          type="search"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            commitSoon(e.target.value);
          }}
          placeholder={def.placeholder}
          className="h-11 w-full rounded-md border border-es-line pl-9 pr-3 text-sm outline-none focus:border-es-accent-strong focus:ring-2 focus:ring-es-accent-strong/25"
        />
      </div>
    </Section>
  );
}
