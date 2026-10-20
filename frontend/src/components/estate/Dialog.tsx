import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it still labels the dialog) */
  hideTitle?: boolean;
  /** "center" for modals, "sheet" for the mobile bottom sheet */
  variant?: "center" | "sheet";
  className?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Native <dialog> modal: the browser handles focus trapping, Escape and the
 * inert background. Focus returns to the opener on close.
 */
export default function Dialog({ open, onClose, title, hideTitle, variant = "center", className = "", footer, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) {
      document.documentElement.style.overflow = "";
      if (opener.current instanceof HTMLElement) opener.current.focus();
      opener.current = null;
    }
  }, [open]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const shape =
    variant === "sheet"
      ? "mt-auto mb-0 w-full max-w-none rounded-t-xl max-h-[88dvh]"
      : "w-[min(100vw-2rem,880px)] max-h-[min(92dvh,900px)] rounded-lg";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, outside the panel)
        if (e.target === e.currentTarget) onClose();
      }}
      className={`es m-auto overflow-hidden bg-white p-0 text-es-body shadow-2xl backdrop:bg-es-ink/60 open:flex open:flex-col ${shape} ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-es-line px-5 py-3 md:px-6">
        <h2 id={titleId} className={hideTitle ? "sr-only" : "font-display text-lg font-bold text-es-ink"}>
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-es-muted transition-colors hover:bg-es-surface hover:text-es-ink"
          aria-label="Close"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{open ? children : null}</div>
      {footer && open ? <div className="border-t border-es-line bg-white px-5 py-3 md:px-6">{footer}</div> : null}
    </dialog>
  );
}
