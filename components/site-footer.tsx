import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { NAV_LINKS } from "@/lib/site-config";
import { instagramUrl, tiktokUrl } from "@/lib/site-content";
import type { SiteSettings } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** The footer sits in the dark room, so it takes the light version of the logo. */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const whatsapp = buildWhatsAppLink(settings.whatsappNumber, settings.siteName);
  const social = [
    { label: "WhatsApp", href: whatsapp, Icon: FaWhatsapp, tracked: true },
    { label: "Instagram", href: instagramUrl(settings.instagram), Icon: FaInstagram, tracked: false },
    { label: "TikTok", href: tiktokUrl(settings.tiktok), Icon: FaTiktok, tracked: false },
  ].filter((item) => item.href);

  return (
    <footer className="bg-ink text-paper">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={settings.lightLogo}
              alt={settings.siteName}
              width={120}
              height={50}
              className="h-9 w-auto"
              unoptimized
            />
            <span className="display-3">{settings.siteName}</span>
          </Link>
          <p className="max-w-sm text-sm leading-7 text-paper/60">{settings.description}</p>
        </div>

        <div>
          <p className="text-sm text-paper/50">Halaman</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-paper/80 hover:text-lamp">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-paper/50">Hubungi</p>
          <div className="mt-4 space-y-3 text-sm text-paper/80">
            <p>{settings.address}</p>
            {settings.phoneNumber ? <p className="figure">{settings.phoneNumber}</p> : null}
            <div className="flex flex-col gap-3 pt-2">
              {social.map(({ label, href, Icon, tracked }) =>
                tracked ? (
                  <TrackedWhatsAppLink
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-paper/80 hover:text-lamp"
                    source="footer"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </TrackedWhatsAppLink>
                ) : (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-paper/80 hover:text-lamp"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell border-t border-white/10 py-6">
        <p className="figure text-sm text-paper/50">
          {new Date().getFullYear()} {settings.siteName}
        </p>
      </div>
    </footer>
  );
}
