# Implementation Plan 4 — Cumulative Status & Recent Fixes

> **Created:** 2026-02-10
> **Status:** Current
> **Covers:** Summary of Plans 1–3 completion + all post-Plan 3 work

---

## 1. Plans 1–3 Summary

### Plan 1 — CNY Greeting Card Generator MVP (67 tasks)

The foundational MVP covering database, auth, templates, payments, public greeting pages, receiver settings, donation flows, analytics stubs, landing page, and the free trial system.

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1: Boot & DB | Prisma/SQLite schema, seed script | **Done** (db:init script missing) |
| Phase 2: Auth & Dashboard | NextAuth JWT, login, register, dashboard shell | **Done** (register API added post-plan) |
| Phase 3: Templates & Greetings | CRUD APIs, templates page, editor | **Done** |
| Phase 4: Payment | Mock Xendit flow, payment page, webhook | **Done** (real Xendit not integrated) |
| Phase 5: Public Page & Motion | GreetingRenderer, fireworks, share modal, animations | **Done** (reduced motion partial) |
| Phase 6: Receiver & Donation Gating | Payment settings, QRIS upload, receiver API | **Done** |
| Phase 7: Donation Flows | Public donation modal, manual QR display | **Partial** (no real payment processing) |
| Phase 8: Analytics & Submissions | Event tracking API, public submissions | **Done** (built in post-plan work) |
| Phase 9: Landing & Polish | Landing page, dark mode, responsive, OG images | **Done** |
| Phase 10: Free Trial System | isTrial flags, UpgradeModal, trial restrictions | **Done** |

**Final count: ~60/67 done, ~4 partial, ~3 not started (Xendit, db:init, reduced motion)**

---

### Plan 2 — Free Trial Template System (concept doc)

Design document for the trial system. All core implementation tasks were completed as Phase 10 of Plan 1:

| Feature | Status |
|---------|--------|
| Logo/branding lock | **Done** — editor disables upload, shows UpgradeModal |
| Promotion/sharing lock | **Partial** — ShareModal doesn't check isTrial |
| Payment/donation lock | **Done** — toggle disabled, no donation button on trial |
| Content limitations | **Done** — layout variant locked to default |
| UpgradeModal component | **Done** — glassmorphism design with feature list |
| Trial generation flow | **Done** — max 1 trial per user, skip payment, auto-published |
| Trial expiry system | **Not done** — trialExpiresAt field exists but no expiry logic |

---

### Plan 3 — Mobile Responsive, Static Templates, Dynamic OG (20 tasks)

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1: Mobile layouts (6 tasks) | Hamburger sidebar, card layouts, responsive grids | **Done** |
| Phase 2: Static templates (11 tasks) | componentSlug, TemplateProps, 3 templates, seed, registry | **Done** |
| Phase 3: Dynamic OpenGraph (3 tasks) | generateMetadata, OG image route, verification | **Done** |

**All 20 tasks completed.**

---

## 2. Post-Plan 3 Work (completed before this plan)

Major features built after Plan 3 that were not tracked in any previous plan:

### 2.1 Send Wish System

| Item | File | Description |
|------|------|-------------|
| SendWishModal | `src/components/SendWishModal.tsx` | Multi-phase modal: wish form → submitting → success/payment-info. Supports QRIS and e-wallet payment methods for donations. |
| FloatingWishes | `src/components/FloatingWishes.tsx` | Animated wish bubbles floating horizontally across screen. Seeded deterministic animations, respects reduced-motion. |
| Public wishes API | `src/app/api/public/wishes/route.ts` | POST endpoint for public (no-auth) wish submission. Creates PublicSubmission + optional DonationPayment records. |
| Wishes API | `src/app/api/greetings/[id]/wishes/route.ts` | Auth-protected GET endpoint returning wishes for a greeting, enriched with donation amounts. |

### 2.2 GreetingToolbar

