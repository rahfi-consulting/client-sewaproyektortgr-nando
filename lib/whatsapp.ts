/**
 * The WhatsApp link every call to action on the site points at.
 *
 * The number and the business name come from Sanity, so they are passed in
 * rather than read here: this file is used by client components, which never
 * reach the CMS themselves.
 *
 * An empty or non-numeric number returns undefined, and the caller leaves the
 * button out rather than rendering one that goes nowhere.
 */
export function buildWhatsAppLink(
  whatsappNumber: string | undefined,
  siteName: string,
  productName?: string,
): string | undefined {
  const digits = whatsappNumber?.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return undefined;

  const text = productName
    ? `Halo, saya tertarik menyewa produk ${productName} dari ${siteName}.`
    : `Halo, saya ingin konsultasi sewa proyektor dan perlengkapannya dari ${siteName}.`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
