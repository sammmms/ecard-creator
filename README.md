# E-Card BizApps

A Next.js fullstack platform for generating and sharing animated greeting cards. Companies create customizable, animated cards (CNY, Valentine's Day, etc.) with optional public wish submissions and donation collection.

## Features

- **Template System** — Multiple animated templates (Crimson Bloom, Gold N' Shiny, Jade Prosperity, Valentine Rose) with color scheme variants
- **Free Trial** — Try templates for free with limited features; upgrade anytime
- **Public Greeting Pages** — Shareable animated cards with glassmorphism UI, fireworks, floating particles
- **Wish Submissions** — Public visitors can send wishes that float as animated bubbles
- **Donation System** — Manual (QRIS/e-wallet) or platform-based (Xendit) donation collection
- **Dashboard** — Stats overview, greeting management, template browsing with filters, analytics
- **Theming** — Seasonal auto-theme (CNY gold, Valentine pink) with dark mode support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite via Prisma |
| Auth | NextAuth.js (Credentials) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Data Fetching | SWR |
| UI Icons | Lucide React |

## Prerequisites

- Node.js 18+ (tested on v22)
- npm

## Quick Start

```bash
git clone git@github.com:your-org/ecard-bizapps.git
cd ecard-bizapps
npm install
cp .env.example .env    # or create .env manually (see below)
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the demo account.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | Secret for signing session tokens (any string for dev) |
| `NEXT_PUBLIC_BASE_URL` | Public-facing URL used for share links and OG images |

### 3. Initialize the database

The project uses SQLite. The database file is stored at `data/app.db`.

```bash
# Create database and apply schema
npx prisma db push

# Seed with demo user + templates
npx tsx prisma/seed.ts
```

### 4. Run the dev server

```bash
npm run dev
```

### Default Login

| Field | Value |
|-------|-------|
| Email | `demo@company.com` |
| Password | `password123` |

## Common Commands

### Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database

```bash
npx prisma db push          # Apply schema changes to database
npx tsx prisma/seed.ts       # Seed database with demo data
npx prisma studio            # Open Prisma Studio (visual DB browser)
```

### Reset Database

To completely reset and re-seed:

```bash
npx prisma db push --force-reset --accept-data-loss
npx tsx prisma/seed.ts
```

This drops all data, recreates tables from the schema, and re-seeds with the demo user and all templates.

### Reset Uploads

Uploaded files (logos, QRIS images) are stored in `public/uploads/`. To clear them:

```bash
rm -rf public/uploads/*
```

## Project Structure

```
ecard-bizapps/
├── prisma/
│   ├── schema.prisma          # Database schema (SQLite)
│   └── seed.ts                # Seed script (demo user + templates)
├── data/
│   └── app.db                 # SQLite database file (gitignored)
├── public/
│   ├── uploads/               # User-uploaded files
│   ├── logo/                  # App logos (themed variants)
│   └── demo/                  # Demo assets
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Authenticated dashboard pages
│   │   │   ├── app/           # /app/* routes
│   │   │   │   ├── page.tsx           # Dashboard overview
│   │   │   │   ├── templates/         # Template browsing + filters
│   │   │   │   ├── greetings/         # Greeting list + edit + pay
│   │   │   │   ├── analytics/         # Analytics page
│   │   │   │   └── settings/          # Payment settings
│   │   │   └── DashboardShell.tsx     # Sidebar layout wrapper
│   │   ├── (public)/          # Public-facing pages
│   │   │   ├── g/[slug]/      # Public greeting page
│   │   │   └── demo/          # Demo page
│   │   ├── api/               # API routes
│   │   │   ├── greetings/     # CRUD + pay + upgrade + wishes
│   │   │   ├── templates/     # Template listing with filters
│   │   │   ├── receiver-configs/  # Payment config (QRIS/e-wallet)
│   │   │   ├── upload/        # File upload/delete
│   │   │   ├── public/        # Public endpoints (no auth)
│   │   │   └── auth/          # NextAuth + register
│   │   ├── globals.css        # Tailwind + glass/theme utilities
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── templates/         # Animated template components
│   │   │   ├── CrimsonBloom.tsx
│   │   │   ├── GoldNShiny.tsx
│   │   │   ├── JadeProsperity.tsx
│   │   │   ├── ValentineRose.tsx
│   │   │   └── TemplateRenderer.tsx
│   │   ├── providers/         # ThemeProvider (seasonal themes)
│   │   ├── Fireworks.tsx      # Canvas particle fireworks
│   │   ├── FloatingWishes.tsx # Animated wish bubbles
│   │   ├── SendWishModal.tsx  # Wish + donation form
│   │   ├── ShareModal.tsx     # Share link modal
│   │   ├── UpgradeModal.tsx   # Trial upgrade prompt
│   │   └── ...                # Reusable UI components
│   └── lib/
│       ├── db.ts              # Prisma client
│       ├── auth.ts            # NextAuth config
│       ├── fetcher.ts         # SWR fetcher
│       ├── animations.ts      # Framer Motion presets
│       └── categories.ts      # Template category constants
└── .env                       # Environment variables
```

## Database Schema

Key models:

- **User** — Authenticated company accounts
- **Template** — Card designs with pricing, category, trial flag
- **Greeting** — Generated cards linked to user + template, with slug for public URL
- **Payment** — Template purchase payments
- **ReceiverConfig** — Donation receiver settings (QRIS images, e-wallet, platform)
- **PublicSubmission** — Wishes sent by public visitors
- **DonationPayment** — Donations made on public greeting pages
- **Event** — Analytics events (views, shares, etc.)

## How It Works

1. **Browse Templates** — Filter by category, pricing, sort; preview live animations
2. **Create Greeting** — Pick a template (free trial or paid), generates a unique slug
3. **Pay** — Mock payment flow marks greeting as published (real Xendit integration planned)
4. **Edit** — Customize title, sender name, message, layout variant, logo, toggles
5. **Share** — Public URL (`/g/{slug}`) shows the full animated greeting
6. **Receive Wishes** — Visitors submit wishes + optional donations on the public page
7. **Analytics** — Track views, wishes, and donations per greeting

## License

Proprietary.
