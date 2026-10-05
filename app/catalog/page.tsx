import React from "react";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";

export const metadata = {
  title: "Catalog - AuraStore",
  description:
    "Browse curated minimalist tech accessories and workplace essentials.",
};

export default function CatalogPage() {
  const products = productsData as Product[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <CatalogView products={products} />
    </div>
  );
}
