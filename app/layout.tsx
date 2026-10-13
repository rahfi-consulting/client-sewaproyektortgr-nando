import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/site-content";
import "./globals.css";

/**
 * Two faces, each with one job.
 *
 * Archivo is variable on its width axis, which is what lets the headlines be
 * stretched to the proportion of a projected rectangle. IBM Plex Sans reads
 * well at paragraph sizes and has the tabular figures the price board needs.
 */
const display = Archivo({
  subsets: ["latin"],
  // No weight listed on purpose: that is what keeps the variable file, and with
  // it the width axis the headlines are stretched on.
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

/**
 * The title, the summary and the tab icon all come from Site Settings, so the
 * business can rename itself or replace its logo without a deploy.
 *
 * The icon is the dark logo: a browser tab is light, and the dark mark is the
 * one that reads on it.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description,
    icons: {
      icon: settings.darkLogo,
      shortcut: settings.darkLogo,
      apple: settings.darkLogo,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
