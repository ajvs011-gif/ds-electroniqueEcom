import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import {
  getProductBySlugServer,
  getRelatedProductsServer,
  getCategoriesServer,
} from "@/lib/data/products.server";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugServer(params.slug);
  if (!product) notFound();

  const [categories, related] = await Promise.all([
    getCategoriesServer(),
    getRelatedProductsServer(product.categorySlug, product.id, 4),
  ]);
  const category = categories.find((c) => c.slug === product.categorySlug);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Boutique", href: "/produits" },
            ...(category ? [{ label: category.name, href: `/produits?categorie=${category.slug}` }] : []),
            { label: product.name },
          ]}
        />
        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xl font-extrabold font-display mb-6">Produits similaires</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
