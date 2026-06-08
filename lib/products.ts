import "server-only";

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

const PRODUCT_LIMITS = {
  name: 120,
  description: 2000,
  price: 80,
  category: 60,
  imageUrl: 2048,
  sortOrder: 10000,
} as const;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readTrimmedText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function assertLength(value: string, limit: number, field: string) {
  if (value.length > limit) {
    throw new Error(`${field} exceeds the maximum length of ${limit} characters.`);
  }
}

function assertUuid(value: string, field: string) {
  if (value && !UUID_PATTERN.test(value)) {
    throw new Error(`${field} is invalid.`);
  }
}

function parseProductImageUrl(imageUrl: string, category: string) {
  if (!imageUrl) {
    return CATEGORY_IMAGE_MAP[category] || SITE_IMAGES.projector;
  }

  assertLength(imageUrl, PRODUCT_LIMITS.imageUrl, "Image URL");

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Error("Image URL must be a valid absolute URL.");
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error("Image URL must use HTTPS.");
  }

  return parsedUrl.toString();
}

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
};

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<Product[]> {
  const { includeUnavailable = false } = options;

  if (!isSupabaseConfigured()) {
    return [];
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
      return [];
    }

    return data.map((item) => normalizeProduct(item as ProductRecord));
  } catch {
    return [];
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
  const id = readTrimmedText(formData, "id");
  const name = readTrimmedText(formData, "name");
  const description = readTrimmedText(formData, "description");
  const price = readTrimmedText(formData, "price");
  const category = readTrimmedText(formData, "category") || "General";
  const sortOrderValue = readTrimmedText(formData, "sort_order");
  const sortOrder = Number(sortOrderValue || 0);

  assertUuid(id, "Product ID");

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (!price) {
    throw new Error("Product price is required.");
  }

  assertLength(name, PRODUCT_LIMITS.name, "Product name");
  assertLength(description, PRODUCT_LIMITS.description, "Product description");
  assertLength(price, PRODUCT_LIMITS.price, "Product price");
  assertLength(category, PRODUCT_LIMITS.category, "Product category");

  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > PRODUCT_LIMITS.sortOrder) {
    throw new Error("Sort order must be an integer between 0 and 10000.");
  }

  return {
    id,
    name,
    description,
    price,
    image_url: parseProductImageUrl(readTrimmedText(formData, "image_url"), category),
    status: formData.get("status") === "on",
    category,
    featured: formData.get("featured") === "on",
    sort_order: sortOrder,
  };
}

export function assertValidProductId(productId: string) {
  assertUuid(productId.trim(), "Product ID");
}
