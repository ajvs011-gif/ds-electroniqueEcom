"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";
import { ICONS } from "@/lib/icons";
import { PackageSearch } from "lucide-react";
import clsx from "clsx";
import type { Category, Product } from "@/types";

type SortKey = "popularite" | "prix-asc" | "prix-desc";

export default function ProduitsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popularite");

  const filtered = useMemo(() => {
    let list = activeCategory
      ? products.filter((p) => p.categorySlug === activeCategory)
      : products;

    list = [...list];
    if (sort === "prix-asc") list.sort((a, b) => a.priceFcfa - b.priceFcfa);
    if (sort === "prix-desc") list.sort((a, b) => b.priceFcfa - a.priceFcfa);
    return list;
  }, [products, activeCategory, sort]);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Boutique" }]} />

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-extrabold font-display">Notre boutique</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none focus:border-ds-blue"
          >
            <option value="popularite">Popularité</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 self-start">
            <h3 className="font-display font-bold text-sm mb-3.5">Catégories</h3>
            <div className="flex lg:flex-col gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={clsx(
                  "text-left px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === null ? "bg-ds-blue text-white" : "hover:bg-ds-gray"
                )}
              >
                Toutes les catégories
              </button>
              {categories.map((c) => {
                const Icon = ICONS[c.icon];
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.slug)}
                    className={clsx(
                      "flex items-center gap-2 text-left px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeCategory === c.slug ? "bg-ds-blue text-white" : "hover:bg-ds-gray"
                    )}
                  >
                    <Icon size={15} />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            {filtered.length > 0 ? (
              <ProductGrid products={filtered} />
            ) : (
              <EmptyState
                icon={PackageSearch}
                title="Aucun produit dans cette catégorie"
                text="Essayez une autre catégorie ou revenez bientôt, nous ajoutons du stock régulièrement."
                ctaLabel="Voir toute la boutique"
                ctaHref="/produits"
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
