import { useRef } from "react";
import { Building2, Handshake, House, Users, type LucideIcon } from "lucide-react";
import { TABS, type Tab } from "@/config/estate/catalog";

const ICONS: Record<Tab, LucideIcon> = { buy: House, projects: Building2, agents: Users };

interface SearchTabsProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  panelId: string;
  /** "Source Selling" is not a search tab yet; clicking it shows a launching-soon notice */
  onSourceSelling: () => void;
}

/** WAI-ARIA tabs with roving tabindex: arrows/Home/End move and activate */
export default function SearchTabs({ active, onChange, panelId, onSourceSelling }: SearchTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = TABS.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(TABS[next].key);
  };

  return (
    <div className="es-scroll-x flex gap-1">
      <div role="tablist" aria-label="Search for" className="flex gap-1">
        {TABS.map((tab, i) => {
          const Icon = ICONS[tab.key];
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`es-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`relative flex min-h-[48px] shrink-0 items-center gap-2 rounded-t-md px-5 text-[15px] font-semibold transition-colors md:px-7 ${
                selected ? "bg-white text-es-ink" : "bg-es-ink/55 text-white hover:bg-es-ink/75"
              }`}
            >
              <Icon size={18} aria-hidden="true" className={selected ? "text-es-accent-strong" : ""} />
              {tab.label}
              {selected && <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-es-accent-strong" />}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onSourceSelling}
        className="flex min-h-[48px] shrink-0 items-center gap-2 rounded-t-md bg-es-ink/55 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-es-ink/75 md:px-7"
      >
        <Handshake size={18} aria-hidden="true" />
        Source Selling
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">Soon</span>
      </button>
    </div>
  );
}
