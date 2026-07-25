# Langgan — Implementation Plan (v3)

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**App Name:** **Langgan** (Indonesian for "subscribe/subscription")

**Goal:** Build a dark-mode-first subscription management app with auth, tracking all recurring payments in IDR, showing upcoming due dates, and calculating total monthly/yearly costs.

**Architecture:** Next.js 16 App Router + Server Actions, Neon PostgreSQL via Prisma ORM, Better Auth for authentication, deployed on Netlify.

**Tech Stack:**
- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** Neon PostgreSQL + Prisma ORM
- **Auth:** Better Auth (email/password + social providers)
- **Styling:** Tailwind CSS 4 (dark mode as default)
- **UI:** shadcn/ui components
- **Notifications:** Browser push notifications via Notification API
- **Deploy:** Netlify
- **Currency:** IDR (Indonesian Rupiah)

---

## Database Schema

### `users` table (managed by Better Auth)

Better Auth auto-creates `user`, `session`, `account`, `verification` tables. We extend the user with a profile relation.

### `categories` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | String | e.g. "Entertainment", "Productivity" |
| `color` | String | Hex color for badge |
| `icon` | String? | Optional emoji/icon |
| `userId` | UUID | FK → users.id |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Unique constraint:** `(userId, name)` — each user has unique category names

### `subscriptions` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | String | e.g. "Netflix", "Spotify" |
| `price` | Decimal(12,2) | Cost per cycle (IDR, no decimals needed but keeps flexibility) |
| `currency` | String | Default "IDR" |
| `billingCycle` | Enum | `daily`, `weekly`, `monthly`, `yearly` |
| `nextPaymentDate` | DateTime | Next due date |
| `categoryId` | UUID? | FK → categories.id (nullable — uncategorized allowed) |
| `logoUrl` | String? | Optional: brand logo URL |
| `color` | String? | Optional: hex color for card |
| `notes` | String? | Optional notes |
| `isActive` | Boolean | Default true, soft-delete |
| `userId` | UUID | FK → users.id |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

---

## Tasks

### Task 1: Project Setup

**Objective:** Initialize Next.js 15 project with Prisma, Tailwind, and shadcn/ui

**Files:**
- Create: entire project scaffold

**Step 1: Create Next.js project**

```bash
npx create-next-app@latest subtracker --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd subtracker
```

**Step 2: Initialize Prisma with Neon**

```bash
npm install prisma @prisma/client
npx prisma init
```

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Categories ───────────────────────────────────────────

model Category {
  id            String         @id @default(uuid()) @db.Uuid
  name          String
  color         String         @default("#6366f1")
  icon          String?
  userId        String         @db.Uuid
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscriptions Subscription[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@unique([userId, name])
  @@map("categories")
}

// ─── Subscriptions ────────────────────────────────────────

model Subscription {
  id              String        @id @default(uuid()) @db.Uuid
  name            String
  price           Decimal       @db.Decimal(12, 2)
  currency        String        @default("IDR")
  billingCycle    BillingCycle
  nextPaymentDate DateTime      @db.Date
  categoryId      String?       @db.Uuid
  category        Category?     @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  logoUrl         String?
  color           String?
  notes           String?
  isActive        Boolean       @default(true)
  userId          String        @db.Uuid
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([userId])
  @@index([nextPaymentDate])
  @@map("subscriptions")
}

enum BillingCycle {
  daily
  weekly
  monthly
  yearly
}

// ─── Users (extended by Better Auth) ──────────────────────

model User {
  id            String         @id @db.Uuid
  name          String?
  email         String         @unique
  emailVerified Boolean        @default(false)
  image         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  accounts      Account[]
  sessions      Session[]
  categories    Category[]
  subscriptions Subscription[]

  @@map("user")
}

model Account {
  id                String  @id @default(uuid()) @db.Uuid
  accountId         String
  providerId        String
  userId            String  @db.Uuid
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken       String?
  refreshToken      String?
  idToken           String?
  accessTokenExpiresAt DateTime?
  refreshTokenExpiresAt DateTime?
  scope             String?
  password          String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([providerId, accountId])
  @@map("account")
}

model Session {
  id           String   @id @default(uuid()) @db.Uuid
  expiresAt    DateTime
  token        String   @unique
  userId       String   @db.Uuid
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
  @@map("session")
}

model Verification {
  id         String   @id @default(uuid()) @db.Uuid
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, value])
  @@map("verification")
}
```

**Step 3: Set up `.env`**

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
```

