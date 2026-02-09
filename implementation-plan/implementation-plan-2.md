# Implementation Plan 2 — Free Trial Template System

> **Status:** Proposal (Pending Review)
> **Created:** 2026-02-09
> **Depends on:** implementation-plan-1.md (MVP foundation)

---

## 1. Concept Overview

### The Problem
Users (companies) need to experience the product before committing to a purchase. Currently, there is no way to preview what a generated greeting looks like without paying for a generation.

### The Solution: Free Trial Template
Provide **one free trial template** that any registered user can generate without payment. The trial greeting is fully functional as a preview but has **hard restrictions** that prevent it from being used for real business purposes. These restrictions are locked behind an **upgrade modal** that encourages the user to purchase a paid generation.

### Core Principle
> "Let them taste it, but make them hungry for more."

The free trial acts as a **live demo** — the user can see exactly what their greeting would look like, interact with it, and share it (with watermark). But the key business features (custom branding, donations, promotions) are gated, pushing conversion to paid.

---

## 2. Free Trial Restrictions

### 2.1 Logo / Branding Lock
| Feature | Paid | Free Trial |
|---------|------|------------|
| Custom company logo on greeting | Yes | **Locked** — shows platform logo/watermark instead |
| Company name in greeting footer | Yes | **Locked** — shows "Powered by E-Card Greeting" |

**Behavior:**
- Logo upload field is visible but disabled (grayed out)
- Clicking it triggers the **Upgrade Modal**
- Public greeting page shows a subtle "Powered by E-Card Greeting" watermark badge

### 2.2 Promotion / Sharing Lock
| Feature | Paid | Free Trial |
|---------|------|------------|
| Custom share message | Yes | **Locked** — uses default share text |
| Share link without watermark | Yes | **Locked** — share link appends `?trial=1` and public page shows trial banner |
| WhatsApp share with custom text | Yes | **Locked** — clicking triggers Upgrade Modal |
| QR code download | Yes | **Locked** — QR has watermark overlay |

**Behavior:**
- Share button works but shows a top banner: "This is a trial greeting. Upgrade to remove branding."
- Copy Link works but the URL produces a page with a trial badge
- WhatsApp share button shows Upgrade Modal

### 2.3 Payment / Donation Lock
| Feature | Paid | Free Trial |
|---------|------|------------|
| Enable donations toggle | Yes | **Locked** — toggle is disabled |
| Configure donation receiver | Yes | **Locked** — settings page shows lock icon |
| Public can donate | Yes | **Blocked** — no donation UI on trial greetings |

**Behavior:**
- Donation toggle on greeting editor is disabled with a lock icon
- Clicking it opens the **Upgrade Modal**
- Public greeting page never shows "Give Angpao" button for trial greetings

### 2.4 Content Limitations
| Feature | Paid | Free Trial |
|---------|------|------------|
| Choose any template | Yes | **Limited** — only 1 trial-designated template |
| Unlimited greeting text | Yes | Yes (no restriction) |
| Layout variant selection | Yes | **Limited** — only default variant |

---

## 3. The Upgrade Modal

### Design
A centered modal with glassmorphism styling, consistent with the app's design language.

### Content Structure
```
┌─────────────────────────────────────────┐
│              [Lock Icon]                 │
│                                          │
│      Unlock Full Greeting Power          │
│                                          │
│  Your trial greeting is a preview.       │
│  Upgrade to unlock:                      │
│                                          │
│  ✓ Custom company logo & branding        │
│  ✓ Shareable links without watermark     │
│  ✓ Digital Angpao (donation) feature     │
│  ✓ Access to all premium templates       │
│  ✓ WhatsApp & QR sharing                 │
│                                          │
│  ┌─────────────────────────────────┐     │
│  │     Choose a Template & Pay     │     │
│  └─────────────────────────────────┘     │
│                                          │
│         Maybe later (dismiss)            │
└─────────────────────────────────────────┘
```

### Trigger Points
1. Clicking disabled logo upload
2. Clicking disabled donation toggle
3. Clicking WhatsApp share on trial greeting
4. Clicking layout variant selector (if locked)
5. From the trial greeting's public page banner ("Upgrade" link)
6. Dashboard overview: "Your trial is active — upgrade to go live" banner

