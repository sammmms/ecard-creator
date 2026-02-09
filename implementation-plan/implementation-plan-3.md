# Implementation Plan 3 — Mobile Responsive, Static Templates, Dynamic OG

## Context

The app needs three major improvements: (1) every layout must be mobile-friendly — the dashboard sidebar is completely broken on mobile with a hardcoded `w-64`/`ml-64` and no hamburger menu, tables overflow, and form grids don't stack; (2) 3 new template components that are static React files receiving dynamic data from the backend — each template is a self-contained `.tsx` file selected by a slug stored in the DB; (3) dynamic OpenGraph metadata per greeting for social sharing previews. Additionally, we audit all tasks from implementation-plan-1.md and implementation-plan-2.md.

---

## Phase 1: Mobile-Friendly Responsive Layouts (6 tasks)

### Task 1.1 — Dashboard sidebar: hamburger menu + collapsible overlay

**File:** `src/app/(dashboard)/layout.tsx`

**Problem:** Sidebar is fixed `w-64` with `ml-64` on `<main>`. Completely broken on mobile — content pushed off-screen, no way to toggle sidebar.

**Changes:**
1. Add `sidebarOpen` state (default `false`)
2. Add mobile top bar (`md:hidden`) with hamburger button (`Menu` icon) + condensed logo
3. Desktop (`md:` and up): keep current sidebar visible, `md:ml-64` on main
4. Mobile (below `md`):
   - `<main>` gets `ml-0 md:ml-64`
   - Sidebar hidden by default: `hidden md:flex`
   - When `sidebarOpen`: fixed overlay with `bg-black/50` backdrop, sidebar slides in from left via `AnimatePresence`/`motion.aside`
   - Tap backdrop or nav link → close sidebar
5. Main content padding: `p-4 md:p-8`

**Acceptance:** Hamburger visible below 768px, sidebar slides in/out, nav links close sidebar, nothing breaks at 375px, desktop unchanged.

---

### Task 1.2 — Greetings page: card layout on mobile

**File:** `src/app/(dashboard)/app/greetings/page.tsx`

**Problem:** `<table>` at line 67 overflows horizontally on mobile.

**Changes:**
1. Wrap existing table in `<div className="hidden md:block">`
2. Add `<div className="md:hidden space-y-3">` with card-based layout:
   - Each card: `glass-card rounded-xl p-4` showing title, template, StatusBadge, date, action buttons
3. Both views share the same data and action links

**Acceptance:** Cards below 768px, table at 768px+, no horizontal overflow at 375px.

---

### Task 1.3 — Edit greeting: responsive 2-col grid

**File:** `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx`

**Problem:** `grid grid-cols-2 gap-4` at line 307 without mobile breakpoint.

**Change:** `grid grid-cols-2 gap-4` → `grid grid-cols-1 sm:grid-cols-2 gap-4`

---

### Task 1.4 — Templates page: responsive header

**File:** `src/app/(dashboard)/app/templates/page.tsx`

**Problem:** Header `flex justify-between items-center` can collide on narrow screens.

**Change:** → `flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2`

---

### Task 1.5 — Payment settings: responsive e-wallet grid

**File:** `src/app/(dashboard)/app/settings/payments/page.tsx`

**Problem:** `grid grid-cols-2 gap-4` for e-wallet fields without mobile breakpoint.

**Change:** → `grid grid-cols-1 sm:grid-cols-2 gap-4`

---

### Task 1.6 — Verify dashboard overview after sidebar fix

**File:** `src/app/(dashboard)/app/page.tsx` (read-only verification)

Already uses `grid-cols-1 md:grid-cols-3` — verify it renders correctly at 375px after Task 1.1 changes.

---

## Phase 2: Static Template Component System (11 tasks)

### Task 2.1 — Schema: add `componentSlug` to Template

**File:** `prisma/schema.prisma`

Add `componentSlug String?` to the Template model. Run `npx prisma db push`.

When set (e.g. `"gold-n-shiny"`), frontend renders that template component. When `null`, falls back to existing `GreetingRenderer`.

