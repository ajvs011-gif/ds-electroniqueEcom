import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm px-5 py-2.5 transition-all duration-200",
        variant === "primary" &&
          "bg-ds-blue text-white hover:bg-ds-blue-dark hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-ds-orange text-white hover:brightness-95 hover:-translate-y-0.5",
        variant === "ghost" &&
          "bg-ds-gray text-ds-black hover:bg-gray-200",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
