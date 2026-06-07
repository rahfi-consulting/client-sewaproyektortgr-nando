import "server-only";

import { DEFAULT_PRODUCTS } from "@/lib/default-products";
import { SITE_IMAGES } from "@/lib/site-config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product, ProductRecord } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  Proyektor: SITE_IMAGES.projector,
  Layar: SITE_IMAGES.screen,
  Audio: SITE_IMAGES.audio,
  Perlengkapan: SITE_IMAGES.accessory,
  Kabel: SITE_IMAGES.cable,
  Komunikasi: SITE_IMAGES.communication,
  General: SITE_IMAGES.projector,
};

function normalizeProduct(record: ProductRecord): Product {
  const category = record.category?.trim() || "General";

  return {
    id: record.id,
    name: record.name,
    description: record.description?.trim() || "Detail produk akan mengikuti kebutuhan acara Anda.",
    price: record.price,
    imageUrl: record.image_url?.trim() || CATEGORY_IMAGE_MAP[category] || SITE_IMAGES.projector,
    status: record.status,
    category,
    featured: Boolean(record.featured),
    sortOrder: record.sort_order ?? 999,
  };
}

type GetProductsOptions = {
  includeUnavailable?: boolean;
  fallbackToDefault?: boolean;
};

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<Product[]> {
  const { includeUnavailable = false, fallbackToDefault = true } = options;

  if (!isSupabaseConfigured()) {
    return fallbackToDefault
      ? DEFAULT_PRODUCTS.filter((product) => includeUnavailable || product.status)
      : [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, status, category, featured, sort_order",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!includeUnavailable) {
      query = query.eq("status", true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return fallbackToDefault
        ? DEFAULT_PRODUCTS.filter((product) => includeUnavailable || product.status)
        : [];
    }

    return data.map((item) => normalizeProduct(item as ProductRecord));
  } catch {
    return fallbackToDefault
      ? DEFAULT_PRODUCTS.filter((product) => includeUnavailable || product.status)
      : [];
  }
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 6);

  if (featured.length === 6) {
    return featured;
  }

  const fallback = products.filter(
    (product) => !featured.some((item) => item.id === product.id),
  );

  return [...featured, ...fallback].slice(0, 6);
}

export function parseProductFormData(formData: FormData) {
  const category = String(formData.get("category") || "General").trim() || "General";

  return {
    id: String(formData.get("id") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    image_url:
      String(formData.get("image_url") || "").trim() ||
      CATEGORY_IMAGE_MAP[category] ||
      SITE_IMAGES.projector,
    status: formData.get("status") === "on",
    category,
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
}
