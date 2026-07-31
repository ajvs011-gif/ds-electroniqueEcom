import { randomUUID } from "crypto";
import type { InitiatePaymentParams, InitiatePaymentResult, PaymentProvider } from "./types";

// Documentation officielle : https://momodeveloper.mtn.com (produit "Collections")
// Étapes réelles : 1) obtenir un token OAuth2 avec la clé d'abonnement + API user/key,
// 2) déclencher une "Request to Pay" (débit du client par USSD push),
// 3) MTN notifie /api/payments/webhook/mtn-momo une fois le client ayant confirmé sur son téléphone.

const BASE_URL = process.env.MTN_MOMO_BASE_URL ?? "https://sandbox.momodeveloper.mtn.com";

function isConfigured() {
  return Boolean(
    process.env.MTN_MOMO_SUBSCRIPTION_KEY &&
      process.env.MTN_MOMO_API_USER &&
      process.env.MTN_MOMO_API_KEY
  );
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MTN_MOMO_API_USER}:${process.env.MTN_MOMO_API_KEY}`
  ).toString("base64");

  const res = await fetch(`${BASE_URL}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
    },
  });

  if (!res.ok) throw new Error("Impossible d'obtenir le token MTN MoMo");
  const data = await res.json();
  return data.access_token as string;
}

export const mtnMomoProvider: PaymentProvider = {
  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    if (!isConfigured()) {
      // Mode simulation : aucune clé API renseignée. Utile en développement,
      // à retirer dès que MTN_MOMO_SUBSCRIPTION_KEY / API_USER / API_KEY sont définis.
      return {
        pending: true,
        message:
          "[Mode démo] MTN MoMo n'est pas encore configuré. Renseignez MTN_MOMO_SUBSCRIPTION_KEY, MTN_MOMO_API_USER et MTN_MOMO_API_KEY dans .env.local pour activer les vrais paiements.",
      };
    }

    const token = await getAccessToken();
    const referenceId = randomUUID();

    const res = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
        "X-Reference-Id": referenceId,
        "X-Target-Environment": process.env.MTN_MOMO_ENV ?? "sandbox",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(params.amountFcfa),
        currency: "XOF",
        externalId: params.orderId,
        payer: { partyIdType: "MSISDN", partyId: params.phone },
        payerMessage: "Commande DS-ELECTRONIQUE",
        payeeNote: `Commande #${params.orderId.slice(0, 8)}`,
      }),
    });

    if (!res.ok && res.status !== 202) {
      throw new Error("Échec de l'initiation du paiement MTN MoMo");
    }

    return {
      pending: true,
      providerReference: referenceId,
      message: "Un push USSD MTN MoMo a été envoyé sur votre téléphone. Validez pour confirmer.",
    };
  },
};
