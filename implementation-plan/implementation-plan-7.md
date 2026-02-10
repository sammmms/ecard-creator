# Implementation Plan 7 — Inline Editing, Universal Trials, Free Sharing, Notifications, Wish Images & Xendit Disable

> **Created:** 2026-02-10
> **Status:** Proposal (Pending Review)
> **Depends on:** Plans 1–6 (all completed)

---

## 1. Context & Overview

### Current State

After Plans 1–6, the platform has a working greeting card system with templates, trial restrictions, mock payments, wish submissions, and analytics. However, several UX and business model gaps remain:

1. **Editing is form-based** — users fill in text fields and must preview separately; there's no WYSIWYG experience
2. **Only 2 dedicated trial templates** — users can only try designated trial templates; paid templates have no free preview
3. **Trial greetings can't be shared** — trial greetings are blocked for non-owners, eliminating viral potential
4. **No notification system** — important events (e.g., share limits reached) have no way to reach users
5. **Wishes are text-only** — no image attachment support
6. **Xendit is mocked but shown as available** — creates confusion when users try to configure donations
7. **Seed has 9 templates but only 4 have actual components** — 5 templates reference non-existent config-based rendering

### What This Plan Solves

| #   | Feature                       | Problem                                                    | Solution                                                                                                                                             |
| --- | ----------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Inline Template Editing       | Form-based editing disconnects users from the final result | Preview-mode editing with highlighted editable zones, `[placeholder]` for empties, music selector in toolbar                                         |
| 2   | Universal Trial Versions      | Only dedicated trial templates can be tried for free       | Every template is free to try — `isTrial` removed from Template model, trial is a greeting-level concept only                                        |
| 3   | Free Sharing with Click Limit | Trial greetings can't be shared at all, killing virality   | Free greetings are shareable but capped at **75 unique views** (IP-deduplicated, excluding owner); after limit, greeting locks and owner is notified |
| 4   | Notification System           | No way to communicate events to users                      | New `Notification` model, notification list page, notification service with message + redirect link (future: realtime via WebSocket)                 |
| 5   | Wish Image Uploads            | Wishes are text-only, limiting expression                  | Each wish can include 1 image (max 2MB, compressed on both frontend and backend even when under 2MB)                                                 |
| 6   | Xendit Donation Disable       | Mocked Xendit shown as available causes confusion          | Disable Xendit donation config; show maintenance modal when attempting to configure; badge on Xendit tab                                             |

---

## 2. Feature 1 — Inline Template Editing (Preview Mode)

### 2.1 The Problem

Currently, the greeting editor at `/app/greetings/[id]/edit` uses a traditional form: text inputs for title, sender name, and message. Users must click "Preview public page" to see how their greeting looks. This creates a disconnect between editing and previewing.

### 2.2 The Solution

When a user enters the editor, they are **automatically placed in preview mode** — the actual template renders with their greeting data. Editable text areas are **highlighted** (subtle border/glow), and users can click directly on the text to edit it inline. Empty text fields display `[placeholder]` text (e.g., `[Your Title]`, `[Your Message]`).

### 2.3 Implementation Details

#### 2.3.1 Inline Editable Component

**File to create:** `src/components/InlineEditable.tsx`

A reusable component that:

- Renders text normally (with highlight border/glow to indicate editability)
- On click: switches to a `contentEditable` or `<textarea>` overlay
- On blur: saves the value back via callback
- When text is empty: shows `[placeholder]` in muted/italic style
- Props: `value`, `onChange`, `placeholder`, `className`, `multiline`

#### 2.3.2 Template Edit Mode

**Files changed:** All template components

- `src/components/templates/GoldNShiny.tsx`
- `src/components/templates/CrimsonBloom.tsx`
- `src/components/templates/JadeProsperity.tsx`
- `src/components/templates/ValentineRose.tsx`
- `src/components/GreetingRenderer.tsx`

