"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useFavorites } from "@/lib/favorites-context";

export default function FavoriteButton({ productId }: { productId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      aria-label="Ajouter aux favoris"
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(productId);
      }}
      className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
    >
      <Heart
        size={16}
        className={clsx(
          "transition-colors",
          active ? "fill-ds-red stroke-ds-red" : "stroke-ds-black"
        )}
      />
    </button>
  );
}
