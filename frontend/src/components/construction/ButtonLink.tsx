import Link from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "primary-on-dark" | "outline-light" | "outline-dark";

// Same look as ui/Button: sky-700 fills so white text passes WCAG AA
const variants: Record<Variant, string> = {
  primary: "bg-es-accent-strong text-white hover:bg-brand-navy focus-visible:outline-es-accent-strong",
  "primary-on-dark": "bg-es-accent-strong text-white hover:bg-white hover:text-brand-navy focus-visible:outline-white",
  "outline-light": "border-2 border-white/70 text-white hover:border-white hover:bg-white hover:text-brand-navy focus-visible:outline-white",
  "outline-dark": "border-2 border-es-accent-strong text-es-accent-strong hover:bg-es-accent-strong hover:text-white focus-visible:outline-es-accent-strong",
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function ButtonLink({ href, variant = "primary", arrow = true, className = "", children }: ButtonLinkProps) {
  const classes = `group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-7 py-3 text-base font-bold shadow-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`;
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