**Step 4: Install shadcn/ui**

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label select dialog table badge dropdown-menu avatar separator
```

**Step 5: Run migration**

```bash
npx prisma migrate dev --name init
```

**Verification:** `npx prisma migrate status` shows "fully up to date"

---

### Task 2: Landing Page

**Objective:** Build a modern, dark-mode landing page for Langgan with hero section, features, and CTA to sign up

**Files:**
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/components/landing/hero.tsx`
- Create: `src/components/landing/features.tsx`
- Create: `src/components/landing/pricing.tsx`
- Create: `src/components/landing/navbar.tsx`
- Create: `src/components/landing/footer.tsx`

**Step 1: Create marketing layout (no auth required)**

```tsx
// src/app/(marketing)/layout.tsx
import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Langgan — Kelola Semua Langganan dalam Satu Tempat",
  description: "Pantau, kelola, dan kendalikan semua langganan Anda. Ketahui kapan harus bayar, berapa total pengeluaran bulanan, dan hemat uang Anda.",
  openGraph: {
    title: "Langgan — Kelola Semua Langganan",
    description: "Satu tempat untuk semua langganan Anda.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar />
      {children}
      <LandingFooter />
    </div>
  );
}
```

**Step 2: Create landing page**

```tsx
// src/app/(marketing)/page.tsx
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
    </>
  );
}
```

**Step 3: Create Hero component**

```tsx
// src/components/landing/hero.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
          <Sparkles className="h-4 w-4" />
          <span>Kelola langganan dengan cerdas</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-white">Semua langganan</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            dalam satu tempat
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pantau semua langganan Anda — Netflix, Spotify, dan lainnya.
          Ketahui kapan harus bayar, berapa total pengeluaran,
          dan jangan pernah ketinggalan pembayaran lagi.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
              Mulai Gratis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
              Masuk
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div>
            <div className="text-2xl font-bold text-white">IDR</div>
            <div className="text-sm text-neutral-500">Mata uang</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-neutral-500">Pantauan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white"> Gratis</div>
            <div className="text-sm text-neutral-500">Untuk mulai</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Create Features component**

```tsx
// src/components/landing/features.tsx
import { CreditCard, Bell, BarChart3, Folder, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Pantau Semua Langganan",
    description: "Satu dashboard untuk semua langganan Anda. Netflix, Spotify, Adobe, dan lainnya — semua terlihat jelas.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Bell,
    title: "Pengingat Pembayaran",
    description: "Dapatkan notifikasi sebelum jatuh tempo. Tidak pernah ketinggalan pembayaran lagi.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "Analisis Pengeluaran",
    description: "Lihat total pengeluaran bulanan dan tahunanan. Ketahui ke mana uang Anda pergi.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Folder,
    title: "Kategorikan",
    description: "Kelompokkan langganan berdasarkan kategori — Hiburan, Produktivitas, Keamanan, dan lainnya.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Aman & Privat",
    description: "Data Anda aman. Autentikasi terenkripsi dan tidak ada data yang dibagikan ke pihak ketiga.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Akses dari mana saja. Dirancang responsif untuk ponsel dan tablet.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fitur yang Anda butuhkan
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola langganan dalam satu aplikasi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 5: Create Pricing section (free tier)**

```tsx
// src/components/landing/pricing.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Gratis untuk dimulai
        </h2>
        <p className="text-neutral-400 text-lg mb-12">
          Mulai kelola langganan Anda tanpa biaya.
        </p>

        <Card className="bg-neutral-900 border-neutral-800 max-w-md mx-auto">
          <CardContent className="p-8">
            <div className="text-4xl font-bold text-white mb-2">Gratis</div>
            <p className="text-neutral-400 mb-6">Selamanya</p>

            <div className="space-y-3 text-left mb-8">
              {[
                "Unlimited subscriptions",
                "Category management",
                "Payment reminders",
                "Monthly/yearly reports",
                "IDR currency support",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="text-neutral-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/register">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Mulai Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```

**Step 6: Create Navbar**

```tsx
// src/components/landing/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-white text-lg">Langgan</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-neutral-400 hover:text-white">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Daftar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

**Step 7: Create Footer**

```tsx
// src/components/landing/footer.tsx
export function LandingFooter() {
  return (
    <footer className="border-t border-neutral-800 py-8 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          © 2026 Langgan. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-neutral-500">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
```

**Verification:** `npm run build` passes, landing page renders at `/`

---

### Task 3: Prisma Client Singleton + Database Utility

**Objective:** Create a shared Prisma client to avoid multiple instances in dev

**Files:**
- Create: `src/lib/prisma.ts`

**Step 1: Create Prisma singleton**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Verification:** TypeScript compiles with `npx tsc --noEmit`

---

### Task 4: Better Auth Setup

**Objective:** Configure Better Auth with email/password authentication and Prisma adapter

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...all]/route.ts`

**Step 1: Install Better Auth**

```bash
npm install better-auth
```

**Step 2: Create auth config**

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
  },
  trustedOrigins: [
    "http://localhost:3000",
    // Add production URL here
  ],
});
```

**Step 3: Create API route handler**

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";

const handler = auth.handler;

export { handler as GET, handler as POST };
```