### CTA Behavior
- "Choose a Template & Pay" → navigates to `/app/templates` (filtered to paid templates)
- "Maybe later" → dismisses modal, returns to current view

---

## 4. Data Model Changes

### Template Model Enhancement
```prisma
model Template {
  // ... existing fields
  isTrial     Boolean  @default(false)  // NEW: marks as free trial template
}
```

### Greeting Model Enhancement
```prisma
model Greeting {
  // ... existing fields
  isTrial     Boolean  @default(false)  // NEW: inherited from template on creation
}
```

### Business Rules
- `isTrial = true` on Template → when user generates from this template, Greeting.isTrial = true
- `isTrial = true` on Greeting → skip payment flow, status goes directly to `published`
- `isTrial = true` → all restriction checks apply on both dashboard and public pages
- Each user can only have **1 active trial greeting** (enforce in API)

---

## 5. Implementation Steps

### Step 1: Schema & Migration
- [ ] Add `isTrial` to Template and Greeting models
- [ ] Run `prisma db push`
- [ ] Update template seed to include 1 trial template

### Step 2: Trial Generation Flow
- [ ] On `/app/templates` page: show trial template with "Try Free" badge instead of price
- [ ] `POST /api/greetings` — if template.isTrial: set greeting.isTrial=true, skip payment, set status=published
- [ ] Enforce max 1 trial greeting per user
- [ ] Skip redirect to `/pay` for trial greetings → go directly to `/app/greetings/[id]/edit`

### Step 3: Upgrade Modal Component
- [ ] Create `<UpgradeModal>` component with glassmorphism design
- [ ] Accept `isOpen`, `onClose`, `trigger` props
- [ ] List locked features with checkmarks
- [ ] CTA button navigates to templates page
- [ ] Track modal opens via events API (`upgrade_modal_view`)

### Step 4: Dashboard Restrictions
- [ ] Greeting editor: disable logo upload, donation toggle, variant selector for trial greetings
- [ ] Show lock icons on disabled fields
- [ ] Wire lock icon clicks to open UpgradeModal
- [ ] Dashboard overview: show trial banner if user has active trial

### Step 5: Public Page Restrictions
- [ ] GreetingRenderer: check `greeting.isTrial`
- [ ] If trial: show "Powered by E-Card Greeting" watermark badge
- [ ] If trial: hide "Give Angpao" button entirely
- [ ] If trial: show top banner "This is a trial greeting"
- [ ] Share link includes `?trial=1` for trial greetings

### Step 6: Templates Page Enhancement
- [ ] Visually distinguish trial vs paid templates
- [ ] Trial template: green "Free" badge, "Try Now" button
- [ ] Paid templates: price tag, "Use Template" button
- [ ] If user already has trial greeting: show "Trial Used" disabled state

---

## 6. Additional Ideas & Enhancements

### 6.1 Trial Expiry (Optional)
- Trial greetings could auto-expire after **7 days** (status → `expired`)
- Show countdown on dashboard: "Your trial expires in X days"
- After expiry, public page shows "This greeting has expired. Contact the sender."
- This creates urgency to convert

### 6.2 Trial Analytics Dashboard
- Show trial users a "lite" analytics view:
  - Total views (visible)
  - Shares (visible)
  - Donations data: "Unlock with paid plan" placeholder
- This teases the value of analytics, driving conversion

### 6.3 Watermark Customization for Paid
- Paid greetings get a subtle "Made with E-Card Greeting" in the footer (removable in a premium tier)
- Trial greetings get a more prominent watermark
- This differentiates tiers visually

### 6.4 Social Proof on Trial Page
- On the trial greeting's public page, add a subtle footer:
  - "Join 500+ companies sending digital greetings"
  - Creates FOMO and validates the product

### 6.5 Referral Bonus
- If a trial user shares their greeting link and the recipient signs up → give the referrer a discount code
- Track via `?ref=[userId]` parameter on greeting links
- Discount code applied at payment for a paid template

