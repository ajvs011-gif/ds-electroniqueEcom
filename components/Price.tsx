import { formatFcfa } from "@/lib/format";

export default function Price({
  price,
  oldPrice,
}: {
  price: number;
  oldPrice?: number;
}) {

  
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="font-extrabold text-lg text-ds-blue-dark">
        {formatFcfa(price)}
      </span>
      {oldPrice && (
        <span className="text-sm text-gray-400 line-through">
          {formatFcfa(oldPrice)}
        </span>
      )}
    </div>
  );
}
