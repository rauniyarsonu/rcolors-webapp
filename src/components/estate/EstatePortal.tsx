"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, SlidersHorizontal, X } from "lucide-react";
import { PROJECT_TYPES, PROPERTY_TYPES, SEGMENTS, type Segment, type Tab } from "@/config/estate/catalog";
import { sortsFor } from "@/config/estate/filters";
import { ESTATE } from "@/config/estate/site";
import {
  clearFilters,
  countActiveFilters,
  createContext,
  localityCounts,
  runQuery,
  trendingLocations,
  withSegment,
  withTab,
  type QueryState,
  type Suggestion,
} from "@/lib/estate/engine";
import type { Agent, City, CityBundle, Project, Property } from "@/lib/estate/schema";
import { serializeQuery } from "@/lib/estate/url";
import AgentCard from "./AgentCard";
import { activeChips } from "./chips";
import CitySelect from "./CitySelect";
import { PropertyDetail, ProjectDetail } from "./DetailView";
import Dialog from "./Dialog";
import EmptyState from "./EmptyState";
import EnquiryForm, { type EnquiryContext } from "./EnquiryForm";
import EnquirySection from "./EnquirySection";
import EstateHero from "./EstateHero";
import FilterPanel, { type Update } from "./FilterPanel";
import LocalityStrip from "./LocalityStrip";
import ProjectCard from "./ProjectCard";
import PropertyCard from "./PropertyCard";
import SearchBar from "./SearchBar";
import SearchTabs from "./SearchTabs";
import StartJourney, { type JourneyAction } from "./StartJourney";
import TrendingChips from "./TrendingChips";
import { useQueryState } from "./useQueryState";

interface EstatePortalProps {
  bundle: CityBundle;
  cities: City[];
  /** Server-rendered starting state (e.g. a locality landing page presets loc) */
  initialState: QueryState;
  /** Path that query-string updates are written to */
  basePath: string;
  heroTitle?: string;
  /** Server-rendered sections placed between "Start Your Journey" and the enquiry form */
  children?: React.ReactNode;
}

const PANEL_ID = "es-results-panel";
const scrollToId = (id: string) => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
};

function headingFor(state: QueryState, place: string): string {
  if (state.tab === "projects") return `Projects in ${place}`;
  if (state.tab === "agents") return `Property Agents in ${place}`;
  const prefix: Record<Segment, string> = { all: "Properties & Land", land: "Land & Plots", residential: "Houses & Flats", commercial: "Commercial Property" };
  return `${prefix[state.segment]} in ${place}`;
}

