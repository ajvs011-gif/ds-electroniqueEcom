export const dynamic = "force-dynamic";
import Link from "next/link";
import { Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatFcfa } from "@/lib/format";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [{ count: productCount }, { count: userCount }, { data: orders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("id, status, total_fcfa, created_at").order("created_at", { ascending: false }),
  ]);

  const totalRevenue = (orders ?? [])
    .filter((o) => o.status !== "annulee")
    .reduce((sum, o) => sum + o.total_fcfa, 0);
  const pendingCount = (orders ?? []).filter((o) => o.status === "en_attente").length;
  const recentOrders = (orders ?? []).slice(0, 6);

  const kpis = [
    { label: "Chiffre d'affaires", value: formatFcfa(totalRevenue), icon: Wallet },
    { label: "Commandes totales", value: String(orders?.length ?? 0), icon: ShoppingBag },
    { label: "Produits au catalogue", value: String(productCount ?? 0), icon: Package },
    { label: "Utilisateurs inscrits", value: String(userCount ?? 0), icon: Users },
  ];

  return (
    <div>
      {/* En-tête : empilé sur mobile, sur une ligne à partir de sm */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de la boutique</p>
        </div>
        {pendingCount > 0 && (
          <Link
            href="/admin/commandes"
            className="inline-block self-start sm:self-auto bg-ds-orange/10 text-ds-orange text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {pendingCount} commande{pendingCount > 1 ? "s" : ""} en attente
          </Link>
        )}
      </div>

      {/* KPI : 1 colonne sur mobile, 2 sur tablette, 4 à partir de lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-gray-100 rounded-card p-4 sm:p-5">
              <div className="w-10 h-10 rounded-xl bg-ds-blue/10 text-ds-blue flex items-center justify-center mb-3.5">
                <Icon size={18} />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold font-display">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-ds-blue text-sm font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">Aucune commande pour le moment.</p>
        ) : (
          <>
            {/* ===== Vue mobile : cartes empilées (< sm) ===== */}
            <div className="sm:hidden divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/commandes`}
                  className="flex items-center justify-between py-3.5 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm">#{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-ds-gray">
                      {o.status}
                    </span>
                  </div>
                  <p className="font-semibold text-sm flex-shrink-0">{formatFcfa(o.total_fcfa)}</p>
                </Link>
              ))}
            </div>

            {/* ===== Vue desktop/tablette : tableau (>= sm) ===== */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                    <th className="pb-3 font-semibold">Commande</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Statut</th>
                    <th className="pb-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 font-medium">#{o.id.slice(0, 8)}</td>
                      <td className="py-3 text-gray-500">
                        {new Date(o.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-ds-gray">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold">{formatFcfa(o.total_fcfa)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}