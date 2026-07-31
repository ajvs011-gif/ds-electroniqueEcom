import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin-client";
import { sendOrderEmails } from "@/lib/email/send-order-emails";

const LIVRAISON_FCFA = 2000;

type OrderItemInput = {
  productId: string;
  name: string;
  quantity: number;
  priceFcfa: number;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, customer, paymentMethod, userId } = body as {
    items: OrderItemInput[];
    customer: {
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
      email: string;
      comment?: string;
    };
    paymentMethod: string;
    userId?: string | null;
  };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
  }
  if (!customer?.firstName || !customer?.lastName || !customer?.city || !customer?.phone || !customer?.email) {
    return NextResponse.json({ error: "Informations client incomplètes" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const subtotalFcfa = items.reduce((sum, i) => sum + i.priceFcfa * i.quantity, 0);
  const totalFcfa = subtotalFcfa + LIVRAISON_FCFA;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId ?? null,
      status: "en_attente",
      subtotal_fcfa: subtotalFcfa,
      livraison_fcfa: LIVRAISON_FCFA,
      remise_fcfa: 0,
      total_fcfa: totalFcfa,
      first_name: customer.firstName,
      last_name: customer.lastName,
      full_name: `${customer.firstName} ${customer.lastName}`.trim(),
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      comment: customer.comment || null,
      payment_method: paymentMethod,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Erreur création commande", orderError);
    return NextResponse.json({ error: "Impossible de créer la commande" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      quantity: i.quantity,
      price_fcfa: i.priceFcfa,
    }))
  );

  if (itemsError) {
    console.error("Erreur lignes de commande", itemsError);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement des articles" }, { status: 500 });
  }

  // Envoi des emails (confirmation client + notification équipe). Ne bloque
  // jamais la réponse : une commande valide ne doit pas échouer à cause d'un
  // problème d'envoi d'email.
  try {
    await sendOrderEmails({
      orderId: order.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      comment: customer.comment,
      paymentMethod,
      items: items.map((i) => ({ name: i.name, quantity: i.quantity, priceFcfa: i.priceFcfa })),
      subtotalFcfa,
      livraisonFcfa: LIVRAISON_FCFA,
      totalFcfa,
    });
  } catch (err) {
    console.error("Erreur envoi emails de commande", err);
  }

  return NextResponse.json({ orderId: order.id, totalFcfa });
}
