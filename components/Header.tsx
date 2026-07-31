"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Menu, User } from "lucide-react";
import clsx from "clsx";
import SearchBar from "./SearchBar";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/produits" },
  { label: "Catégories", href: "/categorie" },
  { label: "Promotions", href: "/promotions" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { favoriteIds } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-ds-blue-dark text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between">
          <span>🚚 Livraison à Abidjan sous 24h — Partout en Côte d'Ivoire sous 72h</span>
          <Link href="/commandes" className="hover:underline opacity-90 hover:opacity-100">
            Suivre ma commande
          </Link>
        </div>
      </div>

      <header
        className={clsx(
          "sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-200",
          scrolled && "shadow-[0_4px_20px_rgba(11,45,92,0.10)]"
        )}
      >
        <div
          className={clsx(
            "max-w-7xl mx-auto px-6 flex items-center gap-7 transition-[padding] duration-200",
            scrolled ? "py-2.5" : "py-4"
          )}
        >
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-ds-electronique.jpeg"
              alt="DS-ELECTRONIQUE"
              width={140}
              height={46}
              className={clsx("w-auto transition-all", scrolled ? "h-9" : "h-11")}
              priority
            />
          </Link>

          <nav className="hidden lg:flex gap-6 font-semibold text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1.5 hover:text-ds-blue transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-ds-blue hover:after:w-full after:transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <SearchBar />

          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            <Link href="/favoris" className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ds-gray">
              <Heart size={20} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ds-red text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {favoriteIds.length}
                </span>
              )}
            </Link>
            <Link href="/panier" className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ds-gray">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ds-red text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href={user ? "/profil" : "/connexion"}
              className="flex items-center gap-2 bg-ds-blue text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-ds-blue-dark transition-colors whitespace-nowrap"
            >
              <User size={16} />
              {user ? (user.user_metadata?.full_name?.split(" ")[0] ?? "Profil") : "Connexion"}
            </Link>
            <button className="lg:hidden w-9 h-9 flex items-center justify-center" aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
