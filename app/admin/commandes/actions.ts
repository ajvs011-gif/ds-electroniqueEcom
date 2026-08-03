"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { sendOrderDeliveredEmail, sendOrderShippedEmail } from "@/lib/email/send-order-emails";
import type { OrderEmailData } from "@/lib/email/templates";

type SupabaseAdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

type OrderRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  comment: string | null;
  payment_method: string;
  subtotal_fcfa: number;
  livraison_fcfa: number;
  total_fcfa: number;
};

type OrderItemRow = {
  product_name: string;
  quantity: number;
  price_fcfa: number;
};

const STATUSES_WITH_EMAIL = new Set(["expediee", "livree"]);

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const status = String(formData.get("status"));

  // On récupère le statut actuel avant modification, pour ne notifier le
  // client que si le statut change réellement (évite un email en double si
  // l'admin re-sélectionne la même valeur ou sauvegarde deux fois).
  const { data: existingOrder, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/commandes");
  revalidatePath("/admin/dashboard");

  const statusChanged = existingOrder?.status !== status;

  if (statusChanged && STATUSES_WITH_EMAIL.has(status)) {
    // Un échec d'envoi d'email ne doit jamais faire échouer la mise à jour
    // du statut, qui est déjà enregistrée à ce stade.
    try {
      const orderData = await buildOrderEmailData(supabase, orderId);
      if (orderData) {
        if (status === "expediee") await sendOrderShippedEmail(orderData);
        if (status === "livree") await sendOrderDeliveredEmail(orderData);
      }
    } catch (err) {
      console.error("Erreur envoi email de statut de commande", err);
    }
  }
}

async function buildOrderEmailData(
  supabase: SupabaseAdminClient,
  orderId: string
): Promise<OrderEmailData | null> {
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, first_name, last_name, email, phone, city, comment, payment_method, subtotal_fcfa, livraison_fcfa, total_fcfa"
    )
    .eq("id", orderId)
    .single<OrderRow>();

  if (!order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, quantity, price_fcfa")
    .eq("order_id", orderId)
    .returns<OrderItemRow[]>();

  return {
    orderId: order.id,
    firstName: order.first_name,
    lastName: order.last_name,
    email: order.email,
    phone: order.phone,
    city: order.city,
    comment: order.comment ?? undefined,
    paymentMethod: order.payment_method,
    items: (items ?? []).map((i) => ({
      name: i.product_name,
      quantity: i.quantity,
      priceFcfa: i.price_fcfa,
    })),
    subtotalFcfa: order.subtotal_fcfa,
    livraisonFcfa: order.livraison_fcfa,
    totalFcfa: order.total_fcfa,
  };
}