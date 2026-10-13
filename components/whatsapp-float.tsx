import { MessageCircle } from "lucide-react";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";

/** Nothing to float when no WhatsApp number is set, so the button stays away. */
export function WhatsAppFloat({ href }: { href: string | undefined }) {
  if (!href) return null;

  return (
    <TrackedWhatsAppLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:-translate-y-0.5"
      aria-label="Open WhatsApp"
      source="floating_button"
    >
      <MessageCircle className="h-6 w-6" />
    </TrackedWhatsAppLink>
  );
}
