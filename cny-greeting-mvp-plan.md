# MVP Implementation Plan — CNY Greeting Card Generator (Next.js Fullstack)

> **Purpose:** Agent-friendly build plan for a simple fullstack Next.js app (frontend + backend) to sell **one paid greeting generation** (one shareable greeting instance) and optionally accept **public donations** (manual QR or platform/Xendit invoice with payout deferred to Phase 2).  
> **Extra Requirement:** UI must be **animative** (fireworks, floating lanterns, subtle parallax, etc.) using suitable animation libraries (e.g., **Framer Motion**, **Lottie**, canvas/WebGL where needed).

---

## 0) Goals & Definitions

### What “1 generation” means
- Company pays to generate **one greeting page instance** using a chosen template.
- That greeting page:
  - Has a permanent share link (`/g/[slug]`)
  - Can be visited infinitely
  - Can be shared via link + QR infinitely
- If company wants another greeting page (even same template), they must **buy another generation**.

### Donations (public visitors)
Donation UI appears on the public greeting only if:
- Company enables donation for that greeting, **AND**
- Company has configured a donation receiver for the greeting’s chosen donation mode

Donation modes:
1. **Manual QR / e-wallet (Option 1)**
   - Company uploads QR image / fills e-wallet info
   - Public sees QR/payment instructions
   - **No payment tracking/analytics** in MVP (optional “I already paid” is only UI)
2. **Platform/Xendit invoice (Option 2)**
   - Public creates a payment via Xendit (through internal service)
   - App records donation payment events + statuses
   - **Payout to company is NOT implemented in MVP**
   - Must show user-facing notice: “Funds processed by platform; payout will be available in Phase 2.”

---

## 1) Tech Stack (MVP)

- **Next.js (App Router) + TypeScript**
- UI: Tailwind + shadcn/ui (or similar)
- ORM: **Prisma** (SQLite)
- Auth: NextAuth OR custom email/password with session cookies
- Payments: internal **Xendit service**
- Share QR generation: client-side library for greeting link QR
- Upload storage (for manual QR images): local `/public/uploads` for MVP or a simple file storage adapter

---

## 2) Database: SQLite Rules

### DB file behavior
- SQLite file is **ignored** in `.gitignore`
- App automatically initializes DB on run (Prisma migration or `prisma db push`)
- Storage location (example): `./data/app.db`

### Required setup tasks
- Add `.gitignore` entry: `data/*.db` (and/or `*.db`)
- Ensure `data/` exists or auto-create on boot
- On dev boot:
  - If DB missing → run `prisma db push` or documented `npm run db:init`
- Provide a seed mechanism for templates (script or boot-time seed)

---

## 3) Data Model (SQLite / Prisma)

### Tables (core)
**users**
- `id`
- `email`
- `passwordHash` (if not using OAuth)
- `companyName`
- `createdAt`

**templates**
- `id`
- `event` = `"cny"`
- `name`
- `price` (generation price)
- `previewImageUrl`
- `configJson` (template base + asset layers + allowed variants + animation hints)
- `isActive`

**greetings** (each row == one paid generation result)
- `id`
- `userId`
- `templateId`
- `slug` (unique)
- `title`
- `senderNameDefault` (nullable)
- `messageDefault` (nullable)
- `layoutVariant` (string/int)
- `submissionsEnabled` (bool)
- `donationEnabled` (bool)
- `donationMode` enum: `none | manual | platform`
- `status` enum: `draft | pending_payment | published`
- `createdAt`, `updatedAt`

**payments** (for greeting generation)
- `id`
- `userId`
- `greetingId`
- `amount`
- `currency`
- `provider` = `xendit`
- `status` enum: `pending | paid | failed | expired`
- `externalRef` (idempotency key)
- `checkoutUrl` (nullable)
- `createdAt`, `updatedAt`

### Donations configuration (company-level)
**receiver_configs**
- `id`
- `userId`
- `mode` enum: `manual | platform`
- `status` enum: `inactive | active`

