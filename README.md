
# DSFR Accessible Starter: React + TypeScript

A tiny, public‑sector‑ready demo app (React + TypeScript + DSFR) that *proves* accessibility with automated tests and audits.

- Real patterns: **Modal** (focus trap + return), **Combobox (ARIA 1.2 listbox pattern)**, **Form** (labels, describedby, invalid, upload), **Radio group**, **Responsive grid**, **Toast** (`role="status"`).
- Automated gates: **eslint (jsx‑a11y)** → **Jest + jest‑axe** → **Playwright + axe** (fail on serious/critical) → **Lighthouse CI** (a11y ≥ 0.98) → **Pa11y**.
- Screen reader quick checks for **VoiceOver/NVDA**.

---

## Quick start

```bash
pnpm install
pnpm dev
```

- App served by Vite at `http://localhost:5173/` (SPA with React Router).
- Routes: `/` (Accueil), `/rdv`, `/justificatifs`.

---



## DSFR integration (SPA)

```ts
// src/main.tsx
import { createBrowserRouter, RouterProvider, Link as RouterLink } from "react-router-dom";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import "@codegouvfr/react-dsfr/main.css";

startReactDsfr({
  defaultColorScheme: "system",
  Link: RouterLink, // use React Router <Link> under the hood
});
```

- **Layout landmarks**: `<Header/>`, one **skip link** → `#content`, exactly one `<main id="content">…</main>`, `<Footer/>`.
- **Language**: page `<html lang="fr">`.

---


## Scripts & how to run

### Everything (lint → unit → build → serve → Lighthouse → E2E + axe → Pa11y)

```bash
pnpm check:a11y
```

### Individually

```bash
# Lint
pnpm lint

# Unit/Integration (Jest)
pnpm test
pnpm jest __tests__/modal.test.tsx -i
pnpm jest -t "Combobox"

# E2E (Playwright)
pnpm playwright test tests-e2e/a11y.spec.ts

# Build then serve dist on :4173 for audits
pnpm build
pnpm serve:dist

# Lighthouse CI against http://localhost:4173/
pnpm lhci

# Pa11y against http://localhost:4173/
pnpm pa11y:/
```

> **Note:** Playwright tests run against the dev server; Pa11y/Lighthouse run against the built site on `:4173`.

---

## Acceptance gates (local “CI”)

- **ESLint**: no errors (a11y rules on).
- **Jest**: all suites green, **`jest-axe` violations = 0**.
- **Playwright + axe**: e2e modal passes, **0 violations** on dialog.
- **Lighthouse CI**: **Accessibility ≥ 0.98**.
- **Pa11y**: **0 blocking errors**.

---

## Manual SR checks (quick scripts)

- **VoiceOver (macOS)**: `⌘ + F5` to toggle.
  - `VO + U` lists landmarks → jump to “Main”.
  - Activate “Ouvrir la modale”, VO should announce “dialogue” + title.
  - `Esc` closes and focus returns to trigger.
- **NVDA (Windows)**: ensure dialog role is announced; arrowing in combobox reads the active option.