Each template receives an `isEditing` prop (from `TemplateProps`). When `isEditing === true`:

- Title, sender name, and message text become `<InlineEditable>` components
- Editable areas get a subtle dashed border + glow effect (e.g., `border: 1px dashed rgba(255,255,255,0.3)`, `box-shadow: 0 0 8px rgba(255,215,0,0.2)`)
- Hover on editable areas shows a pencil cursor

**File changed:** `src/types/template.ts`

- Add `isEditing?: boolean` and `onFieldChange?: (field: string, value: string) => void` to `TemplateProps`

#### 2.3.3 Editor Page Rewrite

**File changed:** `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx`

- Remove the form-based inputs for title, sender name, and message
- Render the actual template component in a preview container
- Pass `isEditing={true}` and `onFieldChange` callback
- Keep the existing toolbar/sidebar for non-text settings (logo upload, donation toggle, layout variant)
- Auto-save on field change (debounced PATCH to `/api/greetings/[id]`)

#### 2.3.4 Music Selector in Toolbar

**File changed:** `src/components/GreetingToolbar.tsx`

Add a music control to the editor toolbar:

- Dropdown/popover listing selectable music tracks
- Music stored as static audio files in `public/music/`
- Tracks defined in a constant array:

**File to create:** `src/lib/music.ts`

```typescript
export const MUSIC_TRACKS = [
  {
    id: "cny-traditional",
    name: "CNY Traditional",
    src: "/music/cny-traditional.mp3",
    category: "cny",
  },
  {
    id: "cny-modern",
    name: "CNY Modern Beat",
    src: "/music/cny-modern.mp3",
    category: "cny",
  },
  {
    id: "valentine-romantic",
    name: "Romantic Piano",
    src: "/music/valentine-romantic.mp3",
    category: "valentine",
  },
  {
    id: "valentine-upbeat",
    name: "Love Beats",
    src: "/music/valentine-upbeat.mp3",
    category: "valentine",
  },
  {
    id: "general-ambient",
    name: "Ambient Glow",
    src: "/music/general-ambient.mp3",
    category: "general",
  },
  { id: "none", name: "No Music", src: null, category: "all" },
] as const;
```

> [!NOTE]
> The actual `.mp3` audio files are **not included yet** — they will be sourced and added separately (royalty-free). The `src/lib/music.ts` data definition and all UI (selector, playback) will be built now so that adding files later is a drop-in.

**Schema change:** Add `musicTrackId String?` to `Greeting` model in `prisma/schema.prisma`

The selected music track ID is saved to the greeting and used by `GreetingPageWrapper` to play the correct audio on the public page.

---

## 3. Feature 2 — Universal Trial Versions (Every Template Has a Trial)

### 3.1 The Problem

Currently, only 2 templates are marked as `isTrial: true` (CNY Trial and Valentine Trial). Users who want to see how a paid template looks must purchase it first. This limits template discovery and reduces conversion. Additionally, the seed contains 9 templates but only 4 have actual component implementations — the other 5 are config-based placeholders with no working renderer.

### 3.2 The Solution

**Every greeting template is now free to try.** The `isTrial` column is **removed from the Template model** — trial is purely a greeting-level concept. When a user clicks "Try" on any template, a trial greeting is created using that template. Trial restrictions still apply (watermark, branding lock, donation lock), but the user can see exactly what their paid greeting would look like.

The seed is cleaned up to only contain the **4 templates with actual component implementations**:

| ID                    | Name             | Component Slug    | Category  | Price   |
| --------------------- | ---------------- | ----------------- | --------- | ------- |
| `template-cny-gold`   | Gold & Shiny     | `gold-n-shiny`    | cny       | 75,000  |
| `template-cny-crimson` | Crimson Bloom   | `crimson-bloom`   | cny       | 65,000  |
| `template-cny-jade`   | Jade Prosperity  | `jade-prosperity` | cny       | 70,000  |
| `template-val-01`     | Valentine Rose   | `valentine-rose`  | valentine | 65,000  |

