import { useRef } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { smallInputClass } from "./ui";

interface ListEditorProps {
  id: string;
  label: string;
  /** Button text, e.g. "Add responsibility" */
  addLabel: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  error?: string;
}

/** Rows of text with add / remove / move up / move down, for the job's bullet lists */
export default function ListEditor({ id, label, addLabel, items, onChange, placeholder, error }: ListEditorProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const focusRow = (index: number) =>
    requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLInputElement>("input")[index]?.focus());

  const move = (from: number, to: number) => {
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
    focusRow(to);
  };

  const iconButton =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="mb-2 block text-sm font-medium text-gray-700">
        {label} <span className="font-normal text-gray-500">(optional)</span>
      </legend>
      {items.length > 0 && (
        <ol ref={listRef} className="mb-2 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <label htmlFor={`${id}-${i}`} className="sr-only">
                {label} item {i + 1}
              </label>
              <input
                id={`${id}-${i}`}
                value={item}
                maxLength={500}
                placeholder={placeholder}
                onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onChange([...items.slice(0, i + 1), "", ...items.slice(i + 1)]);
                    focusRow(i + 1);
                  }
                }}
                className={`${smallInputClass} min-w-0 flex-1`}
              />
              <button type="button" className={iconButton} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move item ${i + 1} up`}>
                <ArrowUp size={16} aria-hidden="true" />
              </button>
              <button type="button" className={iconButton} disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move item ${i + 1} down`}>
                <ArrowDown size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${iconButton} hover:text-red-700`}
                onClick={() => {
                  onChange(items.filter((_, j) => j !== i));
                  focusRow(Math.max(0, i - 1));
                }}
                aria-label={`Remove item ${i + 1}`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        disabled={items.length >= 30}
        onClick={() => {
          onChange([...items, ""]);
          focusRow(items.length);
        }}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-es-accent-strong hover:underline disabled:opacity-50"
      >
        <Plus size={16} aria-hidden="true" /> {addLabel}
      </button>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}
