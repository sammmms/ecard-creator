# Implementation Plan 9 — Auth Security, Prisma Types, and Paid Extension System

> **Created:** 2026-02-10
> **Status:** Implemented
> **Depends on:** Plans 1–8 (all completed/implemented)

---

## 1. Overview

This plan covers three areas addressed in this session:

1. **Auth Session Validation & Route Protection** — Session callback validates user exists in DB, proxy guards dashboard routes, fetcher auto-signs out on 401
2. **Prisma Client Type Fix** — `db.[model]` returns proper types instead of `any`
3. **Paid Extension System** — Greeting extensions require payment, configurable per-template extension months and pricing

---

## 2. Feature 1 — Auth Session Validation & Route Protection

### 2.1 The Problem

After a database reset, users with existing JWT tokens remained "logged in" — the JWT is stateless and never validated user existence. There was no middleware/proxy guarding dashboard routes, and the frontend didn't handle 401 responses.

### 2.2 The Solution

Three-layer protection:
1. **Server-side**: Session callback verifies user exists in DB before populating session
2. **Route protection**: Proxy (Next.js 16 replaces `middleware.ts` with `proxy.ts`) guards `/app/*` routes
3. **Client-side**: SWR fetcher detects 401 responses and auto-signs out with a toast notification

### 2.3 Implementation

#### Task 1: Session Callback DB Validation ✅

**File:** `src/lib/auth.ts`

- Session callback now checks `db.user.findUnique({ where: { id: token.sub } })` before populating `session.user`
- If user doesn't exist, returns `session.user = undefined` — downstream API checks `!session?.user?.id` and return 401

#### Task 2: Route Protection Proxy ✅

**File:** `src/proxy.ts` (new — replaces deprecated `middleware.ts`)

- Uses `getToken()` from `next-auth/jwt` to validate JWT
- Redirects to `/login?callbackUrl=...` if no valid token
- Matcher: `/app/:path*` (dashboard routes only)
- Exported function named `proxy` per Next.js 16 convention

#### Task 3: Frontend 401 Handling ✅

**File:** `src/lib/fetcher.ts`

- Detects `res.status === 401` and calls `signOut({ callbackUrl: "/login?reason=session_expired" })`
- Throws `Error("Unauthorized")` to prevent SWR from caching stale data

#### Task 4: Session Expired Toast ✅

**File:** `src/app/(auth)/login/page.tsx`

- Detects `?reason=session_expired` query param
- Shows `toast.error("Your session has expired. Please sign in again.")`
- Uses `toastShownRef` to prevent duplicate toasts on re-renders

---

## 3. Feature 2 — Prisma Client Type Fix

### 3.1 The Problem

`db.[model]` (e.g., `db.user`, `db.greeting`) returned `any` type in the IDE, making it impossible to get type hints or catch type errors at development time.

### 3.2 The Solution

Replaced the `declare global { var prisma }` pattern with an explicit type cast.

#### Task 5: Fix db.ts Singleton Pattern ✅

**File:** `src/lib/db.ts`

Before:
```typescript
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
const db = globalThis.prisma ?? prismaClientSingleton();
```

After:
```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const db = globalForPrisma.prisma ?? new PrismaClient();
```

This ensures `db` is typed as `PrismaClient` with full IntelliSense support.

---

## 4. Feature 3 — Paid Extension System

### 4.1 The Problem

Greeting extensions were free and unlimited — clicking "Extend by 6 months" immediately extended without any payment. Extension duration was hardcoded to 180 days for all templates. There was no commercial model for extensions.

### 4.2 The Solution

- Each template now defines `extensionMonths` and `extensionPrice`
- Clicking "Extend by X months" redirects to the payment page (`/app/greetings/[id]/pay?extend=true`)
- The payment page handles extension as a third flow (alongside purchase and upgrade)
- Payment model refactored from one-to-one to one-to-many with a `type` field

### 4.3 Schema Changes

#### Task 6: Template Extension Fields ✅

**File:** `prisma/schema.prisma`

```prisma
model Template {
  // ... existing fields ...
  extensionMonths Int @default(6)
  extensionPrice  Int @default(15000)
}
```

#### Task 7: Payment Model Refactor ✅

**File:** `prisma/schema.prisma`

- `Payment.greetingId` — removed `@unique` constraint (multiple payments per greeting: purchase + extensions)
- `Payment.type` — new field: `"purchase" | "upgrade" | "extension"` (default: `"purchase"`)
- `Greeting.payments` — changed from `Payment?` (one-to-one) to `Payment[]` (one-to-many)

#### Task 8: PaymentType Enum ✅

**File:** `src/lib/constants.ts`

