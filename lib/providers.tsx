"use client";

import { CartProvider } from "./cart-context";
import { FavoritesProvider } from "./favorites-context";
import { AuthProvider } from "./auth-context";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
