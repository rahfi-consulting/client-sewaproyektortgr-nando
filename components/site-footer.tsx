import Link from "next/link";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAV_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-black py-16 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <p className="text-sm font-bold tracking-[0.24em] text-white">{SITE_NAME}</p>
          <p className="max-w-sm text-sm leading-7 text-zinc-300">{SITE_DESCRIPTION}</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Store Links
          </p>
          <div className="flex flex-col gap-3 text-sm text-zinc-300">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Quick Links
          </p>
          <div className="space-y-3 text-sm leading-7 text-zinc-300">
            <p>{CONTACT_EMAIL}</p>
            <p>{CONTACT_PHONE}</p>
            <p>{CONTACT_ADDRESS}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