### 3.3 Implementation Details

#### 3.3.1 Schema Changes

**File changed:** `prisma/schema.prisma`

- **Remove `isTrial` column from `Template` model** — trial is no longer a template-level concept
- `isTrial` remains on `Greeting` model (where it determines trial restrictions)

#### 3.3.2 Seed Cleanup

**File changed:** `prisma/seed.ts`

Remove these 5 templates (no component implementations):

- `template-cny-trial` — "CNY Trial — Lantern Glow" (dedicated trial, no componentSlug)
- `template-cny-01` — "Classic Red & Gold" (no componentSlug)
- `template-cny-02` — "Modern Fireworks" (no componentSlug)
- `template-cny-03` — "Paper Cut Art" (no componentSlug)
- `template-val-trial` — "Valentine Trial — Rose Whisper" (duplicate of Valentine Rose)

Keep these 4 templates (all with `isTrial` removed since column no longer exists):

- `template-cny-gold` — Gold & Shiny (`gold-n-shiny`)
- `template-cny-crimson` — Crimson Bloom (`crimson-bloom`)
- `template-cny-jade` — Jade Prosperity (`jade-prosperity`)
- `template-val-01` — Valentine Rose (`valentine-rose`)

#### 3.3.3 API Changes

**File changed:** `src/app/api/greetings/route.ts` (POST handler)

Current logic:

```
if template.isTrial → create trial greeting (max 1 per user)
else → create paid greeting
```

New logic:

```
if request.body.asTrial === true:
  → create greeting with isTrial=true, status='published', skip payment
  → enforce max 1 active trial greeting per user per template
else:
  → create paid greeting (existing flow)
```

#### 3.3.4 Templates Page Changes

**File changed:** `src/app/(dashboard)/app/templates/page.tsx`

- Every template card now shows both "Try Free" and "Use Template (Rp X)" buttons
- "Try Free" creates a trial greeting for that template
- Remove the separate "Free Trial" section — trials are integrated into every card
- If user already has an active trial for that template, show "Trial Active" disabled state

#### 3.3.5 TemplateCard Changes

**File changed:** `src/components/TemplateCard.tsx`

- Add "Try Free" secondary button alongside the primary "Use Template" button
- "Try Free" triggers `POST /api/greetings` with `asTrial: true`

#### 3.3.6 Code Cleanup

Update any code that references `template.isTrial`:

- `src/app/api/greetings/route.ts` — remove checks for `template.isTrial`
- `src/components/TemplateCard.tsx` — remove trial-specific rendering based on `template.isTrial`
- `src/app/(dashboard)/app/templates/page.tsx` — remove trial template filtering

---

## 4. Feature 3 — Free Sharing with Unique View Limit

### 4.1 The Problem

Trial greetings are currently blocked for non-owners. This prevents any viral sharing, which is the primary marketing channel for a greeting card platform.

### 4.2 The Solution

Free (trial) greetings **can now be shared**. However, they are limited to **75 unique views** (IP-deduplicated, excluding the owner). After 75 unique visitors:

- The greeting is **locked** (shows a "limit reached" page)
- A **notification** is sent to the owner's dashboard informing them the limit was reached and prompting an upgrade

### 4.3 Implementation Details

#### 4.3.1 Schema Changes

**File changed:** `prisma/schema.prisma`

Add to `Greeting` model:

```prisma
  viewCount         Int      @default(0)  // Unique non-owner view count
  maxFreeViews      Int      @default(75) // Max unique views for trial greetings (configurable per greeting)
  greetingViews     GreetingView[]
```

New model for IP-based deduplication:

```prisma
model GreetingView {
  id         String   @id @default(cuid())
  greetingId String
  ipAddress  String
  viewedAt   DateTime @default(now())

  greeting   Greeting @relation(fields: [greetingId], references: [id], onDelete: Cascade)

  @@unique([greetingId, ipAddress])
}
```