---

### Task 2.2 — Shared TemplateProps interface

**File to create:** `src/types/template.ts`

```typescript
export interface TemplateProps {
  greeting: {
    id: string;
    title: string;
    senderNameDefault: string;
    messageDefault: string;
    companyLogoUrl?: string;
    isTrial?: boolean;
    submissionsEnabled?: boolean;
    donationEnabled: boolean;
    donationMode: string;
    slug: string;
  };
  wishes: Array<{
    id: string;
    name: string | null;
    comment: string | null;
    createdAt: string;
    donationAmount: number | null;
  }>;
  paymentMethods: {
    qrisImages: Array<{ label: string; url: string }>;
    ewalletType: string | null;
    ewalletNumber: string | null;
    instructionsText: string | null;
    displayName: string | null;
  } | null;
  donationMode: string;
  isPreview?: boolean;
}
```

---

### Task 2.3 — Template registry with dynamic imports

**File to create:** `src/components/templates/index.ts`

Maps `componentSlug` → lazy-loaded component using `next/dynamic`:
- `"gold-n-shiny"` → `./GoldNShiny`
- `"crimson-bloom"` → `./CrimsonBloom`
- `"jade-prosperity"` → `./JadeProsperity`

Exports `getTemplateComponent(slug): ComponentType<TemplateProps> | null`.

**Depends on:** 2.2, 2.5–2.7

---

### Task 2.4 — Route public greeting page through template registry

**File:** `src/app/(public)/g/[slug]/page.tsx`

After fetching greeting + building wishes/paymentMethods (existing logic), add:

```typescript
const StaticTemplate = getTemplateComponent(greeting.template.componentSlug);
if (StaticTemplate) {
  return <StaticTemplate greeting={...} wishes={wishes} paymentMethods={...} donationMode={...} />;
}
// Fallback to existing GreetingRenderer
return <GreetingRenderer ... />;
```

**Depends on:** 2.1, 2.3

---

### Task 2.5 — Template: GoldNShiny.tsx

**File to create:** `src/components/templates/GoldNShiny.tsx`

**Theme:** Luxurious black/dark + gold accents
- **Background:** Dark gradient (`#0a0a0a` → `#1a1a2e`), animated gold sparkle particles
- **Card:** Dark glassmorphism (`bg-black/60 backdrop-blur-xl border-yellow-600/20`), gold accent line at top
- **Typography:** Gold gradient title (`from-yellow-300 via-amber-400 to-yellow-600`), light gray message, gold sender name
- **Effects:** Gold particle shower (animated Framer Motion divs), shimmer on card border
- **Decorative:** Gold frame ornament corners via CSS

**Reuses:** `FloatingWishes`, `SendWishModal`, `ShareModal`, `Fireworks` (optional)

**Internal state:** Same pattern as GreetingRenderer — `showDonation`, `showShare`, `wishes` array

**Depends on:** 2.2

---

### Task 2.6 — Template: CrimsonBloom.tsx

**File to create:** `src/components/templates/CrimsonBloom.tsx`

**Theme:** Traditional red with cherry blossom petals
- **Background:** Deep red gradient (`#8B0000` → `#DC143C`), subtle paper-cut texture overlay
- **Card:** White/cream frosted (`bg-white/90 backdrop-blur-xl`), red accent borders, scalloped edges via CSS
- **Typography:** Warm gradient title (`from-red-700 via-rose-600 to-red-800`), warm gray message, deep red sender
- **Effects:** Falling cherry blossom petals (15–20 Framer Motion divs, pink/white tones `#FFB7C5`, `#FFC0CB`), soft red glow behind card
- **Decorative:** Paper-cut corner ornaments, red/gold dividers

**Reuses:** `FloatingWishes`, `SendWishModal`, `ShareModal`

**Depends on:** 2.2

---

### Task 2.7 — Template: JadeProsperity.tsx

**File to create:** `src/components/templates/JadeProsperity.tsx`

