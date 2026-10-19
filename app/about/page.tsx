import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Code2,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  Calendar,
  FileCheck,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "About - AuraStore",
  description:
    "Learn about AuraStore's academic context, engineering architecture, team roster, and agile development standards.",
};

const TEAM_MEMBERS = [
  {
    name: "Irish Rosita",
    email: "irish.rosita@ue-germany.de",
    role: "Scrum Master & Developer",
    scope: "Authentication, Account Security, Session Tokens & Route Guards",
    keyTickets: "SCRUM-17, SCRUM-62, SCRUM-86",
    pts: "15.0 Story Points",
  },
  {
    name: "Varrel Omar Farazi",
    email: "varrel.farazi@ue-germany.de",
    role: "Product Owner & Developer",
    scope: "Product Catalog Grid, Sorting, Debounced Search, Category Taxonomies & Inventory",
    keyTickets: "SCRUM-14, SCRUM-15, SCRUM-50, SCRUM-54, SCRUM-74, SCRUM-78",
    pts: "20.0 Story Points",
  },
  {
    name: "Sahibpreet Singh",
    email: "sahibpreet@ue-germany.de",
    role: "Developer",
    scope: "Storefront Shell, Navigation, Multi-Step Checkout Schema & WCAG Accessibility",
    keyTickets: "SCRUM-13, SCRUM-41, SCRUM-46, SCRUM-66, SCRUM-70, SCRUM-90",
    pts: "22.0 Story Points",
  },
  {
    name: "Kaya Demiray",
    email: "kaya.demiray@ue-germany.de",
    role: "Developer",
    scope: "Shopping Cart Context, CartDrawer, Pricing Engine & Promo Codes",
    keyTickets: "SCRUM-16, SCRUM-58, SCRUM-82",
    pts: "13.0 Story Points",
  },
];

const SPRINTS = [
  {
    sprint: "Sprint 1",
    dates: "Sept 23 - Oct 1, 2026",
    status: "Completed (v1.0-sprint1)",
    velocity: "24.0 / 24.0 pts",
    focus:
      "Storefront foundation, 8-product catalog grid, multi-user cart state isolation, client authentication modal, and unauthenticated checkout route guard.",
  },
  {
    sprint: "Sprint 2",
    dates: "Oct 4 - Oct 15, 2026",
    status: "Completed (v2.0-sprint2)",
    velocity: "28.0 / 28.0 pts",
    focus:
      "Interactive discovery, debounced text search, category filter pills, sort options, inventory badges, and mid-project QA test cases TC-11 to TC-18.",
  },
  {
    sprint: "Sprint 3",
    dates: "Oct 18 - Oct 31, 2026",
    status: "Active (Sprint 3 in Progress)",
    velocity: "22.0 pts planned",
    focus:
      "WCAG 2.1 AA keyboard accessibility audit, order receipt generation, address validation, tax/shipping math engine, and final QA test register TC-19 to TC-24.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <Breadcrumbs />

      {/* Hero / Header Section */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-12 pt-4">
        <Badge
          variant="outline"
          className="mb-3 border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          University of Europe for Applied Sciences (UE Germany)
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Engineered for Daily Utility. <br />
          <span className="text-zinc-500 font-medium">Built with Agile Rigor.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          AuraStore is a modern web-based storefront engineered as part of the
          <em> IT Agile Development</em> retake curriculum under the academic supervision of
          <strong> Dr. Naghmeh Niknejad</strong>. The project demonstrates full-lifecycle
          Scrum methodology, traceable multi-identity Git contributions, automated Atlassian
          Jira and Confluence synchronization, and production-grade software craftsmanship.
        </p>

        {/* Quick Meta Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Course</span>
            <p className="mt-0.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              IT Agile Development
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Academic Lead</span>
            <p className="mt-0.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Dr. Naghmeh Niknejad
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Jira Project</span>
            <p className="mt-0.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Key: SCRUM (Board 1)
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Confluence Space</span>
            <p className="mt-0.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Space: SD
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl mb-6">
          Architectural Principles &amp; Quality Standards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 mb-2">
                <Code2 className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Next.js 16 &amp; Strict TypeScript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Pre-rendered static routes using App Router and Turbopack. Zero
                any-type compromises, 100% compile safety, and sub-6-second production builds with zero warnings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 mb-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Multi-Tenant Cart &amp; Auth Isolation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Guest cart migration, strictly segregated localStorage keys per user ID,
                RFC 5322 email regex checking, and live unauthenticated route guards protecting <code>/checkout</code>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 mb-2">
                <Layers className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Decoupled Calculation Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Headless mathematical functions in <code>lib/orders.ts</code> computing tiered
                standard shipping ($9.99), free shipping over $100, and 8% sales tax with zero DOM coupling.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Roster & Module Ownership */}
      <div className="mt-14 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Team Roster &amp; Functional Ownership
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Four active students developing dedicated, integrated functional modules per course specifications.
            </p>
          </div>
          <Badge className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 w-fit">
            4 Active Members
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TEAM_MEMBERS.map((m) => (
            <Card
              key={m.email}
              className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-none"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {m.name}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {m.role}
                    </p>
                    <code className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {m.email}
                    </code>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-200">
                    {m.pts}
                  </Badge>
                </div>

                <div className="mt-4 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <strong>Module Scope:</strong> {m.scope}
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-1">
                    Tickets: {m.keyTickets}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Agile Sprints Timeline */}
      <div className="mt-14 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl mb-6">
          Scrum Sprint Execution Timeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SPRINTS.map((s) => (
            <Card
              key={s.sprint}
              className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-none flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {s.sprint}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {s.velocity}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{s.dates}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {s.focus}
                </p>
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    Status: {s.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Governance & Links */}
      <div className="mt-14 rounded-lg border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Traceable Project Governance &amp; Code Quality
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              Every sprint cycle, daily standup check-in, acceptance test result, and code commit
              is linked and maintained across our Atlassian Jira and Confluence cloud environments.
              Zero dead buttons, zero broken routes, and 100% production readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="https://it-agile-development.atlassian.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <span>Atlassian Workspace</span>
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link href="/catalog">
              <Button
                size="sm"
                className="text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <span>Browse Storefront</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
