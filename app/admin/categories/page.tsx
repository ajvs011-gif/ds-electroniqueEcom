
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { ICONS } from "@/lib/icons";
import { deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Catégories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories?.length ?? 0} catégorie(s)</p>
        </div>
        <Link
          href="/admin/categories/nouvelle"
          className="flex items-center gap-2 bg-ds-blue text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-ds-blue-dark transition-colors"
        >
          <Plus size={16} />
          Nouvelle catégorie
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(categories ?? []).map((c) => {
          const Icon = ICONS[c.icon] ?? ICONS.Cpu;
          return (
            <div key={c.id} className="bg-white border border-gray-100 rounded-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ds-blue/10 text-ds-blue flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.slug}</p>
                </div>
              </div>
              <form action={deleteCategory.bind(null, c.id)}>
                <button
                  type="submit"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-ds-red"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
