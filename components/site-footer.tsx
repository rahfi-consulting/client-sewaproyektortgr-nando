import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { NAV_LINKS } from "@/lib/site-config";
import { instagramUrl, tiktokUrl } from "@/lib/site-content";
import type { SiteSettings } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** The footer sits on black, so it takes the light version of the logo. */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const whatsapp = buildWhatsAppLink(settings.whatsappNumber, settings.siteName);
  const instagram = instagramUrl(settings.instagram);
  const tiktok = tiktokUrl(settings.tiktok);
  const linkClass =
    "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:border-white/25 hover:bg-white/10 hover:text-white";

  return (
    <footer className="bg-black py-16 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={settings.lightLogo}
              alt={settings.siteName}
              width={120}
              height={50}
              className="h-10 w-auto"
              unoptimized
            />
            <span className="min-w-0 leading-none">
              <span className="block text-sm font-bold uppercase text-white">
                {settings.siteName}
              </span>
              <span className="mt-1 block text-xs font-medium text-zinc-500">
                Projector Rental
              </span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-7 text-zinc-300">{settings.description}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-zinc-400">
            Store Links
          </p>
          <div className="flex flex-col gap-3 text-sm text-zinc-300">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-zinc-400">
            Contact Information
          </p>
          <div className="space-y-3 text-sm leading-7 text-zinc-300">
            <p>{settings.address}, Indonesia</p>
            <div className="flex gap-3 pt-2 flex-wrap">
              {whatsapp ? (
                <TrackedWhatsAppLink
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  source="footer"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </TrackedWhatsAppLink>
              ) : null}
              {instagram ? (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <FaInstagram className="h-5 w-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              ) : null}
              {tiktok ? (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <FaTiktok className="h-5 w-5" />
                  <span className="text-sm font-medium">TikTok</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="section-shell border-t border-zinc-800 mt-10 pt-10">
        <p className="text-center uppercase tracking-[0.1em] text-sm text-zinc-400">
          <b>© {new Date().getFullYear()} {settings.siteName} - All Rights Reserved</b>
        </p>
      </div>
    </footer>
  );
}
