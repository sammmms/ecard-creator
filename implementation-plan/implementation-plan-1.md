# Implementation Plan 1 — CNY Greeting Card Generator MVP

> **Source:** `cny-greeting-mvp-plan.md`
> **Last Updated:** 2026-02-09 (Round 4)
> **Status:** In Progress

---

## Completion Status Legend

| Symbol | Meaning |
|--------|---------|
| :white_check_mark: | Completed |
| :construction: | Partially done (UI only or mock) |
| :x: | Not started |

---

## Phase 1: Boot & Database

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Prisma schema with SQLite | :white_check_mark: | All 8 models + `isTrial`, `companyLogoUrl` fields added |
| 1.2 | DB file in `data/app.db` | :white_check_mark: | SQLite file at `./data/app.db` |
| 1.3 | `.gitignore` entry for DB | :white_check_mark: | `data/*.db` ignored |
| 1.4 | Auto-create DB on boot (`prisma db push`) | :construction: | Manual `prisma db push` required; no auto-init on `npm run dev` |
| 1.5 | Template seed script | :white_check_mark: | `prisma/seed.ts` with 4 templates (1 trial + 3 paid) |
| 1.6 | `npm run db:init` script | :x: | No convenience script in `package.json` |

---

## Phase 2: Authentication & Dashboard Shell

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | NextAuth credentials provider | :white_check_mark: | JWT strategy, bcryptjs hashing, configured in `src/lib/auth.ts` |
| 2.2 | Login page (`/login`) | :white_check_mark: | Split design, animated, pre-filled demo credentials |
| 2.3 | Register page (`/register`) | :construction: | UI complete but mock-only — redirects to login, does NOT create user in DB |
| 2.4 | Protected dashboard layout | :white_check_mark: | Fixed sidebar with staggered nav animations, layoutId active indicator |
| 2.5 | Dashboard overview (`/app`) | :white_check_mark: | Animated counters, real data fetching, quick actions, recent greetings |
| 2.6 | Session type augmentation | :white_check_mark: | `src/types/next-auth.d.ts` adds `user.id` to session |

---

## Phase 3: Templates & Greeting Creation

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | `GET /api/templates` endpoint | :white_check_mark: | Returns active templates filtered by event |
| 3.2 | Templates listing page (`/app/templates`) | :white_check_mark: | Trial/paid sections, preview modal, trial flow, confirmation modal |
| 3.3 | `POST /api/greetings` — create greeting | :white_check_mark: | Trial: sets isTrial=true, status=published, enforces max 1 per user |
| 3.4 | `GET /api/greetings` — list user greetings | :white_check_mark: | Ordered by `createdAt` desc, includes template + payment |
| 3.5 | `GET /api/greetings/[id]` — single greeting | :white_check_mark: | Auth + ownership check |
| 3.6 | `PATCH /api/greetings/[id]` — update greeting | :white_check_mark: | Validates donation config, saves companyLogoUrl |
| 3.7 | Greetings list page (`/app/greetings`) | :white_check_mark: | Table view with status badges, row stagger animations |
| 3.8 | Greeting editor (`/app/greetings/[id]/edit`) | :white_check_mark: | Logo upload, trial lock icons, UpgradeModal, preview link |

---

## Phase 4: Payment Generation & Webhook

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | `POST /api/greetings/[id]/pay` — create payment | :white_check_mark: | Creates payment record with mock checkout URL |
| 4.2 | `POST /api/payments/webhook` — verify + mark paid | :white_check_mark: | Also supports GET for mock testing |
| 4.3 | Payment page (`/app/greetings/[id]/pay`) | :white_check_mark: | Mock flow with spring animations |
| 4.4 | Real Xendit integration | :x: | Currently mock only — no external API calls |
| 4.5 | Idempotency key handling | :construction: | `externalRef` field exists but generated as random UUID |

---

