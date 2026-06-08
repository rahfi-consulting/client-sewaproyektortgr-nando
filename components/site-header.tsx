"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/dark-logo.png"
            alt={SITE_NAME}
            width={120}
            height={50}
            className="h-10 w-auto"
            priority
          />
          <span className="min-w-0 flex flex-col leading-none">
            <span className="text-xs font-bold uppercase text-zinc-950 sm:text-sm tracking-[0.1em]">
              {SITE_NAME}
            </span>
            <span className="hidden text-[0.7rem] font-medium tracking-[0.1em] text-zinc-500 sm:block">
              Projector Rental
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === link.href : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  active ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-950 md:hidden"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <nav className="section-shell flex flex-col py-4">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === link.href : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium ${
                    active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
