import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Category } from "@/types";

export default function CategoryCard({
  category,
  Icon,
}: {
  category: Category;
  Icon: LucideIcon;
}) {
  return (
    <Link
      href={`/produits?categorie=${category.slug}`}
      className="group bg-white border border-gray-100 rounded-2xl p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card hover:border-ds-blue"
    >
      <Icon
        className="mx-auto mb-3 text-ds-blue"
        size={40}
        strokeWidth={1.6}
      />
      <span className="text-sm font-semibold">
        {category.name}
      </span>
    </Link>
  );
}