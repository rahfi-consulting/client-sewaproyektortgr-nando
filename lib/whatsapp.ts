import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/site-config";

export function buildWhatsAppLink(productName?: string) {
  const text = productName
    ? `Halo, saya tertarik menyewa/membeli produk ${productName} dari ${SITE_NAME}.`
    : `Halo, saya ingin konsultasi sewa proyektor dan perlengkapan event dari ${SITE_NAME}.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
