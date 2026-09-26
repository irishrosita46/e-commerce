import React from "react";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata = {
  title: "Catalog - AuraStore",
  description:
    "Browse curated minimalist tech accessories and workplace essentials.",
};

export default function CatalogPage() {
  const products = productsData as Product[];

  return <CatalogView products={products} />;
}
