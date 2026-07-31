import { Resend } from "resend";
import {
  adminNotificationEmail,
  customerConfirmationEmail,
  type OrderEmailData,
} from "./templates";

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL);
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

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || "DS-ELECTRONIQUE <onboarding@resend.dev>";

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
