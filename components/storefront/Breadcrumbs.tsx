"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();

  // If no items provided, dynamically derive from pathname
  const breadcrumbItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    if (!pathname || pathname === "/") {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);
    const generated: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let accumulatedPath = "";
    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const isLast = index === segments.length - 1;

      // Clean label (capitalize, replace hyphens)
      const label = seg
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      generated.push({
        label,
        href: isLast ? undefined : accumulatedPath,
      });
    });

    return generated;
  }, [items, pathname]);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-xs text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {breadcrumbItems.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === breadcrumbItems.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {!isFirst && (
                <ChevronRight
                  className="h-3 w-3 text-zinc-400 dark:text-zinc-600 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:hover:text-zinc-100"
                >
                  {isFirst && <Home className="h-3 w-3" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="font-medium text-zinc-900 dark:text-zinc-100"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

