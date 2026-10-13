import "server-only";

import { sanityFetch } from "@/lib/sanity/client";
import { imageUrl } from "@/lib/sanity/image";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import {
  BUILT_IN_IMAGES,
  BUILT_IN_LOGOS,
  DEFAULT_SETTINGS,
} from "@/lib/site-config";
import type { FeatureItem, SiteSettings } from "@/lib/types";

/** Sizes asked of the image CDN, each about twice its largest rendered size. */
const WIDTHS = {
  logo: 320,
  photo: 1600,
} as const;

type SettingsRecord = {
  siteName?: string | null;
  tagline?: string | null;
  description?: string | null;
  whatsappNumber?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  darkLogo?: string | null;
  lightLogo?: string | null;
  heroImage?: string | null;
  aboutImage?: string | null;
  features?: FeatureItem[] | null;
  aboutBody?: string[] | null;
};

const text = (value: string | null | undefined, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

/**
 * The business behind the site, from Sanity, with the repository's own values
 * standing in for anything not filled in yet.
 *
 * An editor who clears a field gets the default back rather than a blank page,
 * and a project with no settings document at all still renders the site.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const record = await sanityFetch<SettingsRecord | null>(SITE_SETTINGS_QUERY, null);

  const features = record?.features?.filter((item) => item?.title && item?.description) ?? [];
  const aboutBody = record?.aboutBody?.filter((paragraph) => paragraph?.trim()) ?? [];

  return {
    siteName: text(record?.siteName, DEFAULT_SETTINGS.siteName),
    tagline: text(record?.tagline, DEFAULT_SETTINGS.tagline),
    description: text(record?.description, DEFAULT_SETTINGS.description),
    whatsappNumber: text(record?.whatsappNumber, DEFAULT_SETTINGS.whatsappNumber),
    phoneNumber: text(record?.phoneNumber, DEFAULT_SETTINGS.phoneNumber),
    email: text(record?.email, DEFAULT_SETTINGS.email),
    address: text(record?.address, DEFAULT_SETTINGS.address),
    instagram: text(record?.instagram, DEFAULT_SETTINGS.instagram).replace(/^@/, ""),
    tiktok: text(record?.tiktok, DEFAULT_SETTINGS.tiktok).replace(/^@/, ""),
    darkLogo: imageUrl(record?.darkLogo, WIDTHS.logo) || BUILT_IN_LOGOS.dark,
    lightLogo: imageUrl(record?.lightLogo, WIDTHS.logo) || BUILT_IN_LOGOS.light,
    heroImage: imageUrl(record?.heroImage, WIDTHS.photo) || BUILT_IN_IMAGES.hero,
    aboutImage: imageUrl(record?.aboutImage, WIDTHS.photo) || BUILT_IN_IMAGES.about,
    features: features.length > 0 ? features : DEFAULT_SETTINGS.features,
    aboutBody: aboutBody.length > 0 ? aboutBody : DEFAULT_SETTINGS.aboutBody,
  };
}

/** Where an Instagram or TikTok handle points, or undefined when there is none. */
export function instagramUrl(handle: string): string | undefined {
  return handle ? `https://instagram.com/${handle}` : undefined;
}

export function tiktokUrl(handle: string): string | undefined {
  return handle ? `https://tiktok.com/@${handle}` : undefined;
}
