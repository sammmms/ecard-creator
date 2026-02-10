# Implementation Plan 5: Valentine Theme, Categories, Search & Valentine Trial Template

## Summary
Expanded the app from CNY-only to multi-category support with Valentine's Day as the first new category. Added fuzzy search, a pink seasonal theme, and a new ValentineRose template with 3 color schemes.

## Changes Made

### Phase 1: Schema + Data
- **`prisma/schema.prisma`** — Added `category`, `description`, `premiumPrice` to Template model
- **`src/lib/categories.ts`** — New file with `CATEGORIES` constant and `CategoryValue` type
- **`prisma/seed.ts`** — Updated all existing templates with `category`, `description`, `premiumPrice`; added 2 Valentine templates (`template-val-trial`, `template-val-01`)

### Phase 2: Valentine Theme
- **`src/components/providers/ThemeProvider.tsx`** — Added `valentine` theme (rose-600/pink-400 gradient) and seasonal detection for Feb 1-14
- **`public/logo/pink-logo.png`, `pink.png`, `pink-square.png`** — Copied from gold as placeholders

### Phase 3: ValentineRose Template
- **`src/types/template.ts`** — Added `layoutVariant?: string` to greeting type in TemplateProps
- **`src/components/templates/ValentineRose.tsx`** — New template with 3 color schemes (red/pink/maroon), heart particles, rose shower, floating bubbles, cupid arrow accent, corner ornaments, heart dividers
- **`src/components/templates/TemplateRenderer.tsx`** — Registered `valentine-rose` case

### Phase 4: API + TemplateCard
- **`src/app/api/templates/route.ts`** — Removed hardcoded `event: "cny"`, supports `?category=` and `?event=` params
- **`src/components/TemplateCard.tsx`** — Added `description`, `category`, `premiumPrice` to interface; shows description below name; shows "or unlock for Rp X" for trial+premiumPrice

### Phase 5: Search & Filter
- **Installed `fuse.js`** (~7KB fuzzy search library)
- **`src/app/(dashboard)/app/templates/page.tsx`** — Added search input, category Select dropdown, Fuse.js filtering pipeline, empty state with "Clear filters", updated PREVIEW_GREETING with layoutVariant

### Phase 6: layoutVariant Wiring
- **`src/app/(public)/g/[slug]/page.tsx`** — Pass `layoutVariant` to greetingData
- **`src/app/(dashboard)/app/greetings/[id]/edit/page.tsx`** — Extended Greeting interface with `template?`; dynamic variant selector (Red/Pink/Maroon for valentine-rose, A/B for others); default variant based on template type

### Phase 7: Trial Upgrade Path
- **`src/components/UpgradeModal.tsx`** — Added `greetingId` + `templatePrice` props; primary CTA "Unlock This Template — Rp X" when both provided
- **`src/app/api/greetings/[id]/upgrade/route.ts`** — New POST endpoint; validates ownership + trial status; creates Payment record with premiumPrice
- **Editor page** — Passes `greetingId` and `templatePrice` to UpgradeModal

## New Files (4)
| File | Purpose |
|------|---------|
| `src/components/templates/ValentineRose.tsx` | Valentine template with 3 color schemes |
| `src/lib/categories.ts` | Category constants |
| `src/app/api/greetings/[id]/upgrade/route.ts` | Trial upgrade payment API |
| `implementation-plan/implementation-plan-5.md` | This document |

## Dependencies Added
- `fuse.js` — Client-side fuzzy search

## Notes
- Pink logo files are placeholders (copies of gold) — replace with actual pink-tinted versions when available
- The upgrade API creates a Payment record but actual payment processing via Xendit is not yet wired
- Valentine seasonal theme auto-activates Feb 1-14; CNY shifted to Feb 15+
