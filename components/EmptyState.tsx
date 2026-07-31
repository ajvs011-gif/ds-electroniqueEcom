import Link from "next/link";
import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  text,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-16 h-16 rounded-full bg-ds-gray flex items-center justify-center mb-5">
        <Icon size={28} className="text-ds-blue" />
      </div>
      <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{text}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="bg-ds-blue text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-ds-blue-dark transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
