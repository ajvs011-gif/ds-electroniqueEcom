import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatFcfa } from "@/lib/format";
import { deleteProduct } from "./actions";

export default async function AdminProduitsPage() {
  const { supabase } = await requireAdmin();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price_fcfa, stock, category_slug, badge")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Produits</h1>
          <p className="text-sm text-gray-500 mt-1">{products?.length ?? 0} produit(s) au catalogue</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 bg-ds-blue text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-ds-blue-dark transition-colors"
        >
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ds-gray">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold">Produit</th>
              <th className="px-5 py-3 font-semibold">Catégorie</th>
              <th className="px-5 py-3 font-semibold">Prix</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(products ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3.5 font-medium">
                  {p.name}
                  {p.badge && (
                    <span className="ml-2 text-[10px] font-bold bg-ds-red/10 text-ds-red px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-500">{p.category_slug}</td>
                <td className="px-5 py-3.5 font-semibold">{formatFcfa(p.price_fcfa)}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-ds-gray">
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ds-gray text-gray-500 hover:text-ds-blue"
                    >
                      <Pencil size={15} />
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-500 hover:text-ds-red"
                      >
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="text-sm text-gray-400 py-10 text-center">Aucun produit pour le moment.</p>
        )}
      </div>
    </div>
  );
}
