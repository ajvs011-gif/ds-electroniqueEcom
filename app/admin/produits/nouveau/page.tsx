
export const dynamic = "force-dynamic";
import Breadcrumb from "@/components/Breadcrumb";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export default async function NouveauProduitPage() {
  const { supabase } = await requireAdmin();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Produits", href: "/admin/produits" },
          { label: "Nouveau" },
        ]}
      />
      <h1 className="text-2xl font-extrabold font-display mb-8">Nouveau produit</h1>
      <ProductForm action={createProduct} submitLabel="Créer le produit" categories={categories ?? []} />
    </div>
  );
}