Manual fields (for mode=manual):
- `displayName`
- `qrisImageUrl` (uploaded asset path/url)
- `instructionsText` (optional)
- `ewalletType` (optional)
- `ewalletNumber` (optional)

Platform fields (for mode=platform):
- `displayName`
- `noticeText` (must exist; “payout in Phase 2”)

### Donation payments (public)
**donation_payments** (only for mode=platform)
- `id`
- `greetingId`
- `amount`
- `currency`
- `status` enum: `pending | paid | failed | expired`
- `provider` = `xendit`
- `externalRef`
- `checkoutUrl` (nullable)
- `donorName` (nullable)
- `donorMessage` (nullable)
- `createdAt`, `updatedAt`

### Engagement analytics (MVP)
**events**
- `id`
- `greetingId`
- `type` enum (suggested):
  - `view`
  - `share_copy_link`
  - `share_open_qr`
  - `donation_open`
  - `donation_create`
  - `donation_paid`
  - `submit_comment`
- `metadataJson` (nullable)
- `createdAt`

### Public submissions (optional MVP)
**public_submissions**
- `id`
- `greetingId`
- `name` nullable
- `comment` nullable
- `createdAt`

---

## 4) App Directory Structure (agent-friendly)

Reference layout (agent can adjust, keep responsibilities clear):

```
/app
  /(public)
    /g/[slug]/page.tsx
    /g/[slug]/og/route.tsx           # OpenGraph image (optional)
  /(auth)
    /login/page.tsx
    /register/page.tsx
  /(dashboard)
    /app/page.tsx                    # overview
    /app/templates/page.tsx
    /app/greetings/page.tsx
    /app/greetings/new/page.tsx
    /app/greetings/[id]/edit/page.tsx
    /app/greetings/[id]/pay/page.tsx
    /app/analytics/page.tsx
    /app/settings/payments/page.tsx

  /api
    /auth/...                        # NextAuth or custom
    /templates/route.ts
    /greetings/route.ts
    /greetings/[id]/route.ts
    /greetings/[id]/pay/route.ts     # create generation payment
    /payments/webhook/route.ts        # generation payment webhook
    /g/[slug]/submit/route.ts         # public submissions
    /g/[slug]/donate/route.ts         # create donation (platform mode)
    /donations/webhook/route.ts       # donation webhook
    /events/route.ts                  # record events

/lib
  /db.ts                             # Prisma client
  /auth.ts                           # auth helpers
  /xendit.ts                          # internal service client wrapper
  /slug.ts
  /templates
    /registry.ts                     # list templates / seed loader
    /renderer.tsx                    # render layers + assets + animations
    /animations.ts                   # animation presets/helpers
  /payments
    /verifyWebhook.ts
  /analytics
    /track.ts

/prisma
  schema.prisma
  migrations/ (optional)

/public
  /templates/cny/
    /backgrounds/
    /assets/
    /previews/
  /uploads/                          # manual QR uploads (MVP)

/data
  app.db   (ignored)
```

---

## 5) Pages & UX Requirements (what to build)

### A) Company auth
- Register / login
- Session-protected `/app/*` routes

### B) Templates listing (company)
Route: `/app/templates`
- Show CNY templates (5–8)
- Each template card:
  - Preview image
  - Price per generation
  - CTA: “Generate Greeting” → creates greeting in `pending_payment`, directs to `/pay`

### C) Generate + pay flow
1. Company selects template → create greeting row:
   - status = `pending_payment`
2. Redirect to `/app/greetings/[id]/pay`
3. Pay page:
   - Call API to create payment invoice (internal Xendit service)
   - Show “Pay now” button using `checkoutUrl`
4. Webhook marks payment paid → greeting becomes `published`
5. Success view:
   - show share link
   - show QR (generated from link)
   - show “Edit greeting config” link

### D) Greeting editor (company)
Route: `/app/greetings/[id]/edit`
Configurable fields:
- Title, sender default, message default
- Layout variant selector (A/B/C or random)
- submissionsEnabled toggle (optional)
- donationEnabled toggle
- donationMode selection:
  - none / manual / platform
