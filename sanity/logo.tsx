"use client";

import { useColorSchemeValue } from "sanity";
import { BUILT_IN_LOGOS } from "@/lib/site-config";

/**
 * The wordmark in the Studio's top left corner.
 *
 * The Studio can be put in light or dark mode, so the logo follows it: the dark
 * logo on the white chrome, the light one on the black. Picking by the Studio's
 * own scheme rather than the operating system's keeps the two in step when an
 * editor sets the mode by hand.
 *
 * The files are the ones the website ships, served by Next from /public, so the
 * Studio and the site always show the same mark.
 */
export function StudioLogo() {
  const scheme = useColorSchemeValue();
  const source = scheme === "dark" ? BUILT_IN_LOGOS.light : BUILT_IN_LOGOS.dark;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt="SEWAPROYEKTOR.TGR"
      style={{ height: "1.5rem", width: "auto", display: "block" }}
    />
  );
}
