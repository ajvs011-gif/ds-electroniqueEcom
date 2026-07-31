import { createClient } from "@/lib/supabase/server";
import { mapCategory, mapProduct } from "./mappers";

export async function getCategoriesServer() {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data ?? []).map(mapCategory);
}

export async function getProductsServer() {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(mapProduct);
}

export async function getProductBySlugServer(slug: string) {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
  return data ? mapProduct(data) : null;
}

export async function getPopularProductsServer(limit = 8) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapProduct);
}

export async function getNewArrivalsServer(limit = 4) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("badge", "NOUVEAU")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapProduct);
}

export async function getRelatedProductsServer(categorySlug: string, excludeId: string, limit = 4) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug)
    .neq("id", excludeId)
    .limit(limit);
  return (data ?? []).map(mapProduct);
}
