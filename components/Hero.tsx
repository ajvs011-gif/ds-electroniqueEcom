import { CircuitBoard } from "lucide-react";
import ProductCarousel, { Slide } from "./ProductCarousel";

const slides: Slide[] = [
  {
    eyebrow: "Nouveau stock disponible",
    title: (
      <>
        Construisez vos projets <span className="text-blue-200">électroniques</span> sans
        limites
      </>
    ),
    text: "Arduino, ESP32, Raspberry Pi, capteurs et modules robotiques — livrés partout en Côte d'Ivoire et en Afrique de l'Ouest.",
    tags: ["Arduino", "ESP32", "Raspberry Pi", "Capteurs"],
    ctaLabel: "Découvrir la boutique",
    ctaHref: "/produits",
  },
  {
    eyebrow: "Promotions du moment",
    title: (
      <>
        Jusqu'à <span className="text-blue-200">-30%</span> sur les kits robotique
      </>
    ),
    text: "Profitez de nos offres sur une sélection de kits robotiques, moteurs et modules RF, en stock et prêts à expédier.",
    tags: ["Robotique", "Moteurs", "Modules RF"],
    ctaLabel: "Voir les promotions",
    ctaHref: "/promotions",
  },
  {
    eyebrow: "Livraison rapide",
    title: (
      <>
        Toute l'électronique, livrée <span className="text-blue-200">chez vous</span>
      </>
    ),
    text: "Commandez en ligne, payez en toute sécurité, et recevez vos composants où que vous soyez en Afrique de l'Ouest.",
    tags: ["Outillage", "Alimentation", "Afficheurs"],
    ctaLabel: "Commander maintenant",
    ctaHref: "/produits",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ds-blue-dark to-ds-blue text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center relative z-10">
        <ProductCarousel slides={slides} />
        <div className="order-first md:order-last bg-white/5 border border-white/15 rounded-3xl p-10 backdrop-blur-sm max-w-[280px] mx-auto md:max-w-none">
          <CircuitBoard size={160} className="w-full h-auto text-white/85" strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}
