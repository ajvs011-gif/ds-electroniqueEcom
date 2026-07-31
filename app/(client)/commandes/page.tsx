import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { formatFcfa } from "@/lib/format";
import { Package } from "lucide-react";

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  en_attente: { text: "En attente", color: "bg-yellow-100 text-yellow-700" },
  confirmee: { text: "Confirmée", color: "bg-blue-100 text-ds-blue" },
  expediee: { text: "Expédiée", color: "bg-orange-100 text-ds-orange" },
  livree: { text: "Livrée", color: "bg-green-100 text-ds-green" },
  annulee: { text: "Annulée", color: "bg-red-100 text-ds-red" },
};

export default async function CommandesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_fcfa, created_at, order_items(id, product_name, quantity, price_fcfa)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mes commandes" }]} />
        <h1 className="text-[28px] font-extrabold font-display mb-8">Mes commandes</h1>

        {!orders || orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucune commande pour le moment"
            text="Vos commandes passées apparaîtront ici avec leur statut de livraison."
            ctaLabel="Découvrir la boutique"
            ctaHref="/produits"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.en_attente;
              return (
                <div key={order.id} className="bg-white border border-gray-100 rounded-card p-5">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-sm">Commande #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {order.order_items?.length ?? 0} article{(order.order_items?.length ?? 0) > 1 ? "s" : ""}
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-bold text-ds-blue-dark">{formatFcfa(order.total_fcfa)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link href="/profil" className="text-ds-blue text-sm font-semibold hover:underline">
            ← Retour au profil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