**Step 4: Add auth middleware**

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protect dashboard routes
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if already logged in
  if (session && (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

**Step 5: Install Better Auth client**

```bash
npm install better-auth/client
```

**Step 6: Create auth client**

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signOut, useSession } = authClient;
```

**Verification:** `npm run build` passes, `/api/auth` endpoint responds

---

### Task 5: Auth Pages (Login + Register)

**Objective:** Build login and registration pages

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/components/auth/register-form.tsx`

**Step 1: Create login page**

```tsx
// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SubTracker",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">SubTracker</h1>
          <p className="text-neutral-400 mt-2">Sign in to manage your subscriptions</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
```

**Step 2: Create login form**

```tsx
// src/components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 3: Create register page + form** (similar pattern to login)

**Verification:** `npm run build` passes

---

### Task 6: Subscription CRUD Server Actions

**Objective:** Create server actions for categories and subscriptions

**Files:**
- Create: `src/lib/actions/categories.ts`
- Create: `src/lib/actions/subscriptions.ts`
- Create: `src/lib/validations/subscription.ts`
- Create: `src/lib/validations/category.ts`

**Step 1: Install zod**

```bash
npm install zod
```

**Step 2: Create category validation + actions**

```typescript
// src/lib/validations/category.ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().default("#6366f1"),
  icon: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
```

```typescript
// src/lib/actions/categories.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getCategories() {
  const userId = await requireUser();
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: CategoryInput) {
  const userId = await requireUser();
  const validated = categorySchema.parse(data);
  const category = await prisma.category.create({
    data: { ...validated, userId },
  });
  revalidatePath("/dashboard");
  return category;
}

export async function updateCategory(id: string, data: CategoryInput) {
  const userId = await requireUser();
  const validated = categorySchema.parse(data);
  const category = await prisma.category.update({
    where: { id, userId },
    data: validated,
  });
  revalidatePath("/dashboard");
  return category;
}

export async function deleteCategory(id: string) {
  const userId = await requireUser();
  // Unlink subscriptions before deleting
  await prisma.subscription.updateMany({
    where: { categoryId: id, userId },
    data: { categoryId: null },
  });
  await prisma.category.delete({
    where: { id, userId },
  });
  revalidatePath("/dashboard");
}
```

**Step 3: Create subscription validation + actions**

```typescript
// src/lib/validations/subscription.ts
import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.coerce.number().positive("Price must be positive"),
  currency: z.string().default("IDR"),
  billingCycle: z.enum(["daily", "weekly", "monthly", "yearly"]),
  nextPaymentDate: z.coerce.date(),
  categoryId: z.string().uuid().optional().nullable(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  color: z.string().optional(),
  notes: z.string().optional(),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
```

```typescript
// src/lib/actions/subscriptions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { subscriptionSchema, type SubscriptionInput } from "@/lib/validations/subscription";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getSubscriptions() {
  const userId = await requireUser();
  return prisma.subscription.findMany({
    where: { userId, isActive: true },
    include: { category: true },
    orderBy: { nextPaymentDate: "asc" },
  });
}

