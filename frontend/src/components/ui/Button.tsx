import Link from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "outline" | "light" | "outline-light";

// Filled buttons use sky-700 so white text passes WCAG AA (brand sky #28A9DC is 2.7:1 on white).
const variants: Record<Variant, string> = {
  primary: "bg-es-accent-strong text-white hover:bg-brand-navy focus-visible:outline-es-accent-strong",
  outline: "border-2 border-es-accent-strong text-es-accent-strong hover:bg-es-accent-strong hover:text-white focus-visible:outline-es-accent-strong",
  light: "bg-white text-brand-navy hover:bg-brand-navy hover:text-white focus-visible:outline-white",
  "outline-light": "border-2 border-white/70 text-white hover:border-white hover:bg-white hover:text-brand-navy focus-visible:outline-white",
};

interface ButtonProps {
  href: string;
  variant?: Variant;
  /** Show a trailing arrow that slides right on hover */
  arrow?: boolean;
  /** Open in a new tab (external links such as WhatsApp) */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Shared pill-less link button: 48px touch target, visible focus, sliding arrow */
export default function Button({ href, variant = "primary", arrow = false, external = false, className = "", children }: ButtonProps) {
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
  if (external || href.startsWith("tel:")) {
    return (
      <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
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
