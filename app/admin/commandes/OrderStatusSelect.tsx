"use client";

import { useRef } from "react";
import { updateOrderStatus } from "./actions";

const STATUSES = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = updateOrderStatus.bind(null, orderId);

  return (
    <form ref={formRef} action={action}>
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-ds-gray border-none outline-none cursor-pointer"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </form>
  );
}
