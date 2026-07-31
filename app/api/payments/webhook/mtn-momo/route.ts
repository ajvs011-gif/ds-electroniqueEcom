import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// MTN MoMo notifie ce endpoint une fois le "Request to Pay" confirmé ou rejeté par le client.
// ⚠️ En production, vérifiez l'origine/la signature de la requête avant de faire confiance
// à son contenu (voir la doc MTN MoMo Collections pour le détail du payload).
export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { externalId, status } = payload as { externalId?: string; status?: string };

  if (!externalId) {
    return NextResponse.json({ error: "externalId manquant" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const newStatus = status === "SUCCESSFUL" ? "confirmee" : "annulee";

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", externalId);

  if (error) {
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