```typescript
export const PaymentType = {
  PURCHASE: "purchase",
  UPGRADE: "upgrade",
  EXTENSION: "extension",
} as const;
```

### 4.4 Payment Service

#### Task 9: extendGreeting Function ✅

**File:** `src/lib/payment-service.ts`

- New `extendGreeting(userId, greetingId, amount, extensionMonths)` function
- Creates a new `Payment` record with `type: "extension"`
- Extends `expiresAt` from `max(current expiresAt, now)` + extensionMonths
- Sets `isExpired: false`

#### Task 10: Refactor createAndCompletePayment ✅

**File:** `src/lib/payment-service.ts`

- Changed from `db.payment.upsert` (required unique `greetingId`) to `findFirst` + create/update
- Auto-detects payment type (upgrade vs purchase) based on greeting's `isTrial` status
- Sets `type` field on payment record

### 4.5 API Changes

#### Task 11: Pay API Extension Mode ✅

**File:** `src/app/api/greetings/[id]/pay/route.ts`

- Reads `?extend=true` query param
- Extension flow: validates greeting is not trial, calls `extendGreeting()` with template's `extensionPrice` and `extensionMonths`
- Purchase/upgrade flow: uses `payments.find()` to check for existing paid purchase/upgrade payment
- Returns `{ isExtend, extensionMonths }` in response

#### Task 12: Update All Payment References ✅

**Files:** Multiple API routes

- `src/app/api/greetings/route.ts` — `payment: true` → `payments: true`
- `src/app/api/greetings/[id]/route.ts` — `payment: true` → `payments: true`
- `src/app/api/greetings/[id]/upgrade/route.ts` — Updated to use `payments.find()` for paid check

### 4.6 UI Changes

#### Task 13: Pay Page Extension Mode ✅

**File:** `src/app/(dashboard)/app/greetings/[id]/pay/page.tsx`

- Supports three modes via query params: default (purchase), `?upgrade=true`, `?extend=true`
- Extension mode shows: template name, extension duration (months), extension price
- Button label: "Extend X Months"
- Success toast: "Extended by X months!"
- Updated `Greeting` interface: `payments: Payment[]` (was `payment?: Payment`)

#### Task 14: Edit Page Redirect to Payment ✅

**File:** `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx`

- `handleExtend()` now redirects to `/app/greetings/[id]/pay?extend=true` instead of calling extend API directly
- Removed `extending` state variable (no longer needed)
- Button text shows template-specific months: "Extend by {extensionMonths} months"

### 4.7 Seed Update ✅

**File:** `prisma/seed.ts`

All 6 templates now include `extensionMonths: 6` and `extensionPrice: 15000`.

---

## 5. Files Modified/Created

| File | Action | Feature |
|------|--------|---------|
| `prisma/schema.prisma` | Modified | Extension fields, Payment refactor |
| `prisma/seed.ts` | Modified | Extension values per template |
| `src/lib/auth.ts` | Modified | Session DB validation |
| `src/lib/db.ts` | Modified | Prisma type fix |
| `src/lib/fetcher.ts` | Modified | 401 auto-signout |
| `src/lib/constants.ts` | Modified | PaymentType enum |
| `src/lib/payment-service.ts` | Modified | extendGreeting + refactored createAndCompletePayment |
| `src/proxy.ts` | Created | Route protection (replaces middleware.ts) |
| `src/app/(auth)/login/page.tsx` | Modified | Session expired toast |
| `src/app/api/greetings/route.ts` | Modified | payments plural |
| `src/app/api/greetings/[id]/route.ts` | Modified | payments plural |
| `src/app/api/greetings/[id]/pay/route.ts` | Modified | Extension flow + payments plural |
| `src/app/api/greetings/[id]/upgrade/route.ts` | Modified | payments plural |
| `src/app/(dashboard)/app/greetings/[id]/pay/page.tsx` | Modified | Extension mode UI |
| `src/app/(dashboard)/app/greetings/[id]/edit/page.tsx` | Modified | Redirect to pay for extension |

---

## 6. Verification

- [x] `npx prisma db push` succeeds
- [x] `npx prisma db seed` succeeds (6 templates with extension fields)
- [x] `npx next build` passes
- [x] Auth: After DB reset, user is redirected to login with "session expired" toast
- [x] Auth: Dashboard routes are guarded by proxy (no valid JWT → login redirect)
- [x] Prisma: `db.user`, `db.greeting` etc. show proper types in IDE
- [x] Extension: "Extend by X months" redirects to payment page
- [x] Extension: Payment page shows extension-specific UI (months, price)
- [x] Extension: After payment, greeting expiry is extended
- [x] Payment: Multiple payments per greeting supported (purchase + extensions)
