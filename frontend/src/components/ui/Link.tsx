import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link as RouterLink } from "react-router-dom";
import { KEEP_SCROLL } from "@/lib/navigation";

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  /** false keeps the scroll position after navigating */
  scroll?: boolean;
  replace?: boolean;
}

/** Client-side link for in-app paths; a plain <a> for external, mailto:, tel: and #hash links */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, scroll = true, replace, ...rest }, ref) {
  if (/^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return <a ref={ref} href={href} {...rest} />;
  return <RouterLink ref={ref} to={href} replace={replace} state={scroll ? undefined : KEEP_SCROLL} {...rest} />;
});

export default Link;
