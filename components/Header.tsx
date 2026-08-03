"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronRight,
  Search,
  Cpu,
  Radio,
  Activity,
  Bot,
  Battery,
  Wrench,
  CircuitBoard,
} from "lucide-react";
import clsx from "clsx";
import SearchBar from "./SearchBar";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/produits" },
  { label: "Promotions", href: "/promotions" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// À terme : remplacer par les catégories réelles issues de Supabase
// (fetch côté serveur dans le layout, passées en prop à <Header categories={...} />).
const CATEGORIES = [
  { label: "Arduino", slug: "arduino", icon: Cpu, description: "Cartes UNO, Mega, Nano..." },
  { label: "ESP32", slug: "esp32", icon: Radio, description: "Wi-Fi, Bluetooth, caméra" },
  { label: "Capteurs", slug: "capteurs", icon: Activity, description: "Ultrason, température, mouvement" },
  { label: "Robotique", slug: "robotique", icon: Bot, description: "Châssis, servos, moteurs" },
  { label: "Alimentation", slug: "alimentation", icon: Battery, description: "Modules, batteries, régulateurs" },
  { label: "Outils", slug: "outils", icon: Wrench, description: "Fers à souder, multimètres" },
  { label: "Composants", slug: "composants", icon: CircuitBoard, description: "Résistances, LED, condensateurs" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);

  const { itemCount } = useCart();
  const { favoriteIds } = useFavorites();
  const { user } = useAuth();

  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Ombre au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture du dropdown catégories (desktop) au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target as Node)
      ) {
        setDesktopCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermeture du menu mobile au clic extérieur (hors bouton burger)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Fermeture à la touche Echap + blocage du scroll body pendant l'ouverture
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleEscape);

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Fermer le menu mobile à chaque changement de route (clic sur un lien)
  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
  }

  return (
    <>
      {/* Bandeau utilitaire */}
      <div className="bg-ds-blue-dark text-white text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between gap-3">
          <span className="truncate">
            🚚 Livraison à Abidjan sous 24h — Partout en Côte d&apos;Ivoire sous 72h
          </span>
          <Link
            href="/commandes"
            className="hover:underline opacity-90 hover:opacity-100 whitespace-nowrap flex-shrink-0"
          >
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
        {/* ===== Barre principale ===== */}
        <div
          className={clsx(
            "max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 sm:gap-5 lg:gap-7 transition-[padding] duration-200",
            scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
          )}
        >
          <Link href="/" className="flex-shrink-0" onClick={closeMobileMenu}>
            <Image
              src="/logo-ds-electronique.jpeg"
              alt="DS-ELECTRONIQUE"
              width={140}
              height={46}
              className={clsx(
                "w-auto transition-all",
                scrolled ? "h-8 sm:h-9" : "h-9 sm:h-11"
              )}
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm flex-shrink-0">
            {/* Dropdown Catégories */}
            <div ref={categoryMenuRef} className="relative">
              <button
                onClick={() => setDesktopCategoriesOpen((v) => !v)}
                className={clsx(
                  "flex items-center gap-1 py-1.5 hover:text-ds-blue transition-colors",
                  desktopCategoriesOpen && "text-ds-blue"
                )}
                aria-expanded={desktopCategoriesOpen}
              >
                Catégories
                <ChevronDown
                  size={15}
                  className={clsx(
                    "transition-transform duration-200",
                    desktopCategoriesOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Méga-menu */}
              <div
                className={clsx(
                  "absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 origin-top",
                  desktopCategoriesOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                )}
              >
                <div className="w-[560px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(11,45,92,0.16)] border border-gray-100 p-4 grid grid-cols-2 gap-1">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/categorie/${cat.slug}`}
                        onClick={() => setDesktopCategoriesOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-ds-gray transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-ds-blue/10 text-ds-blue flex items-center justify-center flex-shrink-0 group-hover:bg-ds-blue group-hover:text-white transition-colors">
                          <Icon size={18} />
                        </span>
                        <span>
                          <span className="block font-semibold text-sm text-gray-900">
                            {cat.label}
                          </span>
                          <span className="block text-xs text-gray-500 font-normal mt-0.5">
                            {cat.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

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

          {/* Recherche desktop */}
          <div className="hidden md:block flex-1 min-w-0">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 ml-auto">
            {/* Recherche mobile (icône uniquement) */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ds-gray"
              aria-label="Rechercher"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Search size={20} />
            </button>

            <Link
              href="/favoris"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ds-gray"
              onClick={closeMobileMenu}
            >
              <Heart size={20} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ds-red text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {favoriteIds.length}
                </span>
              )}
            </Link>

            <Link
              href="/panier"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ds-gray"
              onClick={closeMobileMenu}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ds-red text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href={user ? "/profil" : "/connexion"}
              onClick={closeMobileMenu}
              className="hidden sm:flex items-center gap-2 bg-ds-blue text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-ds-blue-dark transition-colors whitespace-nowrap"
            >
              <User size={16} />
              {user ? (user.user_metadata?.full_name?.split(" ")[0] ?? "Profil") : "Connexion"}
            </Link>

            {/* Bouton burger — icône Menu/X animée */}
            <button
              ref={menuButtonRef}
              className="lg:hidden w-9 h-9 flex items-center justify-center flex-shrink-0"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <span className="relative w-6 h-6 flex items-center justify-center">
                <Menu
                  size={22}
                  className={clsx(
                    "absolute transition-all duration-200",
                    mobileMenuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                  )}
                />
                <X
                  size={22}
                  className={clsx(
                    "absolute transition-all duration-200",
                    mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== Overlay + panneau mobile (slide-in) ===== */}
      <div
        aria-hidden={!mobileMenuOpen}
        className={clsx(
          "fixed inset-0 z-[60] lg:hidden transition-opacity duration-300",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          ref={mobileMenuRef}
          className={clsx(
            "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* En-tête du panneau */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 flex-shrink-0">
            <span className="font-bold text-ds-blue-dark">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ds-gray"
              aria-label="Fermer le menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Recherche mobile */}
            <div className="mb-4 md:hidden">
              <SearchBar />
            </div>

            {/* Compte */}
            <Link
              href={user ? "/profil" : "/connexion"}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 bg-ds-blue text-white px-4 py-3 rounded-xl font-semibold text-sm mb-5"
            >
              <User size={18} />
              {user
                ? `Bonjour, ${user.user_metadata?.full_name?.split(" ")[0] ?? "vous"}`
                : "Se connecter / Créer un compte"}
            </Link>

            {/* Catégories en accordéon */}
            <div className="border-b border-gray-100 pb-2 mb-2">
              <button
                onClick={() => setMobileCategoriesOpen((v) => !v)}
                className="w-full flex items-center justify-between py-3 font-semibold text-gray-900"
                aria-expanded={mobileCategoriesOpen}
              >
                Catégories
                <ChevronDown
                  size={18}
                  className={clsx(
                    "transition-transform duration-200 text-gray-400",
                    mobileCategoriesOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={clsx(
                  "grid transition-all duration-300 ease-out",
                  mobileCategoriesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
                style={{ display: "grid" }}
              >
                <div className="overflow-hidden">
                  <div className="pb-2 space-y-0.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/categorie/${cat.slug}`}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-ds-gray text-sm text-gray-700"
                        >
                          <Icon size={17} className="text-ds-blue flex-shrink-0" />
                          {cat.label}
                          <ChevronRight size={14} className="ml-auto text-gray-300" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Liens de nav principaux */}
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="py-3 border-b border-gray-50 text-sm font-medium text-gray-800 hover:text-ds-blue"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/favoris"
                onClick={closeMobileMenu}
                className="py-3 border-b border-gray-50 text-sm font-medium text-gray-800 hover:text-ds-blue flex items-center gap-2"
              >
                <Heart size={16} /> Favoris
                {favoriteIds.length > 0 && (
                  <span className="text-xs text-ds-red font-semibold">
                    ({favoriteIds.length})
                  </span>
                )}
              </Link>
              <Link
                href="/panier"
                onClick={closeMobileMenu}
                className="py-3 text-sm font-medium text-gray-800 hover:text-ds-blue flex items-center gap-2"
              >
                <ShoppingCart size={16} /> Panier
                {itemCount > 0 && (
                  <span className="text-xs text-ds-red font-semibold">({itemCount})</span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}