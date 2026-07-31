"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name"));
  const { error } = await supabase.from("products").insert({
    name,
    slug: slugify(name),
    image_url: String(formData.get("image_url") || "") || null,
    price_fcfa: Number(formData.get("price_fcfa")),
    old_price_fcfa: formData.get("old_price_fcfa") ? Number(formData.get("old_price_fcfa")) : null,
    badge: String(formData.get("badge") || "") || null,
    rating: Number(formData.get("rating") || 5),
    stock: String(formData.get("stock")),
    icon: String(formData.get("icon")),
    category_slug: String(formData.get("category_slug")),
    short_description: String(formData.get("short_description")),
    description: String(formData.get("description")),
    specs: [],
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function updateProduct(productId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name")),
      image_url: String(formData.get("image_url") || "") || null,
      price_fcfa: Number(formData.get("price_fcfa")),
      old_price_fcfa: formData.get("old_price_fcfa") ? Number(formData.get("old_price_fcfa")) : null,
      badge: String(formData.get("badge") || "") || null,
      rating: Number(formData.get("rating") || 5),
      stock: String(formData.get("stock")),
      icon: String(formData.get("icon")),
      category_slug: String(formData.get("category_slug")),
      short_description: String(formData.get("short_description")),
      description: String(formData.get("description")),
    })
    .eq("id", productId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function deleteProduct(productId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produits");
}
