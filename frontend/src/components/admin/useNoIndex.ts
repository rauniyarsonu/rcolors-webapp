import { useEffect } from "react";

/** Admin pages: keep them out of search engines and give the tab an admin title */
export function useNoIndex(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | R Colors Admin`;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex,nofollow";
    document.head.appendChild(robots);
    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, [title]);
}
