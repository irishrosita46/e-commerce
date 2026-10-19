import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Headphones,
  Monitor,
  Lamp,
  Watch,
  Zap,
  Coffee,
  PackageCheck,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";

export const metadata = {
  title: "Categories - AuraStore",
  description:
    "Explore our complete range of engineered minimalist lifestyle goods across six curated categories.",
};

const CATEGORY_META: Record<
  string,
  {
    icon: React.ReactNode;
    description: string;
    highlights: string[];
    fallbackImage: string;
  }
> = {
  Audio: {
    icon: <Headphones className="h-5 w-5" />,
    description:
      "Acoustic precision headphones, studio earbuds, and room-filling 360-degree wireless speakers tuned for transparent audio fidelity.",
    highlights: ["Custom 40mm beryllium drivers", "Active hybrid noise cancellation", "LDAC & AAC high-res codecs"],
    fallbackImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  "Desk Accessories": {
    icon: <Monitor className="h-5 w-5" />,
    description:
      "CNC-machined mechanical keyboards, ergonomic mice, wool felt desk pads, and anodized aluminum monitor stands engineered for ergonomics.",
    highlights: ["Solid CNC zinc-aluminum chassis", "Ergonomic 26K DPI optical tracking", "Natural Merino wool surface"],
    fallbackImage:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  Lighting: {
    icon: <Lamp className="h-5 w-5" />,
    description:
      "Linear glare-free task lamps and screen-mounted asymmetric optical bars with ambient Kelvin temperature adjustment and 95+ CRI ratings.",
    highlights: ["2700K-6500K touch color tuning", "High CRI 95+ eye protection", "Zero screen glare asymmetric optics"],
    fallbackImage:
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
  },
  Wearables: {
    icon: <Watch className="h-5 w-5" />,
    description:
      "Aerospace-grade titanium smart telemetry watches and finger-worn recovery health rings with sapphire crystal glass and standalone GPS.",
    highlights: ["Aerospace-grade titanium case", "Continuous biometric telemetry", "Sapphire glass & 100m water resistance"],
    fallbackImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  "Power & Charging": {
    icon: <Zap className="h-5 w-5" />,
    description:
      "High-speed Gallium Nitride 100W travel charging hubs and Kevlar-braided fast charge cables rated for 50,000 bend cycles.",
    highlights: ["100W GaN 4-port fast delivery", "240W Thunderbolt Kevlar braiding", "Dynamic thermal over-voltage safeguards"],
    fallbackImage:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
  },
  Drinkware: {
    icon: <Coffee className="h-5 w-5" />,
    description:
      "Double-walled vacuum insulated ceramic travel tumblers and heat-resistant borosilicate glass carafes engineered for temperature retention.",
    highlights: ["18/8 kitchen stainless + ceramic lining", "12h hot / 24h cold thermal insulation", "Thermal shock borosilicate glass"],
    fallbackImage:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  },
};

export default function CategoriesPage() {
  const products = productsData as Product[];

  // Group items by category
  const categories = Array.from(new Set(products.map((p) => p.category)))
    .sort()
    .map((catName) => {
      const items = products.filter((p) => p.category === catName);
      const firstImage = items[0]?.image || CATEGORY_META[catName]?.fallbackImage;
      const meta = CATEGORY_META[catName] || {
        icon: <Monitor className="h-5 w-5" />,
        description: "Curated lifestyle essentials.",
        highlights: ["Engineered build quality", "Minimalist aesthetic", "Premium materials"],
        fallbackImage: firstImage,
      };

      return {
        name: catName,
        count: items.length,
        items,
        image: firstImage,
        description: meta.description,
        highlights: meta.highlights,
        icon: meta.icon,
        featuredItem: items.find((p) => p.featured) || items[0],
      };
    });

  const totalProducts = products.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <Breadcrumbs />

      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 pt-4">
        <Badge
          variant="outline"
          className="mb-3 border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          Curated Product Taxonomy
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Product Categories
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Explore our collection of precision-engineered tech goods, workspace
          accessories, acoustic gear, and minimalist daily essentials categorized
          for instant discovery and full inventory transparency.
        </p>

        {/* Stats strip */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <PackageCheck className="h-4 w-4" />
              <span>Families</span>
            </div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {categories.length} Curated Lines
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Catalog</span>
            </div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {totalProducts} Total Items
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Truck className="h-4 w-4" />
              <span>Shipping</span>
            </div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Free Over $100
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Checkout</span>
            </div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Auth-Protected
            </p>
          </div>
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="mt-8 flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
          Jump to:
        </span>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/catalog?category=${encodeURIComponent(cat.name)}`}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600 transition-colors"
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card
            key={cat.name}
            className="group overflow-hidden border border-zinc-200 bg-white transition-all duration-200 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 flex flex-col justify-between"
          >
            {/* Category Image Header */}
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-white/20 backdrop-blur-md text-white">
                      {cat.icon}
                    </span>
                    <span className="font-bold text-base tracking-tight drop-shadow-sm">
                      {cat.name}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-zinc-900 font-semibold backdrop-blur-sm"
                  >
                    {cat.count} {cat.count === 1 ? "Product" : "Products"}
                  </Badge>
                </div>
              </div>

              {/* Category Details */}
              <div className="p-5 pb-0">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Highlights List */}
                <div className="mb-4 space-y-1">
                  {cat.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400"
                    >
                      <span className="h-1 w-1 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Featured Product Box */}
                {cat.featuredItem && (
                  <div className="mb-4 rounded-md border border-zinc-100 bg-zinc-50/70 p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                      Featured In This Line
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mr-2">
                        {cat.featuredItem.name}
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold shrink-0">
                        ${cat.featuredItem.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <CardContent className="p-5 pt-0">
              <Link href={`/catalog?category=${encodeURIComponent(cat.name)}`}>
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs font-semibold border-zinc-300 text-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
                >
                  <span>Explore {cat.name} ({cat.count})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Production Standards & Cross-links */}
      <div className="mt-14 rounded-lg border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Looking for our complete inventory?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              Use our live catalog search to filter across all {totalProducts} items,
              sort by price and name, or view real-time inventory availability with zero page reload latency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/catalog">
              <Button
                size="sm"
                className="text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <span>View Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
