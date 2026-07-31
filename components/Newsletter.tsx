"use client";

import { FormEvent, useState } from "react";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="bg-ds-blue-dark text-white rounded-3xl px-10 py-11 flex flex-wrap items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl font-extrabold mb-2">Restez branché ⚡</h3>
        <p className="opacity-80 max-w-sm text-sm">
          Recevez nos nouveautés, promotions et tutoriels directement dans votre boîte mail.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2.5">
        <input
          type="email"
          required
          placeholder="Votre adresse email"
          className="px-4 py-3 rounded-lg text-ds-black outline-none min-w-[240px] text-sm"
        />
        <button
          type="submit"
          className="bg-ds-orange px-5.5 py-3 rounded-lg font-bold text-sm hover:brightness-95"
        >
          {submitted ? "Merci ! ✓" : "S'abonner"}
        </button>
      </form>
    </div>
  );
}
