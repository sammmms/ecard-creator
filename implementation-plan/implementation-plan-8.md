# Implementation Plan 8 — Consolidated Status + Custom Slugs & Greeting Expiry

> **Created:** 2026-02-10
> **Status:** Proposal (Pending Review)
> **Depends on:** Plans 1–7 (all completed/implemented)

---

## 1. Consolidated Status (Plans 1–7)

### 1.1 Completed Features

All features below are implemented, tested, and passing build.

| Category | Feature | Source Plan | Key Files |
|----------|---------|-------------|-----------|
| **Database** | Prisma SQLite schema (11 models) | Plan 1 | `prisma/schema.prisma` |
| **Database** | Seed script (4 templates: 3 CNY + 1 Valentine) | Plan 3/5 | `prisma/seed.ts` |
| **Auth** | NextAuth JWT + credentials provider | Plan 1 | `src/lib/auth.ts` |
| **Auth** | Register API | Plan 1 | `src/app/api/auth/register/route.ts` |
| **Auth** | User profile API (GET/PATCH companyName) | Plan 6 | `src/app/api/user/profile/route.ts` |
| **Templates** | 4 static template components (GoldNShiny, CrimsonBloom, JadeProsperity, ValentineRose) | Plan 3/5 | `src/components/templates/` |
| **Templates** | Template registry with dynamic imports | Plan 3 | `src/components/templates/index.tsx` |
| **Templates** | Categories (cny, valentine, general) + fuzzy search (fuse.js) | Plan 5 | `src/lib/categories.ts` |
| **Templates** | Layout variants (ValentineRose: red/pink/maroon) | Plan 5 | `src/components/templates/ValentineRose.tsx` |
| **Greetings** | Full CRUD APIs | Plan 1 | `src/app/api/greetings/` |
| **Greetings** | Inline template editing (WYSIWYG preview mode) | Plan 7 | `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` |
| **Greetings** | InlineEditable component (click-to-edit, hover hints) | Plan 7 | `src/components/InlineEditable.tsx` |
| **Greetings** | Company logo upload in live preview | Session | `src/components/templates/*.tsx` |
| **Greetings** | Collapsible sidebar sections (animated) | Session | `src/components/Collapsible.tsx` |
| **Trial** | Trial system (isTrial on Greeting, restrictions, UpgradeModal) | Plan 1/2 | `src/components/UpgradeModal.tsx` |
| **Trial** | Universal trials (any template free to try) | Plan 7 | `src/app/api/greetings/route.ts` |
| **Trial** | Free sharing with IP-deduplicated 75-view cap | Plan 7 | `src/app/(public)/g/[slug]/page.tsx` |
| **Trial** | Trial upgrade endpoint | Plan 5 | `src/app/api/greetings/[id]/upgrade/route.ts` |
| **Public** | Public greeting page (dynamic template routing) | Plan 1/3 | `src/app/(public)/g/[slug]/page.tsx` |
| **Public** | OG image generation | Plan 3 | `src/app/(public)/g/[slug]/opengraph-image/route.tsx` |
| **Public** | Seasonal theme system (6 themes + auto-detection) | Plan 5 | `src/lib/theme.ts`, `src/components/ThemeProvider.tsx` |
| **Public** | Music playback system | Plan 1 | `src/lib/music.ts`, `src/components/GreetingPageWrapper.tsx` |
| **Public** | Force light mode on public pages | Plan 4 | `src/components/ThemeProvider.tsx` |
| **Wishes** | SendWishModal (text + optional donation) | Plan 4 | `src/components/SendWishModal.tsx` |
| **Wishes** | FloatingWishes (animated bubbles) | Plan 4 | `src/components/FloatingWishes.tsx` |
| **Wishes** | WishesModal (view all wishes) | Plan 4 | `src/components/WishesModal.tsx` |
| **Wishes** | Wish image uploads (2MB limit, compression) | Plan 7 | `src/components/SendWishModal.tsx` |
| **Wishes** | Public wishes API (no-auth POST) | Plan 4 | `src/app/api/public/wishes/route.ts` |
| **Sharing** | ShareModal (WhatsApp, Facebook, LinkedIn, QR code) | Plan 1 | `src/components/ShareModal.tsx` |
| **Donations** | Manual donation mode (QRIS + e-wallet) | Plan 1 | `src/components/SendWishModal.tsx` |
| **Donations** | Multi-QRIS support with labels | Plan 4 | `src/app/(dashboard)/app/settings/payments/page.tsx` |
| **Donations** | Xendit donation disabled (maintenance modal) | Plan 7 | `src/components/MaintenanceModal.tsx` |
| **Payments** | Mock Xendit payment flow | Plan 1 | `src/app/api/greetings/[id]/pay/route.ts` |
| **Payments** | Payment page with animations | Plan 1 | `src/app/(dashboard)/app/greetings/[id]/pay/page.tsx` |
| **Analytics** | IP-deduplicated view counting (all greetings) | Plan 7/Session | `src/app/(public)/g/[slug]/page.tsx` |
| **Analytics** | Analytics dashboard (viewCount-based) | Plan 4/Session | `src/app/(dashboard)/app/analytics/page.tsx` |
| **Analytics** | Per-greeting stats (desktop table + mobile cards) | Plan 4 | `src/app/(dashboard)/app/analytics/PerGreetingStats.tsx` |
| **Notifications** | Notification model + service | Plan 7 | `src/lib/notifications.ts` |
| **Notifications** | Notifications page + nav badge | Plan 7 | `src/app/(dashboard)/app/notifications/page.tsx` |
| **Dashboard** | Overview (animated counters, quick actions, recent greetings) | Plan 1 | `src/app/(dashboard)/app/page.tsx` |
| **Dashboard** | Templates catalog (search, filter, live preview) | Plan 1/5 | `src/app/(dashboard)/app/templates/page.tsx` |
| **Dashboard** | Settings page (company name) | Plan 6 | `src/app/(dashboard)/app/settings/page.tsx` |
| **Dashboard** | Payment settings (receiver config) | Plan 1 | `src/app/(dashboard)/app/settings/payments/page.tsx` |
| **Mobile** | Responsive layouts (hamburger sidebar, card views) | Plan 3 | Multiple dashboard pages |
| **Dark Mode** | System detection + manual toggle + Tailwind 4 dark variant | Plan 4/5 | `src/app/globals.css`, `src/components/ThemeProvider.tsx` |
| **UX** | Escape key closes all modals and overlays | Session | `src/hooks/useEscapeKey.ts`, all modal components |
| **Landing** | Landing page (hero, features, footer) | Plan 1 | `src/app/(public)/page.tsx` |
| **Demo** | Demo page (animations, music, floating particles) | Plan 4 | `src/app/(public)/demo/page.tsx` |
| **Upload** | File upload API (images, 2MB limit) | Plan 1 | `src/app/api/upload/route.ts` |

