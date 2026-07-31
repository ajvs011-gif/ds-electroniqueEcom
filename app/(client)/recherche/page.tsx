"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";
import { getAllProductsClient } from "@/lib/data/products.client";
import type { Product } from "@/types";
import { Search } from "lucide-react";

export default function RecherchePage() {
  return (
    <Suspense fallback={null}>
      <RechercheContent />
    </Suspense>
  );
}

function RechercheContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProductsClient().then(setProducts);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q)
    );
  }, [query, products]);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Recherche" }]} />

        <div className="relative max-w-xl mb-10">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit, une catégorie..."
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-ds-blue text-sm"
          />
        </div>

        {query.trim() === "" ? (
          <p className="text-gray-400 text-sm">Commencez à taper pour rechercher dans notre catalogue.</p>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {results.length} résultat{results.length > 1 ? "s" : ""} pour « {query} »
            </p>
            <ProductGrid products={results} />
          </>
        ) : (
          <EmptyState
            icon={Search}
            title={`Aucun résultat pour « ${query} »`}
            text="Essayez avec un autre mot-clé, ou parcourez nos catégories."
            ctaLabel="Voir la boutique"
            ctaHref="/produits"
          />
        )}
      </main>
      <Footer />
    </>
  );
}