- Donation mode gating:
  - If donationEnabled AND mode=manual → require manual receiver config active
  - If donationEnabled AND mode=platform → require platform receiver config active **and show notice about payout delay**

### E) Payment receiver settings (company)
Route: `/app/settings/payments`

Two tabs:
1. Manual receiver
   - Upload QR image (QRIS)
   - Optional instructions text
   - Optional e-wallet type + number
   - Activate/Deactivate
2. Platform receiver
   - Display name
   - Required notice text:
     - “Donations are processed by platform. Payout to your account will be enabled in Phase 2.”
   - Activate/Deactivate

### F) Public greeting page
Route: `/g/[slug]`

Layout rules:
- Full-web background (red theme)
- 3–5 assets layered differently per template
- Center card glassmorphism (liquid-glass look)
- Text content visible
- Share controls:
  - Copy link
  - Show QR modal
  - Optional: “Share message builder”
- Submissions module if enabled
- Donation module:
  - Hidden unless donationEnabled + receiver config exists for selected mode

---

## 6) API Endpoints (exact list)

### Templates
- `GET /api/templates?event=cny`
  - returns active templates list

### Greetings (company)
- `POST /api/greetings`
  - body: `{ templateId }`
  - creates greeting with status `pending_payment`
- `GET /api/greetings`
  - list company greetings
- `GET /api/greetings/[id]`
  - fetch greeting details
- `PATCH /api/greetings/[id]`
  - update config fields (title, message, toggles, mode, variant)
  - enforce rule: cannot set donationEnabled true if receiver not configured for mode

### Generation Payment (company)
- `POST /api/greetings/[id]/pay`
  - creates a `payments` row + calls internal Xendit to get checkoutUrl
- `POST /api/payments/webhook`
  - verifies webhook, sets `payments.status=paid`
  - sets `greetings.status=published`

### Public submissions
- `POST /api/g/[slug]/submit`
  - only if `submissionsEnabled`
  - creates `public_submissions` row

### Donation (public)
- `POST /api/g/[slug]/donate`
  - only if donationEnabled AND donationMode=platform AND platform receiver active
  - creates donation invoice via Xendit, returns checkoutUrl
- `POST /api/donations/webhook`
  - verifies, sets `donation_payments.status=paid`
  - writes analytics event `donation_paid`

### Analytics
- `POST /api/events`
  - records event types (view/share/donation_open/etc.)

---

## 7) Enforcement Rules (must implement)

### Publishing access
Public greeting page accessible only if:
- greeting.status = `published`
If not published → show 404 or “Not available”

### Donation gating
Donation module visibility on public page:
- If `donationEnabled` is false → hidden
- If `donationMode = manual`:
  - require manual receiver active
  - show QR image + instructions
  - do **not** track payment completion (MVP)
- If `donationMode = platform`:
  - require platform receiver active
  - show payout notice text (Phase 2)
  - donation creates Xendit invoice and can be tracked

### One generation == one greeting
- Payment record ties to a single `greetingId`
- Once paid, greeting is permanently usable/shareable
- New greeting requires new payment

### DB lifecycle
- App must not crash if DB missing
- Must auto-create DB + run

---

## 8) Template System (assets + layout spec)

### Template rules (for every greeting)
- Full-web background (red-based)
- 3–5 assets minimum
- Each template must have different asset placements
- Center glassmorphism card always present

### Assets pack for CNY (in `/public/templates/cny/assets`)
Minimum set to cover 5–8 templates:
- Lantern (single, pair, string)
- Fireworks burst (2–3 variants)
- Firecracker string
- Plum blossom branch (corner overlays)
- Gold ingots + coin scatter
- Auspicious clouds (corner overlays)
- Chinese knot decoration
- Lion dance / barongsai (2 poses)
- “福” badge / seal
- Sparkle particles overlay
- Optional: zodiac icon (horse) if you want theme variation

