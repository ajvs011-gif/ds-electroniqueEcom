import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatFcfa } from "@/lib/format";
import OrderStatusSelect from "./OrderStatusSelect";

export default async function AdminCommandesPage() {
  const { supabase } = await requireAdmin();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_fcfa, full_name, email, phone, city, payment_method, comment, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold font-display">Commandes</h1>
        <p className="text-sm text-gray-500 mt-1">{orders?.length ?? 0} commande(s)</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ds-gray">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold">Commande</th>
              <th className="px-5 py-3 font-semibold">Client</th>
              <th className="px-5 py-3 font-semibold">Ville</th>
              <th className="px-5 py-3 font-semibold">Paiement</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Statut</th>
              <th className="px-5 py-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(orders ?? []).map((o) => (
              <tr key={o.id}>
                <td className="px-5 py-3.5 font-medium whitespace-nowrap">#{o.id.slice(0, 8)}</td>
                <td className="px-5 py-3.5">
                  <p className="font-medium">{o.full_name}</p>
                  <p className="text-xs text-gray-400">{o.phone}</p>
                  <p className="text-xs text-gray-400">{o.email}</p>
                  {o.comment && (
                    <p className="text-xs text-ds-blue mt-0.5" title={o.comment}>
                      💬 {o.comment.length > 40 ? `${o.comment.slice(0, 40)}...` : o.comment}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-500">{o.city}</td>
                <td className="px-5 py-3.5 text-gray-500">{o.payment_method}</td>
                <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                  {new Date(o.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-3.5">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
                <td className="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                  {formatFcfa(o.total_fcfa)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="text-sm text-gray-400 py-10 text-center">Aucune commande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
