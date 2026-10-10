import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "primary-on-dark" | "outline-light" | "outline-dark";

const variants: Record<Variant, string> = {
  primary: "bg-brand-sky text-white hover:bg-brand-navy",
  "primary-on-dark": "bg-brand-sky text-white hover:bg-white hover:text-brand-navy shadow-md",
  "outline-light": "border border-white/50 text-white hover:border-white hover:bg-white hover:text-cx-ink",
  "outline-dark": "border border-cx-ink/30 text-cx-ink hover:border-cx-ink hover:bg-cx-ink hover:text-white",
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function ButtonLink({ href, variant = "primary", arrow = true, className = "", children }: ButtonLinkProps) {
  const classes = `group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-sm px-7 text-[15px] font-semibold transition-colors duration-200 ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          size={18}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      )}
    </>
  );

  // In-page anchors use a plain <a> so the browser handles smooth scrolling and focus
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
