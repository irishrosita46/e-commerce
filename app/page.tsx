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

      {/* Featured Catalog Section */}
      <ProductGrid
        products={featuredProducts}
        title="Featured Selection"
        subtitle="Flagship essentials engineered for tactile performance and longevity."
      />
    </div>
  );
}