### 6.6 Template Preview Gallery
- Let users browse ALL paid templates in a preview gallery (read-only, no generation)
- Each template shows a live animated preview (using GreetingRenderer with sample data)
- "Use This Template" → if not logged in, redirect to register; if logged in, go to payment flow
- This lets the trial act as a gateway to the full catalog

### 6.7 Upgrade Nudge Emails
- After trial generation, send a follow-up email sequence:
  - Day 0: "Your trial greeting is live!"
  - Day 3: "Your greeting got X views — imagine the impact with a custom one"
  - Day 6: "Your trial expires tomorrow" (if expiry is enabled)
- Requires email integration (Phase 2+)

### 6.8 A/B Test Trial Restrictions
- Test different restriction levels:
  - **Loose:** Trial allows donations but takes a higher platform cut
  - **Strict:** Trial blocks all monetization
  - Track conversion rates per variant

### 6.9 Free Trial with Company Verification
- Require company email domain (not gmail/yahoo) for trial
- Verified companies get a slightly less restricted trial (e.g., can use company name but not logo)
- Filters out casual/non-business users

### 6.10 Multi-Event Template Trials
- As the platform adds more events (Eid, Christmas, Diwali), each event gets its own trial template
- User can try 1 free template per event type
- Broadens the funnel for each seasonal campaign

---

## 7. Completion Checklist from Plan 1 (Prerequisites)

These items from implementation-plan-1 should be completed before starting Plan 2:

| Prerequisite | Plan 1 Ref | Status | Required For |
|-------------|-----------|--------|-------------|
| Template seeding | 1.5 | :x: | Need at least 1 trial + paid templates in DB |
| Register API | 2.3 | :construction: | Users must be able to create accounts |
| Dashboard overview data | 2.5 | :construction: | Trial banner needs context |
| Share functionality | 5.6 | :construction: | Watermark on share links |
| GreetingRenderer assets | 5.4 | :construction: | Visual distinction between trial/paid |
| Receiver config API | 6.4 | :x: | Donation lock needs config check |

---

## 8. UX Flow Diagram

```
User registers
     │
     ▼
Dashboard shows "Try your first greeting for free!"
     │
     ▼
User clicks "Try Now" on trial template
     │
     ▼
Greeting created (isTrial=true, status=published, no payment)
     │
     ▼
Redirected to greeting editor
     │
     ├── Can edit: title, message, sender name ✓
     ├── Cannot edit: logo (🔒 → Upgrade Modal)
     ├── Cannot enable: donations (🔒 → Upgrade Modal)
     └── Cannot change: layout variant (🔒 → Upgrade Modal)
     │
     ▼
User views public greeting
     │
     ├── Greeting works! But has watermark + trial banner
     ├── Share works, but with trial branding
     └── No donation button
     │
     ▼
User sees value, clicks "Upgrade" anywhere
     │
     ▼
Upgrade Modal → "Choose a Template & Pay"
     │
     ▼
User selects paid template → normal payment flow
     │
     ▼
Paid greeting: full features, no restrictions
```

---

## 9. Technical Notes

### Trial Detection
```typescript
// Check if greeting is trial (use throughout app)
const isTrial = greeting.isTrial === true;

// In API: enforce max 1 trial per user
const existingTrial = await prisma.greeting.findFirst({
  where: { userId, isTrial: true, status: { not: "expired" } }
});
if (existingTrial) {
  return Response.json({ error: "Trial already used" }, { status: 400 });
}
```

### Upgrade Modal Tracking
```typescript
// Track when users see the upgrade modal
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    greetingId: greeting.id,
    type: "upgrade_modal_view",
    metadata: JSON.stringify({ trigger: "donation_toggle" })
  })
});
```

### Public Page Trial Badge
```tsx
{greeting.isTrial && (
  <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-sm z-50">
    This is a trial greeting.
    <a href="/register" className="underline ml-1 font-bold">
      Create your own →
    </a>
  </div>
)}
```

---

## 10. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Trial-to-paid conversion | >15% | Users who generate paid greeting after trial |
| Upgrade modal click-through | >25% | CTA clicks / modal opens |
| Trial greeting shares | >3 per trial | Share events per trial greeting |
| Time to conversion | <48 hours | Time between trial creation and first paid generation |
| Trial completion rate | >80% | Users who complete trial editor after generating |
