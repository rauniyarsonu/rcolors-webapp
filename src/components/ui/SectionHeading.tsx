type Align = "center" | "left" | "responsive";

interface SectionHeadingProps {
  title: React.ReactNode;
  /** Small uppercase label above the title */
  eyebrow?: string;
  /** One-line supporting copy below the title / bar */
  subtitle?: string;
  /** Sky underline bar below the title */
  bar?: boolean;
  /** "responsive" = centered on mobile, left-aligned from md */
  align?: Align;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

const alignClass: Record<Align, string> = {
  center: "text-center",
  left: "text-left",
  responsive: "text-center md:text-left",
};

const barAlignClass: Record<Align, string> = {
  center: "mx-auto",
  left: "",
  responsive: "mx-auto md:mx-0",
};

/** Eyebrow + h2 (+ optional bar, subtitle and intro copy) used by every homepage section */
export default function SectionHeading({
  title,
  eyebrow,
  subtitle,
  bar = false,
  align = "center",
  tone = "light",
  id,
  className = "",
  children,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`${alignClass[align]} ${className}`}>
      {eyebrow && (
        // sky-700 on light (AA); brand sky on navy
        <p className={`mb-2 text-sm font-bold uppercase tracking-widest md:text-base ${dark ? "text-brand-sky" : "text-es-accent-strong"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`text-balance font-heading text-3xl font-black leading-tight md:text-4xl ${dark ? "text-white" : "text-brand-navy"}`}
      >
        {title}
      </h2>
      {bar && <div aria-hidden="true" className={`mt-4 h-1 w-20 rounded-full bg-brand-sky md:w-24 ${barAlignClass[align]}`} />}
      {subtitle && (
        <p className={`mt-4 text-pretty text-base leading-relaxed md:text-lg ${dark ? "text-gray-300" : "text-gray-600"} ${align === "center" ? "mx-auto max-w-2xl" : ""}`}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
