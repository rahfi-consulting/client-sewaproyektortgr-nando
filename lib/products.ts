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
