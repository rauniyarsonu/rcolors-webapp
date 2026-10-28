import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { Building2, Landmark, MapPin, Search } from "lucide-react";
import { suggest, type EngineContext, type Suggestion } from "@/lib/estate/engine";
import type { CityBundle } from "@/lib/estate/schema";

interface SearchBarProps {
  bundle: CityBundle;
  ctx: EngineContext;
  /** Current keyword in the URL */
  keyword: string;
  onKeyword: (q: string) => void;
  onPick: (s: Suggestion) => void;
  disabled?: boolean;
}

const ICON = { location: MapPin, landmark: Landmark, project: Building2 } as const;

/**
 * Combobox (ARIA 1.2 pattern): typing suggests areas, landmarks and projects
 * in the selected city; picking one applies a filter, Enter on free text
 * runs a keyword search.
 */
export default function SearchBar({ bundle, ctx, keyword, onKeyword, onPick, disabled }: SearchBarProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [text, setText] = useState(keyword);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const deferred = useDeferredValue(text);
  // Projects temporarily hidden from the app; drop the filter to restore project suggestions
  const items = useMemo(() => suggest(deferred, bundle, ctx).filter((s) => s.kind !== "project"), [deferred, bundle, ctx]);

  // Keep the box in sync when the keyword changes elsewhere (chip removed, back button)
  useEffect(() => setText(keyword), [keyword]);
  useEffect(() => setActive(-1), [deferred]);

  const showList = open && items.length > 0;

  const choose = (s: Suggestion) => {
    setOpen(false);
    setText("");
    onPick(s);
  };
  const submit = () => {
    if (showList && active >= 0) return choose(items[active]);
    setOpen(false);
    onKeyword(text.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (items.length ? (i + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (items.length ? (i <= 0 ? items.length - 1 : i - 1) : -1));
    } else if (e.key === "Escape") {
      if (showList) {
        e.preventDefault();
        setOpen(false);
      } else setText("");
    }
  };

  return (
    <form
      role="search"
      className="flex flex-1 flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="relative flex-1">
        <label htmlFor={`${uid}-input`} className="sr-only">
          Search by locality, village or landmark
        </label>
        <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-es-muted" />
        <input
          id={`${uid}-input`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${uid}-opt-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          disabled={disabled}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder="Search by locality, village or landmark"
          className="h-[52px] w-full rounded-md border border-es-line bg-white pl-11 pr-4 text-base text-es-ink outline-none transition-colors placeholder:text-es-muted hover:border-slate-400 focus:border-es-accent-strong focus:ring-2 focus:ring-es-accent-strong/25 disabled:bg-slate-50"
        />
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          hidden={!showList}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-80 overflow-y-auto rounded-md border border-es-line bg-white py-1 shadow-lg"
        >
          {items.map((s, i) => {
            const Icon = ICON[s.kind];
            return (
              <li
                key={s.id}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(s)}
                onMouseEnter={() => setActive(i)}
                className={`flex min-h-[48px] cursor-pointer items-center gap-3 px-4 py-2 ${i === active ? "bg-es-surface" : ""}`}
              >
                <Icon size={18} aria-hidden="true" className="shrink-0 text-es-accent-strong" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-es-ink">{s.label}</span>
                  <span className="block truncate text-xs text-es-muted">{s.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-md bg-es-accent-strong px-7 text-[15px] font-bold text-white transition-colors hover:bg-es-ink disabled:opacity-60"
      >
        <Search size={18} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
