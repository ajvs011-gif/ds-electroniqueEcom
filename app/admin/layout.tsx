import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin-guard";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/produits", icon: Package },
  { label: "Catégories", href: "/admin/categories", icon: Tags },
  { label: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
  { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { fullName } = await requireAdmin();

  return (
    <div className="min-h-screen flex bg-ds-gray font-body">
      <aside className="w-64 bg-ds-black text-gray-300 flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Image
            src="/logo-ds-electronique.jpeg"
            alt="DS-ELECTRONIQUE"
            width={130}
            height={42}
            className="h-9 w-auto brightness-125"
          />
          <p className="text-[11px] text-gray-500 mt-2 uppercase tracking-wider font-semibold">
            Back-office
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <p className="px-3.5 py-1 text-xs text-gray-500 truncate">{fullName ?? "Admin"}</p>
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink size={17} />
            Retour au site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
