export default function Rating({ value }: { value: number }) {
  return (
    <div className="text-[13px] text-ds-orange tracking-wider mb-2" aria-label={`${value} sur 5 étoiles`}>
      {"★★★★★".slice(0, value)}
      <span className="text-gray-300">{"★★★★★".slice(value)}</span>
    </div>
  );
}
