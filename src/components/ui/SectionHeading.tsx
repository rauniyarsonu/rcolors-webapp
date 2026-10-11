type Align = "center" | "left" | "responsive";

interface SectionHeadingProps {
  title: React.ReactNode;
  /** Small uppercase label above the title */
  eyebrow?: string;
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

/** Eyebrow + h2 (+ optional bar and intro copy) used by every homepage section */
export default function SectionHeading({
  title,
  eyebrow,
  bar = false,
  align = "center",
  tone = "light",
  id,
  className = "",
  children,
}: SectionHeadingProps) {
  return (
    <div className={`${alignClass[align]} ${className}`}>
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-sky md:text-base">{eyebrow}</p>
      )}
      <h2
        id={id}
        className={`text-balance font-heading text-3xl font-black leading-tight md:text-4xl ${
          tone === "dark" ? "text-white" : "text-brand-navy"
        }`}
      >
        {title}
      </h2>
      {bar && <div aria-hidden="true" className={`mt-4 h-1 w-20 bg-brand-sky md:w-24 ${barAlignClass[align]}`} />}
      {children}
    </div>
  );
}
