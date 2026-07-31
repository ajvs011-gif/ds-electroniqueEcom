import { createClient } from "@supabase/supabase-js";

/**
 * ⚠️ Ne jamais importer ce fichier dans un composant client ni exposer
 * SUPABASE_SERVICE_ROLE_KEY côté navigateur. Réservé aux routes API
 * (app/api/**) qui doivent écrire sans dépendre d'une session utilisateur —
 * par exemple créer une commande invité.
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
