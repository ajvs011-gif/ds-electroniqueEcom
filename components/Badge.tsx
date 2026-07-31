import clsx from "clsx";

export default function Badge({
  children,
  tone = "red",
}: {
  children: React.ReactNode;
  tone?: "red" | "green" | "orange";
}) {
  return (
    <span
      className={clsx(
        "absolute top-2.5 left-2.5 text-[11px] font-bold text-white px-2.5 py-1 rounded-md z-10",
        tone === "red" && "bg-ds-red",
        tone === "green" && "bg-ds-green",
        tone === "orange" && "bg-ds-orange"
      )}
    >
      {children}
    </span>
  );
}