> [!NOTE]
> `maxFreeViews` is stored per-greeting (not as a constant) because the limit may vary by template tier — premium templates might have fewer free views to incentivize faster upgrades.

#### 4.3.2 Public Greeting Page Logic

**File changed:** `src/app/(public)/g/[slug]/page.tsx`

Current logic for trial greetings:

```
if isTrial && viewer is not owner → show blocked page
```

New logic:

```
if isTrial:
  if viewer is owner → render normally (don't count view)
  else:
    → get visitor IP from request headers (x-forwarded-for / x-real-ip / connection)
    → attempt upsert into GreetingView (greetingId + ipAddress unique constraint)
    → if new view (upsert created): increment viewCount atomically
    → if existing view (upsert updated): do nothing (already counted)
    → if viewCount < maxFreeViews: render greeting (with trial banner)
    → else: show "This greeting has reached its free view limit" page
      → CTA: "Create your own greeting" → landing page
```

**Owner detection:** Use `getServerSession(authOptions)` to check if `session?.user?.id === greeting.userId`. Unauthenticated users and non-owners count toward the view limit.

#### 4.3.3 View Count Increment (IP-Deduplicated)

**File changed:** `src/app/(public)/g/[slug]/page.tsx`

```typescript
// Get visitor IP
const forwarded = request.headers.get("x-forwarded-for");
const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

// Attempt to record unique view
try {
  await prisma.greetingView.create({
    data: { greetingId: greeting.id, ipAddress: ip },
  });
  // New unique visitor — increment count
  const updated = await prisma.greeting.update({
    where: { id: greeting.id },
    data: { viewCount: { increment: 1 } },
  });
  // Check if limit just reached
  if (updated.viewCount >= updated.maxFreeViews) {
    await createNotification({ ... });
  }
} catch (e) {
  // Unique constraint violation → already counted, skip
  if (e.code !== "P2002") throw e;
}
```

This ensures:
- Same IP visiting multiple times = 1 count
- Different IPs = different counts
- Owner visits = 0 counts (checked before this logic)

#### 4.3.4 Lock Notification

When `viewCount` reaches `maxFreeViews`, trigger a notification (see Feature 4):

```typescript
await createNotification({
  userId: greeting.userId,
  message: `Your greeting "${greeting.title}" has reached its free view limit of ${greeting.maxFreeViews} unique visitors. Upgrade to unlock unlimited views!`,
  redirectLink: `/app/greetings/${greeting.id}/edit`,
  type: "view_limit_reached",
});
```

#### 4.3.5 Trial Page Changes

**File changed:** `src/app/(public)/g/[slug]/page.tsx`

- Remove the full block for non-owner trial views
- Show the greeting with the existing trial banner
- Add a small counter badge: "X/75 free views used" (visible to owner only)

#### 4.3.6 Analytics Integration

**File changed:** `src/app/(dashboard)/app/analytics/page.tsx`

Show view count and remaining free views for trial greetings in the per-greeting breakdown.

---

## 5. Feature 4 — Notification System

### 5.1 The Problem

There is no mechanism to communicate important events to users within the platform (e.g., view limits reached, payment confirmations, system announcements).

### 5.2 The Solution

Build a lightweight notification system:

- **`Notification` model** in the database
- **Notification service** (`createNotification`) for sending notifications with a message and redirect link
- **Notification list page** at `/app/notifications` accessible from the dashboard
- **Unread badge** on the notifications nav item

> [!NOTE]
> This implementation uses database reads on page load / navigation. No polling interval — the badge and list refresh when the user navigates to a page or manually refreshes. In the future, this will integrate as a **realtime notification system using WebSocket** for instant delivery without page refresh.

### 5.3 Implementation Details

#### 5.3.1 Schema

**File changed:** `prisma/schema.prisma`

