"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/types";

/** The header sits on paper, so it takes the dark version of the logo. */
export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-rule bg-paper/95 backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={settings.darkLogo}
            alt={settings.siteName}
            width={120}
            height={50}
            className="h-9 w-auto"
            priority
            unoptimized
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="display-3 text-sm sm:text-base">{settings.siteName}</span>
            <span className="mt-1 hidden text-xs text-muted sm:block">
              Sewa proyektor dan perlengkapan acara
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b-2 py-1 text-sm font-medium ${
                isActive(link.href)
                  ? "border-lamp text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center border border-rule text-ink md:hidden"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-rule bg-paper md:hidden">
          <nav className="section-shell flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`border-b border-rule py-4 text-sm font-medium last:border-b-0 ${
                  isActive(link.href) ? "text-ink" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
