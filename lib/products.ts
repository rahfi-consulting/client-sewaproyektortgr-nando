import "server-only";

import { sanityFetch } from "@/lib/sanity/client";
import { imageUrl } from "@/lib/sanity/image";
import { PRODUCTS_QUERY } from "@/lib/sanity/queries";
import type { Product, ProductRecord } from "@/lib/types";

/** Wide enough for the card at two times its size on a high density screen. */
const CARD_WIDTH = 800;

const PLACEHOLDER_DESCRIPTION = "Detail produk akan mengikuti kebutuhan acara Anda.";

function normalizeProduct(record: ProductRecord): Product {
  return {
    id: record.id,
    name: record.name,
    description: record.description?.trim() || PLACEHOLDER_DESCRIPTION,
    price: record.price,
    imageUrl: imageUrl(record.imageUrl, CARD_WIDTH),
    status: record.status ?? true,
    category: record.category?.trim() || "General",
    featured: Boolean(record.featured),
    sortOrder: record.sortOrder ?? 999,
  };
}

/** The catalogue, in the order set in Studio. Empty while there is no content. */
export async function getProducts(): Promise<Product[]> {
  const records = await sanityFetch<ProductRecord[]>(PRODUCTS_QUERY, []);
  return records.map(normalizeProduct);
}

/**
 * Six products for the home page carousel: the ones marked featured first, then
 * the rest of the catalogue to fill the row, so the carousel is never half empty.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
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