export async function getSubscriptionById(id: string) {
  const userId = await requireUser();
  return prisma.subscription.findFirst({
    where: { id, userId },
    include: { category: true },
  });
}

export async function createSubscription(data: SubscriptionInput) {
  const userId = await requireUser();
  const validated = subscriptionSchema.parse(data);
  const sub = await prisma.subscription.create({
    data: { ...validated, userId },
    include: { category: true },
  });
  revalidatePath("/dashboard");
  return sub;
}

export async function updateSubscription(id: string, data: SubscriptionInput) {
  const userId = await requireUser();
  const validated = subscriptionSchema.parse(data);
  const sub = await prisma.subscription.update({
    where: { id, userId },
    data: validated,
    include: { category: true },
  });
  revalidatePath("/dashboard");
  return sub;
}

export async function deleteSubscription(id: string) {
  const userId = await requireUser();
  await prisma.subscription.update({
    where: { id, userId },
    data: { isActive: false },
  });
  revalidatePath("/dashboard");
}

export async function getMonthlyTotal() {
  const userId = await requireUser();
  const subs = await prisma.subscription.findMany({
    where: { userId, isActive: true },
  });

  return subs.reduce((total, sub) => {
    const monthly =
      sub.billingCycle === "monthly" ? sub.price.toNumber() :
      sub.billingCycle === "yearly" ? sub.price.toNumber() / 12 :
      sub.billingCycle === "weekly" ? sub.price.toNumber() * 4.33 :
      sub.billingCycle === "daily" ? sub.price.toNumber() * 30 : 0;
    return total + monthly;
  }, 0);
}
```

**Verification:** `npx tsc --noEmit` passes

---

### Task 7: Dashboard Layout + Total Cost Cards

**Objective:** Build the main dashboard showing total monthly/yearly spend with IDR formatting

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(dashboard)/dashboard/page.tsx`
- Create: `src/components/dashboard/total-cards.tsx`
- Create: `src/lib/utils.ts` (IDR formatter)

**Step 1: Create IDR formatter utility**

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIDRCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `Rp${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (amount >= 1_000) {
    return `Rp${(amount / 1_000).toFixed(0)}rb`;
  }
  return formatIDR(amount);
}
```

**Step 2: Create dashboard layout (auth-protected)**

```tsx
// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNav user={session.user} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
```

**Step 3: Create total-cards with IDR**

```tsx
// src/components/dashboard/total-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { formatIDR } from "@/lib/utils";

interface TotalCardsProps {
  monthlyTotal: number;
  yearlyTotal: number;
  subscriptionCount: number;
}

export function TotalCards({ monthlyTotal, yearlyTotal, subscriptionCount }: TotalCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">Monthly Spend</CardTitle>
          <DollarSign className="h-4 w-4 text-neutral-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatIDR(monthlyTotal)}</div>
          <p className="text-xs text-neutral-500">per month</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">Yearly Spend</CardTitle>
          <Calendar className="h-4 w-4 text-neutral-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatIDR(yearlyTotal)}</div>
          <p className="text-xs text-neutral-500">per year</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">Active Subscriptions</CardTitle>
          <TrendingUp className="h-4 w-4 text-neutral-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{subscriptionCount}</div>
          <p className="text-xs text-neutral-500">active</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Verification:** `npm run build` passes

---

### Task 8: Category CRUD (Full)

**Objective:** Build category management — list, create, edit, delete with color picker

**Files:**
- Create: `src/components/dashboard/category-list.tsx`
- Create: `src/components/dashboard/add-category-dialog.tsx`
- Create: `src/components/dashboard/edit-category-dialog.tsx`
- Create: `src/app/(dashboard)/dashboard/categories/page.tsx`

**Step 1: Category list component**

```tsx
// src/components/dashboard/category-list.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/categories";
import { useRouter } from "next/navigation";
import { EditCategoryDialog } from "./edit-category-dialog";
import type { Category } from "@prisma/client";