```prisma
model Notification {
  id          String   @id @default(cuid())
  userId      String
  message     String
  redirectLink String?
  type        String   @default("info") // "info", "warning", "view_limit_reached", "system"
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}
```

Add to `User` model:

```prisma
  notifications   Notification[]
```

#### 5.3.2 Notification Service

**File to create:** `src/lib/notifications.ts`

```typescript
import { prisma } from "./db";

interface CreateNotificationParams {
  userId: string;
  message: string;
  redirectLink?: string;
  type?: "info" | "warning" | "view_limit_reached" | "system";
}

export async function createNotification(params: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      message: params.message,
      redirectLink: params.redirectLink,
      type: params.type ?? "info",
    },
  });
}
```

> [!IMPORTANT]
> This service currently writes directly to the database. In future iterations, this will be extended to push realtime notifications via WebSocket connections, enabling instant in-app delivery without page refresh.

#### 5.3.3 Notification API Endpoints

**File to create:** `src/app/api/notifications/route.ts`

- `GET /api/notifications` — returns notifications for authenticated user, ordered by `createdAt desc`, includes `unreadCount`
- `GET /api/notifications?countOnly=true` — returns only `{ unreadCount: number }` (lightweight, for badge)
- `PATCH /api/notifications` — mark notification(s) as read (accepts `{ ids: string[] }` or `{ markAllRead: true }`)

#### 5.3.4 Notification List Page

**File to create:** `src/app/(dashboard)/app/notifications/page.tsx`

- Lists all notifications for the current user
- Each notification shows: icon (based on type), message, timestamp, unread dot
- Clicking a notification marks it as read and navigates to `redirectLink` if present
- "Mark all as read" button at the top
- Empty state: "No notifications yet"
- Styled consistently with the dashboard (glass cards, dark mode support)

#### 5.3.5 Dashboard Navigation Update

**File changed:** `src/app/(dashboard)/DashboardShell.tsx`

- Add "Notifications" nav item (Bell icon) with unread count badge
- Badge fetched via `/api/notifications?countOnly=true` on component mount (no polling — refreshes on navigation)
- Links to `/app/notifications`

---

## 6. Feature 5 — Wish Image Uploads

### 6.1 The Problem

When visitors submit wishes on a public greeting page, they can only send text. Adding an image (e.g., a photo, a card) would make wishes more personal and engaging.

### 6.2 The Solution

Each wish can optionally include **1 image** (max **2MB**). The image is **compressed on both the frontend and backend** — compression runs even when the image is already under 2MB to ensure consistent quality and size.

### 6.3 Implementation Details

#### 6.3.1 Schema Changes

**File changed:** `prisma/schema.prisma`

Add to `PublicSubmission` model:

```prisma
  imageUrl    String?   // URL to the uploaded wish image
```

#### 6.3.2 Frontend — Wish Image in SendWishModal

**File changed:** `src/components/SendWishModal.tsx`

- Add an image upload button (camera/image icon) below the comment textarea
- File input accepts `image/*`, limited to 1 file
- **Frontend validation:**
  - Max file size: 2MB (`file.size <= 2 * 1024 * 1024`)
  - Reject non-image files
  - Show error toast if file exceeds 2MB
- **Frontend compression (always applied, even when < 2MB):**
  - Use `canvas` API to resize (max 1200px width) and re-encode as JPEG (quality: 0.8)
  - This ensures consistent output regardless of input size
- Show image thumbnail preview with a remove button after selection
- On submit: upload image via `POST /api/upload` first, then include the returned URL in the wish submission

#### 6.3.3 Backend — Upload Compression

**File changed:** `src/app/api/upload/route.ts`

The upload route **already has** 2MB size validation (`MAX_SIZE = 2 * 1024 * 1024` with 400 error). Changes needed:

- **Add backend compression (always applied):**
  - Use `sharp` library to resize (max 1200px width) and compress as JPEG (quality: 80)
  - This ensures even if frontend compression is bypassed (e.g., direct API calls), files are always optimized
  - Apply compression after the existing size check, before writing to disk
  - Install `sharp` as a dependency

