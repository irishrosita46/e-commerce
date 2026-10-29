# AuraStore - E-Commerce Platform

**Module:** IT Agile Development - Retake Project  
**Institution:** University of Europe for Applied Sciences (UE Germany)  
**Academic Assessor:** Dr. Naghmeh Niknejad  
**Atlassian Workspace:** [Jira Board & Confluence Space (SD)](https://it-agile-development.atlassian.net)  
**GitHub Repository:** [https://github.com/irishrosita46/e-commerce.git](https://github.com/irishrosita46/e-commerce.git)

---

## 1. Overview

**AuraStore** is a distraction-free, modern e-commerce web application engineered using the Next.js App Router, React 19, and Tailwind CSS v4. Developed following the Scrum framework across three sprints, the application emphasizes minimalist product presentation, rapid responsive navigation, real-time cart state management, and strict authenticated checkout validation.

---

## 2. Team Members & Functional Module Ownership

In accordance with course guidelines, every student owns and develops a dedicated functional module:

| Team Member | Student Email | GitHub Username | Scrum Role | Functional Module Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Irish Rosita** | `irish.rosita@ue-germany.de` | `irishrosita46` | Scrum Master & Dev | Authentication & Customer Account Dashboard (Route Guard) |
| **Varrel Omar Farazi** | `varrel.farazi@ue-germany.de` | `varrelfarazi` | Product Owner & Dev | Storefront, Catalog, Inventory & Multi-Facet Filtering |
| **Kaya Demiray** | `kaya.demiray@ue-germany.de` | `kayademiray` | Developer | Shopping Cart Drawer, Promo Coupons & Pricing Engine |
| **Sahibpreet Singh** | `sahibpreet@ue-germany.de` | `sahibpreetsingh` | Developer | Checkout, Payment Gateway Simulation & Accessibility |

---

## 3. Technology Stack & Design System

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + `lucide-react`
- **Testing:** Bun native test runner (45 tests across 7 test suites)
- **Design Tokens:** Strict monochromatic Zinc & White palette (`bg-white`, `text-zinc-900`, `border-zinc-200`) with zero star-rating clutter and flat borders.
- **State & Storage:** Client-side React Context (`AuthContext`, `CartContext`) persisted in `localStorage` for deterministic demonstration without external database dependencies.

---

## 4. Getting Started & Local Setup

### Prerequisites

- Node.js 20+ or Bun runtime
- Git

### Installation & Execution

```bash
# Clone repository
git clone https://github.com/irishrosita46/e-commerce.git
cd e-commerce

# Install dependencies
bun install
# or: npm install

# Run automated tests
bun test

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

## 5. Release Tags

Official version tags correspond to sprint review milestones:

- **`v1.0-sprint1`**: Sprint 1 Release - Storefront layout, catalog grid, search/filter foundation, cart context, auth contracts, and checkout layout contract.
- **`v2.0-sprint2`**: Sprint 2 Release - Cart drawer calculations, route guard on `/checkout`, registration/login validation, and shipping address inputs.
- **`v3.0-final`**: Sprint 3 Final Release - Simulated credit card payment with brand detection, 1.5s gateway latency, order receipt screen (`/checkout/success`), order history persistence, cross-device responsive defect fixes, and 25 QA test cases.

---

## 6. Agile Project Documentation (Confluence Space SD)

All sprint planning, user stories, burndown tracking, and meeting minutes are managed on Atlassian Cloud:

- **Jira Project:** `SCRUM` ([Board Link](https://it-agile-development.atlassian.net/jira/software/projects/SCRUM/boards/1))
- **Confluence Space:** `SD` (Software Development)
  - **Project and Team:** Business problem, vision, Product Goal, personas, stakeholders, scope, and team charter.
  - **Working Agreements:** Communication rules, DoR, DoD, estimation method, and integration approach.
  - **Technical Design:** System architecture, technology choices & rationale, and local setup instructions.
  - **Sprint and Meeting Records:** Master hub linking all 16 daily standups, sprint plannings, reviews, retrospectives, and improvement action tracker.
  - **Testing:** Full QA Test Register containing 25 test cases (`TC-01` through `TC-25`).
  - **Risks and Decisions:** 6-item risk register with mitigations, owners, and statuses, alongside Architecture Decision Records (ADRs).
  - **Version Control:** Repository URL, student attribution directory, and release tags.
  - **Final Delivery:** Completed scope, limitations, individual contribution summaries, lessons learned, and presentation links.