## Phase 5: Public Greeting Page & Motion System

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Public greeting route (`/g/[slug]`) | :white_check_mark: | Server-side fetch, renders GreetingRenderer |
| 5.2 | GreetingRenderer component | :white_check_mark: | Animated red bg, fireworks, sparkles, glass card, company logo, trial watermark |
| 5.3 | Framer Motion animation presets | :white_check_mark: | 16+ variants in animations.ts |
| 5.4 | Asset layer rendering | :construction: | Uses emoji placeholders (🏮💥🦁🧧🌸) with glow effects + staggered entrance |
| 5.5 | Glassmorphism card | :white_check_mark: | CSS `.glass-card` + enhanced card with gold accent line |
| 5.6 | Share modal | :white_check_mark: | Copy Link, WhatsApp, Facebook, LinkedIn, QR code |
| 5.7 | Donation modal | :construction: | UI exists; platform mode has amount input but no API call; manual mode shows placeholder QR |
| 5.8 | Canvas fireworks | :white_check_mark: | Full particle-based fireworks with rockets, trails, glow effects |
| 5.9 | Reduced motion support | :x: | No `prefers-reduced-motion` detection |
| 5.10 | Staggered asset entrance | :white_check_mark: | Assets stagger in with delay based on index |
| 5.11 | Event-driven animations (confetti on copy, fireworks on open) | :construction: | Fireworks play on page load, no event-driven confetti yet |
| 5.12 | Background glow pulse | :white_check_mark: | Animated gradient + radial glow pulses on greeting page |

---

## Phase 6: Receiver Settings & Donation Gating

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | Payment settings page (`/app/settings/payments`) | :white_check_mark: | Full rewrite: loads configs, saves to API, multi-QRIS with labels |
| 6.2 | Manual receiver config (QRIS upload) | :white_check_mark: | Multi-image upload with labels, thumbnails, remove buttons |
| 6.3 | Platform receiver config | :white_check_mark: | Platform tab with display name, notice text, saves to API |
| 6.4 | `ReceiverConfig` API endpoints | :white_check_mark: | GET + POST (upsert by userId+mode) at `/api/receiver-configs` |
| 6.5 | Donation gating validation in greeting editor | :white_check_mark: | PATCH endpoint checks for active receiver before enabling donations |

---

## Phase 7: Donation Flows

| # | Task | Status | Notes |
|---|------|--------|-------|
| 7.1 | `POST /api/g/[slug]/donate` — create donation | :x: | Endpoint not created |
| 7.2 | `POST /api/donations/webhook` — donation webhook | :x: | Endpoint not created |
| 7.3 | Manual mode: display QR + instructions on public page | :construction: | Placeholder QR shown, no real data from receiver config |
| 7.4 | Platform mode: create Xendit invoice from public page | :x: | Not implemented |
| 7.5 | Payout notice on public page | :white_check_mark: | Yellow notice in donation modal |

---

## Phase 8: Analytics & Submissions

| # | Task | Status | Notes |
|---|------|--------|-------|
| 8.1 | `POST /api/events` — track events | :white_check_mark: | Endpoint exists, records event type + metadata |
| 8.2 | Event tracking calls from pages | :x: | No pages call the events API (no view/share tracking) |
| 8.3 | `POST /api/g/[slug]/submit` — public submissions | :x: | Endpoint not created |
| 8.4 | Public submissions UI on greeting page | :x: | No submissions section in GreetingRenderer |
| 8.5 | Analytics dashboard (`/app/analytics`) | :x: | Page not created |

---

## Phase 9: Landing Page & Polish

| # | Task | Status | Notes |
|---|------|--------|-------|
| 9.1 | Landing page (`/`) | :white_check_mark: | Hero + features grid + footer with animations |
| 9.2 | Navbar with branding | :white_check_mark: | Fixed nav with Login / Get Started CTAs |
| 9.3 | Dark mode support | :white_check_mark: | CSS variables + dark: prefixes throughout |
| 9.4 | Responsive design | :white_check_mark: | Grid breakpoints, mobile-friendly layouts |
| 9.5 | OpenGraph image route (`/g/[slug]/og`) | :x: | Not implemented |

---

## Phase 10: Free Trial System (Plan 2)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 10.1 | `isTrial` field on Template + Greeting models | :white_check_mark: | Schema updated, `prisma db push` applied |
| 10.2 | `companyLogoUrl` field on Greeting model | :white_check_mark: | Schema updated |
| 10.3 | Trial template in seed | :white_check_mark: | "CNY Trial — Lantern Glow" with price=0, isTrial=true |
| 10.4 | Trial flow in POST /api/greetings | :white_check_mark: | Max 1 trial per user, auto-published, skip payment |
| 10.5 | Templates page: trial vs paid sections | :white_check_mark: | Free trial section with green badge, "Try Now" button |
| 10.6 | Template preview modal | :white_check_mark: | Placeholder text layout preview before purchase |
| 10.7 | UpgradeModal component | :white_check_mark: | Glassmorphism modal, feature list, CTA to templates page |
| 10.8 | Editor trial restrictions | :white_check_mark: | Logo, layout variant, donation mode/toggle locked with Lock icons |
| 10.9 | Public page trial restrictions | :white_check_mark: | Trial banner, "Powered by" watermark, no donation button |
| 10.10 | Fireworks canvas component | :white_check_mark: | Full particle system with rockets, trails, glow effects |

