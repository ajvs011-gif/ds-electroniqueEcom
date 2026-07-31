import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Orange Money notifie ce endpoint (notif_url) une fois le paiement confirmé ou annulé.
// ⚠️ En production, vérifiez la signature/l'origine de la requête avant de faire confiance
// à son contenu (voir la doc Orange Money Web Payment pour le détail du payload).
export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { order_id, status } = payload as { order_id?: string; status?: string };

  if (!order_id) {
    return NextResponse.json({ error: "order_id manquant" }, { status: 400 });
  }

  // Client Supabase avec la clé "service role" pour écrire sans dépendre de la session client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const newStatus = status === "SUCCESS" ? "confirmee" : "annulee";

  const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order_id);

  if (error) {
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
