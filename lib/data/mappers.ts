import { Category, Product } from "@/types";

export function mapProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    priceFcfa: row.price_fcfa,
    oldPriceFcfa: row.old_price_fcfa ?? undefined,
    badge: row.badge ?? undefined,
    rating: row.rating,
    stock: row.stock,
    icon: row.icon,
    imageUrl: row.image_url ?? undefined,
    categorySlug: row.category_slug,
    shortDescription: row.short_description,
    description: row.description,
    specs: row.specs ?? [],
  };
}

export function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
  };
}
