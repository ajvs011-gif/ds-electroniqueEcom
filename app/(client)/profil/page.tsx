import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";
import { Package, Heart } from "lucide-react";

export default async function ProfilPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?next=/profil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, city")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || "Utilisateur";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function signOut() {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mon profil" }]} />

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-ds-blue-dark text-white flex items-center justify-center font-display font-bold text-xl">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-display">{fullName}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Link href="/commandes" className="bg-white border border-gray-100 rounded-card p-5 hover:shadow-card hover:-translate-y-0.5 transition-all">
            <Package size={22} className="text-ds-blue mb-3" />
            <p className="font-semibold text-sm">Mes commandes</p>
            <p className="text-xs text-gray-400 mt-1">Suivi et historique</p>
          </Link>
          <Link href="/favoris" className="bg-white border border-gray-100 rounded-card p-5 hover:shadow-card hover:-translate-y-0.5 transition-all">
            <Heart size={22} className="text-ds-blue mb-3" />
            <p className="font-semibold text-sm">Mes favoris</p>
            <p className="text-xs text-gray-400 mt-1">Produits sauvegardés</p>
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-card p-6 max-w-lg mb-8">
          <h2 className="font-display font-bold mb-4">Mes informations</h2>
          <form action={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nom complet</label>
              <input
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Téléphone</label>
                <input
                  name="phone"
                  defaultValue={profile?.phone ?? ""}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ville</label>
                <input
                  name="city"
                  defaultValue={profile?.city ?? ""}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-ds-blue text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-ds-blue-dark transition-colors"
            >
              Enregistrer
            </button>
          </form>
        </div>

        <form action={signOut}>
          <button type="submit" className="text-ds-red font-semibold text-sm hover:underline">
            Se déconnecter
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
