"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const paymentMessage = searchParams.get("message");

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-ds-green/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-ds-green" />
        </div>
        <h1 className="text-2xl font-extrabold font-display mb-2">Commande confirmée !</h1>
        <p className="text-gray-500 text-sm mb-1">
          Merci pour votre commande{orderId ? ` #${orderId.slice(0, 8)}` : ""}.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Vous recevrez une confirmation par email et pourrez suivre son statut dans votre espace commandes.
        </p>
        {paymentMessage && (
          <div className="bg-ds-gray rounded-xl p-4 text-sm text-gray-600 mb-6">{paymentMessage}</div>
        )}
        <div className="flex justify-center gap-3">
          <Link href="/commandes" className="bg-ds-blue text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-ds-blue-dark transition-colors">
            Suivre ma commande
          </Link>
          <Link href="/produits" className="bg-ds-gray px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
            Continuer mes achats
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
