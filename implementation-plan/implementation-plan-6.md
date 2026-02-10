# Implementation Plan 6 — Session Updates & Cumulative Status

> **Created:** 2026-02-10
> **Covers:** Recent session work (demo branding, user settings, register cleanup) + full project status

---

## 1. Changes Made This Session

### 1.1 Demo Page — Seasonal Logo Branding

**Files changed:**
- `src/components/providers/ThemeProvider.tsx` — Added `logoSquare` path to context
- `src/app/(public)/demo/DemoClient.tsx` — Added logo + back button

**Details:**
- Seasonal logo (icon + text) displayed top-center on all screen sizes
- Uses `brightness-0 invert` to render themed icon as white on the dark demo background
- Pill-style badge (`bg-black/20 backdrop-blur-sm`) matching the toolbar aesthetic
- Back button (top-left) linking to landing page, icon-only on mobile, "Back" text on `sm+`

### 1.2 User Settings Page

**Files created:**
- `src/app/api/user/profile/route.ts` — GET/PATCH for user profile (companyName)
- `src/app/(dashboard)/app/settings/page.tsx` — General settings page

**Files changed:**
- `src/app/(auth)/register/page.tsx` — Removed companyName field (email + password only)
- `src/app/(dashboard)/DashboardShell.tsx` — Nav link changed from `/app/settings/payments` to `/app/settings`

**Details:**
- Registration simplified: companyName is nullable, no longer required at signup
- New `/api/user/profile` API: GET returns user profile, PATCH updates companyName
- New `/app/settings` page with company name input, save button, and link card to Payment Settings
- Sidebar "Settings" nav now points to the general settings page

### 1.3 ThemeProvider — logoSquare Addition

**File:** `src/components/providers/ThemeProvider.tsx`

Added `logoSquare` (`/logo/{color}-square.png`) to the theme context alongside `logoIcon`, `logoText`, and `logoTextDark`. Available to all components via `useTheme()`.

---

## 2. Cumulative Project Status

### All Plans Summary

| Plan | Scope | Tasks | Status |
|------|-------|-------|--------|
| Plan 1 | CNY MVP (DB, auth, templates, payments, trial) | 67 | ~60 done, ~4 partial, ~3 not started |
| Plan 2 | Free Trial concept document | N/A | Implemented as Plan 1 Phase 10 |
| Plan 3 | Mobile responsive, static templates, OG images | 20 | 20/20 done |
| Plan 4 | Cumulative status + session fixes | 7 | 7/7 done |
| Plan 5 | Valentine theme, categories, search, upgrade | 7 | 7/7 done |
| Plan 6 | Demo branding, user settings, register cleanup | 3 | 3/3 done |

### Features Complete

| Feature | Status |
|---------|--------|
| Database (Prisma + SQLite, 9 models) | Done |
| Authentication (NextAuth JWT + register) | Done |
| Template system (5 templates, componentSlug routing) | Done |
| Template categories + fuzzy search | Done |
| Greeting CRUD (create, read, update, list) | Done |
| Greeting editor (layout variants, logo upload) | Done |
| Mock payment flow | Done |
| Trial upgrade path (API + UpgradeModal) | Done |
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
| Dashboard responsive (hamburger sidebar, cards) | Done |
| Dark mode support (system + manual toggle) | Done |
| Seasonal theme system (6 themes, auto-detection) | Done |
| Landing page (seasonal theming) | Done |
| Demo page (animations, music, branding) | Done |
| User settings page (company profile) | Done |

### Features Remaining

| Feature | Priority | Notes |
|---------|----------|-------|
| **Real Xendit payment integration** | High | All payments are mocked — no external API calls |
| **Donation payment processing** | High | Manual QR works, no actual payment verification |
| **Email system (verification, notifications)** | Medium | No email integration at all |
| **Trial expiry system** | Medium | `trialExpiresAt` field exists, no enforcement logic |
| **Password reset flow** | Medium | No forgot password functionality |
| **Event tracking (share/donate)** | Low | Only view events tracked |
| **Trial sharing lock** | Low | ShareModal doesn't check isTrial |
| **Reduced motion support** | Low | `prefers-reduced-motion` only partially detected |
| **Auto DB init on boot** | Low | Manual `prisma db push` required |
| **Upgrade nudge emails** | Low | No email integration |

---

## 3. What To Do Next

### Recommended Priority Order

