import React from "react";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const metadata = {
  title: "Catalog - AuraStore",
  description:
    "Browse curated minimalist tech accessories and workplace essentials.",
};

export default function CatalogPage() {
  const products = productsData as Product[];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <ProductGrid
        products={products}
        title="All Products"
        subtitle="Explore our complete collection of engineered daily essentials."
      />
    </div>
  );
}
