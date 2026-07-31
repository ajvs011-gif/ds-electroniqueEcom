"use client";

import Link from "next/link";
import Image from "next/image";
import { Cpu, Trash2 } from "lucide-react";
import { CartLine } from "@/types";
import { formatFcfa } from "@/lib/format";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/lib/cart-context";

export default function CartItem({ line }: { line: CartLine }) {
  const { setQuantity, removeFromCart } = useCart();
  const { product, quantity } = line;

  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-100 last:border-0">

      <Link
        href={`/produits/${product.slug}`}
        className="relative w-20 h-20 rounded-xl bg-ds-gray overflow-hidden flex-shrink-0"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Cpu size={32} className="text-ds-blue/80" />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/produits/${product.slug}`}
          className="font-semibold text-sm hover:text-ds-blue transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        <p className="text-ds-blue-dark font-bold text-sm mt-1">
          {formatFcfa(product.priceFcfa)}
        </p>
      </div>

      <QuantitySelector
        value={quantity}
        onChange={(q) => setQuantity(product.id, q)}
      />

      <div className="w-24 text-right font-bold text-sm hidden sm:block">
        {formatFcfa(product.priceFcfa * quantity)}
      </div>

      <button
        onClick={() => removeFromCart(product.id)}
        aria-label="Retirer du panier"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-ds-red hover:bg-red-50 transition-colors flex-shrink-0"
      >
        <Trash2 size={17} />
      </button>

    </div>
  );
}