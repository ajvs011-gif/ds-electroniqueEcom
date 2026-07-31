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

export function customerConfirmationEmail(order: OrderEmailData) {
  const body = `
    <p style="font-size:14px;color:#444;line-height:1.6;">
      Bonjour ${order.firstName}, merci pour votre commande <b>#${order.orderId.slice(0, 8)}</b> !
      Voici le récapitulatif :
    </p>
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
    </table>
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
    </table>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/commandes"
       style="display:inline-block;margin-top:20px;background:${BLUE};color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;">
      Voir dans le back-office
    </a>
  `;
  return layout("🛒 Nouvelle commande", body);
}
