import { useEffect } from "react";

/** Adds a <script type="application/ld+json"> to <head> while mounted */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data);
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    // textContent never parses HTML; escaping "<" also keeps a copied snippet from closing its <script>
    script.textContent = json.replace(/</g, "\\u003c");
    document.head.appendChild(script);
    return () => script.remove();
  }, [json]);
  return null;
}
