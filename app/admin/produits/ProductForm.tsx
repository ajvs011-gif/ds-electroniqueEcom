import { Category } from "@/types";
import ProductImageUpload from "./ProductImageUpload";

type ProductFormValues = {
  name?: string;
  imageUrl?: string;
  price_fcfa?: number;
  old_price_fcfa?: number | null;
  badge?: string | null;
  rating?: number;
  stock?: string;
  icon?: string;
  category_slug?: string;
  short_description?: string;
  description?: string;
};

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

export default function ProductForm({
  action,
  initial,
  submitLabel,
  categories,
}: {
  action: (formData: FormData) => void;
  initial?: ProductFormValues;
  submitLabel: string;
  categories: Category[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="bg-white border border-gray-100 rounded-card p-6 space-y-4">
        <ProductImageUpload initialUrl={initial?.imageUrl} />
        <Field label="Nom du produit" name="name" defaultValue={initial?.name} required />

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Prix (FCFA)"
            name="price_fcfa"
            type="number"
            defaultValue={initial?.price_fcfa}
            required
          />
          <Field
            label="Ancien prix (optionnel)"
            name="old_price_fcfa"
            type="number"
            defaultValue={initial?.old_price_fcfa ?? undefined}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Badge (ex: PROMO, NOUVEAU)" name="badge" defaultValue={initial?.badge ?? undefined} />
          <Field
            label="Note (0-5)"
            name="rating"
            type="number"
            defaultValue={initial?.rating ?? 5}
            min={0}
            max={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Stock</label>
            <select
              name="stock"
              defaultValue={initial?.stock ?? "en_stock"}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
            >
              <option value="en_stock">En stock</option>
              <option value="stock_limite">Stock limité</option>
              <option value="rupture">Rupture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Catégorie</label>
            <select
              name="category_slug"
              defaultValue={initial?.category_slug ?? categories[0]?.slug}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Icône</label>
          <select
            name="icon"
            defaultValue={initial?.icon ?? "Cpu"}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Description courte"
          name="short_description"
          defaultValue={initial?.short_description}
          required
        />

        <div>
          <label className="block text-sm font-semibold mb-1.5">Description complète</label>
          <textarea
            name="description"
            defaultValue={initial?.description}
            rows={4}
            required
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-ds-blue text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-ds-blue-dark transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-ds-blue text-sm"
      />
    </div>
  );
}
