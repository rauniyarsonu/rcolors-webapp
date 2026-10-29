import { useEffect } from "react";

export interface PageMeta {
  title: string;
  description: string;
  /** Site-relative canonical path */
  canonical: string;
  image: { src: string; alt: string };
  siteName: string;
}

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://rcolorsgroup.com").replace(/\/$/, "");
const TITLE_TEMPLATE = (title: string) => `${title} | R Colors Group`;
const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** Sets <head> tags for one page and restores the site defaults from index.html on unmount */
export default function Seo({ meta }: { meta: PageMeta }) {
  const key = JSON.stringify(meta);
  useEffect(() => {
    const restore: (() => void)[] = [];
    const prevTitle = document.title;
    document.title = TITLE_TEMPLATE(meta.title);
    restore.push(() => (document.title = prevTitle));

    const set = (attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      const prev = el.content;
      el.content = content;
      const node = el;
      restore.push(() => (created ? node.remove() : (node.content = prev)));
    };

    const url = absolute(meta.canonical);
    set("name", "description", meta.description);
    set("property", "og:title", meta.title);
    set("property", "og:description", meta.description);
    set("property", "og:url", url);
    set("property", "og:type", "website");
    set("property", "og:site_name", meta.siteName);
    set("property", "og:locale", "en_IN");
    set("property", "og:image", absolute(meta.image.src));
    set("property", "og:image:alt", meta.image.alt);
    set("name", "twitter:card", "summary_large_image");
    set("name", "twitter:title", meta.title);
    set("name", "twitter:description", meta.description);
    set("name", "twitter:image", absolute(meta.image.src));

    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = url;
    document.head.appendChild(link);
    restore.push(() => link.remove());

    return () => restore.reverse().forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` is `meta` by value
  }, [key]);

  return null;
}
