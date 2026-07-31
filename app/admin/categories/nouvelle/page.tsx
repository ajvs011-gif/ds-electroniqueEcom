import Breadcrumb from "@/components/Breadcrumb";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createCategory } from "../actions";

const ICON_OPTIONS = [
  "Cpu",
  "Wifi",
  "RadioTower",
  "Bot",
  "Wrench",
  "BatteryFull",
  "SatelliteDish",
  "MonitorSmartphone",
  "Plug",
];

export default async function NouvelleCategoriePage() {
  await requireAdmin();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Catégories", href: "/admin/categories" },
          { label: "Nouvelle" },
        ]}
      />
      <h1 className="text-2xl font-extrabold font-display mb-8">Nouvelle catégorie</h1>

      <form action={createCategory} className="max-w-md space-y-4 bg-white border border-gray-100 rounded-card p-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Nom</label>
          <input
            name="name"
            required
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
            placeholder="Ex: Microcontrôleurs"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Icône</label>
          <select
            name="icon"
            defaultValue="Cpu"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-ds-blue text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-ds-blue-dark transition-colors"
        >
          Créer la catégorie
        </button>
      </form>
    </div>
  );
}
