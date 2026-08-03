"use client";
export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import { formatFcfa } from "@/lib/format";
import clsx from "clsx";

const LIVRAISON_FCFA = 2000;
const PAYMENT_METHODS = [
  { id: "orange_money", label: "Orange Money" },
  { id: "mtn_momo", label: "MTN MoMo" },
  { id: "carte", label: "Carte bancaire" },
  { id: "paiement_livraison", label: "Paiement à la livraison" },
] as const;

export default function CheckoutPage() {
  const { lines, subtotalFcfa, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("paiement_livraison");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = subtotalFcfa + LIVRAISON_FCFA;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);

    // 1. Création de compte optionnelle
    let userId: string | null = null;
    if (createAccount) {
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        setSubmitting(false);
        return;
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: `${firstName} ${lastName}`.trim(), phone, city } },
      });
      if (signUpError) {
        setError(`Compte non créé : ${signUpError.message}. La commande peut continuer sans compte.`);
      } else {
        userId = data.user?.id ?? null;
      }
    }

    // 2. Création de la commande (invité ou compte)
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((line) => ({
          productId: line.product.id,
          name: line.product.name,
          quantity: line.quantity,
          priceFcfa: line.product.priceFcfa,
        })),
        customer: { firstName, lastName, city, phone, email, comment },
        paymentMethod,
        userId,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitting(false);
      setError(data.error || "Impossible de créer la commande. Réessayez.");
      return;
    }

    const { orderId } = await res.json();
    let confirmationUrl = `/commandes/confirmation?id=${orderId}`;

    // 3. Paiement mobile money / carte si nécessaire
    try {
      const payRes = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, method: paymentMethod, phone }),
      });
      const payment = await payRes.json();

      setSubmitting(false);

      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }
      if (payment.message) {
        confirmationUrl += `&message=${encodeURIComponent(payment.message)}`;
      }
    } catch {
      setSubmitting(false);
    }

    clearCart();
    router.push(confirmationUrl);
  }

  if (lines.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-500">Votre panier est vide.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Panier", href: "/panier" }, { label: "Checkout" }]} />
        <h1 className="text-[28px] font-extrabold font-display mb-8">Finaliser la commande</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="space-y-6">
            <section className="bg-white border border-gray-100 rounded-card p-6">
              <h3 className="font-display font-bold mb-4">Vos informations</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Prénom" value={firstName} onChange={setFirstName} required />
                <Field label="Nom" value={lastName} onChange={setLastName} required />
                <Field label="Ville" value={city} onChange={setCity} required />
                <Field label="Téléphone" value={phone} onChange={setPhone} required type="tel" />
                <div className="sm:col-span-2">
                  <Field label="Email" value={email} onChange={setEmail} required type="email" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1.5">
                  Commentaire de commande <span className="text-gray-400 font-normal">(facultatif)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Précisions sur la livraison, un repère, une demande particulière..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                />
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-ds-blue"
                  />
                  <span className="text-sm">
                    <span className="font-semibold">Créer un compte</span>
                    <span className="block text-gray-500 text-xs mt-0.5">
                      Optionnel — pour retrouver facilement l&apos;historique de vos commandes la prochaine fois.
                    </span>
                  </span>
                </label>
                {createAccount && (
                  <div className="mt-3.5 max-w-xs">
                    <Field
                      label="Mot de passe"
                      value={password}
                      onChange={setPassword}
                      type="password"
                      required={createAccount}
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white border border-gray-100 rounded-card p-6">
              <h3 className="font-display font-bold mb-4">Mode de paiement</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={clsx(
                      "px-4 py-3 rounded-lg border text-sm font-semibold text-left transition-colors",
                      paymentMethod === method.id
                        ? "border-ds-blue bg-ds-blue/5 text-ds-blue"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-ds-gray rounded-card p-6 lg:sticky lg:top-24">
            <h3 className="font-display font-bold mb-5">Récapitulatif</h3>
            <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
              {lines.map((line) => (
                <div key={line.product.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate pr-2">{line.quantity}× {line.product.name}</span>
                  <span className="flex-shrink-0">{formatFcfa(line.product.priceFcfa * line.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatFcfa(subtotalFcfa)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{formatFcfa(LIVRAISON_FCFA)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
              <span className="font-bold">Total</span>
              <span className="font-extrabold text-xl text-ds-blue-dark">{formatFcfa(total)}</span>
            </div>

            {error && <p className="text-ds-red text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ds-blue text-white py-3.5 rounded-xl font-bold hover:bg-ds-blue-dark transition-colors disabled:opacity-50"
            >
              {submitting ? "Traitement..." : "Confirmer la commande"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
      />
    </div>
  );
}
