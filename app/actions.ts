"use server";

import { revalidatePath } from "next/cache";
import { parseProductFormData } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  createSupabaseServerClient,
  requireAuthenticatedUser,
} from "@/lib/supabase/server";

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
}

export async function saveProduct(formData: FormData) {
  ensureSupabaseConfigured();
  await requireAuthenticatedUser();

  const payload = parseProductFormData(formData);

  if (!payload.name || !payload.price) {
    throw new Error("Product name and price are required.");
  }

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
}

export async function deleteProduct(productId: string) {
  ensureSupabaseConfigured();
  await requireAuthenticatedUser();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}
