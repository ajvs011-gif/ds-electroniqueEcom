import { Resend } from "resend";
import {
  adminNotificationEmail,
  customerConfirmationEmail,
  orderDeliveredEmail,
  orderShippedEmail,
  type OrderEmailData,
} from "./templates";

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL);
}

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromAddress() {
  return process.env.EMAIL_FROM || "DS-ELECTRONIQUE <onboarding@resend.dev>";
}

/**
 * Envoie l'email de confirmation au client et la notification à l'équipe.
 * N'échoue jamais bruyamment : si RESEND_API_KEY n'est pas configurée, on se
 * contente de logguer (utile en développement, avant d'avoir un compte Resend).
 */
export async function sendOrderEmails(order: OrderEmailData) {
  if (!isConfigured()) {
    console.log(
      `[Mode démo] Emails de commande non envoyés (RESEND_API_KEY / ORDER_NOTIFICATION_EMAIL absents). Commande #${order.orderId.slice(0, 8)} pour ${order.email}.`
    );
    return;
  }

  const resend = getResendClient();
  const from = getFromAddress();

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: order.email,
      subject: `Confirmation de votre commande #${order.orderId.slice(0, 8)} — DS-ELECTRONIQUE`,
      html: customerConfirmationEmail(order),
    }),
    resend.emails.send({
      from,
      to: process.env.ORDER_NOTIFICATION_EMAIL!,
      subject: `Nouvelle commande #${order.orderId.slice(0, 8)} — ${order.firstName} ${order.lastName}`,
      html: adminNotificationEmail(order),
    }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Échec envoi email (${i === 0 ? "client" : "admin"})`, r.reason);
    }
  });
}

/**
 * Envoie au client l'email "commande expédiée". À appeler uniquement quand
 * le statut passe réellement à `expediee` (voir app/admin/commandes/actions.ts).
 */
export async function sendOrderShippedEmail(order: OrderEmailData) {
  if (!isConfigured()) {
    console.log(
      `[Mode démo] Email "expédiée" non envoyé (Resend non configuré). Commande #${order.orderId.slice(0, 8)}.`
    );
    return;
  }

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: order.email,
    subject: `Votre commande #${order.orderId.slice(0, 8)} est en route 📦 — DS-ELECTRONIQUE`,
    html: orderShippedEmail(order),
  });

  if (error) {
    console.error("Échec envoi email (expédiée)", error);
  }
}

/**
 * Envoie au client l'email "commande livrée". À appeler uniquement quand
 * le statut passe réellement à `livree`.
 */
export async function sendOrderDeliveredEmail(order: OrderEmailData) {
  if (!isConfigured()) {
    console.log(
      `[Mode démo] Email "livrée" non envoyé (Resend non configuré). Commande #${order.orderId.slice(0, 8)}.`
    );
    return;
  }

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: order.email,
    subject: `Votre commande #${order.orderId.slice(0, 8)} a été livrée ✅ — DS-ELECTRONIQUE`,
    html: orderDeliveredEmail(order),
  });

  if (error) {
    console.error("Échec envoi email (livrée)", error);
  }
}