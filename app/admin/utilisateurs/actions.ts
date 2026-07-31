"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export async function toggleAdmin(profileId: string, nextValue: boolean) {
  const { supabase, user } = await requireAdmin();

  if (profileId === user.id) {
    throw new Error("Vous ne pouvez pas modifier votre propre rôle.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: nextValue })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/utilisateurs");
}
