import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/site-config";

export function buildWhatsAppLink(productName?: string) {
  const text = productName
    ? `Halo, saya tertarik menyewa produk ${productName} dari ${SITE_NAME}.`
    : `Halo, saya ingin konsultasi sewa proyektor dan perlengkapannya dari ${SITE_NAME}.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
