"use server";
// export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name")),
      phone: String(formData.get("phone")),
      city: String(formData.get("city")),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  // Garde le nom affiché dans le header synchronisé
  await supabase.auth.updateUser({ data: { full_name: String(formData.get("full_name")) } });

  revalidatePath("/profil");
}
