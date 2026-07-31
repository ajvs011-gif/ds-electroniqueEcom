import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import Testimonials from "@/components/Testimonials";
import BlogCard from "@/components/BlogCard";
import { ICONS } from "@/lib/icons";
import { testimonials, blogPosts } from "@/lib/sample-data";
import {
  getCategoriesServer,
  getPopularProductsServer,
  getNewArrivalsServer,
} from "@/lib/data/products.server";
import { Bot } from "lucide-react";

export default async function HomePage() {
  const [categories, popularProducts, newArrivals] = await Promise.all([
    getCategoriesServer(),
    getPopularProductsServer(8),
    getNewArrivalsServer(4),
  ]);

  return (
    <>
      <Header />
      <Hero />


<section className="bg-ds-gray py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead eyebrow="Best-sellers" title="Produits populaires" linkLabel="Voir tout le catalogue" linkHref="/produits" />
          <ProductGrid products={popularProducts} />
        </div>
</section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHead eyebrow="Fraîchement arrivés" title="Nouveautés" linkLabel="Voir tout" linkHref="/produits" />
        <ProductGrid products={newArrivals} />
 </section>


      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHead eyebrow="Explorez" title="Catégories populaires" linkLabel="Voir toutes les catégories" linkHref="/categorie" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} Icon={ICONS[c.icon]} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-ds-red to-ds-orange text-white rounded-3xl px-10 py-8 flex flex-wrap justify-between items-center gap-5">
          <div>
            <h3 className="text-2xl font-extrabold mb-1">⚡ Ventes flash sur les kits ESP32</h3>
            <p className="opacity-90 text-sm">Jusqu&apos;à -30% — stock limité, dépêchez-vous avant la fin de l&apos;offre.</p>
          </div>
          <div className="flex gap-2.5">
            {[["12", "heures"], ["45", "min"], ["30", "sec"]].map(([val, label]) => (
              <div key={label} className="bg-white/20 rounded-lg px-3.5 py-2.5 text-center min-w-[60px]">
                <b className="block text-xl">{val}</b>
                <span className="text-[11px] opacity-90">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      <section className="bg-ds-gray py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead eyebrow="Engagement" title="Pourquoi nous choisir" />
          <div className="grid md:grid-cols-4 gap-5">
            {[
              ["Livraison rapide", "Expédition sous 24h à Abidjan, 72h dans le reste de la Côte d'Ivoire."],
              ["Produits garantis", "Composants testés et garantis, retour possible sous 7 jours."],
              ["Paiement sécurisé", "Orange Money, MTN MoMo, Visa et Mastercard acceptés."],
              ["Support technique", "Une équipe de makers pour vous conseiller sur vos projets."],
            ].map(([title, text]) => (
              <div key={title} className="bg-white rounded-card p-6 border border-gray-100">
                <div className="w-13 h-13 rounded-2xl bg-ds-blue text-white flex items-center justify-center mb-4">
                  <Bot size={24} />
                </div>
                <h4 className="font-bold mb-1.5">{title}</h4>
                <p className="text-[13.5px] text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHead eyebrow="Ils nous font confiance" title="Témoignages" />
        <Testimonials items={testimonials} />
      </section>

      <section className="bg-ds-gray py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead eyebrow="Ressources" title="Le blog" linkLabel="Tous les articles" linkHref="/blog" />
          <div className="grid md:grid-cols-3 gap-5">
            {blogPosts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <Newsletter />
      </section>

      <Footer />
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  linkLabel,
  linkHref,
}: {
  eyebrow: string;
  title: string;
  linkLabel?: string;
  linkHref?: string;
}) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
      <div>
        <span className="block text-ds-blue font-bold text-xs uppercase tracking-wider mb-1.5">
          {eyebrow}
        </span>
        <h2 className="text-[28px] font-extrabold">{title}</h2>
      </div>
      {linkLabel && linkHref && (
        <a href={linkHref} className="text-ds-blue font-semibold text-sm hover:underline">
          {linkLabel} →
        </a>
      )}
    </div>
  );
}