| Item | File | Description |
|------|------|-------------|
| GreetingToolbar | `src/components/GreetingToolbar.tsx` | Consolidated floating toolbar for public greeting pages. Handles Share, Send Wish, Play/Pause buttons. Accepts `extraButtons` prop for music controls. |

### 2.3 GreetingPageWrapper (reusable wrapper)

| Item | File | Description |
|------|------|-------------|
| GreetingPageWrapper | `src/components/GreetingPageWrapper.tsx` | Context provider wrapping all template/demo pages. Provides `isPlaying` state via `useGreetingPage()` hook. Manages background music (auto-play on mount), renders GreetingToolbar. |

Templates refactored to consume `isPlaying` from context instead of internal state. Toolbar rendering moved from individual templates into the wrapper.

**Affected files:**
- `src/components/templates/GoldNShiny.tsx` — uses `useGreetingPage()`
- `src/components/templates/CrimsonBloom.tsx` — uses `useGreetingPage()`
- `src/components/templates/JadeProsperity.tsx` — uses `useGreetingPage()`
- `src/components/GreetingRenderer.tsx` — uses `useGreetingPage()`
- `src/app/(public)/g/[slug]/page.tsx` — wraps templates with `<GreetingPageWrapper>`
- `src/types/template.ts` — simplified (removed wishes, paymentMethods, donationMode from TemplateProps)

### 2.4 Analytics Dashboard

| Item | File | Description |
|------|------|-------------|
| Analytics page | `src/app/(dashboard)/app/analytics/page.tsx` | Server component. Aggregate stats (views, shares, wishes, donations), greeting counts by status, per-greeting breakdown, recent events. |
| PerGreetingStats | `src/app/(dashboard)/app/analytics/PerGreetingStats.tsx` | Client component. Desktop table + mobile cards for per-greeting metrics. Clickable wishes count opens WishesModal. |

### 2.5 WishesModal

| Item | File | Description |
|------|------|-------------|
| WishesModal | `src/components/WishesModal.tsx` | Fetches wishes from `/api/greetings/[id]/wishes`. Shows avatar, name, comment, donation badge, date. Loading + empty states. Used in both Analytics and My Greetings pages. |

### 2.6 Event Tracking

| Item | File | Description |
|------|------|-------------|
| EventTracker | `src/components/EventTracker.tsx` | `trackEvent()` helper + `ViewTracker` component. Fires POST to `/api/events` on page view. |

View tracking integrated into `g/[slug]/page.tsx`.

### 2.7 Register API

| Item | File | Description |
|------|------|-------------|
| Register endpoint | `src/app/api/auth/register/route.ts` | POST endpoint. Takes email, password, companyName. Hashes with bcryptjs, creates User, validates email uniqueness. |

### 2.8 Reusable UI Components

| Component | File | Purpose |
|-----------|------|---------|
| PageLoader | `src/components/PageLoader.tsx` | Animated spinner for loading states |
| StatusBadge | `src/components/StatusBadge.tsx` | Color-coded status badges (published/pending/draft) |
| ToggleSwitch | `src/components/ToggleSwitch.tsx` | Custom toggle with theme colors, disabled state |
| Button | `src/components/Button.tsx` | Shared button with variant/size props |
| Select | `src/components/Select.tsx` | Custom animated select dropdown |

### 2.9 Demo Page

| Item | File | Description |
|------|------|-------------|
| DemoClient | `src/app/(public)/demo/DemoClient.tsx` | Full CNY demo page with animated decorative images, scrolling vertical Chinese text background (8 columns, `writing-mode: vertical-rl`), 12 hardcoded Chinese wishes, floating particles. Uses GreetingPageWrapper for music + toolbar. |
| Demo server page | `src/app/(public)/demo/page.tsx` | Server component rendering DemoClient with greeting ID. |

### 2.10 Dark Mode & Theming

