import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-[13px] text-gray-500 mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-ds-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ds-black font-medium">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={13} />}
        </span>
      ))}
    </nav>
  );
}