**Theme:** Green/jade/emerald with modern minimalist feel
- **Background:** Emerald gradient (`#064e3b` → `#059669`), jade texture overlay at low opacity
- **Card:** Semi-transparent jade-tinted (`bg-emerald-950/50 backdrop-blur-xl border-emerald-400/20`), clean thin emerald lines
- **Typography:** Jade/gold gradient title (`from-emerald-300 via-teal-200 to-amber-300`), light emerald message, gold-on-jade sender
- **Effects:** Floating jade coin/ingot shapes (10–15 emerald/gold elements floating upward)
- **Decorative:** Minimal — thin line borders, small jade circles in corners, wide letter-spacing, generous whitespace

**Reuses:** `FloatingWishes`, `SendWishModal`, `ShareModal`

**Depends on:** 2.2

---

### Task 2.8 — Update seed script with new templates

**File:** `prisma/seed.ts`

Add 3 new template entries with `componentSlug` values:
- `"template-cny-gold"` → name "Gold & Shiny", price 75000, componentSlug `"gold-n-shiny"`
- `"template-cny-crimson"` → name "Crimson Bloom", price 65000, componentSlug `"crimson-bloom"`
- `"template-cny-jade"` → name "Jade Prosperity", price 70000, componentSlug `"jade-prosperity"`

`configJson` set to `"{}"` (not used when componentSlug is set).

**Depends on:** 2.1

---

### Task 2.9 — Refactor GreetingRenderer to use TemplateProps

**File:** `src/components/GreetingRenderer.tsx`

Import `TemplateProps` from `@/types/template`. Extend it with `template.configJson`. Remove inline `GreetingData`, `WishData`, `PaymentMethodsData` interfaces.

**Depends on:** 2.2

---

### Task 2.10 — Template preview colors on templates page

**File:** `src/app/(dashboard)/app/templates/page.tsx`

Preview modal uses a color map based on `componentSlug`:
- `"gold-n-shiny"` → dark/gold gradient
- `"crimson-bloom"` → red/rose gradient
- `"jade-prosperity"` → emerald gradient
- Default → existing red

**Depends on:** 2.1, 2.8

---

### Task 2.11 — Verify editor preview link (read-only)

The "Preview public page" link in the editor already opens `/g/[slug]`. Task 2.4 handles routing. No changes needed — just verify it works.

**Depends on:** 2.4

---

## Phase 3: Dynamic OpenGraph (3 tasks)

### Task 3.1 — Add `generateMetadata` to public greeting page

**File:** `src/app/(public)/g/[slug]/page.tsx`

Export `generateMetadata` function:
- `og:title`: `"{greeting.title} - from {senderName}"`
- `og:description`: First 160 chars of greeting message
- `og:image`: Points to `/g/[slug]/opengraph-image`
- `twitter:card`: `summary_large_image`

---

### Task 3.2 — Create OpenGraph image route

**File to create:** `src/app/(public)/g/[slug]/opengraph-image.tsx`

Uses Next.js built-in `ImageResponse` from `next/og`:
- 1200×630 PNG
- Template-specific color scheme based on `componentSlug`:
  - `"gold-n-shiny"` → black bg, gold text
  - `"crimson-bloom"` → red bg, white text
  - `"jade-prosperity"` → emerald bg, jade text
  - Default → red bg, gold text
- Shows: CNY emoji decorations, greeting title, "From {sender}", Bizapps branding
- Uses Node.js runtime (required for Prisma/SQLite)

**Depends on:** 2.1, 3.1

---

### Task 3.3 — Verify OG tags end-to-end

Check page source for `og:title`, `og:description`, `og:image`. Visit `/g/[slug]/opengraph-image` directly. Different templates → different OG images.

**Depends on:** 3.1, 3.2

---

## Dependency Graph