### 1.2 Reusable UI Components

| Component | File |
|-----------|------|
| PageLoader | `src/components/PageLoader.tsx` |
| StatusBadge | `src/components/StatusBadge.tsx` |
| ToggleSwitch | `src/components/ToggleSwitch.tsx` |
| Button | `src/components/Button.tsx` |
| Select | `src/components/Select.tsx` |
| TextField | `src/components/TextField.tsx` |
| InlineEditable | `src/components/InlineEditable.tsx` |
| Collapsible | `src/components/Collapsible.tsx` |
| Fireworks | `src/components/Fireworks.tsx` |
| Shimmer | `src/components/Shimmer.tsx` |
| AnimationToggle | `src/components/AnimationToggle.tsx` |
| SettingsDropdown | `src/components/SettingsDropdown.tsx` |

### 1.3 Remaining Technical Debt (Not Addressed in This Plan)

| Item | Priority | Notes |
|------|----------|-------|
| Real Xendit payment integration | High | APIs are mocked; no real transactions |
| Email verification on registration | Medium | No email service configured |
| Password reset flow | Medium | No implementation |
| Trial expiry enforcement | Low | `trialExpiresAt` field exists but no logic checks it |
| Reduced motion support | Low | `prefers-reduced-motion` only partially detected |
| Auto DB init on boot | Low | Manual `prisma db push` required |

### 1.4 Current Database Schema

11 models: `User`, `Template`, `Greeting`, `Payment`, `ReceiverConfig`, `DonationPayment`, `Event`, `PublicSubmission`, `GreetingView`, `Notification`

