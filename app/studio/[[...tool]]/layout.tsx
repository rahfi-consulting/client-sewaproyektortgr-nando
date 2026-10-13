import type { ReactNode } from "react";

/**
 * The Studio's own segment, outside the site's chrome.
 *
 * The metadata and viewport Sanity needs come from here rather than from the
 * page, because the page is a client component: the Studio pulls in the whole
 * `sanity` package, which is browser code, and importing it from a server
 * component drags it into the server graph where it cannot run.
 */
export { metadata, viewport } from "next-sanity/studio";

/** Rendered once at build time; everything inside it runs in the browser. */
export const dynamic = "force-static";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