- Tailwind 4 dark mode via `@custom-variant dark` in `globals.css`
- Public pages force light mode via ThemeProvider (`isPublicPage` check)
- Glass-card styling via `.glass`, `.glass-card` CSS classes
- Theme colors configurable via CSS custom properties

---

## 3. Current Session Fixes (Plan 4 new work)

### 3.1 Live Template Preview

**File:** `src/app/(dashboard)/app/templates/page.tsx`

Replaced the fake preview modal (emoji decorations + static card) with a fullscreen live preview that renders the actual template component via `TemplateRenderer` or `GreetingRenderer`. Placeholder greeting data shows `[Your Greeting Title]`, `[Your greeting message...]`, `[Company Name]`. Floating close button (top-right) and bottom bar with template name, price, and action button.

**Added imports:** `TemplateRenderer`, `GreetingRenderer`
**Added constant:** `PREVIEW_GREETING` with placeholder values

### 3.2 Dashboard Mobile Overflow Fix

**File:** `src/app/(dashboard)/DashboardShell.tsx`

- Added `overflow-x-hidden` to root flex container
- Added `min-w-0` to `<main>` element (prevents flex item from exceeding container width)

### 3.3 Recent Activity Pagination

**File:** `src/app/(dashboard)/app/page.tsx`

Dashboard overview "Recent Greetings" section now shows all greetings with Prev/Next pagination (5 per page) instead of a fixed first-5 slice.

### 3.4 Auto-Enable Public Submissions

**File:** `src/app/api/greetings/route.ts`

New greetings are created with `submissionsEnabled: true` by default. Previously defaulted to `false` (schema default). Users can still disable in the editor.

### 3.5 Trial Page Owner Access

**File:** `src/app/(public)/g/[slug]/page.tsx`

Trial greetings are now viewable by their owner. Added `getServerSession(authOptions)` check — if `session.user.id === greeting.userId`, the greeting renders normally. Non-owners and unauthenticated users see the blocked page.

### 3.6 Trial Blocked Page Redesign

**File:** `src/app/(public)/g/[slug]/page.tsx`

Redesigned the "This greeting is not available" page:
- Replaced emoji lock with SVG icon in a styled circle
- Clean dark card (`bg-gray-900/80 border border-gray-800`) instead of glass-card on red gradient
- Updated copy: "can only be viewed by its creator"
- CTA button now links to `/` (landing page) instead of `/app/templates`
- Button is a proper full-width `<Link>` with white bg + hover state

### 3.7 Premium Modal Z-Index Fix

**File:** `src/app/(dashboard)/app/templates/page.tsx`

Bumped the payment/trial confirmation modal from `z-50` to `z-[100]` to prevent conflicts with dashboard layout elements and the live template preview overlay.

---

## 4. Updated Overall Status

### Features Complete

| Feature | Status |
|---------|--------|
| Database (Prisma + SQLite) | Done |
| Authentication (NextAuth JWT + register) | Done |
| Template system (4 templates, componentSlug routing) | Done |
| Greeting CRUD (create, read, update, list) | Done |
| Mock payment flow | Done |
| Public greeting pages (all templates) | Done |
| GreetingPageWrapper (music, toolbar, context) | Done |
| Send Wish system (form + floating wishes) | Done |
| Share modal (WhatsApp, Facebook, LinkedIn, QR) | Done |
| Donation modal (QRIS, e-wallet, manual mode) | Done |
| Receiver config / payment settings | Done |
| Free trial system (restrictions, UpgradeModal) | Done |
| Trial owner access on public page | Done |
| Live template preview (fullscreen) | Done |
| Analytics dashboard (stats + per-greeting breakdown) | Done |
| WishesModal (clickable wishes counts) | Done |
| Event tracking (views) | Done |
| OG image generation (template-specific) | Done |
| Dashboard responsive (hamburger sidebar, card layouts) | Done |
| Dashboard mobile overflow fix | Done |
| Recent activity pagination | Done |
| Auto-enable public submissions | Done |
| Dark mode support | Done |
| Landing page | Done |
| Demo page (animations, music, Chinese wishes) | Done |