Key Greeting fields relevant to new features:
- `slug` — unique, currently auto-generated via `nanoid(10)`
- `status` — "draft" | "pending_payment" | "published"
- `isTrial` — boolean
- `trialExpiresAt` — nullable DateTime (unused)
- `viewCount` — IP-deduplicated unique visitor count
- `maxFreeViews` — cap for trial greetings (default 75)

---

## 2. Feature 1 — Custom Slug (Unlocked Greetings Only)

### 2.1 The Problem

All greeting slugs are auto-generated random strings (e.g., `aBcDeFgHiJ`). Companies want memorable, branded URLs like `/g/acme-cny-2026` for sharing. Trial greetings should keep random slugs to prevent abuse.

### 2.2 The Solution

Unlocked (paid) greetings can set a custom slug via the editor sidebar. The slug must be unique across all greetings and follow URL-safe rules. Trial greetings cannot customize slugs.

### 2.3 Rules

1. **Only unlocked greetings** (`isTrial === false`) can set custom slugs
2. **Slug format**: 3-50 characters, lowercase alphanumeric + hyphens, no leading/trailing hyphens
3. **Uniqueness**: validated server-side against all existing slugs (including expired greetings — see Feature 2)
4. **Slug is never null**: if a greeting loses its custom slug (see 2.7 slug reclaim), a new random slug is generated
5. **Real-time availability check**: debounced API call as user types

### 2.4 Schema Changes

No schema changes needed — `slug` is already a `String @unique` on Greeting.

### 2.5 Implementation Tasks

#### Task 1: Slug Validation API

**File:** `src/app/api/greetings/[id]/slug/route.ts` (new)

- `POST { slug: string }` — validate and update slug
  - Auth check (must be greeting owner)
  - Trial check (reject if `isTrial === true`)
  - Format validation: `/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/`
  - Uniqueness check: `db.greeting.findUnique({ where: { slug } })`
  - If taken by same greeting → no-op success
  - If taken by different greeting → 409 Conflict
  - If available → update greeting slug
  - Return `{ ok: true, slug }` or `{ error: "..." }`

- `GET ?slug=xxx` — availability check (no update)
  - Returns `{ available: boolean }`

#### Task 2: Slug Availability Check Hook

**File:** `src/hooks/useSlugCheck.ts` (new)

- Debounced (500ms) check against `GET /api/greetings/[id]/slug?slug=xxx`
- Returns `{ isChecking, isAvailable, error }`
- Skips check if slug matches current greeting slug

#### Task 3: Slug Editor UI in Sidebar

**File:** `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` (modify)

- New section in sidebar (below "Greeting name", above "Card content")
- Only renders when `!greeting.isTrial`
- Text input with `/g/` prefix label
- Real-time availability indicator (green check / red X / spinner)
- "Save" button (or auto-save on blur like other fields)
- Validation error messages below input
- For trial greetings: show slug as read-only with lock icon + "Upgrade to customize URL"

#### Task 4: Update Greeting PATCH API

**File:** `src/app/api/greetings/[id]/route.ts` (modify)

- Add `slug` to allowed PATCH fields
- Same validation as Task 1 (format + uniqueness + trial check)

---

## 3. Feature 2 — Greeting Expiry System

### 3.1 The Problem

