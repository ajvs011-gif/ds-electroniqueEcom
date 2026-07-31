import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin-client";
import { orangeMoneyProvider } from "@/lib/payments/orange-money";
import { mtnMomoProvider } from "@/lib/payments/mtn-momo";
import type { PaymentMethod } from "@/lib/payments/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { orderId, method, phone } = body as {
    orderId: string;
    method: PaymentMethod;
    phone: string;
  };

  const supabase = createServiceRoleClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, total_fcfa")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Paiement à la livraison ou carte : pas d'appel fournisseur, la commande reste "en_attente"
  if (method === "paiement_livraison" || method === "carte") {
    return NextResponse.json({ pending: false });
  }

  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/commandes/confirmation?id=${orderId}`;
  const provider = method === "orange_money" ? orangeMoneyProvider : mtnMomoProvider;

  try {
    const result = await provider.initiate({
      orderId,
      amountFcfa: order.total_fcfa,
      phone,
      returnUrl,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(`Erreur paiement ${method}`, err);
    return NextResponse.json(
      { error: "Le paiement n'a pas pu être initié. Réessayez ou choisissez un autre mode." },
      { status: 502 }
    );
  }
}
