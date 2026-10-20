import { useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams as useRouterSearchParams } from "react-router-dom";

/** Pass as navigation state to keep the scroll position (Next's `scroll: false`) */
export const KEEP_SCROLL = { scroll: false } as const;

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  return useRouterSearchParams()[0];
}

/** push/replace with an optional `{ scroll: false }`; stable across renders */
export function useRouter() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  return useMemo(() => {
    const go = (href: string, replace: boolean, opts?: { scroll?: boolean }) =>
      navigateRef.current(href, { replace, state: opts?.scroll === false ? KEEP_SCROLL : undefined });
    return {
      push: (href: string, opts?: { scroll?: boolean }) => go(href, false, opts),
      replace: (href: string, opts?: { scroll?: boolean }) => go(href, true, opts),
      back: () => navigateRef.current(-1),
    };
  }, []);
}
