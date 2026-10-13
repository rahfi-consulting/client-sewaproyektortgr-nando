import type { FeatureItem, SiteSettings } from "@/lib/types";

/**
 * What the site says about itself before Sanity answers.
 *
 * Everything here is editable in Studio under Site Settings. These values are
 * the fallback for a field left empty, and what the pages render while a brand
 * new project has no content document at all, so the site is never blank.
 */

export const DEFAULT_FEATURES: FeatureItem[] = [
  { title: "Fast Shipping", description: "Pengiriman cepat untuk area layanan Tangerang." },
  { title: "Simple Form", description: "Isi data diri dan validasi lokasi yang cepat dan mudah" },
  { title: "Secured Payments", description: "Harga transparan dan proses transaksi jelas." },
  { title: "Call us Anytime", description: "Konsultasi kebutuhan event dan presentasi kapan saja." },
];

export const DEFAULT_ABOUT_BODY = [
  "berfokus pada layanan sewa proyektor dan perlengkapan event yang rapi, cepat, dan mudah dikoordinasikan. Kami melayani kebutuhan presentasi kantor, seminar, nobar, ibadah, hingga event komunitas di area Tangerang dan sekitarnya.",
  "Misi kami sederhana: membantu klien menjalankan acara tanpa hambatan teknis. Itu berarti harga jelas, pilihan perlengkapan relevan, komunikasi responsif, dan setup yang stabil sejak awal.",
  "Kami menjaga setiap penyewaan tetap praktis, dari konsultasi alat, pengantaran, hingga pengambilan kembali setelah acara selesai.",
];

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "SEWAPROYEKTOR.TGR",
  tagline: "Pusat Sewa Proyektor Tangerang Terbaik & Terpercaya!",
  description:
    "Layanan sewa proyektor, layar, audio, dan perlengkapan event lain mulai dari 3 jam dengan harga jelas dengan respons cepat untuk area Tangerang dan sekitarnya.",
  whatsappNumber: "",
  phoneNumber: "",
  email: "halo@sewaproyektor.tgr",
  address: "Tangerang, Banten",
  instagram: "sewaproyektor.tgr",
  tiktok: "sewaproyektor.tgr",
  darkLogo: "",
  lightLogo: "",
  heroImage: "",
  aboutImage: "",
  features: DEFAULT_FEATURES,
  aboutBody: DEFAULT_ABOUT_BODY,
};

/** The logo files that ship with the repository, used until one is uploaded. */
export const BUILT_IN_LOGOS = {
  dark: "/dark-logo.png",
  light: "/light-logo.png",
} as const;

/** The photographs that ship with the repository, used until one is uploaded. */
export const BUILT_IN_IMAGES = {
  hero: "/home-image.jpeg",
  about: "/about-image.jpeg",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/about", label: "About" },
];
