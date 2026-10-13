import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-content";
import "./globals.css";

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
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-white font-sans text-zinc-950">
        {children}
      </body>
    </html>
  );
}