#### 6.3.4 Backend — Wish Submission Update

**File changed:** `src/app/api/public/wishes/route.ts`

- Accept `imageUrl` field in the POST body
- Save `imageUrl` to `PublicSubmission` record
- Validate that `imageUrl` is a valid internal upload URL (starts with `/api/uploads/`)

#### 6.3.5 Display Wish Images

**Files changed:**

- `src/components/FloatingWishes.tsx` — Show small image thumbnail in floating wish bubbles (if present)
- `src/components/WishesModal.tsx` — Show full image in wish detail view (clickable to expand)
- `src/components/SendWishModal.tsx` — Show images in the wish list section

---

## 7. Feature 6 — Disable Xendit Donation

### 7.1 The Problem

All Xendit payment integration is currently mocked. Users can select "Platform" donation mode and see Xendit-related UI, but nothing actually works. This creates confusion and erodes trust.

### 7.2 The Solution

Temporarily disable all Xendit donation features:

1. **Payment settings page:** When user tries to configure Xendit (Platform tab), show a **maintenance modal** explaining it's under maintenance
2. **Donation mode selector in editor:** Remove Xendit/Platform from the selectable donation modes
3. **Tab badge:** Add a "Maintenance" badge on the Xendit/Platform tab to clearly communicate status

### 7.3 Implementation Details

#### 7.3.1 Maintenance Modal Component

**File to create:** `src/components/MaintenanceModal.tsx`

A simple modal with:

- Wrench/construction icon
- Title: "Under Maintenance"
- Message: "Xendit payment integration is currently under maintenance. Please use Manual (QRIS) donation mode in the meantime."
- "Got it" dismiss button
- Consistent glassmorphism styling

#### 7.3.2 Payment Settings Page Changes

**File changed:** `src/app/(dashboard)/app/settings/payments/page.tsx`

- Add "Under Maintenance" badge (amber/orange) next to the "Platform" tab label
- When user clicks the Platform tab: open `MaintenanceModal` instead of switching tabs
- Platform tab content is still accessible but form inputs are disabled with a maintenance overlay
- Prevent saving platform receiver config

#### 7.3.3 Greeting Editor Changes

**File changed:** `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx`

- In the donation mode selector, remove "Platform (Xendit)" as an option
- Only show: "None" and "Manual (QRIS)"
- If a greeting already has `donationMode: "platform"`, show a warning badge: "Xendit is under maintenance — please switch to Manual"

#### 7.3.4 Public Greeting Page

**File changed:** `src/app/(public)/g/[slug]/page.tsx`

- If greeting has `donationMode: "platform"`, treat donations as disabled
- Don't show the donation button for platform-mode greetings

---

## 8. Data Model Changes Summary

All schema changes in one view:

```prisma
// ── Template model changes ──
model Template {
  // REMOVE: isTrial Boolean @default(false)
  // ... rest unchanged ...
}

// ── Greeting model additions ──
model Greeting {
  // ... existing fields ...
  musicTrackId      String?              // Feature 1: selected music track
  viewCount         Int      @default(0) // Feature 3: unique non-owner view count
  maxFreeViews      Int      @default(75)// Feature 3: max unique views (configurable per greeting)
  greetingViews     GreetingView[]       // Feature 3: IP tracking relation
}

// ── New model: GreetingView (IP deduplication) ──
model GreetingView {
  id         String   @id @default(cuid())
  greetingId String
  ipAddress  String
  viewedAt   DateTime @default(now())

  greeting   Greeting @relation(fields: [greetingId], references: [id], onDelete: Cascade)

  @@unique([greetingId, ipAddress])
}

// ── New model: Notification ──
model Notification {
  id           String   @id @default(cuid())
  userId       String
  message      String
  redirectLink String?
  type         String   @default("info")
  isRead       Boolean  @default(false)
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
}

// ── PublicSubmission model additions ──
model PublicSubmission {
  // ... existing fields ...
  imageUrl     String?                  // Feature 5: wish image URL
}

// ── User model additions ──
model User {
  // ... existing fields ...
  notifications Notification[]
}
```

