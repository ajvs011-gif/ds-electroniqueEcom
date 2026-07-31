"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import CartItem from "@/components/CartItem";
import EmptyState from "@/components/EmptyState";
import { useCart } from "@/lib/cart-context";
import { formatFcfa } from "@/lib/format";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

const LIVRAISON_FCFA = 1500;
const EXPEDITION = 2000;
const EXPEDITION_DAYS_TEXT = "2-3 jours ouvrés";

export default function PanierPage() {
  const { lines, subtotalFcfa, clearCart } = useCart();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const livraison = lines.length > 0 ? LIVRAISON_FCFA : 0;
  const expedition = lines.length > 0 ? EXPEDITION : 0;
  const expeditionDaysText = lines.length > 0 ? EXPEDITION_DAYS_TEXT : "";

  const remise = couponApplied ? Math.round(subtotalFcfa * 0.1) : 0;

  // Le total doit inclure les frais d'expédition
  const total = subtotalFcfa + livraison + expedition - remise;

  function handleApplyCoupon() {
    if (coupon.trim().toUpperCase() === "DS10") {
      setCouponApplied(true);
    }
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Panier" },
          ]}
        />

        <h1 className="text-[28px] font-extrabold font-display mb-8">
          Mon panier
        </h1>

        {lines.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Votre panier est vide"
            text="Parcourez notre catalogue pour trouver les composants de votre prochain projet."
            ctaLabel="Découvrir la boutique"
            ctaHref="/produits"
          />
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* Liste des produits */}
            <div className="bg-white border border-gray-100 rounded-card px-6">
              {lines.map((line) => (
                <CartItem key={line.product.id} line={line} />
              ))}

              <div className="py-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-400 hover:text-ds-red transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-ds-gray rounded-card p-6 lg:sticky lg:top-24">
              <h3 className="font-display font-bold mb-5">
                Récapitulatif
              </h3>

              <div className="flex gap-2 mb-5">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Code promo (ex: DS10)"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-ds-blue"
                />

                <button
                  onClick={handleApplyCoupon}
                  className="bg-ds-black text-white px-4 rounded-lg text-sm font-semibold hover:bg-ds-blue-dark transition-colors"
                >
                  Valider
                </button>
              </div>

              {couponApplied && (
                <p className="text-ds-green text-xs font-semibold mb-4">
                  ✓ Code DS10 appliqué (-10%)
                </p>
              )}

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatFcfa(subtotalFcfa)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{formatFcfa(livraison)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Frais d'expédition</span>
                  <span>{formatFcfa(expedition)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Expédition</span>
                  <span>{expeditionDaysText}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-ds-green">
                    <span>Remise</span>
                    <span>-{formatFcfa(remise)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                <span className="font-bold">Total</span>
                <span className="font-extrabold text-xl text-ds-blue-dark">
                  {formatFcfa(total)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-ds-blue text-white py-3.5 rounded-xl font-bold hover:bg-ds-blue-dark transition-colors"
              >
                Passer commande
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}