export default function EstatePortal({ bundle, cities, initialState, basePath, heroTitle, children }: EstatePortalProps) {
  const router = useRouter();
  const [state, setState] = useQueryState(initialState, basePath);
  const ctx = useMemo(() => createContext(bundle), [bundle]);
  const city = bundle.city;

  const [citySelected, setCitySelected] = useState(!ESTATE.REQUIRE_CITY_SELECTION);
  const [shown, setShown] = useState<number>(ESTATE.PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<EnquiryContext | null>(null);
  const [formContext, setFormContext] = useState<EnquiryContext | undefined>();
  const baseTitle = useRef<string | null>(null);

  const update: Update = useCallback((fn, opts) => setState(fn, opts), [setState]);

  /* ---------- derived data ---------- */
  const results = useMemo(() => runQuery(bundle, state, ctx) as (Property | Project | Agent)[], [bundle, state, ctx]);
  const areas = useMemo(() => localityCounts(bundle, state, ctx), [bundle, state, ctx]);
  const trending = useMemo(() => trendingLocations(bundle, ctx, ESTATE.TRENDING_LIMIT), [bundle, ctx]);
  const chips = useMemo(() => activeChips(state, ctx), [state, ctx]);
  const activeCount = countActiveFilters(state);
  const single = state.loc.length === 1 ? state.loc[0] : null;
  const place = single ? `${ctx.locationName(single)}, ${city.name}` : city.name;
  const heading = headingFor(state, place);

  // Reset paging whenever the query changes
  const queryKey = serializeQuery({ ...state, view: undefined });
  useEffect(() => setShown(ESTATE.PAGE_SIZE), [queryKey]);

  // Title follows a single selected locality
  useEffect(() => {
    baseTitle.current ??= document.title;
    document.title = single && !initialState.loc.length ? `Properties & Land in ${ctx.locationName(single)}, ${city.name} | ${ESTATE.brand}` : baseTitle.current;
  }, [single, ctx, city.name, initialState.loc.length]);

  // Legacy/hub links like /businesses/estate?city=kanpur go to that city's page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("city");
    if (!wanted) return;
    params.delete("city");
    if (wanted !== city.slug && cities.some((c) => c.slug === wanted)) {
      const rest = params.toString();
      router.replace(`${ESTATE.basePath}/${wanted}${rest ? `?${rest}` : ""}`);
    } else {
      const rest = params.toString();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${rest ? `?${rest}` : ""}`);
    }
  }, [city.slug, cities, router]);

  /* ---------- actions ---------- */
  const goToResults = () => requestAnimationFrame(() => scrollToId("es-results"));

  const changeCity = (slug: string) => {
    setCitySelected(true);
    if (slug === city.slug) return;
    const qs = serializeQuery({ ...state, loc: [], q: "", view: undefined });
    router.push(`${ESTATE.basePath}/${slug}${qs ? `?${qs}` : ""}`);
  };

  const pickSuggestion = (s: Suggestion) => {
    if (s.kind === "project") update((st) => ({ ...withTab(st, "projects"), view: s.projectId }));
    else update((st) => ({ ...st, loc: st.loc.includes(s.slug) ? st.loc : [...st.loc, s.slug] }));
    goToResults();
  };

  const toggleLoc = (slug: string) => update((s) => ({ ...s, loc: s.loc.includes(slug) ? s.loc.filter((x) => x !== slug) : [...s.loc, slug] }));

  const enquireProperty = (p: Property) =>
    setEnquiry({ subject: p.title, reference: p.id, city: city.name, interest: PROPERTY_TYPES[p.type].interest });
  const enquireProject = (p: Project) => setEnquiry({ subject: p.name, reference: p.id, city: city.name, interest: PROJECT_TYPES[p.type].interest });
  const enquireAgent = (a: Agent) => setEnquiry({ subject: `${a.name} (${a.role})`, reference: a.id, city: city.name });
  const enquireGeneral = () => setEnquiry({ subject: `${heading}`, city: city.name });

  const onJourney = (a: JourneyAction) => {
    if (a === "investment") {
      setFormContext({ interest: "investment", city: city.name });
      requestAnimationFrame(() => {
        scrollToId("enquire");
        document.querySelector<HTMLElement>("#enquire input")?.focus({ preventScroll: true });
      });
      return;
    }
    update((s) => (a === "land" ? withSegment(withTab(s, "buy"), "land") : withTab(s, a)));
    goToResults();
  };

  const nearby = useMemo(() => {
    const out = new Set<string>();
    for (const slug of state.loc) for (const n of ctx.index.bySlug.get(slug)?.nearby ?? []) if (!state.loc.includes(n) && ctx.index.bySlug.has(n)) out.add(n);
    return Array.from(out);
  }, [state.loc, ctx]);

  /* ---------- detail view ---------- */
  const viewProperty = state.view ? bundle.properties.find((p) => p.id === state.view) : undefined;
  const viewProject = state.view && !viewProperty ? bundle.projects.find((p) => p.id === state.view) : undefined;
  const closeView = () => update((s) => ({ ...s, view: undefined }));
  const openView = (id: string) => update((s) => ({ ...s, view: id }));

  /* ---------- render ---------- */
  const sorts = sortsFor(state.tab);
  const visible = results.slice(0, shown);
  const showResults = citySelected;

  const emptyTitle = single ? `No ${state.tab === "agents" ? "agents" : state.tab === "projects" ? "projects" : "listings"} in ${ctx.locationName(single)} yet` : "No results match these filters";

  const filterPanel = <FilterPanel bundle={bundle} ctx={ctx} state={state} update={update} />;

  return (
    <div className="bg-white">
      <EstateHero cityName={city.name} title={heroTitle} />

      {/* Tabs + search card overlap the hero's lower edge */}
      <div className="es-container relative z-10 -mt-28 md:-mt-32">
        <SearchTabs active={state.tab} onChange={(tab: Tab) => update((s) => withTab(s, tab))} panelId={PANEL_ID} />
        <div className="rounded-b-lg rounded-tr-lg border border-es-line bg-white p-4 shadow-[0_18px_40px_-20px_rgba(15,60,99,0.45)] md:p-5">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="md:w-56 md:shrink-0">
              <CitySelect id="es-city" cities={cities} value={citySelected ? city.slug : ""} onChange={changeCity} requireSelection={ESTATE.REQUIRE_CITY_SELECTION} />
            </div>
            <SearchBar
              bundle={bundle}
              ctx={ctx}
              keyword={state.q}
              disabled={!citySelected}
              onKeyword={(q) => {
                update((s) => ({ ...s, q }));
                goToResults();
              }}
              onPick={pickSuggestion}
            />
          </div>
          {citySelected && (
            <div className="mt-4 border-t border-es-line pt-4">
              <TrendingChips
                locations={trending}
                selected={state.loc}
                onPick={(slug) => {
                  update((s) => ({ ...s, loc: s.loc.length === 1 && s.loc[0] === slug ? [] : [slug] }));
                  goToResults();
                }}
              />
            </div>
          )}
        </div>
      </div>

      {!showResults ? (
        <div className="es-container py-16 text-center">
          <p className="font-display text-xl font-semibold text-es-ink">
            {cities.length === 1 ? `Select ${cities[0].name} to browse properties and land` : "Select a city to browse properties and land"}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <LocalityStrip cityName={city.name} areas={areas} selected={state.loc} onToggle={toggleLoc} onAll={() => update((s) => ({ ...s, loc: [] }))} />
          </div>

          <section id="es-results" aria-labelledby="es-results-heading" className="bg-es-surface pb-16 pt-8 md:pt-10">
            <div id={PANEL_ID} role="tabpanel" aria-labelledby={`es-tab-${state.tab}`} key={state.tab} className="es-fade">
              <div className="es-container">
                {/* Heading, segment, count, sort */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <h2 id="es-results-heading" className="font-display text-2xl font-bold tracking-tight text-es-ink md:text-3xl">
                      {heading}
                    </h2>
                    <p className="mt-1 text-sm text-es-muted" aria-live="polite" aria-atomic="true">
                      Showing {Math.min(shown, results.length)} of {results.length} {results.length === 1 ? "result" : "results"}
                    </p>
                  </div>
                  {state.tab === "buy" && (
                    <fieldset className="min-w-0">
                      <legend className="sr-only">Category</legend>
                      <div className="es-scroll-x flex rounded-md border border-es-line bg-white p-1">
                        {SEGMENTS.map((seg) => {
                          const on = state.segment === seg.value;
                          return (
                            <label key={seg.value} className="relative shrink-0">
                              <input
                                type="radio"
                                name="es-segment"
                                value={seg.value}
                                checked={on}
                                onChange={() => update((s) => withSegment(s, seg.value))}
                                className="peer sr-only"
                              />
                              <span
                                className={`flex min-h-[40px] cursor-pointer items-center rounded px-4 text-sm font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-es-accent-strong ${
                                  on ? "bg-es-ink text-white" : "text-es-body hover:bg-es-surface"
                                }`}
                              >
                                {seg.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}
                </div>

                {/* Sticky summary bar: filters button on small screens, sort everywhere */}
                <div className="sticky top-16 z-20 -mx-4 mt-5 flex items-center gap-2 border-y border-es-line bg-es-surface/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-es-surface/80 md:-mx-8 md:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="flex min-h-[44px] items-center gap-2 rounded-md border border-es-line bg-white px-4 text-sm font-semibold text-es-ink hover:border-es-ink lg:hidden"
                  >
                    <SlidersHorizontal size={16} aria-hidden="true" />
                    Filters
                    {activeCount > 0 && <span className="rounded-full bg-es-accent-strong px-2 py-0.5 text-xs text-white">{activeCount}</span>}
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    <label htmlFor="es-sort" className="hidden text-sm text-es-muted sm:block">
                      Sort by
                    </label>
                    <select
                      id="es-sort"
                      value={state.sort}
                      onChange={(e) => update((s) => ({ ...s, sort: e.target.value }))}
                      aria-label="Sort results"
                      className="min-h-[44px] rounded-md border border-es-line bg-white px-3 text-sm font-semibold text-es-ink outline-none focus:border-es-accent-strong"
                    >
                      {sorts.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {chips.length > 0 && (
                  <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
                    {chips.map((chip) => (
                      <li key={chip.id}>
                        <button
                          type="button"
                          onClick={() => update(chip.remove)}
                          className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-es-accent-strong/40 bg-white pl-3.5 pr-2.5 text-sm text-es-ink hover:border-es-accent-strong"
                          aria-label={`Remove filter: ${chip.label}`}
                        >
                          {chip.label}
                          <X size={14} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                    <li>
                      <button type="button" onClick={() => update((s) => clearFilters(s))} className="min-h-[36px] px-2 text-sm font-semibold text-es-accent-strong hover:underline">
                        Clear all
                      </button>
                    </li>
                  </ul>
                )}

                <div className="mt-6 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
                  <aside aria-label="Filters" className="hidden lg:block">
                    <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-es-line bg-white p-5">{filterPanel}</div>
                  </aside>

                  <div className="min-w-0">
                    {results.length === 0 ? (
                      <EmptyState
                        title={emptyTitle}
                        body={single ? "We're adding listings here. Try a nearby area or tell us what you need." : "Try removing a filter, or tell us what you're looking for and we'll find it."}
                        nearbyNames={nearby.map((n) => ctx.locationName(n))}
                        onNearby={nearby.length ? () => update((s) => ({ ...s, loc: [...s.loc, ...nearby] })) : undefined}
                        onClear={activeCount ? () => update((s) => clearFilters(s)) : undefined}
                        onEnquire={enquireGeneral}
                      />
                    ) : (
                      <>
                        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                          {visible.map((r) => (
                            <li key={r.id} className="flex">
                              <div className="flex w-full flex-col [&>article]:flex-1">
                                {state.tab === "buy" && (
                                  <PropertyCard property={r as Property} ctx={ctx} cityName={city.name} unit={state.unit} onView={openView} onEnquire={enquireProperty} />
                                )}
                                {state.tab === "projects" && <ProjectCard project={r as Project} ctx={ctx} cityName={city.name} onView={openView} onEnquire={enquireProject} />}
                                {state.tab === "agents" && <AgentCard agent={r as Agent} ctx={ctx} onEnquire={enquireAgent} />}
                              </div>
                            </li>
                          ))}
                        </ul>
                        {results.length > shown && (
                          <div className="mt-8 flex justify-center">
                            <button
                              type="button"
                              onClick={() => setShown((n) => n + ESTATE.PAGE_SIZE)}
                              className="flex min-h-[48px] items-center gap-2 rounded-md border border-es-ink bg-white px-6 text-sm font-semibold text-es-ink hover:bg-es-ink hover:text-white"
                            >
                              <ArrowDown size={16} aria-hidden="true" />
                              Load more ({results.length - shown} more)
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <StartJourney onAction={onJourney} />
      {children}
      <EnquirySection key={formContext?.interest ?? "default"} context={formContext} />

      {/* Mobile filters: bottom sheet */}
      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        variant="sheet"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => update((s) => clearFilters(s))}
              disabled={!activeCount}
              className="min-h-[48px] flex-1 rounded-md border border-es-line font-semibold text-es-ink disabled:opacity-50"
            >
              Clear all
            </button>
            <button type="button" onClick={() => setFiltersOpen(false)} className="min-h-[48px] flex-[2] rounded-md bg-es-accent-strong font-bold text-white">
              Show {results.length} {results.length === 1 ? "result" : "results"}
            </button>
          </div>
        }
      >
        <div className="px-5 py-4">{filterPanel}</div>
      </Dialog>

      {/* Detail view (deep-linkable via ?view=<id>) */}
      <Dialog open={!!(viewProperty || viewProject)} onClose={closeView} title={viewProperty?.title ?? viewProject?.name ?? "Details"}>
        {viewProperty && (
          <PropertyDetail
            property={viewProperty}
            bundle={bundle}
            ctx={ctx}
            unit={state.unit}
            onEnquire={() => enquireProperty(viewProperty)}
            onViewProject={(id) => update((s) => ({ ...withTab(s, "projects"), view: id }))}
          />
        )}
        {viewProject && (
          <ProjectDetail
            project={viewProject}
            bundle={bundle}
            ctx={ctx}
            onEnquire={() => enquireProject(viewProject)}
            onShowListings={(p) => {
              update((s) => ({ ...withTab(s, "buy"), q: p.name, view: undefined }));
              goToResults();
            }}
          />
        )}
      </Dialog>

      {/* Enquiry modal, pre-filled with the listing, project or agent */}
      <Dialog open={!!enquiry} onClose={() => setEnquiry(null)} title="Send an enquiry" className="md:w-[min(100vw-2rem,600px)]">
        <div className="px-5 py-5 md:px-6">{enquiry && <EnquiryForm context={enquiry} onDone={() => setEnquiry(null)} />}</div>
      </Dialog>

      <SampleBanner bundle={bundle} />
    </div>
  );
}

/** Development-only reminder that sample records are on screen */
function SampleBanner({ bundle }: { bundle: CityBundle }) {
  const [hidden, setHidden] = useState(false);
  if (process.env.NODE_ENV === "production" || hidden) return null;
  const n = [...bundle.properties, ...bundle.projects, ...bundle.agents].filter((r) => r.isSample).length;
  if (!n) return null;
  return (
    <div role="note" className="fixed bottom-4 left-4 z-40 flex max-w-xs items-start gap-3 rounded-md bg-amber-100 px-4 py-3 text-sm text-amber-950 shadow-lg ring-1 ring-amber-300">
      <span>
        <strong>Dev only:</strong> {n} [SAMPLE] records render on this page. Replace them before launch (see docs/ADDING-DATA.md).
      </span>
      <button type="button" onClick={() => setHidden(true)} aria-label="Hide sample data notice" className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-amber-200">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