Currently, published greetings live forever. For seasonal events (CNY, Valentine's), greetings become irrelevant after the event passes. There's no mechanism to expire greetings or manage their lifecycle.

### 3.2 The Solution

Unlocked greetings expire after a configurable duration (default: 6 months from publish date). When expired:
- Public visitors see an "expired" page
- The slug remains reserved (unclaimable) for 1 year after expiry
- After 1 year, the slug becomes claimable — the previous owner is notified and their greeting gets a new random slug
- Owners can extend their greeting before/after expiry

### 3.3 Rules

1. **Trial greetings**: Do NOT expire via this system (they have their own view-count limit)
2. **Default expiry**: 6 months (180 days) from publish date
3. **Extension**: Owners can extend by another 6 months (free, unlimited extensions)
4. **Slug reservation**: Expired greeting's slug is reserved for 1 year after expiry
5. **Slug reclaim**: After 1 year, any new greeting can claim the slug
   - Previous owner is notified via notification
   - Previous greeting gets a new auto-generated slug (slug is never null)
6. **Owner access**: Owners can always view their expired greeting (no block)

### 3.4 Schema Changes

**File:** `prisma/schema.prisma`

```prisma
model Greeting {
  // ... existing fields ...
  expiresAt         DateTime?  // When this greeting expires (null = never for trials)
  isExpired         Boolean    @default(false) // Cached flag, updated by check logic
}
```

- `expiresAt`: Set when greeting is published (publish date + 180 days). Null for trial greetings.
- `isExpired`: Cached boolean to avoid date comparisons on every request. Updated when checked.

### 3.5 Implementation Tasks

#### Task 5: Schema Update

**File:** `prisma/schema.prisma`

- Add `expiresAt DateTime?` to Greeting
- Add `isExpired Boolean @default(false)` to Greeting
- Run `npx prisma db push`

#### Task 6: Expiry Check Utility

**File:** `src/lib/expiry.ts` (new)

```typescript
export function isGreetingExpired(greeting: { expiresAt: Date | null; isTrial: boolean }): boolean
export function getExpiryDate(publishDate: Date, durationDays?: number): Date
export function isSlugReclaimable(expiresAt: Date): boolean // true if > 1 year past expiry
export async function handleSlugReclaim(greetingId: string, newClaimerGreetingId: string): Promise<void>
```

- `isGreetingExpired`: Returns true if `expiresAt` is in the past and `isTrial` is false
- `getExpiryDate`: Returns publish date + duration (default 180 days)
- `isSlugReclaimable`: Returns true if current date > expiresAt + 365 days
- `handleSlugReclaim`: Generates new random slug for old greeting, notifies old owner, assigns slug to new greeting

#### Task 7: Set Expiry on Publish

**File:** `src/app/api/greetings/[id]/route.ts` (modify)

- When `status` changes to `"published"` and `isTrial === false`:
  - Set `expiresAt = getExpiryDate(new Date())`
- When greeting is extended (see Task 10):
  - Set `expiresAt = getExpiryDate(expiresAt || new Date())`
  - Set `isExpired = false`

#### Task 8: Expiry Check on Public Page

**File:** `src/app/(public)/g/[slug]/page.tsx` (modify)

- After fetching greeting, check `isGreetingExpired(greeting)`
- If expired and viewer is NOT owner:
  - Update `isExpired = true` in DB (cache)
  - Show expired page (similar style to trial limit page):
    - Lock icon
    - "This greeting has expired"
    - "The creator can extend this greeting to make it available again."
    - "Create your own greeting" CTA
- If expired and viewer IS owner:
  - Show the greeting normally with a banner: "This greeting has expired. [Extend] to make it public again."

#### Task 9: Slug Reclaim on Custom Slug Assignment

**File:** `src/app/api/greetings/[id]/slug/route.ts` (modify Task 1)

- When a slug is "taken" (409 Conflict), additionally check:
  - Is the existing greeting expired? (`isExpired === true` or `expiresAt < now`)
  - Is it reclaimable? (`expiresAt + 365 days < now`)
  - If reclaimable: call `handleSlugReclaim()` — reassign slug to new greeting
  - If not reclaimable: return 409 with `{ error: "This URL is reserved. It will become available on [date].", availableAt: reclaimDate }`

#### Task 10: Extend Greeting API

**File:** `src/app/api/greetings/[id]/extend/route.ts` (new)

- `POST` — extend greeting by 180 days
  - Auth check (must be owner)
  - Trial check (reject trials — they don't expire)
  - Set `expiresAt = max(expiresAt, now) + 180 days`
  - Set `isExpired = false`
  - Return updated greeting

#### Task 11: Expiry UI in Editor Sidebar

**File:** `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` (modify)

- New section showing:
  - "Expires on: [date]" (for published non-trial greetings)
  - "Extend" button → calls extend API
  - If expired: red badge "Expired" + "Extend to republish" button
  - For trial greetings: hide this section entirely
  - For draft greetings: "Expiry will be set when published"

#### Task 12: Expiry Display in Greetings List

**File:** `src/app/(dashboard)/app/greetings/page.tsx` (modify)

- Add "expired" status badge (red) when `isExpired === true`
- Show expiry date in greeting card/row

#### Task 13: Notification on Slug Reclaim

Already handled in Task 6 (`handleSlugReclaim`):
- Create notification for previous slug owner:
  - Message: `Your greeting URL "/g/[old-slug]" has been claimed by another user. Your greeting is now available at "/g/[new-random-slug]".`
  - Type: `"slug_reclaimed"`
  - Redirect: `/app/greetings/[id]/edit`

---

## 4. Feature 3 — Deferred Trial Creation (Try Before Save)

### 4.1 The Problem

Currently, clicking "Try Free" on a template immediately creates a trial greeting in the database and redirects to the editor. This leads to abandoned trial greetings cluttering the database when users are just browsing. It also creates a confusing experience — users don't expect a permanent record to be created just by clicking "Try."

### 4.2 The Solution

Clicking "Try Free" navigates to the editor page in a **draft-preview state** — the template renders with placeholder data, and the user can freely edit title, message, sender name, and logo. The greeting is only created in the database when the user explicitly clicks "Save." Until saved, leaving the page discards all changes (with a confirmation prompt).

### 4.3 Rules

1. **No DB record until save**: The editor works with local state only (no `greetingId` yet)
2. **Unsaved changes hint**: Persistent text hint at the top: "This greeting hasn't been saved yet. Changes will be lost if you leave."
3. **Leave confirmation**: Browser `beforeunload` event + in-app route change intercepted with a confirmation modal
4. **Save action**: Creates the trial greeting via `POST /api/greetings` (with `asTrial: true`) then redirects to the edit page with the new greeting ID
5. **Existing trials**: If user already has a trial for this template, "Try Free" should redirect to the existing trial's edit page (current behavior, keep as-is)

### 4.4 Implementation Tasks

#### Task 14: Deferred Trial Navigation

**File:** `src/app/(dashboard)/app/templates/page.tsx` (modify)

- Change `handleTryFree()` to NOT call `POST /api/greetings`
- Instead: `router.push(/app/greetings/new?templateId=xxx&trial=true)`
- Keep existing trial check: if user already has a trial for this template, redirect to that trial's edit page

#### Task 15: New Greeting Editor Route

**File:** `src/app/(dashboard)/app/greetings/new/page.tsx` (new)

- Reads `templateId` and `trial=true` from search params
- Fetches template data (for `componentSlug`, name, etc.)
- Initializes local state with defaults:
  - `title: ""`, `senderNameDefault: ""`, `messageDefault: ""`, `companyLogoUrl: null`
- Renders the same editor layout as the existing edit page but:
  - No API calls for auto-save (all changes in local state)
  - "Save" button in sidebar (primary CTA)
  - Unsaved hint banner at top
  - `beforeunload` event listener
  - Route change guard (intercept Next.js navigation)

#### Task 16: Save Action (Create Trial Greeting)

**File:** `src/app/(dashboard)/app/greetings/new/page.tsx` (same file)

- "Save" button calls `POST /api/greetings` with `{ templateId, asTrial: true }`
- On success: immediately PATCH the new greeting with the local edits (title, sender, message, logo)
- Then `router.replace(/app/greetings/[newId]/edit)` — replaces history so back doesn't go to `/new`

#### Task 17: Leave Confirmation Modal

**File:** `src/components/UnsavedChangesGuard.tsx` (new)

- Wraps the new greeting page
- Listens for `beforeunload` (browser tab close/refresh)
- Intercepts Next.js route changes (via `router.events` or `usePathname` watcher)
- Shows modal: "You have unsaved changes. Leave without saving?"
  - "Stay" — closes modal
  - "Leave" — allows navigation
- Reusable component (can be used on edit page too if needed)

#### Task 18: Update Templates Page Trial Check

**File:** `src/app/(dashboard)/app/templates/page.tsx` (modify)

- When "Try Free" is clicked and user already has a trial for this template:
  - Redirect to existing trial: `router.push(/app/greetings/[existingTrialId]/edit)`
- When no existing trial:
  - Navigate to new page: `router.push(/app/greetings/new?templateId=xxx&trial=true)`

---

## 5. Feature 4 — Trial Upgrade UX Overhaul

### 5.1 The Problems

Several UX issues with the current trial upgrade experience:

1. **Redirect-heavy upgrade flow**: Clicking "Unlock This Template" redirects to `/app/greetings/[id]/pay?upgrade=true`, and the secondary CTA goes to `/app/templates`. The owner should be able to upgrade the current trial greeting directly without leaving the editor.

2. **No view limit visibility for owners**: Owners don't know how many of the 75 free views remain. They should see "X/75 views used" so they understand urgency.

3. **Misleading copy**: "Unlock Full Greeting Power" and "Access to all premium templates" imply paying unlocks ALL templates, when it only unlocks the current template. The copy needs to be specific to the current template.

4. **Gradient background issues**: The decorative top gradient (`bg-theme-gradient`) in the UpgradeModal looks broken in dark mode (weird color bleed) and in light mode there's a visible color discontinuity between the gradient area and the white card below where the title/subtitle sit.

5. **Modal renders inside preview container**: On the edit page, the trial banner's "Upgrade" button triggers `openUpgradeModal` via `GreetingPageWrapper` context, but that UpgradeModal renders inside the preview panel (which has `contain: paint` and `h-[650px]`). The modal needs to render at the page level, not inside the preview container.

### 5.2 The Solution

Redesign the UpgradeModal and trial UX:

- **Direct upgrade from editor**: The primary CTA triggers payment for the current template inline (no page redirect). Secondary option: "Or browse other templates."
- **View count display**: Show remaining views on the trial banner and in the editor sidebar.
- **Accurate copy**: "Upgrade This Greeting" with template-specific pricing. Feature list describes what upgrading THIS greeting unlocks (not all templates).
- **Fix gradient**: Replace the large decorative gradient with a subtler design that works in both light and dark mode.
- **Fix modal z-index**: Move the UpgradeModal trigger from `GreetingPageWrapper` context to the edit page level, so the modal overlays the entire page.

### 5.3 Implementation Tasks

#### Task 19: Redesign UpgradeModal Copy and Visuals

**File:** `src/components/UpgradeModal.tsx` (modify)

Current issues to fix:

- **Title**: "Unlock Full Greeting Power" → "Upgrade This Greeting"
- **Subtitle**: "Your trial greeting is a preview. Upgrade to unlock:" → "Remove trial restrictions and get the full experience."
- **Feature list**: Replace misleading items:
  - ~~"Access to all premium templates"~~ → "Unlimited views (no 75-view cap)"
  - Keep: "Custom company logo & branding"
  - Keep: "Shareable links without watermark"
  - Keep: "Digital Wishes (donation) feature"
  - Keep: "WhatsApp & QR sharing"
  - Add: "Custom greeting URL"
- **Primary CTA**: "Upgrade This Greeting — Rp XX.XXX" (keeps current `handleUnlockTemplate` but stays on page)
- **Secondary CTA**: "Or browse other templates" (links to `/app/templates`)
- **Gradient fix**: Replace `bg-theme-gradient` top area with a more subtle approach:
  - Use a solid darker background (e.g., `bg-gray-900 dark:bg-gray-800`) with a small accent line at top
  - Or use a contained gradient strip (not full 44px height)
  - Ensure title and subtitle text colors are consistent (no bleed between gradient and card)

#### Task 20: Add View Count to Trial Banner and Sidebar

**Files:**
- `src/components/templates/*.tsx` (all 4 templates, modify trial banner)
- `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` (modify sidebar)

**Trial banner in templates** (public page + edit preview):
- Current: "This is a trial greeting. Upgrade to unlock all features →"
- New: "Trial greeting — {viewCount}/{maxFreeViews} views used. [Upgrade →]"
- Need to pass `viewCount` and `maxFreeViews` through `TemplateProps` or `GreetingPageWrapper` context

**Editor sidebar** (when `isTrial`):
- Add a trial info card at top of sidebar showing:
  - "Trial Greeting" badge
  - "{viewCount} / {maxFreeViews} free views used"
  - Progress bar (viewCount / maxFreeViews)
  - "Upgrade" button

**TemplateProps update:**
- Add optional `viewCount?: number` and `maxFreeViews?: number` to `TemplateProps` greeting type
- Or pass via GreetingPageWrapper context (preferred — avoids prop drilling into all templates)

#### Task 21: Fix UpgradeModal Rendering in Edit Page

**Files:**
- `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` (modify)
- `src/components/GreetingPageWrapper.tsx` (modify)

**Problem:** The edit page wraps the preview in `GreetingPageWrapper` which has its own `UpgradeModal`. When the trial banner inside a template calls `openUpgradeModal()` (from context), the modal renders inside the `GreetingPageWrapper` — which is inside the preview container with `contain: paint` and fixed height. The modal is clipped/trapped.

**Solution:**
- When `isEditing` or `isPreview`, the `GreetingPageWrapper` should NOT render its own `UpgradeModal`
- Instead, the `openUpgradeModal` context callback should call a function passed from the edit page
- The edit page already has its own `UpgradeModal` at the page level (line 669). Wire the context's `openUpgradeModal` to trigger the page-level modal instead.

**Implementation:**
1. Add `onUpgradeClick?: () => void` prop to `GreetingPageWrapper`
2. When `onUpgradeClick` is provided, use it as the `openUpgradeModal` context value instead of the internal one
3. When `onUpgradeClick` is provided, skip rendering the internal `UpgradeModal`
4. Edit page passes `onUpgradeClick={() => setShowUpgrade(true)}` to `GreetingPageWrapper`

#### Task 22: Direct Upgrade Flow (No Redirect)

**Files:**
- `src/components/UpgradeModal.tsx` (modify)
- `src/app/api/greetings/[id]/upgrade/route.ts` (already exists)

Currently, "Unlock This Template" calls `router.push(/app/greetings/[id]/pay?upgrade=true)` which redirects to the payment page. For a smoother experience:

- **Option A (simple)**: Keep the redirect to pay page but use `router.push` without closing the editor context. The pay page already handles the upgrade flow.
- **Option B (inline)**: Call the upgrade API directly from the modal, show a payment confirmation inline, then refresh the editor data on success.

**Recommended: Option A** — the pay page already exists and handles Xendit integration (even if mocked). No need to duplicate payment UI. Just ensure the pay page has a "Back to editor" link after success.

Update the pay page (`/app/greetings/[id]/pay/page.tsx`) to:
- When `?upgrade=true`, show "Upgrading your trial greeting" context
- After payment success, redirect back to `/app/greetings/[id]/edit` instead of greetings list

---

## 6. Dependency Graph

```
Feature 1 & 2 (Custom Slug + Expiry):

Task 5 (Schema) ──┬──> Task 6 (Expiry Utils)
                   │         │
                   │         ├──> Task 7 (Set Expiry on Publish)
                   │         ├──> Task 8 (Expired Public Page)
                   │         ├──> Task 10 (Extend API)
                   │         └──> Task 13 (Notifications)
                   │
                   └──> Task 1 (Slug Validation API) ──> Task 9 (Slug Reclaim)
                              │
                              ├──> Task 2 (Slug Check Hook)
                              │         │
                              │         └──> Task 3 (Slug Editor UI)
                              │
                              └──> Task 4 (Update PATCH API)

Task 11 (Expiry UI) ──> depends on Tasks 7, 10
Task 12 (Greetings List) ──> depends on Task 5

Feature 3 (Deferred Trial Creation) — independent:

Task 17 (UnsavedChangesGuard) ──> Task 15 (New Greeting Route)
                                         │
Task 14 (Deferred Navigation) ──────────>├──> Task 16 (Save Action)
Task 18 (Template Trial Check) ─────────>│

Feature 4 (Trial Upgrade UX) — independent:

Task 19 (Redesign UpgradeModal) ──┬──> Task 22 (Direct Upgrade Flow)
Task 20 (View Count Display)      │
Task 21 (Fix Modal Rendering) ────┘
```

**Suggested implementation order:**
1. Task 5 (Schema)
2. Tasks 6, 17, 19 (in parallel — Expiry Utils + UnsavedChangesGuard + UpgradeModal Redesign)
3. Tasks 1, 7, 14, 18, 20, 21 (in parallel)
4. Tasks 2, 8, 10, 15, 22 (in parallel)
5. Tasks 3, 4, 9, 16 (in parallel)
6. Tasks 11, 12, 13 (in parallel — UI polish)

---

## 6. Summary

| # | Task | Feature | Depends On | Complexity |
|---|------|---------|------------|------------|
| 1 | Slug Validation API | Custom Slug | 5 | Medium |
| 2 | Slug Availability Check Hook | Custom Slug | 1 | Low |
| 3 | Slug Editor UI in Sidebar | Custom Slug | 2 | Medium |
| 4 | Update Greeting PATCH API | Custom Slug | 1 | Low |
| 5 | Schema Update (expiresAt, isExpired) | Expiry | — | Low |
| 6 | Expiry Check Utility | Expiry | 5 | Medium |
| 7 | Set Expiry on Publish | Expiry | 6 | Low |
| 8 | Expiry Check on Public Page | Expiry | 6 | Medium |
| 9 | Slug Reclaim on Custom Slug Assignment | Slug + Expiry | 1, 6 | High |
| 10 | Extend Greeting API | Expiry | 6 | Low |
| 11 | Expiry UI in Editor Sidebar | Expiry | 7, 10 | Medium |
| 12 | Expiry Display in Greetings List | Expiry | 5 | Low |
| 13 | Notification on Slug Reclaim | Expiry | 6 | Low |
| 14 | Deferred Trial Navigation | Deferred Trial | — | Low |
| 15 | New Greeting Editor Route | Deferred Trial | 14, 17 | High |
| 16 | Save Action (Create Trial Greeting) | Deferred Trial | 15 | Medium |
| 17 | Leave Confirmation Modal (UnsavedChangesGuard) | Deferred Trial | — | Medium |
| 18 | Update Templates Page Trial Check | Deferred Trial | 14 | Low |
| 19 | Redesign UpgradeModal Copy and Visuals | Trial Upgrade UX | — | Medium |
| 20 | Add View Count to Trial Banner and Sidebar | Trial Upgrade UX | — | Medium |
| 21 | Fix UpgradeModal Rendering in Edit Page | Trial Upgrade UX | — | Medium |
| 22 | Direct Upgrade Flow (No Redirect) | Trial Upgrade UX | 19 | Low |

**Total: 22 tasks** — 4 Features (Custom Slug: 4, Greeting Expiry: 9, Deferred Trial: 5, Trial Upgrade UX: 4)

---

## 7. Verification Checklist

After all tasks are implemented:

**Custom Slug:**
- [ ] Custom slug can be set on unlocked (paid) greetings
- [ ] Custom slug input shows real-time availability (green check / red X / spinner)
- [ ] Trial greetings cannot customize slug (locked UI with upgrade hint)
- [ ] Slug format is enforced (lowercase, alphanumeric + hyphens, 3-50 chars)
- [ ] Duplicate slug returns 409 Conflict

**Greeting Expiry:**
- [ ] Published non-trial greetings get `expiresAt` set (180 days from publish)
- [ ] Expired greetings show expired page to non-owners
- [ ] Owners can still view their expired greetings (with extend banner)
- [ ] Extend API adds 180 days and clears `isExpired`
- [ ] Expired slug is reserved for 1 year
- [ ] After 1 year, slug can be reclaimed by new greeting
- [ ] Previous owner gets notification when slug is reclaimed
- [ ] Previous greeting gets new auto-generated slug (never null)
- [ ] Greetings list shows "expired" badge
- [ ] Editor sidebar shows expiry date + extend button

**Deferred Trial Creation:**
- [ ] "Try Free" navigates to `/app/greetings/new?templateId=xxx&trial=true` (no DB record created)
- [ ] Editor works with local state (template preview + inline editing)
- [ ] Unsaved hint text visible at top of page
- [ ] Browser tab close/refresh triggers `beforeunload` confirmation
- [ ] In-app navigation triggers modal confirmation ("Leave without saving?")
- [ ] "Save" creates trial greeting via API then redirects to edit page
- [ ] If trial already exists for template, redirects to existing trial's edit page

**Trial Upgrade UX:**
- [ ] UpgradeModal title says "Upgrade This Greeting" (not "Unlock Full Greeting Power")
- [ ] Feature list is accurate (no "Access to all premium templates")
- [ ] Feature list includes "Unlimited views" and "Custom greeting URL"
- [ ] Gradient background works correctly in both light and dark mode
- [ ] No color discontinuity between gradient area and card background
- [ ] Trial banner shows view count: "X/75 views used"
- [ ] Editor sidebar shows trial info card with progress bar and upgrade button
- [ ] UpgradeModal from trial banner in edit preview overlays the entire page (not clipped inside preview)
- [ ] "Upgrade This Greeting" CTA navigates to pay page with upgrade context
- [ ] Pay page redirects back to editor after successful upgrade
- [ ] Owner can upgrade directly without needing to browse templates again

**General:**
- [ ] `npx next build` passes with zero errors
- [ ] All existing functionality remains unbroken
