export const SITE_NAME = "SEWAPROYEKTOR.TGR";
export const SITE_TAGLINE = "Pusat Sewa Proyektor Tangerang Terbaik & Terpercaya!";
export const SITE_DESCRIPTION =
  "Layanan sewa proyektor, layar, audio, dan perlengkapan event dengan setup rapi, harga jelas, dan respons cepat untuk area Tangerang dan sekitarnya.";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;

export const CONTACT_EMAIL = "halo@sewaproyektor.tgr";
export const CONTACT_SOCIAL = "sewaproyektor.tgr";
export const CONTACT_ADDRESS = "Tangerang, Banten";

// Change this to your actual images placeholder
export const SITE_IMAGES = {
  hero: "/home-image.jpeg",
  about: "/about-image.jpeg",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/about", label: "About" },
];

export const FEATURE_ITEMS = [
  {
    title: "Fast Shipping",
    description: "Pengiriman cepat untuk area layanan Tangerang.",
  },
  {
    title: "Simple Returns",
    description: "Penjemputan alat dan pengecekan selesai acara.",
  },
  {
    title: "Secured Payments",
    description: "Harga transparan dan proses transaksi jelas.",
  },
  {
    title: "Call us Anytime",
    description: "Konsultasi kebutuhan event dan presentasi kapan saja.",
  },
];