```
Phase 1 (all parallel):
  1.1, 1.2, 1.3, 1.4, 1.5
  1.6 → after 1.1

Phase 2:
  2.1 (schema) ─┬─ 2.3 (registry) → 2.4 (routing) → 2.11 (verify)
  2.2 (types)  ─┼─ 2.5 (GoldNShiny)
                ├─ 2.6 (CrimsonBloom)
                ├─ 2.7 (JadeProsperity)
                ├─ 2.8 (seed) → 2.10 (preview colors)
                └─ 2.9 (refactor GreetingRenderer)

Phase 3:
  2.1 → 3.1 (metadata) → 3.2 (OG image) → 3.3 (verify)
```

---

## Appendix A: Status Audit — Plan 1

| # | Task | Status | Details |
|---|------|--------|---------|
| 1.1 | Prisma schema with 8 models | **DONE** | All models present in `prisma/schema.prisma` |
| 1.2 | DB file at data/app.db | **DONE** | Configured in datasource |
| 1.3 | .gitignore for DB | **DONE** | `data/*.db` in .gitignore |
| 1.4 | Auto-create DB on boot | **NOT DONE** | Manual `prisma db push` required |
| 1.5 | Template seed script | **DONE** | `prisma/seed.ts` with 4 templates |
| 1.6 | npm run db:init script | **NOT DONE** | No convenience script in package.json |
| 2.1 | NextAuth credentials + JWT | **DONE** | `src/lib/auth.ts` configured |
| 2.2 | Login page | **DONE** | `src/app/(auth)/login/page.tsx` |
| 2.3 | Register page + API | **PARTIAL** | UI exists but submit is mocked — no `/api/auth/register` route, no user created in DB |
| 2.4 | Protected dashboard layout | **DONE** | Session-protected layout |
| 2.5 | Dashboard overview | **DONE** | `src/app/(dashboard)/app/page.tsx` |
| 2.6 | Session type augmentation | **DONE** | JWT callbacks add user.id |
| 3.1 | GET /api/templates | **DONE** | |
| 3.2 | Templates listing page | **DONE** | Trial/paid sections, preview modal |
| 3.3 | POST /api/greetings | **DONE** | Trial enforcement, slug generation |
| 3.4 | GET /api/greetings | **DONE** | |
| 3.5 | GET /api/greetings/[id] | **DONE** | Auth + ownership check |
| 3.6 | PATCH /api/greetings/[id] | **DONE** | Validates donation config |
| 3.7 | Greetings list page | **DONE** | |
| 3.8 | Greeting editor | **DONE** | Logo upload, trial locks, UpgradeModal |
| 4.1 | POST /api/greetings/[id]/pay | **DONE** | Mock checkout URL |
| 4.2 | POST /api/payments/webhook | **DONE** | Mock verification |
| 4.3 | Payment page | **DONE** | |
| 4.4 | Real Xendit integration | **NOT DONE** | All payment logic is mocked |
| 4.5 | Idempotency key | **PARTIAL** | `externalRef` exists but uses `Date.now()` |
| 5.1 | Public greeting route /g/[slug] | **DONE** | |
| 5.2 | GreetingRenderer component | **DONE** | |
| 5.3 | Framer Motion presets | **DONE** | `src/lib/animations.ts` — 15+ variants |
| 5.4 | Asset layer rendering | **PARTIAL** | Emoji placeholders, no real images |
| 5.5 | Glassmorphism card | **DONE** | |
| 5.6 | Share modal | **DONE** | WhatsApp, Facebook, LinkedIn, QR |
| 5.7 | Donation modal | **DONE** | SendWishModal with payment methods |
| 5.8 | Canvas fireworks | **DONE** | `src/components/Fireworks.tsx` |
| 5.9 | Reduced motion support | **NOT DONE** | No `prefers-reduced-motion` detection |
| 5.10 | Staggered asset entrance | **DONE** | |
| 5.11 | Event-driven animations | **PARTIAL** | Fireworks on load, no confetti on copy |
| 5.12 | Background glow pulse | **DONE** | |
| 6.1 | Payment settings page | **DONE** | |
| 6.2 | Manual receiver config (QRIS) | **DONE** | Multi-image upload |
| 6.3 | Platform receiver config | **DONE** | |
| 6.4 | ReceiverConfig API GET + POST | **DONE** | Upsert by userId+mode |
| 6.5 | Donation gating validation | **DONE** | |
| 7.1 | POST /api/g/[slug]/donate | **NOT DONE** | Replaced by `/api/public/wishes` |
| 7.2 | POST /api/donations/webhook | **NOT DONE** | |
| 7.3 | Manual mode: display QR + instructions | **DONE** | SendWishModal shows QRIS/e-wallet |
| 7.4 | Platform Xendit invoice from public | **NOT DONE** | No Xendit API integration |
| 7.5 | Payout notice on public page | **DONE** | |
| 8.1 | POST /api/events | **DONE** | Endpoint exists |
| 8.2 | Event tracking calls from pages | **NOT DONE** | Endpoint never called from any page |
| 8.3 | POST /api/g/[slug]/submit | **NOT DONE** | Replaced by `/api/public/wishes` |
| 8.4 | Public submissions UI | **PARTIAL** | FloatingWishes exists, no static list |
| 8.5 | Analytics dashboard | **NOT DONE** | No `/app/analytics` page |
| 9.1 | Landing page | **DONE** | |
| 9.2 | Navbar with branding | **DONE** | |
| 9.3 | Dark mode support | **DONE** | Tailwind 4 `@custom-variant dark` |
| 9.4 | Responsive design | **DONE** | (except dashboard sidebar — fixed in Phase 1) |
| 9.5 | OpenGraph image route | **NOT DONE** | Fixed in Phase 3 of this plan |
| 10.1–10.10 | Free Trial System | **DONE** | All trial tasks complete |

