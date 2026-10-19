import { useCallback, useEffect, useRef, useState } from "react";
import type { QueryState } from "@/lib/estate/engine";
import { parseQuery, serializeQuery } from "@/lib/estate/url";

type Updater = QueryState | ((prev: QueryState) => QueryState);

/**
 * Portal state that lives in the URL query. The server renders `initial`
 * (so pages stay static and crawlable); after hydration the query string
 * takes over, and back/forward restore earlier states.
 *
 * `basePath` is where updates are written: a locality landing page writes
 * to its city path, so ?loc= in the query is the single source of truth.
 */
export function useQueryState(initial: QueryState, basePath: string) {
  const [state, setState] = useState(initial);
  const stateRef = useRef(state);
  const initialRef = useRef(initial);

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const next = Array.from(params.keys()).some((k) => k !== "city") ? parseQuery(params) : initialRef.current;
      stateRef.current = next;
      setState(next);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const update = useCallback(
    (next: Updater, opts: { replace?: boolean } = {}) => {
      const value = typeof next === "function" ? next(stateRef.current) : next;
      stateRef.current = value;
      setState(value);
      const qs = serializeQuery(value);
      const url = qs ? `${basePath}?${qs}` : basePath;
      if (url !== window.location.pathname + window.location.search) {
        window.history[opts.replace ? "replaceState" : "pushState"](window.history.state, "", url);
      }
    },
    [basePath],
  );

  return [state, update] as const;
}

/** Debounced callback for text and range inputs */
export function useDebounced<A extends unknown[]>(fn: (...args: A) => void, ms = 300) {
  const fnRef = useRef(fn);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  fnRef.current = fn;
  useEffect(() => () => clearTimeout(timer.current), []);
  return useCallback(
    (...args: A) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fnRef.current(...args), ms);
    },
    [ms],
  );
}
