export type PaymentMethod = "orange_money" | "mtn_momo" | "carte" | "paiement_livraison";

export type InitiatePaymentParams = {
  orderId: string;
  amountFcfa: number;
  phone: string;
  /** URL vers laquelle le fournisseur redirige une fois le paiement terminé */
  returnUrl: string;
};

export type InitiatePaymentResult = {
  /** true si le paiement doit encore être confirmé (redirection / USSD / webhook) */
  pending: boolean;
  /** URL de paiement à laquelle rediriger le client (Orange Money / carte), si applicable */
  redirectUrl?: string;
  /** Référence de transaction côté fournisseur, à stocker pour rapprochement au webhook */
  providerReference?: string;
  /** Message à afficher au client (ex: "Composez #144# pour valider") */
  message?: string;
};

export interface PaymentProvider {
  initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult>;
}
