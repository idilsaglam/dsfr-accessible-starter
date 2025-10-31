# dsfr-accessible-starter

**Access first.** A tiny, public-sector-ready demo app (React + TypeScript + DSFR) that *proves* accessibility with tests and CI.

- Real patterns: **Modal** (trap + return), **Combobox (ARIA 1.2)**, **Date Grid** (roving tabindex), **Radio group**, **Form** (labels, describedby, invalid, upload), **Toast** (`role="status"`)
- Automated gates: **eslint (jsx-a11y)** → **jest + jest-axe** → **Playwright + axe** (fail on serious/critical) → **Lighthouse CI** (a11y ≥ 0.98) → **pa11y**
- Quick SR scripts for **VoiceOver/NVDA**

## Quick start
```bash
pnpm install
pnpm dev
