"use server";

import { revalidatePath } from "next/cache";
import { assertValidProductId, parseProductFormData } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ProductMutationState } from "@/lib/types";
import {
  createSupabaseServerClient,
  requireAdminUser,
} from "@/lib/supabase/server";

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export async function saveProduct(formData: FormData): Promise<ProductMutationState> {
  const operation = formData.get("id") ? "update" : "create";
  const productName = String(formData.get("name") || "").trim() || "Produk";

  try {
    ensureSupabaseConfigured();
    await requireAdminUser();

    const payload = parseProductFormData(formData);
    const supabase = await createSupabaseServerClient();

    if (payload.id) {
      const { error } = await supabase
        .from("products")
        .update({
          name: payload.name,
          description: payload.description,
          price: payload.price,
          image_url: payload.image_url,
          status: payload.status,
          category: payload.category,
          featured: payload.featured,
          sort_order: payload.sort_order,
        })
        .eq("id", payload.id);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase.from("products").insert({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        image_url: payload.image_url,
        status: payload.status,
        category: payload.category,
        featured: payload.featured,
        sort_order: payload.sort_order,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");

    return {
      ok: true,
      operation,
      message:
        operation === "create"
          ? `${payload.name} berhasil ditambahkan ke katalog.`
          : `${payload.name} berhasil diperbarui.`,
      productName: payload.name,
      productStatusLabel: payload.status ? "Tersedia" : "Dinonaktifkan",
    };
  } catch (error) {
    return {
      ok: false,
      operation,
      message: getErrorMessage(error),
      productName,
      productStatusLabel: "Tidak berubah",
    };
  }
}

export async function deleteProduct(formData: FormData): Promise<ProductMutationState> {
  const productId = String(formData.get("id") || "").trim();
  const productName = String(formData.get("name") || "").trim() || "Produk";

  try {
    ensureSupabaseConfigured();
    await requireAdminUser();
    assertValidProductId(productId);

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");

    return {
      ok: true,
      operation: "delete",
      message: `${productName} berhasil dihapus dari katalog.`,
      productName,
      productStatusLabel: "Dihapus",
    };
  } catch (error) {
    return {
      ok: false,
      operation: "delete",
      message: getErrorMessage(error),
      productName,
      productStatusLabel: "Tidak berubah",
    };
  }
}
