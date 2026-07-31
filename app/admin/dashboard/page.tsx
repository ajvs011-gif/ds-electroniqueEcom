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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de la boutique</p>
        </div>
        {pendingCount > 0 && (
          <Link
            href="/admin/commandes"
            className="bg-ds-orange/10 text-ds-orange text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {pendingCount} commande{pendingCount > 1 ? "s" : ""} en attente
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-gray-100 rounded-card p-5">
              <div className="w-10 h-10 rounded-xl bg-ds-blue/10 text-ds-blue flex items-center justify-center mb-3.5">
                <Icon size={18} />
              </div>
              <p className="text-2xl font-extrabold font-display">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-ds-blue text-sm font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">Aucune commande pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
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
        )}
      </div>
    </div>
  );
}
