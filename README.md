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
- Git

### Cloning the Repository

**Via SSH:**

```bash
git clone git@github.com:your-org/ecard-bizapps.git
cd ecard-bizapps
```

**Via HTTPS:**

```bash
git clone https://github.com/your-org/ecard-bizapps.git
cd ecard-bizapps
```

### Installation

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Set up environment variables**:

    Create a `.env` file in the project root (or copy from `.env.example` if available):

    ```bash
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_secret_key_here
    ```

    > **Note**: For local development, any secret key will work. For production, use a strong, randomly generated secret.

3.  **Initialize the Database**:

    The project uses **SQLite** as the database, managed by Prisma. The database file (`app.db`) is stored in the `data/` directory.

    ```bash
    # Create the database and apply schema
    npx prisma db push

    # Seed the database with demo user and templates (recommended)
    npx tsx prisma/seed.ts
    ```

    > **How `app.db` is created**: When you run `npx prisma db push`, Prisma reads the schema from `prisma/schema.prisma` and creates the SQLite database file at `data/app.db`. This file contains all your application data.

4.  **Run Development Server**:

    ```bash
    npm run dev
    ```

5.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000)

### Default Credentials

After seeding, you can log in with:

- **Email**: `demo@company.com`
- **Password**: `password123`

### Quick Start (TL;DR)

```bash
git clone git@github.com:your-org/ecard-bizapps.git
cd ecard-bizapps
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

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
