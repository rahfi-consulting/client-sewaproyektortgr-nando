export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  status: boolean;
  category: string;
  featured: boolean;
  sortOrder: number;
};

/** A product exactly as Sanity returns it, before the empty fields are filled in. */
export type ProductRecord = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  status: boolean | null;
  category: string | null;
  featured: boolean | null;
  sortOrder: number | null;
};

export type FeatureItem = {
  title: string;
  description: string;
};

/**
 * The business behind the site: how it is named, how it is reached, and the
 * pictures the pages are built around. Every field is optional because the
 * document may not be filled in yet; the site falls back to its own defaults.
 */
export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  darkLogo: string;
  lightLogo: string;
  heroImage: string;
  aboutImage: string;
  features: FeatureItem[];
  aboutBody: string[];
};

export type SiteSettingsRecord = Partial<Record<keyof SiteSettings, unknown>> | null;
