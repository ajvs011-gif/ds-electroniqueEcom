"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import Badge from "./Badge";
import Rating from "./Rating";
import Price from "./Price";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "@/lib/cart-context";
import { ICONS } from "@/lib/icons";

const stockLabel: Record<Product["stock"], { text: string; color: string }> = {
  en_stock: { text: "En stock", color: "text-ds-green" },
  stock_limite: { text: "Stock limité", color: "text-ds-orange" },
  rupture: { text: "Rupture de stock", color: "text-ds-red" },
};

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const stock = stockLabel[product.stock];
  const Icon = ICONS[product.icon] ?? ICONS.Cpu;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group block bg-white border border-gray-100 rounded-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative bg-ds-gray aspect-square flex items-center justify-center overflow-hidden">
        {product.badge && <Badge>{product.badge}</Badge>}
        <FavoriteButton productId={product.id} />
        {product.imageUrl ? (
        <Image
    src={product.imageUrl}
    alt={product.name}
    fill
    className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
    sizes="(max-width:768px)100vw,25vw"
/>
        ) : (
          <Icon
            size={72}
            className="text-ds-blue/80 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          />
        )}
        <div className="absolute left-0 right-0 -bottom-10 group-hover:bottom-0 transition-all duration-200 bg-ds-blue-dark/90 text-white text-xs font-semibold text-center py-2">
          Voir le produit
        </div>
      </div>
      <div className="p-4">
        <span className={`text-[11px] font-bold flex items-center gap-1.5 mb-1.5 ${stock.color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {stock.text}
        </span>
        <p className="text-[14.5px] font-semibold min-h-[38px] mb-1.5">{product.name}</p>
        <Rating value={product.rating} />
        <Price price={product.priceFcfa} oldPrice={product.oldPriceFcfa} />
        <button
          onClick={handleAdd}
          disabled={product.stock === "rupture"}
          className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13.5px] font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            added ? "bg-ds-green" : "bg-ds-blue hover:bg-ds-blue-dark"
          }`}
        >
          <ShoppingCart size={15} />
          {added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
      </div>
    </Link>
  );
}
