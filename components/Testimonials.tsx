import { Testimonial } from "@/types";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {items.map((t) => {
        const initials = t.name
          .split(" ")
          .map((n) => n[0])
          .join("");
        return (
          <div key={t.id} className="bg-white border border-gray-100 rounded-card p-6">
            <div className="text-ds-orange text-sm mb-3">★★★★★</div>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-ds-blue-dark text-white flex items-center justify-center font-bold text-xs font-display">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-[13.5px]">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
