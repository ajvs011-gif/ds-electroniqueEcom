import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatFcfa } from "@/lib/format";
export const dynamic = "force-dynamic";

export default async function AdminStatistiquesPage() {
  const { supabase } = await requireAdmin();

  const { data: orders } = await supabase.from("orders").select("status, total_fcfa");
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_name, quantity, price_fcfa");

  const revenueByStatus = ["en_attente", "confirmee", "expediee", "livree", "annulee"].map(
    (status) => ({
      status,
      total: (orders ?? [])
        .filter((o) => o.status === status)
        .reduce((sum, o) => sum + o.total_fcfa, 0),
      count: (orders ?? []).filter((o) => o.status === status).length,
    })
  );
  const maxRevenue = Math.max(...revenueByStatus.map((r) => r.total), 1);

  const productTotals = new Map<string, number>();
  (orderItems ?? []).forEach((item) => {
    productTotals.set(item.product_name, (productTotals.get(item.product_name) ?? 0) + item.quantity);
  });
  const topProducts = [...productTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxQty = Math.max(...topProducts.map(([, qty]) => qty), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold font-display">Statistiques</h1>
        <p className="text-sm text-gray-500 mt-1">Aperçu des ventes et des produits les plus demandés</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-card p-6">
          <h2 className="font-display font-bold mb-5">Chiffre d&apos;affaires par statut</h2>
          <div className="space-y-4">
            {revenueByStatus.map((r) => (
              <div key={r.status}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium capitalize">{r.status.replace("_", " ")}</span>
                  <span className="text-gray-500">
                    {formatFcfa(r.total)} · {r.count} commande{r.count > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-2.5 bg-ds-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ds-blue rounded-full"
                    style={{ width: `${(r.total / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-card p-6">
          <h2 className="font-display font-bold mb-5">Produits les plus vendus</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">Pas encore assez de données.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map(([name, qty]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium truncate pr-2">{name}</span>
                    <span className="text-gray-500 flex-shrink-0">{qty} vendu(s)</span>
                  </div>
                  <div className="h-2.5 bg-ds-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ds-orange rounded-full"
                      style={{ width: `${(qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
