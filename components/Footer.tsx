import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ds-black text-gray-300 pt-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 pb-10">
          <div className="md:col-span-1">
            <Image
              src="/logo-ds-electronique.jpeg"
              alt="DS-ELECTRONIQUE"
              width={120}
              height={40}
              className="h-9 w-auto mb-3.5 brightness-125"
            />
            <p className="text-[13px] text-gray-400 leading-relaxed mb-4">
              Votre boutique de composants électroniques pour makers, étudiants et ingénieurs, en
              Côte d&apos;Ivoire et en Afrique de l&apos;Ouest.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8.5 h-8.5 rounded-full bg-[#333] flex items-center justify-center hover:bg-ds-blue transition-colors"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="À propos"
            links={[
              { label: "Qui sommes-nous", href: "/a-propos" },
              { label: "Contact", href: "/contact" },
              { label: "Blog", href: "/blog" },
            ]}
          />
          <FooterCol
            title="Service client"
            links={[
              { label: "Livraison", href: "/livraison" },
              { label: "Suivi commande", href: "/commandes" },
              { label: "FAQ", href: "/faq" },
            ]}
          />
          <FooterCol
            title="Juridique"
            links={[
              { label: "CGV", href: "/cgv" },
              { label: "Politique de confidentialité", href: "/confidentialite" },
            ]}
          />
        </div>

        <div className="border-t border-[#333] py-4.5 flex flex-wrap justify-between gap-2.5 text-[12.5px] text-gray-500">
          <span>© 2026 DS-ELECTRONIQUE. Tous droits réservés.</span>
          <div>
            Paiement sécurisé
            {["Orange Money", "MTN MoMo", "Visa", "Mastercard"].map((p) => (
              <span key={p} className="inline-block bg-[#2c2c2c] px-2.5 py-1 rounded-md text-[11px] font-semibold ml-1.5">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h5 className="text-white font-display font-bold text-sm mb-4">{title}</h5>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="block text-[13.5px] mb-2.5 text-gray-400 hover:text-white transition-colors">
          {l.label}
        </Link>
      ))}
    </div>
  );
}
