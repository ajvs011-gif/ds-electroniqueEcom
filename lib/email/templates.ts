import { formatFcfa } from "@/lib/format";

export type OrderEmailItem = {
  name: string;
  quantity: number;
  priceFcfa: number;
};

export type OrderEmailData = {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  comment?: string;
  paymentMethod: string;
  items: OrderEmailItem[];
  subtotalFcfa: number;
  livraisonFcfa: number;
  totalFcfa: number;
};

const BLUE = "#0057B8";
const BLUE_DARK = "#0B2D5C";
const GREEN = "#22C55E";
const GRAY = "#F4F4F4";

const PAYMENT_LABELS: Record<string, string> = {
  orange_money: "Orange Money",
  mtn_momo: "MTN MoMo",
  carte: "Carte bancaire",
  paiement_livraison: "Paiement à la livraison",
};

function itemsRows(items: OrderEmailItem[]) {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#222;">${i.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#666;text-align:center;">×${i.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#222;text-align:right;">${formatFcfa(i.priceFcfa * i.quantity)}</td>
      </tr>`
    )
    .join("");
}

function layout(title: string, bodyHtml: string) {
  return `
  <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:${GRAY};padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:${BLUE_DARK};padding:24px 32px;">
        <span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:.02em;">DS-ELECTRONIQUE</span>
      </div>
      <div style="padding:32px;">
        <h1 style="font-size:20px;color:#222;margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;background:${GRAY};font-size:12px;color:#888;">
        DS-ELECTRONIQUE — Composants électroniques pour makers, étudiants et ingénieurs en Côte d'Ivoire et en Afrique de l'Ouest.
      </div>
    </div>
  </div>`;
}

/** Bandeau de statut réutilisé sur les emails d'expédition / livraison. */
function statusBanner(emoji: string, label: string, color: string) {
  return `
    <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:${color}1A;color:${color};font-weight:700;font-size:13px;margin-bottom:16px;">
      ${emoji} ${label}
    </div>`;
}

function orderTotalsTable(order: OrderEmailData) {
  return `
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      ${itemsRows(order.items)}
    </table>
    <table style="width:100%;font-size:14px;color:#444;">
      <tr><td>Sous-total</td><td style="text-align:right;">${formatFcfa(order.subtotalFcfa)}</td></tr>
      <tr><td>Livraison</td><td style="text-align:right;">${formatFcfa(order.livraisonFcfa)}</td></tr>
      <tr>
        <td style="font-weight:800;padding-top:8px;color:${BLUE_DARK};">Total</td>
        <td style="font-weight:800;padding-top:8px;text-align:right;color:${BLUE_DARK};">${formatFcfa(order.totalFcfa)}</td>
      </tr>
    </table>`;
}

export function customerConfirmationEmail(order: OrderEmailData) {
  const body = `
    <p style="font-size:14px;color:#444;line-height:1.6;">
      Bonjour ${order.firstName}, merci pour votre commande <b>#${order.orderId.slice(0, 8)}</b> !
      Voici le récapitulatif :
    </p>
    ${orderTotalsTable(order)}
    <div style="margin-top:24px;padding:16px;background:${GRAY};border-radius:10px;font-size:13px;color:#555;">
      <p style="margin:0 0 6px;"><b>Livraison à :</b> ${order.city}</p>
      <p style="margin:0 0 6px;"><b>Téléphone :</b> ${order.phone}</p>
      <p style="margin:0;"><b>Paiement :</b> ${PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
      ${order.comment ? `<p style="margin:10px 0 0;"><b>Votre commentaire :</b> ${order.comment}</p>` : ""}
    </div>
    <p style="font-size:13px;color:#888;margin-top:24px;">
      Vous recevrez une notification dès que votre commande sera expédiée.
    </p>
  `;
  return layout("Commande confirmée ✓", body);
}

export function adminNotificationEmail(order: OrderEmailData) {
  const body = `
    <p style="font-size:14px;color:#444;line-height:1.6;">
      Nouvelle commande <b>#${order.orderId.slice(0, 8)}</b> reçue.
    </p>
    <div style="margin:16px 0;padding:16px;background:${GRAY};border-radius:10px;font-size:13px;color:#333;">
      <p style="margin:0 0 6px;"><b>Client :</b> ${order.firstName} ${order.lastName}</p>
      <p style="margin:0 0 6px;"><b>Email :</b> ${order.email}</p>
      <p style="margin:0 0 6px;"><b>Téléphone :</b> ${order.phone}</p>
      <p style="margin:0 0 6px;"><b>Ville :</b> ${order.city}</p>
      <p style="margin:0;"><b>Paiement :</b> ${PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
      ${order.comment ? `<p style="margin:10px 0 0;"><b>Commentaire :</b> ${order.comment}</p>` : ""}
    </div>
    ${orderTotalsTable(order)}
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/commandes"
       style="display:inline-block;margin-top:20px;background:${BLUE};color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;">
      Voir dans le back-office
    </a>
  `;
  return layout("🛒 Nouvelle commande", body);
}

export function orderShippedEmail(order: OrderEmailData) {
  const body = `
    ${statusBanner("📦", "Commande expédiée", BLUE)}
    <p style="font-size:14px;color:#444;line-height:1.6;">
      Bonjour ${order.firstName}, votre commande <b>#${order.orderId.slice(0, 8)}</b> vient d'être expédiée
      et est en route vers <b>${order.city}</b>.
    </p>
    <p style="font-size:14px;color:#444;line-height:1.6;">
      Livraison estimée sous 24h à Abidjan, ou 48h pour le reste de la Côte d'Ivoire.
    </p>
    ${orderTotalsTable(order)}
    <div style="margin-top:24px;padding:16px;background:${GRAY};border-radius:10px;font-size:13px;color:#555;">
      <p style="margin:0 0 6px;"><b>Adresse de livraison :</b> ${order.city}</p>
      <p style="margin:0;"><b>Téléphone de contact :</b> ${order.phone}</p>
    </div>
    <p style="font-size:13px;color:#888;margin-top:24px;">
      Vous recevrez un dernier email de confirmation dès que votre colis sera livré.
    </p>
  `;
  return layout("Votre commande est en route 📦", body);
}

export function orderDeliveredEmail(order: OrderEmailData) {
  const body = `
    ${statusBanner("✅", "Commande livrée", GREEN)}
    <p style="font-size:14px;color:#444;line-height:1.6;">
      Bonjour ${order.firstName}, votre commande <b>#${order.orderId.slice(0, 8)}</b> a bien été livrée
      à <b>${order.city}</b>. Merci pour votre confiance !
    </p>
    ${orderTotalsTable(order)}
    <p style="font-size:13px;color:#888;margin-top:24px;">
      Un souci avec un article reçu ? Répondez simplement à cet email, notre équipe vous répondra rapidement.
    </p>
  `;
  return layout("Votre commande a été livrée ✅", body);
}