export function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Subscriptions will become uncategorized.")) return;
    await deleteCategory(id);
    router.refresh();
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p>No categories yet</p>
        <p className="text-sm mt-1">Create one to organize your subscriptions</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <div>
              <p className="font-medium text-white">{cat.name}</p>
              {cat.icon && <p className="text-xs text-neutral-400">{cat.icon}</p>}
            </div>
          </div>
          <div className="flex gap-1">
            <EditCategoryDialog category={cat} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-red-500"
              onClick={() => handleDelete(cat.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Add category dialog** (name + color picker + icon emoji)

**Step 3: Edit category dialog** (pre-filled)

**Step 4: Categories page**

```tsx
// src/app/(dashboard)/dashboard/categories/page.tsx
import { getCategories } from "@/lib/actions/categories";
import { CategoryList } from "@/components/dashboard/category-list";
import { AddCategoryDialog } from "@/components/dashboard/add-category-dialog";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-neutral-400 mt-1">Organize your subscriptions</p>
        </div>
        <AddCategoryDialog />
      </div>
      <CategoryList categories={categories} />
    </div>
  );
}
```

**Verification:** `npm run build` passes

---

### Task 9: Subscription List + Cards (with category relation)

**Objective:** Display all subscriptions in a card grid with category badges, edit/delete actions

**Files:**
- Create: `src/components/dashboard/subscription-list.tsx`
- Create: `src/components/dashboard/subscription-card.tsx`
- Create: `src/app/(dashboard)/dashboard/page.tsx`

**Step 1: Subscription card with category badge**

```tsx
// src/components/dashboard/subscription-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditSubscriptionDialog } from "./edit-subscription-dialog";
import { Trash2 } from "lucide-react";
import { deleteSubscription } from "@/lib/actions/subscriptions";
import { formatIDR } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Subscription, Category } from "@prisma/client";

type SubscriptionWithCategory = Subscription & { category: Category | null };

export function SubscriptionCard({ subscription }: { subscription: SubscriptionWithCategory }) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteSubscription(subscription.id);
    router.refresh();
  };

  const daysUntilPayment = Math.ceil(
    (new Date(subscription.nextPaymentDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: subscription.color || subscription.category?.color || "#6366f1" }}
            >
              {subscription.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-white">{subscription.name}</h3>
              <p className="text-sm text-neutral-400">
                {formatIDR(subscription.price.toNumber())}/{subscription.billingCycle}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <EditSubscriptionDialog subscription={subscription} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-neutral-800 text-neutral-300">
              {subscription.billingCycle}
            </Badge>
            {subscription.category && (
              <Badge
                variant="secondary"
                className="text-white"
                style={{ backgroundColor: subscription.category.color }}
              >
                {subscription.category.name}
              </Badge>
            )}
          </div>
          <span className="text-xs text-neutral-500">
            {daysUntilPayment <= 0 ? "Due today" : `in ${daysUntilPayment} days`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Subscription list component**

**Step 3: Dashboard page (main)**

```tsx
// src/app/(dashboard)/dashboard/page.tsx
import { getSubscriptions, getMonthlyTotal } from "@/lib/actions/subscriptions";
import { TotalCards } from "@/components/dashboard/total-cards";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { AddSubscriptionDialog } from "@/components/dashboard/add-subscription-dialog";

export default async function DashboardPage() {
  const subscriptions = await getSubscriptions();
  const monthlyTotal = await getMonthlyTotal();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">SubTracker</h1>
          <p className="text-neutral-400 mt-1">Manage your subscriptions</p>
        </div>
        <AddSubscriptionDialog />
      </div>
      <TotalCards
        monthlyTotal={monthlyTotal}
        yearlyTotal={monthlyTotal * 12}
        subscriptionCount={subscriptions.length}
      />
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>
        <SubscriptionList subscriptions={subscriptions} />
      </div>
    </div>
  );
}
```

**Verification:** `npm run build` passes

---

### Task 10: Add/Edit Subscription Dialogs (with category select)

**Objective:** Forms for adding/editing subscriptions with category dropdown

**Files:**
- Create: `src/components/dashboard/add-subscription-dialog.tsx`
- Create: `src/components/dashboard/edit-subscription-dialog.tsx`

**Step 1: Add subscription dialog with category select**

```tsx
// src/components/dashboard/add-subscription-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createSubscription } from "@/lib/actions/subscriptions";
import { getCategories } from "@/lib/actions/categories";
import type { Category } from "@prisma/client";

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await createSubscription({
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      currency: "IDR",
      billingCycle: formData.get("billingCycle") as "monthly" | "yearly" | "weekly" | "daily",
      nextPaymentDate: new Date(formData.get("nextPaymentDate") as string),
      categoryId: (formData.get("categoryId") as string) || undefined,
      color: (formData.get("color") as string) || undefined,
    });

    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g. Netflix" required className="bg-neutral-800 border-neutral-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (IDR)</Label>
              <Input id="price" name="price" type="number" min="0" placeholder="54000" required className="bg-neutral-800 border-neutral-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select name="billingCycle" defaultValue="monthly">
                <SelectTrigger className="bg-neutral-800 border-neutral-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
            <Input id="nextPaymentDate" name="nextPaymentDate" type="date" required className="bg-neutral-800 border-neutral-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId">
              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="No category" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="">None</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Adding..." : "Add Subscription"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Edit subscription dialog (similar, pre-filled with current values)**

**Verification:** `npm run build` passes

---

### Task 11: Dashboard Navigation

**Objective:** Build nav bar with user avatar, links to dashboard/categories, sign out

**Files:**
- Create: `src/components/dashboard/nav.tsx`

**Step 1: Create nav component**

```tsx
// src/components/dashboard/nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/categories", label: "Categories" },
];

export function DashboardNav({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold text-white">
            SubTracker
          </Link>
          <div className="flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname === link.href
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-600 text-white text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-900 border-neutral-800" align="end">
            <DropdownMenuItem className="text-neutral-400 text-xs">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 cursor-pointer">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
```

**Verification:** `npm run build` passes

---

### Task 12: Payment Reminders (Browser Notifications)

**Objective:** Show browser notifications for upcoming payments

**Files:**
- Create: `src/hooks/use-notifications.ts`
- Modify: `src/app/(dashboard)/dashboard/page.tsx` (add client wrapper)

**Step 1: Create notification hook**

```typescript
// src/hooks/use-notifications.ts
"use client";

import { useEffect } from "react";
import type { Subscription, Category } from "@prisma/client";

type SubWithCategory = Subscription & { category: Category | null };

export function usePaymentNotifications(subscriptions: SubWithCategory[]) {
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const upcoming = subscriptions.filter((sub) => {
      const days = Math.ceil(
        (new Date(sub.nextPaymentDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return days >= 0 && days <= 3;
    });

    if (upcoming.length > 0 && Notification.permission === "granted") {
      upcoming.forEach((sub) => {
        const days = Math.ceil(
          (new Date(sub.nextPaymentDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const price = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(sub.price.toNumber());
        const msg = days === 0
          ? `${sub.name} payment due today! (${price})`
          : `${sub.name} payment in ${days} day(s) (${price})`;
        new Notification("SubTracker", { body: msg });
      });
    }
  }, [subscriptions]);
}
```

**Verification:** `npm run build` passes

---

### Task 13: Netlify Deployment

**Objective:** Deploy to Netlify

**Step 1: Add `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "22"
```

**Step 2: Link and deploy**

```bash
netlify link
netlify deploy --prod
```

**Verification:** Site is live at *.netlify.app

---

## Summary

| Task | Description | New Files |
|------|-------------|-----------|
| 1 | Project setup + Prisma schema | scaffold |
| 2 | **Landing page** (hero, features, pricing, nav, footer) | `src/app/(marketing)/`, `src/components/landing/` |
| 3 | Prisma singleton | `src/lib/prisma.ts` |
| 4 | Better Auth setup | `src/lib/auth.ts`, API route, middleware |
| 5 | Login/Register pages | auth pages + forms |
| 6 | Category + Subscription CRUD | server actions + validations |
| 7 | Dashboard layout + total cards | layout + cards |
| 8 | Category CRUD UI | category list, add, edit dialogs |
| 9 | Subscription list + cards | subscription list, card components |
| 10 | Add/Edit subscription dialogs | with category dropdown |
| 11 | Dashboard navigation | nav with dropdown |
| 12 | Payment reminders | notification hook |
| 13 | Netlify deployment | netlify.toml |
