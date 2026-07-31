"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { LogIn } from "lucide-react";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/profil");
    router.refresh();
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ds-blue text-white flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-extrabold font-display">Connexion</h1>
          <p className="text-sm text-gray-500 mt-1.5">Accédez à votre compte DS-ELECTRONIQUE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-sm font-semibold mb-1.5">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-ds-red text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ds-blue text-white py-3 rounded-lg font-bold hover:bg-ds-blue-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-ds-blue font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