**Phase A: Payment Integration (HIGH — enables revenue)**
1. Set up Xendit API keys + environment variables
2. Wire `/api/greetings/[id]/pay` to create real Xendit invoice
3. Wire `/api/payments/webhook` to handle Xendit callback (verify signature, update Payment status)
4. Wire `/api/greetings/[id]/upgrade` to create real Xendit invoice for trial upgrades
5. Update greeting status to `published` on successful payment
6. Handle DonationPayment creation via Xendit for platform donation mode
7. Test end-to-end payment flow (create → pay → webhook → published)

**Phase B: Email & Account (MEDIUM — user trust)**
1. Add email verification on registration (send verification link)
2. Add password reset flow (forgot password → email link → reset form)
3. Confirmation emails on successful payment

**Phase C: Polish & Production Readiness (MEDIUM)**
1. Trial expiry enforcement (check `trialExpiresAt`, block expired trials)
2. Trial sharing lock (disable WhatsApp/QR in ShareModal for trials)
3. Track share + donate events in `/api/events`
4. Add `reduced-motion` support globally
5. Add `npm run db:init` convenience script
6. Error boundaries for graceful failures
7. Rate limiting on public APIs (wishes, events)

**Phase D: Growth Features (LOW — nice to have)**
1. More templates (Eid, Halloween, Diwali, Indonesia Independence)
2. Custom template builder (drag & drop)
3. Upgrade nudge emails for trial users
4. Admin dashboard (user management, payment overview)
5. Multi-language support (ID/EN)

---

## 4. Updated File Structure

```
src/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/
│   │   ├── DashboardShell.tsx
│   │   └── app/
│   │       ├── page.tsx                — Dashboard overview
│   │       ├── templates/page.tsx      — Template catalog (search, filter, preview)
│   │       ├── greetings/page.tsx      — My Greetings
│   │       ├── greetings/[id]/edit/    — Greeting editor
│   │       ├── greetings/[id]/pay/     — Payment page
│   │       ├── analytics/
│   │       │   ├── page.tsx            — Analytics dashboard
│   │       │   ├── PerGreetingStats.tsx
│   │       │   └── RecentActivity.tsx
│   │       └── settings/
│   │           ├── page.tsx            — General settings (company profile)  ← NEW
│   │           └── payments/page.tsx   — Payment/receiver config
│   ├── (public)/
│   │   ├── demo/
│   │   │   ├── page.tsx               — Demo server component
│   │   │   └── DemoClient.tsx         — Demo visuals + logo + back button
│   │   └── g/[slug]/
│   │       ├── page.tsx               — Public greeting
│   │       └── opengraph-image.tsx    — Dynamic OG images
│   ├── api/
│   │   ├── auth/[...nextauth], register
│   │   ├── user/profile/route.ts      — User profile CRUD  ← NEW
│   │   ├── templates/
│   │   ├── greetings/, [id]/, [id]/pay/, [id]/upgrade/, [id]/wishes/
│   │   ├── payments/webhook
│   │   ├── public/wishes
│   │   ├── receiver-configs
│   │   ├── events
│   │   └── upload
│   ├── layout.tsx, page.tsx, globals.css
├── components/
│   ├── templates/
│   │   ├── GoldNShiny.tsx, CrimsonBloom.tsx, JadeProsperity.tsx, ValentineRose.tsx
│   │   └── TemplateRenderer.tsx
│   ├── GreetingRenderer.tsx, GreetingPageWrapper.tsx, GreetingToolbar.tsx
│   ├── FloatingWishes.tsx, SendWishModal.tsx, WishesModal.tsx
│   ├── ShareModal.tsx, UpgradeModal.tsx, Fireworks.tsx
│   ├── TemplateCard.tsx, EventTracker.tsx, Shimmer.tsx
│   ├── PageLoader.tsx, StatusBadge.tsx, ToggleSwitch.tsx, Button.tsx, Select.tsx, TextField.tsx
│   ├── SettingsDropdown.tsx
│   └── providers/AuthProvider.tsx, ThemeProvider.tsx
├── lib/animations.ts, auth.ts, db.ts, categories.ts, fetcher.ts
├── types/template.ts, next-auth.d.ts
prisma/schema.prisma, seed.ts
```

---

## 5. Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.x |
| Database | SQLite via Prisma | 5.22.0 |
| Auth | NextAuth.js (JWT) | 4.24.13 |
| Animation | Framer Motion | 12.33.0 |
| Styling | Tailwind CSS | 4.x |
| Icons | Lucide React | 0.563.0 |
| Search | Fuse.js | ~7KB |
| Password | bcryptjs | 3.0.3 |
| Data Fetching | SWR | latest |
| Utilities | clsx, tailwind-merge, nanoid | various |
