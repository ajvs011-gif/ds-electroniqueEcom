"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatFcfa } from "@/lib/format";
import { ICONS } from "@/lib/icons";
import Rating from "@/components/Rating";
import QuantitySelector from "@/components/QuantitySelector";
import FavoriteButton from "@/components/FavoriteButton";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import clsx from "clsx";

const stockLabel: Record<Product["stock"], { text: string; color: string }> = {
  en_stock: { text: "En stock", color: "text-ds-green" },
  stock_limite: { text: "Stock limité", color: "text-ds-orange" },
  rupture: { text: "Rupture de stock", color: "text-ds-red" },
};

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const Icon = ICONS[product.icon] ?? ICONS.Cpu;
  const stock = stockLabel[product.stock];

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="relative bg-ds-gray rounded-3xl aspect-square flex items-center justify-center">
        {product.badge && (
          <span className="absolute top-4 left-4 bg-ds-red text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            {product.badge}
          </span>
        )}
        <FavoriteButton productId={product.id} />
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-3xl"
          />
        ) : (
          <Icon size={140} className="text-ds-blue/80" strokeWidth={1.3} />
        )}
      </div>

      <div>
        <span className={clsx("text-[12px] font-bold flex items-center gap-1.5 mb-3", stock.color)}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {stock.text}
        </span>
        <h1 className="text-2xl md:text-[30px] font-extrabold font-display leading-tight mb-3">
          {product.name}
        </h1>
        <Rating value={product.rating} />
        <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-5">{product.shortDescription}</p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-extrabold text-ds-blue-dark">{formatFcfa(product.priceFcfa)}</span>
          {product.oldPriceFcfa && (
            <span className="text-lg text-gray-400 line-through">{formatFcfa(product.oldPriceFcfa)}</span>
          )}
        </div>

        <div className="flex items-center gap-4 mb-7">
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <button
            onClick={handleAdd}
            disabled={product.stock === "rupture"}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              added ? "bg-ds-green" : "bg-ds-blue hover:bg-ds-blue-dark"
            )}
          >
            <ShoppingCart size={18} />
            {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          {[
            [Truck, "Livraison 24-72h"],
            [ShieldCheck, "Garantie 7 jours"],
            [RotateCcw, "Retour facile"],
          ].map(([Ico, label]) => {
            const IconComp = Ico as typeof Truck;
            return (
              <div key={label as string} className="bg-ds-gray rounded-xl p-3.5">
                <IconComp size={20} className="mx-auto mb-1.5 text-ds-blue" />
                <span className="text-[11.5px] font-semibold">{label as string}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-display font-bold mb-3">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <h3 className="font-display font-bold mb-3">Caractéristiques</h3>
          <dl className="text-sm divide-y divide-gray-100">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between py-2.5">
                <dt className="text-gray-500">{s.label}</dt>
                <dd className="font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