### Backgrounds (in `/public/templates/cny/backgrounds`)
- Red silk gradient
- Red patterned repeat
- Red+gold glow
- Paper-cut style
- Curtain / stage style

### Template config JSON (stored per template)
- background: path
- assets: list of layers with x/y/scale/rotate/zIndex
- allowedVariants: array of preset layouts
- typography: font + gold title style
- **animationHints** (new):
  - per asset: `float`, `sway`, `sparkle`, `pulse`, `parallax`, `confetti`
  - global: `fireworksLoop`, `particleDensity`, `reduceMotionSafe`

---

## 9) Animation & Motion Requirements (NEW — must implement)

### Libraries (agent can choose, recommended)
- **Framer Motion**: primary UI + asset animations (float, sway, fade-in, spring)
- **Lottie** (optional): ready-made fireworks/particles JSON animations
- **Canvas/WebGL** (optional advanced): fireworks bursts on user interactions
- **CSS animations**: lightweight looping (sparkles, glow)

### Motion guidelines
- Provide a **smooth animated landing** for the greeting page:
  - Background glow pulse
  - Floating lanterns / subtle swaying ornaments
  - Sparkle particles drifting
- Provide **event-driven animations**:
  - On page load: assets stagger in (fade/slide)
  - On “Open QR”: QR modal pops with spring animation
  - On “Copy link”: small confetti burst or sparkle pulse
  - Optional: fireworks burst on first open or on CTA click
- Add **Reduced Motion** support:
  - Detect `prefers-reduced-motion`
  - Lower intensity or disable looping animations for accessibility/performance

### “Fireworks” requirement (MVP acceptable versions)
Pick one:
1. **Lottie fireworks** overlay loop (lightweight, good-looking)
2. **CSS/Canvas particle fireworks** triggered on interactions (copy/share/donate)
3. **Hybrid**: subtle Lottie loop + occasional burst effect

### Performance constraints
- Avoid heavy continuous animations on low-end devices:
  - cap particles
  - prefer transform/opacity animations
  - keep canvas resolution adaptive

---

## 10) Agent Checklist (build order)

### Step 1 — Boot & DB
- Setup Prisma SQLite
- Auto-create `data/app.db` if missing
- Seed templates on boot (or CLI script)

### Step 2 — Auth + Dashboard shell
- Login/register + protected routes
- Base dashboard layout

### Step 3 — Templates list + Greeting create
- `/app/templates` listing
- Create greeting row (pending_payment)

### Step 4 — Payment generation + webhook
- Create invoice via internal Xendit service
- Webhook verifies + marks greeting published

### Step 5 — Public greeting page renderer + motion
- `/g/[slug]` renders template + glass card + text
- **Add motion system** (Framer Motion baseline)
- Share link + QR modal (animated)

### Step 6 — Receiver settings + donation gating
- Manual receiver config
- Platform receiver config (with Phase 2 notice)
- Greeting editor toggles donation + mode + gating

### Step 7 — Donation flows
- Manual mode: show QR + instructions
- Platform mode: create donation invoice + donation webhook

### Step 8 — Analytics basics
- Track view/share/donation_open/donation_paid/submission

---

## 11) Required User-Facing Notes (must show)

### On platform donation setup (company settings)
Show warning banner:
- “Platform donations are processed by our system. **Payout to your company will be available in Phase 2.** For now, donations are held by the platform.”

### On public donation module (platform mode)
Show small note:
- “Donations are processed securely. Recipient payout availability depends on platform rollout.”

---

## 12) Acceptance Criteria (MVP “done”)

- Company can:
  - register/login
  - browse templates
  - create greeting + pay + publish
  - edit greeting (text + toggles + donation mode)
  - configure manual QR receiver and/or platform receiver
  - see greeting link + QR
- Public can:
  - view published greeting
  - submit name/comment if enabled
  - donate if enabled + receiver configured
- UI:
  - greeting page is **animated**
  - fireworks effect exists (loop or triggered)
  - respects reduced motion preferences
- DB:
  - SQLite DB auto-created if missing
  - DB not committed to git
