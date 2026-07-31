import { requireAdmin } from "@/lib/supabase/admin-guard";
import { toggleAdmin } from "./actions";
import { ShieldCheck, Shield } from "lucide-react";

export default async function AdminUtilisateursPage() {
  const { supabase, user } = await requireAdmin();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city, is_admin, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold font-display">Utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-1">{profiles?.length ?? 0} compte(s) inscrit(s)</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ds-gray">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold">Nom</th>
              <th className="px-5 py-3 font-semibold">Inscrit le</th>
              <th className="px-5 py-3 font-semibold">Rôle</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(profiles ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3.5 font-medium">{p.full_name ?? "—"}</td>
                <td className="px-5 py-3.5 text-gray-500">
                  {new Date(p.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.is_admin ? "bg-ds-blue/10 text-ds-blue" : "bg-ds-gray text-gray-500"
                    }`}
                  >
                    {p.is_admin ? "Admin" : "Client"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  {p.id === user.id ? (
                    <span className="text-xs text-gray-400">Vous</span>
                  ) : (
                    <form action={toggleAdmin.bind(null, p.id, !p.is_admin)}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-ds-blue hover:underline"
                      >
                        {p.is_admin ? <Shield size={13} /> : <ShieldCheck size={13} />}
                        {p.is_admin ? "Retirer l'accès admin" : "Promouvoir admin"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!profiles || profiles.length === 0) && (
          <p className="text-sm text-gray-400 py-10 text-center">Aucun utilisateur inscrit.</p>
        )}
      </div>
    </div>
  );
}
