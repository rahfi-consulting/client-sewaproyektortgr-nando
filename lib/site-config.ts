export const SITE_NAME = "SEWAPROYEKTOR.TGR";
export const SITE_TAGLINE = "Pusat Sewa Proyektor Tangerang Terbaik & Terpercaya!";
export const SITE_DESCRIPTION =
  "Layanan sewa proyektor, layar, audio, dan perlengkapan event dengan setup rapi, harga jelas, dan respons cepat untuk area Tangerang dan sekitarnya.";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export const CONTACT_EMAIL = "halo@sewaproyektor.tgr";
export const CONTACT_SOCIAL = "sewaproyektor.tgr";
export const CONTACT_PHONE = "+62 896-1587-7876";
export const CONTACT_ADDRESS = "Tangerang, Banten";

// Change this to your actual images placeholder
export const SITE_IMAGES = {
  hero: "https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200",
  about:
    "https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200",
  projector:
    "https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200",
  screen:
    "https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200",
  audio:
    "https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200",
  accessory:
    "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200",
  cable:
    "https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200",
  communication:
    "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/about", label: "About" },
];

export const FEATURE_ITEMS = [
  {
    title: "Free Shipping",
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
