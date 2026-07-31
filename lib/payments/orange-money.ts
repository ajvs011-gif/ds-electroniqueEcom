import type { InitiatePaymentParams, InitiatePaymentResult, PaymentProvider } from "./types";

// Documentation officielle : https://developer.orange.com/apis/om-webpay-ci
// Étapes réelles : 1) obtenir un token OAuth2, 2) créer un paiement web, 3) rediriger
// le client vers payment_url, 4) Orange notifie /api/payments/webhook/orange-money.

const OAUTH_URL = "https://api.orange.com/oauth/v3/token";
const WEBPAY_URL = "https://api.orange.com/orange-money-webpay/ci/v1/webpayment";

function isConfigured() {
  return Boolean(
    process.env.ORANGE_MONEY_CLIENT_ID &&
      process.env.ORANGE_MONEY_CLIENT_SECRET &&
      process.env.ORANGE_MONEY_MERCHANT_KEY
  );
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.ORANGE_MONEY_CLIENT_ID}:${process.env.ORANGE_MONEY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Impossible d'obtenir le token Orange Money");
  const data = await res.json();
  return data.access_token as string;
}

export const orangeMoneyProvider: PaymentProvider = {
  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    if (!isConfigured()) {
      // Mode simulation : aucune clé API renseignée. Utile en développement,
      // à retirer dès que ORANGE_MONEY_CLIENT_ID / SECRET / MERCHANT_KEY sont définis.
      return {
        pending: true,
        message:
          "[Mode démo] Orange Money n'est pas encore configuré. Renseignez ORANGE_MONEY_CLIENT_ID, ORANGE_MONEY_CLIENT_SECRET et ORANGE_MONEY_MERCHANT_KEY dans .env.local pour activer les vrais paiements.",
      };
    }

    const token = await getAccessToken();

    const res = await fetch(WEBPAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_key: process.env.ORANGE_MONEY_MERCHANT_KEY,
        currency: "OUV", // XOF sandbox currency code Orange
        order_id: params.orderId,
        amount: params.amountFcfa,
        return_url: params.returnUrl,
        cancel_url: params.returnUrl,
        notif_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook/orange-money`,
        lang: "fr",
        reference: `DS-ELECTRONIQUE-${params.orderId.slice(0, 8)}`,
      }),
    });

    if (!res.ok) throw new Error("Échec de l'initiation du paiement Orange Money");
    const data = await res.json();

    return {
      pending: true,
      redirectUrl: data.payment_url,
      providerReference: data.pay_token,
    };
  },
};
