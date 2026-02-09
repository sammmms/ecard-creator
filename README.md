# CNY Greeting Card MVP

A Next.js fullstack application for generating and sharing animated Chinese New Year greeting cards.

## Features

- **Company Dashboard**: Manage templates, create greetings, and configure payment settings.
- **Greeting Generator**: Select from varied templates with unique assets and animations.
- **Public Greeting Pages**: Animated, interactive greeting cards with standard and glassmorphism designs.
- **Donation System**: Integrated (mock) payment flow for "Angpao" via Xendit or manual QR.
- **Animation**: Powered by Framer Motion for smooth, high-performance interactions.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite (via Prisma)
- **Styling**: Tailwind CSS + Glassmorphism utilities
- **Auth**: NextAuth.js (Credentials)
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Initialize Database**:

    ```bash
    npx prisma db push
    npm run seed  # Seeding is optional but recommended for templates
    # OR
    npx tsx prisma/seed.ts
    ```

3.  **Run Development Server**:

    ```bash
    npm run dev
    ```

4.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000)

### Default Credentials

- **Email**: `demo@company.com`
- **Password**: `password123`

## Usage Guide

1.  **Login**: Use the default credentials to access the dashboard.
2.  **Browse Templates**: Go to "Templates" to see available CNY designs.
3.  **Create Greeting**: Select a template. This creates a draft greeting.
4.  **Pay**: Click "Pay" (Simulated). The greeting will be marked as "published".
5.  **Edit**: Customize the greeting title, sender name, and message.
6.  **Share**: Open the public link (e.g., `/g/xyz123`) to view the animated card.
7.  **Donations**: Configure payment receivers in Settings to enable the "Give Angpao" feature on public cards.

## Directory Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities (DB, Auth, Animations).
- `prisma`: Database schema and seed script.
- `public`: Static assets.

## License

Proprietary.
