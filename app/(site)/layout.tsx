import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-white text-zinc-950">
        <SiteHeader />
        <main className="pt-20">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
      </div>
    </>
  );
}
