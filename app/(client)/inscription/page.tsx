"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { UserPlus } from "lucide-react";

export default function InscriptionPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone, city } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ds-blue text-white flex items-center justify-center mx-auto mb-4">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-extrabold font-display">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1.5">Rejoignez la communauté DS-ELECTRONIQUE</p>
        </div>

        {success ? (
          <div className="bg-ds-gray rounded-xl p-6 text-center">
            <p className="font-semibold mb-1.5">Compte créé avec succès ✓</p>
            <p className="text-sm text-gray-500">
              Vérifiez votre boîte mail pour confirmer votre adresse, puis{" "}
              <Link href="/connexion" className="text-ds-blue font-semibold hover:underline">
                connectez-vous
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nom complet</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                placeholder="vous@exemple.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                  placeholder="07 00 00 00 00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ville</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                  placeholder="Abidjan"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
                placeholder="6 caractères minimum"
              />
            </div>

            {error && <p className="text-ds-red text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ds-blue text-white py-3 rounded-lg font-bold hover:bg-ds-blue-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-ds-blue font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
