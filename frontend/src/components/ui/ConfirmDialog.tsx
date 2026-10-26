import { useEffect, useId, useRef } from "react";
import { LoaderCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** What will happen, in a sentence or two */
  children: React.ReactNode;
  confirmLabel: string;
  /** Red confirm button for deletes and other things that can't be undone */
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Small confirm modal on a native <dialog> (focus trap, Escape and inert
 * background come from the browser). Focus starts on Cancel and returns to the
 * opener on close. estate/Dialog is a large, estate-themed panel, so this is separate.
 */
export default function ConfirmDialog({ open, title, children, confirmLabel, danger = false, busy = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      if (opener.current instanceof HTMLElement) opener.current.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[min(100vw-2rem,440px)] rounded-xl bg-white p-0 text-gray-800 shadow-2xl backdrop:bg-brand-navy/60"
    >
      <div className="p-6">
        <h2 id={titleId} className="mb-2 font-heading text-lg font-bold text-brand-navy">
          {title}
        </h2>
        <div id={bodyId} className="text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 font-semibold text-gray-700 transition-colors hover:border-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 font-bold text-white transition-colors disabled:opacity-70 ${
            danger ? "bg-red-700 hover:bg-red-800" : "bg-es-accent-strong hover:bg-brand-navy"
          }`}
        >
          {busy && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
