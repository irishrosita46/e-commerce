# AuraStore - E-Commerce Platform

**Module:** IT Agile Development - Retake Project  
**Institution:** University of Europe for Applied Sciences (UE Germany)  
**Academic Assessor:** Dr. Naghmeh Niknejad  
**Atlassian Workspace:** [Jira Board & Confluence Space (SD)](https://it-agile-development.atlassian.net)

---

## 1. Overview

**AuraStore** is a distraction-free, modern e-commerce web application engineered using the Next.js App Router, React 19, and Tailwind CSS v4. Developed following the Scrum framework across three sprints, the application emphasizes minimalist product presentation, rapid responsive navigation, real-time cart state management, and strict authenticated checkout validation.

---

## 2. Team Members & Functional Module Ownership

In accordance with course guidelines, every student owns and develops a dedicated functional module:

| Team Member                | Student Email                         | Scrum Role          | Functional Module Scope                           |
| :------------------------- | :------------------------------------ | :------------------ | :------------------------------------------------ |
| **Irish Rosita**           | `irish.rosita@ue-germany.de`          | Scrum Master & Dev  | Accounts, Authentication & Route Guard            |
| **Chukwuemeka Joel Offor** | `chukwuemekajoel.offor@ue-germany.de` | Product Owner & Dev | Catalog, Inventory Schema & Product Details       |
| **Sahibpreet Singh**       | `sahibpreet@ue-germany.de`            | Developer           | Storefront Shell, Navigation & Responsive Layout  |
| **Varrel Omar Farazi**     | `varrel.farazi@ue-germany.de`         | Developer           | Search Bar, Category Filters & Dynamic Queries    |
| **Kaya Demiray**           | `kaya.demiray@ue-germany.de`          | Developer           | Shopping Cart, Badge Counter & Price Calculations |
| **Khojiakbar Umarov**      | `khojiakbar.umarov@ue-germany.de`     | Developer           | Checkout Validation, Payment Simulation & Orders  |

---

## 3. Technology Stack & Design System

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + `@base-ui/react` + `lucide-react`
- **Design Tokens:** Strict monochromatic Zinc & White palette (`bg-white`, `text-zinc-900`, `border-zinc-200`) with zero star-rating clutter and flat borders.
- **State & Storage:** Client-side React Context (`AuthContext`, `CartContext`) persisted in `localStorage` for deterministic demonstration without external database dependencies.

---

## 4. Getting Started & Local Setup

### Prerequisites

- Node.js 20+ or Bun runtime
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/irishrosita46/e-commerce.git
cd e-commerce

# Install dependencies
bun install
# or: npm install

# Run local development server
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

### Verification & Production Build

```bash
bun run build
# or: npm run build
```

---

## 5. Agile Project Documentation

All sprint planning, user stories, burndown tracking, and meeting minutes are managed on Atlassian Cloud:

- **Jira Project:** `SCRUM` ([Board Link](https://it-agile-development.atlassian.net/jira/software/projects/SCRUM/boards/1))
- **Confluence Space:** `SD` (Software Development)
  - Team Charter & Working Agreements (DoR / DoD)
  - Project Vision & Product Goal
  - System Architecture & Technical Design
  - Risk Register & Decision Log
  - Bi-daily Standup Check-in Records