---

## Appendix B: Status Audit — Plan 2

| # | Task | Status | Details |
|---|------|--------|---------|
| 2.1 | Logo/branding lock for trial | **DONE** | Edit page triggers UpgradeModal |
| 2.2 | WhatsApp/QR sharing lock for trial | **NOT DONE** | ShareModal does not check `isTrial` |
| 2.3 | Payment/donation lock for trial | **DONE** | Toggle disabled for trial |
| 2.4 | Content limitations (single variant) | **DONE** | Trial locked to Variant A |
| 3.1 | UpgradeModal component | **DONE** | |
| 3.2 | Upgrade modal trigger points | **PARTIAL** | Logo + donation trigger it, WhatsApp does not |
| 4.1 | Trial detection logic | **DONE** | |
| 5.1–5.6 | Core trial implementation | **DONE** | |
| 6.1 | Trial expiry system | **NOT DONE** | No expiry logic |
| 6.2 | Trial analytics dashboard | **NOT DONE** | Analytics not built |

---

## Appendix C: Technical Debt Summary

| Category | Count | Items |
|----------|-------|-------|
| Missing API endpoints | 3 | Register, Donate, Donation webhook |
| Missing pages | 1 | Analytics dashboard |
| Missing integrations | 2 | Real Xendit payments, Event tracking calls |
| Incomplete features | 3 | Reduced motion, Trial sharing locks, Trial expiry |
| Missing infrastructure | 2 | Auto DB init, db:init script |

---

## Verification Checklist

1. `npx next build` — compiles with no errors
2. Dashboard on 375px mobile: hamburger visible, sidebar slides in/out, all pages usable
3. Greetings page on mobile: card layout, no overflow
4. Edit page on mobile: form fields stack properly
5. Visit `/g/[slug]` with GoldNShiny template → dark/gold theme renders
6. Visit `/g/[slug]` with CrimsonBloom template → red/blossom theme renders
7. Visit `/g/[slug]` with JadeProsperity template → jade/emerald theme renders
8. Existing greetings (no componentSlug) → fallback to GreetingRenderer
9. Send Wish + Share buttons work on all 3 templates
10. FloatingWishes display on all templates
11. View page source → OG meta tags present with correct title/description/image
12. Visit `/g/[slug]/opengraph-image` → PNG image with template-specific colors
13. Templates page shows new templates with themed preview colors
