import { createClient } from "@/lib/supabase/client";
import { mapProduct } from "./mappers";

export async function getAllProductsClient() {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(mapProduct);
}
