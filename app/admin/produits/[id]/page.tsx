import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import ProductForm from "../ProductForm";
import { updateProduct } from "../actions";

export default async function EditProduitPage({ params }: { params: { id: string } }) {
  const { supabase } = await requireAdmin();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const updateWithId = updateProduct.bind(null, params.id);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Produits", href: "/admin/produits" },
          { label: product.name },
        ]}
      />
      <h1 className="text-2xl font-extrabold font-display mb-8">Modifier le produit</h1>
      <ProductForm
        action={updateWithId}
        initial={{
          name: product.name,
          imageUrl: product.image_url,
          price_fcfa: product.price_fcfa,
          old_price_fcfa: product.old_price_fcfa,
          badge: product.badge,
          rating: product.rating,
          stock: product.stock,
          icon: product.icon,
          category_slug: product.category_slug,
          short_description: product.short_description,
          description: product.description,
        }}
        submitLabel="Enregistrer les modifications"
        categories={categories ?? []}
      />
    </div>
  );
}