---

## 9. New Files Summary

| File                                             | Feature | Purpose                                                                              |
| ------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `src/components/InlineEditable.tsx`              | 1       | Reusable inline text editing component                                               |
| `src/lib/music.ts`                               | 1       | Static music track definitions (audio files to be sourced separately)                |
| `src/lib/notifications.ts`                       | 4       | Notification creation service (future: realtime via WebSocket)                       |
| `src/app/api/notifications/route.ts`             | 4       | GET/PATCH notification endpoints                                                     |
| `src/app/(dashboard)/app/notifications/page.tsx` | 4       | Notification list page                                                               |
| `src/components/MaintenanceModal.tsx`            | 6       | Xendit maintenance notice modal                                                      |

---

## 10. Files Modified Summary

| File                                                   | Features | Changes                                                                                                                                          |
| ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prisma/schema.prisma`                                 | 1–5      | Remove `isTrial` from Template; add `musicTrackId`/`viewCount`/`maxFreeViews` to Greeting; add `GreetingView` + `Notification` models; add `imageUrl` to PublicSubmission |
| `prisma/seed.ts`                                       | 2        | Remove 5 non-component templates; keep only 4 with componentSlug (3 CNY + 1 Valentine); remove `isTrial` field from all templates               |
| `src/types/template.ts`                                | 1        | Add `isEditing`, `onFieldChange` to TemplateProps                                                                                                |
| `src/components/templates/*.tsx`                       | 1        | Support `isEditing` mode with `InlineEditable` components                                                                                        |
| `src/components/GreetingRenderer.tsx`                  | 1        | Support `isEditing` mode                                                                                                                         |
| `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` | 1,6      | Rewrite to preview mode editing; remove Platform donation option                                                                                 |
| `src/components/GreetingToolbar.tsx`                   | 1        | Add music selector dropdown                                                                                                                      |
| `src/components/GreetingPageWrapper.tsx`               | 1        | Use `musicTrackId` from greeting data                                                                                                            |
| `src/app/api/greetings/route.ts`                       | 2        | Support `asTrial` for any template; remove `template.isTrial` checks                                                                            |
| `src/app/(dashboard)/app/templates/page.tsx`           | 2        | Add "Try Free" on every template card; remove trial template filtering                                                                           |
| `src/components/TemplateCard.tsx`                      | 2        | Add "Try Free" secondary button; remove `template.isTrial` rendering                                                                            |
| `src/app/(public)/g/[slug]/page.tsx`                   | 3,6      | IP-deduplicated view counting, owner detection, view limit lock; disable platform donations                                                      |
| `src/app/(dashboard)/app/analytics/page.tsx`           | 3        | Show view count / remaining free views                                                                                                           |
| `src/app/(dashboard)/DashboardShell.tsx`               | 4        | Add Notifications nav item with badge (fetch on mount, no polling)                                                                               |
| `src/components/SendWishModal.tsx`                     | 5        | Add image upload, frontend compression, preview                                                                                                  |
| `src/app/api/upload/route.ts`                          | 5        | Add backend compression with `sharp` (2MB validation already exists)                                                                             |
| `src/app/api/public/wishes/route.ts`                   | 5        | Accept `imageUrl` field                                                                                                                          |
| `src/components/FloatingWishes.tsx`                    | 5        | Show image thumbnails in bubbles                                                                                                                 |
| `src/components/WishesModal.tsx`                       | 5        | Show images in wish detail                                                                                                                       |
| `src/app/(dashboard)/app/settings/payments/page.tsx`   | 6        | Maintenance badge on Platform tab, block configuration                                                                                           |

---

## 11. Dependency Graph

```
Feature 1 (Inline Editing):
  schema (musicTrackId) → InlineEditable component → template edit modes → editor rewrite → music selector

Feature 2 (Universal Trials):
  schema (remove Template.isTrial) → seed cleanup (4 templates only) → API change (asTrial) → TemplateCard + Templates page UI → code cleanup

Feature 3 (Free Sharing):
  schema (viewCount, maxFreeViews, GreetingView) → public page logic (IP dedup) → lock page → notification trigger
  depends on Feature 4 (notification service)

Feature 4 (Notifications):
  schema (Notification model) → notification service → API endpoints → notification page → dashboard nav badge

Feature 5 (Wish Images):
  schema (imageUrl) → install sharp → upload API compression → SendWishModal image upload → wishes API → display in FloatingWishes/WishesModal

Feature 6 (Xendit Disable):
  MaintenanceModal → payment settings page changes → editor changes → public page changes
  (no schema changes, no dependencies on other features)
```

**Recommended order:** Feature 4 → Feature 3 → Feature 6 → Feature 2 → Feature 5 → Feature 1

- Feature 4 first because Feature 3 depends on the notification service
- Feature 6 is independent and quick
- Feature 2 includes seed cleanup and schema migration (remove Template.isTrial)
- Feature 1 is the most complex and should be done last

---

## 12. Dependencies to Install

| Package | Feature | Purpose                                    |
| ------- | ------- | ------------------------------------------ |
| `sharp` | 5       | Server-side image compression and resizing |

---

## 13. Verification Checklist

### Feature 1 — Inline Editing

- [ ] Open greeting editor → template renders in preview mode
- [ ] Click on title text → inline editor activates with highlight
- [ ] Clear text → `[placeholder]` appears
- [ ] Edit text → auto-saves (check via API / page refresh)
- [ ] Music selector shows in toolbar with track list
- [ ] Selecting music → saves to greeting (playback when audio files are added)

### Feature 2 — Universal Trials

- [ ] Seed only creates 4 templates (3 CNY + 1 Valentine)
- [ ] `isTrial` column no longer exists on Template model
- [ ] Every template card shows "Try Free" button
- [ ] Clicking "Try Free" creates a trial greeting for that template
- [ ] Trial restrictions apply (watermark, branding lock, donation lock)
- [ ] Max 1 active trial per template per user enforced

### Feature 3 — Free Sharing

- [ ] Share a trial greeting link → non-owner can view it
- [ ] View count increments on first visit from a unique IP
- [ ] Same IP visiting again does NOT increment the count
- [ ] Owner views do NOT increment the count
- [ ] After 75 unique views → greeting shows "limit reached" page
- [ ] Notification sent to owner when limit reached
- [ ] Owner sees remaining count in analytics

### Feature 4 — Notifications

- [ ] Notification list page at `/app/notifications` renders
- [ ] Notifications show message, timestamp, unread indicator
- [ ] Clicking notification → marks as read + navigates to redirect link
- [ ] "Mark all as read" button works
- [ ] Dashboard nav shows unread badge count (refreshes on navigation)
- [ ] `createNotification()` service creates records correctly

### Feature 5 — Wish Images

- [ ] Image upload button visible in SendWishModal
- [ ] Selecting image > 2MB → shows error, rejects file
- [ ] Selecting valid image → thumbnail preview shown
- [ ] Frontend compression runs (check output size in DevTools)
- [ ] Submit wish with image → image URL saved to PublicSubmission
- [ ] Backend compression runs (check file size on disk)
- [ ] Image visible in FloatingWishes and WishesModal

### Feature 6 — Xendit Disable

- [ ] Payment settings → Platform tab shows "Under Maintenance" badge
- [ ] Clicking Platform tab → MaintenanceModal opens
- [ ] Greeting editor → donation mode selector only shows None + Manual
- [ ] Existing platform greetings show warning to switch
- [ ] Public page with platform donation mode → donation button hidden