---

## Summary

### Overall Progress

| Category | Done | Partial | Not Started | Total |
|----------|------|---------|-------------|-------|
| Phase 1: Boot & DB | 4 | 1 | 1 | 6 |
| Phase 2: Auth & Dashboard | 5 | 1 | 0 | 6 |
| Phase 3: Templates & Greetings | 8 | 0 | 0 | 8 |
| Phase 4: Payment | 3 | 1 | 1 | 5 |
| Phase 5: Public Page & Motion | 9 | 2 | 1 | 12 |
| Phase 6: Receiver & Donation Gating | 5 | 0 | 0 | 5 |
| Phase 7: Donation Flows | 1 | 1 | 3 | 5 |
| Phase 8: Analytics & Submissions | 1 | 0 | 4 | 5 |
| Phase 9: Landing & Polish | 4 | 0 | 1 | 5 |
| Phase 10: Free Trial System | 10 | 0 | 0 | 10 |
| **TOTAL** | **50** | **6** | **11** | **67** |

**Completion: ~75% done, ~9% partial, ~16% not started**

---

## New Components Created (Round 3-4)

| Component | File | Purpose |
|-----------|------|---------|
| Select | `src/components/Select.tsx` | Custom animated select dropdown |
| Fireworks | `src/components/Fireworks.tsx` | Canvas-based particle fireworks |
| UpgradeModal | `src/components/UpgradeModal.tsx` | Trial feature lock upgrade prompt |
| ShareModal | `src/components/ShareModal.tsx` | Social sharing + QR code |

## New API Routes Created (Round 3-4)

| Route | File | Purpose |
|-------|------|---------|
| `/api/upload` | `src/app/api/upload/route.ts` | File upload (POST) + delete (DELETE) |
| `/api/receiver-configs` | `src/app/api/receiver-configs/route.ts` | GET + POST (upsert) receiver configs |

---

## Priority Queue (Remaining)

### High Priority
1. **Register API** — Registration is mock; users can't create accounts
2. **Donation endpoints** — `POST /api/g/[slug]/donate` and webhook
3. **Real Xendit integration** — Replace mock payment flow

### Medium Priority
4. **Event tracking integration** — Call `/api/events` from greeting page on view/share/donate
5. **Public submission endpoint** — `POST /api/g/[slug]/submit`
6. **Real asset images** — Replace emoji placeholders with SVG/PNG assets
7. **Manual QR on public page** — Load real QRIS from receiver config

### Low Priority (Polish)
8. **Reduced motion support** — Detect `prefers-reduced-motion`
9. **OG image generation** — `/g/[slug]/og/route.tsx`
10. **Analytics dashboard page** — `/app/analytics`
11. **DB init convenience script** — `npm run db:init`

---

## Tech Stack Reference

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.x |
| Database | SQLite via Prisma | 5.22.0 |
| Auth | NextAuth.js (JWT) | 4.24.13 |
| Animation | Framer Motion | 12.33.0 |
| Styling | Tailwind CSS | 4.x |
| Icons | Lucide React | 0.563.0 |
| Password | bcryptjs | 3.0.3 |
| Utilities | clsx, tailwind-merge | 2.1.1, 3.4.0 |

---

## File Structure

```
src/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/app/overview, templates, greetings, settings
│   ├── (public)/g/[slug]
│   ├── api/auth, templates, greetings, payments, events, upload, receiver-configs
│   ├── layout.tsx, page.tsx, globals.css
├── components/
│   ├── GreetingRenderer.tsx   — Public greeting page renderer
│   ├── ShareModal.tsx         — Social share + QR modal
│   ├── Select.tsx             — Custom animated select dropdown
│   ├── Fireworks.tsx          — Canvas particle fireworks
│   ├── UpgradeModal.tsx       — Trial upgrade prompt modal
│   └── providers/AuthProvider.tsx
├── lib/animations.ts, auth.ts, db.ts
├── types/next-auth.d.ts
prisma/schema.prisma, seed.ts
```
