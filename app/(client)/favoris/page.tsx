"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";
import { useFavorites } from "@/lib/favorites-context";
import { getAllProductsClient } from "@/lib/data/products.client";
import type { Product } from "@/types";
import { Heart } from "lucide-react";

export default function FavorisPage() {
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProductsClient().then(setProducts);
  }, []);

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Favoris" }]} />
        <h1 className="text-[28px] font-extrabold font-display mb-8">Mes favoris</h1>

        {favoriteProducts.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Aucun favori pour le moment"
            text="Cliquez sur le cœur d'un produit pour le retrouver ici facilement."
            ctaLabel="Découvrir la boutique"
            ctaHref="/produits"
          />
        ) : (
          <ProductGrid products={favoriteProducts} />
        )}
      </main>
      <Footer />
    </>
  );
}
