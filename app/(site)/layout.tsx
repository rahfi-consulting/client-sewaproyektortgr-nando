import type { ReactNode } from "react";
import { GoogleTag } from "@/components/google-tag";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSiteSettings } from "@/lib/site-content";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * The chrome around every public page.
 *
 * The settings are read once here and handed to the header, the footer and the
 * floating button, so the logo, the business name and the WhatsApp number all
 * come from Studio rather than from anything compiled into the site.
 *
 * The Google tags live here rather than in the root layout, so they load on the
 * pages a customer sees and not inside the Studio, which is a tool for the
 * business and not a page worth tracking.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <GoogleTag />
      <div className="min-h-screen bg-white text-zinc-950">
        <SiteHeader settings={settings} />
        <main className="pt-20">{children}</main>
        <SiteFooter settings={settings} />
        <WhatsAppFloat href={buildWhatsAppLink(settings.whatsappNumber, settings.siteName)} />
      </div>
    </>
  );
}
