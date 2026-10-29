import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Zap, PackageCheck } from "lucide-react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";

export default function Home() {
  const allProducts = productsData as Product[];
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative border-b border-zinc-200 bg-zinc-50/50 py-20 sm:py-28 dark:border-zinc-800 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
            Engineered Essentials. <br />
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Curated for modern daily life.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400 leading-relaxed">
            Minimalist electronics, functional work accessories, and timeless
            design pieces. Built with clean architecture and strict quality
            standards.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/catalog">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Browse Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://it-agile-development.atlassian.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Atlassian Workspace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Value Props using shadcn Card */}
      <section className="py-12 border-b border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
              <CardContent className="p-6 space-y-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <PackageCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Curated Catalog
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Carefully categorized items with structured schemas and
                  real-time inventory previews.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
              <CardContent className="p-6 space-y-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Protected Checkout Gate
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Strict authentication verification guards order finalization
                  and customer transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
              <CardContent className="p-6 space-y-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Agile Sprint Delivery
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Continuous delivery mapped to Jira user stories, Confluence
                  documentation, and Git release tags.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-12 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Shop by Category
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Explore our six engineered product families designed for focused productivity.
              </p>
            </div>
            <Link
              href="/categories"
              className="mt-3 sm:mt-0 min-h-10 sm:min-h-0 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
            >
              <span>Explore all categories</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Audio", count: 3, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
              { name: "Desk Accessories", count: 5, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80" },
              { name: "Lighting", count: 2, image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=400&q=80" },
              { name: "Wearables", count: 2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
              { name: "Power & Charging", count: 2, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80" },
              { name: "Drinkware", count: 2, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-3 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 transition-all duration-200"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 mb-2.5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  {cat.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Catalog Section */}
      <ProductGrid
        products={featuredProducts}
        title="Featured Selection"
        subtitle="Flagship essentials engineered for tactile performance and longevity."
      />
    </div>
  );
}
