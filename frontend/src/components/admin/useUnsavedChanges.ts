import { useEffect } from "react";

const MESSAGE = "You have unsaved changes. Leave this page without saving?";

/**
 * Warns before leaving with unsaved changes: closing/reloading the tab
 * (beforeunload) and clicking an in-app link. The app uses <BrowserRouter>, where
 * react-router's useBlocker isn't available, so links are caught at the document.
 * The browser's Back button isn't covered.
 */
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== window.location.origin) return;
      if (a.pathname === window.location.pathname && a.hash) return;
      if (!window.confirm(MESSAGE)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    // Capture phase: runs before React Router's link handler
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);
}

/** For buttons that navigate or sign out */
export const confirmLeave = (dirty: boolean) => !dirty || window.confirm(MESSAGE);