### Features Remaining

| Feature | Priority | Notes |
|---------|----------|-------|
| Real Xendit payment integration | High | All payments are mocked — no external API calls |
| Donation payment processing | High | Manual QR works, but no actual payment verification |
| Trial expiry system | Medium | `trialExpiresAt` field exists, no enforcement logic |
| Trial sharing lock | Low | ShareModal doesn't check isTrial for WhatsApp/QR restrictions |
| Reduced motion support | Low | `prefers-reduced-motion` partially detected in GreetingRenderer only |
| Auto DB init on boot | Low | Manual `prisma db push` required |
| Event tracking (share/donate events) | Low | Only view events tracked, share/donate not yet |
| Upgrade nudge emails | Low | No email integration |

---

## 5. Current File Structure

```
src/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/
│   │   ├── DashboardShell.tsx          — Responsive sidebar + main layout
│   │   └── app/
│   │       ├── page.tsx                — Dashboard overview (paginated activity)
│   │       ├── templates/page.tsx      — Template catalog (live preview)
│   │       ├── greetings/page.tsx      — My Greetings (table + mobile cards)
│   │       ├── greetings/[id]/edit/    — Greeting editor
│   │       ├── greetings/[id]/pay/     — Payment page
│   │       ├── analytics/
│   │       │   ├── page.tsx            — Analytics dashboard (server)
│   │       │   └── PerGreetingStats.tsx — Per-greeting stats (client)
│   │       └── settings/payments/      — Receiver config / QRIS
│   ├── (public)/
│   │   ├── demo/                       — Demo page with CNY visuals
│   │   └── g/[slug]/
│   │       ├── page.tsx                — Public greeting (trial owner check)
│   │       └── opengraph-image.tsx     — Dynamic OG images
│   ├── api/
│   │   ├── auth/[...nextauth], register
│   │   ├── templates/
│   │   ├── greetings/, greetings/[id]/, greetings/[id]/pay/, greetings/[id]/wishes/
│   │   ├── payments/webhook
│   │   ├── public/wishes
│   │   ├── receiver-configs
│   │   ├── events
│   │   └── upload
│   ├── layout.tsx, page.tsx, globals.css
├── components/
│   ├── templates/
│   │   ├── GoldNShiny.tsx, CrimsonBloom.tsx, JadeProsperity.tsx
│   │   ├── TemplateRenderer.tsx        — componentSlug → component dispatch
│   │   └── index.ts                    — Barrel export
│   ├── GreetingRenderer.tsx            — configJson-based template renderer
│   ├── GreetingPageWrapper.tsx         — Context + music + toolbar wrapper
│   ├── GreetingToolbar.tsx             — Floating toolbar (share/wish/play)
│   ├── FloatingWishes.tsx              — Animated floating wish bubbles
│   ├── SendWishModal.tsx               — Wish form + donation payment selector
│   ├── WishesModal.tsx                 — View all wishes for a greeting
│   ├── ShareModal.tsx                  — Social sharing + QR code
│   ├── Fireworks.tsx                   — Canvas particle fireworks
│   ├── UpgradeModal.tsx                — Trial upgrade prompt
│   ├── TemplateCard.tsx                — Template card with preview/use buttons
│   ├── EventTracker.tsx                — View tracking + trackEvent helper
│   ├── PageLoader.tsx, StatusBadge.tsx, ToggleSwitch.tsx, Button.tsx, Select.tsx
│   └── providers/AuthProvider.tsx, ThemeProvider.tsx
├── lib/animations.ts, auth.ts, db.ts
├── types/template.ts, next-auth.d.ts
prisma/schema.prisma, seed.ts
```

---

## 6. Tech Stack

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
| Utilities | clsx, tailwind-merge, nanoid | various |
