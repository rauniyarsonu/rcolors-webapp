import { forwardRef, useState } from "react";
import { CircleAlert, FileText, Upload, X } from "lucide-react";
import { RESUME_RULES } from "@/config/careers";
import { formatBytes } from "@/lib/careers/format";
import { errorTextClass } from "./formStyles";

interface ResumeInputProps {
  id: string;
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}

/**
 * Drag-and-drop or click to pick a résumé. The real <input type="file"> stays in
 * the tab order (visually hidden), so the picker works from the keyboard and
 * screen readers announce it with its label, hint and error.
 */
const ResumeInput = forwardRef<HTMLInputElement, ResumeInputProps>(function ResumeInput({ id, file, error, onChange }, ref) {
  const [dragging, setDragging] = useState(false);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div>
      <span id={`${id}-label`} className="mb-2 block text-sm font-medium text-gray-700">
        CV / Résumé <span aria-hidden="true">*</span>
      </span>
      {file ? (
        <div className={`flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3 ${error ? "border-red-600" : "border-gray-300"}`}>
          <FileText size={24} aria-hidden="true" className="shrink-0 text-es-accent-strong" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy"
            aria-label={`Remove ${file.name}`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) onChange(dropped);
        }}
        className={`${file ? "sr-only" : "flex"} cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:border-brand-sky focus-within:ring-2 focus-within:ring-brand-sky ${
          dragging ? "border-brand-sky bg-brand-sky/5" : error ? "border-red-600 bg-white" : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <Upload size={28} aria-hidden="true" className="text-es-accent-strong" />
        <span className="font-semibold text-brand-navy">
          {file ? "Replace file" : "Drag your CV here, or click to choose a file"}
        </span>
        <span id={hintId} className="text-sm text-gray-500">
          {RESUME_RULES.hint}
        </span>
        <input
          ref={ref}
          id={id}
          name="resume"
          type="file"
          accept={RESUME_RULES.accept}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          aria-invalid={!!error}
          required
          onChange={(e) => {
            onChange(e.target.files?.[0] ?? null);
            // Allow picking the same file again after removing it
            e.target.value = "";
          }}
        />
      </label>
      {error ? (
        <p id={errorId} className={errorTextClass}>
          <CircleAlert size={14} className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default ResumeInput;
