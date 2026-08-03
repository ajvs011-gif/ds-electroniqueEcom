import { createClient } from "@supabase/supabase-js";

export function createServiceRoleClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("DEBUG — clé présente:", !!key);
  console.log("DEBUG — longueur:", key?.length);
  console.log("DEBUG — préfixe:", key?.slice(0, 12));
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key!
  );
}