export type Product = {
  id: string;
  slug: string;
  name: string;
  priceFcfa: number;
  oldPriceFcfa?: number;
  badge?: string;
  rating: number; // 0-5
  stock: "en_stock" | "stock_limite" | "rupture";
  icon: string;
  imageUrl?: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};
