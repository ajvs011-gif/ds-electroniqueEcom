import { getCategoriesServer, getProductsServer } from "@/lib/data/products.server";
import ProduitsClient from "./ProduitsClient";

export default async function ProduitsPage() {
  const [products, categories] = await Promise.all([getProductsServer(), getCategoriesServer()]);
  return <ProduitsClient products={products} categories={categories} />;
}
