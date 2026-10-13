"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

/**
 * The Studio, served by the site itself at /studio.
 *
 * Signing in is Sanity's own: an editor logs in with the Google account the
 * project was shared with, and nothing about that account is stored here.
 *
 * The catch-all segment is what lets the Studio put the document being edited in
 * the URL, so a refresh deep inside the tool returns to the same place.
 */
export default function StudioPage() {
  // Without a project there is nothing to edit, and the Studio's own failure is
  // a stack trace. This says which setting is missing instead.
  if (!isSanityConfigured) {
    return (
      <main style={{ padding: "4rem 1.5rem", fontFamily: "system-ui, sans-serif", color: "#0a0a0a" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Studio is not configured yet</h1>
        <p style={{ marginTop: "0.75rem", maxWidth: "34rem", lineHeight: 1.7, color: "#52525b" }}>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in
          the environment, then reload this page. The README has the steps for creating the project.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
