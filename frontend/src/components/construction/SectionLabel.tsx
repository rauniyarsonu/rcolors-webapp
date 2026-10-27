interface SectionLabelProps {
  index: string;
  label: string;
  tone?: "light" | "dark";
}

export default function SectionLabel({ index, label, tone = "light" }: SectionLabelProps) {
  const onDark = tone === "dark";
  return (
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em]">
      <span className="text-brand-sky font-bold">{index}</span>
      <span aria-hidden="true" className={onDark ? "text-white/40" : "text-cx-muted/70"}>
        :
      </span>
      <span className={onDark ? "text-white/75" : "text-cx-muted"}>{label}</span>
    </p>
  );
}
