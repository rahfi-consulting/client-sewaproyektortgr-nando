import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import {
  CONTACT_ADDRESS,
  NAV_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  CONTACT_SOCIAL,
} from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="bg-black py-16 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/light-logo.png"
              alt={SITE_NAME}
              width={120}
              height={50}
              className="h-10 w-auto"
            />
            <span className="min-w-0 leading-none">
              <span className="block text-sm font-bold uppercase text-white">
                {SITE_NAME}
              </span>
              <span className="mt-1 block text-xs font-medium text-zinc-500">
                Projector Rental
              </span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-7 text-zinc-300">{SITE_DESCRIPTION}</p>
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
            <p>{CONTACT_ADDRESS}, Indonesia</p>
            <div className="flex gap-3 pt-2 flex-wrap">
              <TrackedWhatsAppLink
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
                source="footer"
              >
                <FaWhatsapp className="h-5 w-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </TrackedWhatsAppLink>
              <a
                href={`https://instagram.com/${CONTACT_SOCIAL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <FaInstagram className="h-5 w-5" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
              <a
                href={`https://tiktok.com/@${CONTACT_SOCIAL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <FaTiktok className="h-5 w-5" />
                <span className="text-sm font-medium">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="section-shell border-t border-zinc-800 mt-10 pt-10">
        <p className="text-center uppercase tracking-[0.1em] text-sm text-zinc-400">
          <b>© 2026 {SITE_NAME} - All Rights Reserved</b>
        </p>
      </div>
    </footer>
  );
}
