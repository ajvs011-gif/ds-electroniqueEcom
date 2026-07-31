"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-ds-gray rounded-full px-4 py-2.5"
    >
      <Search size={16} className="text-gray-500 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un Arduino, ESP32, capteur..."
        className="flex-1 bg-transparent outline-none text-sm min-w-0"
      />
    </form>
  );
}
