# Life Update - Sprint 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build functional daily logging system deployable to Vercel that user can use immediately

**Architecture:** Next.js 14 App Router with TypeScript, Supabase PostgreSQL + Auth, Prisma ORM, mobile-first daily entry form

**Tech Stack:** Next.js 14, TypeScript, Prisma, Supabase, Tailwind CSS, shadcn/ui

**Priority:** User needs to log daily entries ASAP - focus on minimal viable logging first, polish later

---

## File Structure Overview

```
life-update/
├── .env.local                          # Environment variables
├── .gitignore                          # Git ignore patterns
├── next.config.js                      # Next.js configuration
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── tailwind.config.ts                  # Tailwind config
├── components.json                     # shadcn/ui config
│
├── prisma/
│   ├── schema.prisma                   # Database schema (already exists)
│   └── migrations/                     # Prisma migrations
│
├── app/
│   ├── layout.tsx                      # Root layout (dark theme)
│   ├── page.tsx                        # Landing/redirect page
│   ├── globals.css                     # Global styles
│   │
│   ├── (auth)/                         # Public routes group
│   │   └── login/
│   │       └── page.tsx                # Login page
│   │
│   ├── (dashboard)/                    # Protected routes group
│   │   ├── layout.tsx                  # Dashboard layout with header
│   │   └── daily/
│   │       └── page.tsx                # Daily entry form
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts            # NextAuth config
│       └── entries/
│           └── daily/
│               └── route.ts            # Daily entry CRUD
│
├── lib/
│   ├── prisma/
│   │   └── client.ts                   # Prisma singleton
│   ├── supabase/
│   │   ├── client.ts                   # Supabase browser client
│   │   └── server.ts                   # Supabase server client
│   └── utils.ts                        # Utility functions (cn, etc)
│
└── components/
    └── ui/                             # shadcn/ui components
        ├── button.tsx
        ├── input.tsx
        ├── label.tsx
        ├── slider.tsx
        └── checkbox.tsx
```

---

## Task 1: Project Initialization

**Files:**
- Create: `.env.local`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /c/dev/life-update
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm
```

When prompted:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Import alias: @/*

- [ ] **Step 2: Install core dependencies**

```bash
npm install @prisma/client @supabase/supabase-js @supabase/auth-helpers-nextjs next-auth prisma gray-matter date-fns framer-motion recharts lucide-react clsx tailwind-merge class-variance-authority
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D @types/node prisma
```

- [ ] **Step 4: Initialize Prisma**

```bash
npx prisma init
```

Expected: Creates `prisma/` directory with `schema.prisma`

- [ ] **Step 5: Copy existing schema**

The schema already exists at `prisma/schema.prisma`. Verify it's there:

```bash
cat prisma/schema.prisma | head -20
```

Expected: Should show generator and datasource config

- [ ] **Step 6: Create .env.local**

```bash
cat > .env.local << 'EOF'
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="temp-secret-replace-in-production"

# Vercel (auto-populated in production)
VERCEL_URL=""
EOF
```

- [ ] **Step 7: Create .env.example**

```bash
cat > .env.example << 'EOF'
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Vercel
VERCEL_URL=""
EOF
```

- [ ] **Step 8: Update .gitignore**

```bash
cat >> .gitignore << 'EOF'

# Environment
.env.local
.env*.local

# Prisma
prisma/migrations/
EOF
```

- [ ] **Step 9: Verify project structure**

```bash
ls -la
```

Expected: Should see `app/`, `prisma/`, `public/`, `package.json`, etc.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

## Task 2: Supabase Setup

**Files:**
- Modify: `.env.local` (add real credentials)
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

**Prerequisites:** 
- Create Supabase project at https://supabase.com
- Get credentials: PROJECT_URL, ANON_KEY, SERVICE_ROLE_KEY, DATABASE_URL

- [ ] **Step 1: Create Supabase project**

Manual step:
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: "life-update"
4. Database password: Generate strong password
5. Region: Choose closest
6. Wait for project to initialize (~2 min)

- [ ] **Step 2: Get credentials**

From Supabase dashboard → Settings → API:
- Copy `Project URL` → NEXT_PUBLIC_SUPABASE_URL
- Copy `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY
- Copy `service_role` key (show secret) → SUPABASE_SERVICE_ROLE_KEY

From Supabase dashboard → Settings → Database:
- Copy Connection string (URI, Session mode) → DATABASE_URL
- Replace `[YOUR-PASSWORD]` with your database password

- [ ] **Step 3: Update .env.local with real credentials**

```bash
# Edit .env.local and replace placeholder values
nano .env.local
```

Replace all `[PROJECT-REF]`, `[PASSWORD]`, `[ANON-KEY]`, `[SERVICE-ROLE-KEY]` with actual values

- [ ] **Step 4: Create Supabase browser client**

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient();
};
```

- [ ] **Step 5: Create Supabase server client**

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};
```

- [ ] **Step 6: Test connection**

```bash
npx prisma db pull
```

Expected: Should connect successfully (may show "No tables found" - that's ok)

- [ ] **Step 7: Commit**

```bash
git add lib/supabase/
git commit -m "feat: setup Supabase client configuration"
```

---

## Task 3: Prisma Migration

**Files:**
- Verify: `prisma/schema.prisma`
- Create: `prisma/migrations/`
- Create: `lib/prisma/client.ts`

- [ ] **Step 1: Verify schema is correct**

```bash
cat prisma/schema.prisma | grep "model User" -A 10
```

Expected: Should show User model with id, email, name, timestamps, and relations

- [ ] **Step 2: Generate Prisma client**

```bash
npx prisma generate
```

Expected: "Generated Prisma Client"

- [ ] **Step 3: Create initial migration**

```bash
npx prisma migrate dev --name init
```

Expected: Creates migration files and applies to database

- [ ] **Step 4: Verify tables created in Supabase**

Go to Supabase dashboard → Table Editor
Expected: See tables: users, daily_entries, weekly_entries, monthly_entries, projects, plan_snapshots

- [ ] **Step 5: Create Prisma singleton client**

```typescript
// lib/prisma/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 6: Test Prisma client**

Create temporary test file:

```typescript
// test-prisma.ts
import { prisma } from './lib/prisma/client';

async function main() {
  const userCount = await prisma.user.count();
  console.log('User count:', userCount);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run:
```bash
npx ts-node test-prisma.ts
```

Expected: "User count: 0"

- [ ] **Step 7: Delete test file**

```bash
rm test-prisma.ts
```

- [ ] **Step 8: Commit**

```bash
git add lib/prisma/ prisma/
git commit -m "feat: setup Prisma client and run initial migration"
```

---

## Task 4: Tailwind & shadcn/ui Setup

**Files:**
- Modify: `tailwind.config.ts`
- Create: `components.json`
- Modify: `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn-ui@latest init
```

When prompted:
- Style: Default
- Base color: Zinc
- CSS variables: Yes

- [ ] **Step 2: Update globals.css with dark theme**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;          /* #0a0a0a */
    --foreground: 0 0% 100%;        /* #ffffff */
    
    --card: 0 0% 8%;                /* #141414 */
    --card-foreground: 0 0% 100%;
    
    --popover: 0 0% 8%;
    --popover-foreground: 0 0% 100%;
    
    --primary: 262 83% 58%;         /* #8b5cf6 purple */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 0 0% 12%;          /* #1f1f1f */
    --secondary-foreground: 0 0% 100%;
    
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 63%;   /* #a0a0a0 */
    
    --accent: 187 92% 69%;          /* #06b6d4 cyan */
    --accent-foreground: 0 0% 0%;
    
    --destructive: 0 84% 60%;       /* #ef4444 red */
    --destructive-foreground: 0 0% 100%;
    
    --border: 0 0% 20%;             /* #333333 */
    --input: 0 0% 20%;
    --ring: 262 83% 58%;
    
    --radius: 0.5rem;
    
    /* Status colors */
    --status-crushing: 160 100% 50%;  /* #00ff88 */
    --status-ahead: 160 84% 39%;      /* #10b981 */
    --status-on-track: 217 91% 60%;   /* #3b82f6 */
    --status-warning: 38 92% 50%;     /* #f59e0b */
    --status-danger: 0 84% 60%;       /* #ef4444 */
    --status-critical: 0 74% 42%;     /* #dc2626 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

- [ ] **Step 3: Install essential shadcn components**

```bash
npx shadcn-ui@latest add button input label slider checkbox card
```

- [ ] **Step 4: Verify lib/utils.ts exists**

```bash
cat lib/utils.ts
```

Expected: Should see `cn` function for className merging

If not, create it:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Test dev server**

```bash
npm run dev
```

Open http://localhost:3000
Expected: Should see Next.js welcome page with dark background

Stop server: Ctrl+C

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: setup Tailwind dark theme and shadcn/ui components"
```

---

## Task 5: NextAuth Configuration

**Files:**
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: Create NextAuth route handler**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Authenticate with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          return null;
        }

        // Find or create user in Prisma
        let user = await prisma.user.findUnique({
          where: { email: data.user.email! },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || null,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 2: Create NextAuth types**

```typescript
// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
```

- [ ] **Step 3: Create middleware for route protection**

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/daily/:path*',
    '/analytics/:path*',
    '/plan/:path*',
    '/settings/:path*',
  ],
};
```

- [ ] **Step 4: Install missing auth dependencies**

```bash
npm install @auth/prisma-adapter
```

- [ ] **Step 5: Update tsconfig.json for type imports**

```json
// tsconfig.json - verify "moduleResolution" is "bundler"
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: configure NextAuth with Supabase credentials provider"
```

---

## Task 6: Login Page

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/layout.tsx`

- [ ] **Step 1: Create auth layout**

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create login page**

```typescript
// app/(auth)/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/daily');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Life Update</CardTitle>
        <CardDescription>Sign in to track your transformation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Update root layout with SessionProvider**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import SessionProvider from '@/components/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life Update',
  description: 'Life transformation tracking system',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create SessionProvider component**

```typescript
// components/session-provider.tsx
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
```

- [ ] **Step 5: Update root page to redirect to login**

```typescript
// app/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/daily');
  } else {
    redirect('/login');
  }
}
```

- [ ] **Step 6: Test login page**

```bash
npm run dev
```

Visit http://localhost:3000
Expected: Redirects to /login, shows login form with dark theme

Stop server: Ctrl+C

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: create login page with NextAuth integration"
```

---

## Task 7: Create Test User in Supabase

**Manual Steps** (cannot be automated):

- [ ] **Step 1: Go to Supabase dashboard**

Navigate to: https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]/auth/users

- [ ] **Step 2: Create test user**

Click "Add user" → "Create new user"
- Email: your@email.com (use real email you have access to)
- Password: Choose strong password (remember it!)
- Email confirm: Check "Auto confirm user"
- Click "Create user"

- [ ] **Step 3: Test login**

```bash
npm run dev
```

1. Visit http://localhost:3000
2. Should redirect to /login
3. Enter email and password from Step 2
4. Click "Sign In"
5. Expected: Should redirect to /daily (will show 404 for now - that's ok)

- [ ] **Step 4: Document credentials**

Add to a secure note (not in git):
```
Life Update Test User:
Email: your@email.com
Password: [your-password]
```

- [ ] **Step 5: Stop dev server**

```bash
# Press Ctrl+C
```

---

## Task 8: Daily Entry Form

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/daily/page.tsx`
- Create: `components/daily/entry-form.tsx`

- [ ] **Step 1: Create dashboard layout**

```typescript
// app/(dashboard)/layout.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Life Update</h1>
          <div className="text-sm text-muted-foreground">
            {session.user.email}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create daily entry page**

```typescript
// app/(dashboard)/daily/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/client';
import DailyEntryForm from '@/components/daily/entry-form';

export default async function DailyPage() {
  const session = await getServerSession(authOptions);
  const today = new Date().toISOString().split('T')[0];

  // Get today's entry if exists
  const existingEntry = await prisma.dailyEntry.findUnique({
    where: {
      userId_date: {
        userId: session!.user.id,
        date: new Date(today),
      },
    },
  });

  // Get yesterday's entry for pre-fill
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayEntry = await prisma.dailyEntry.findUnique({
    where: {
      userId_date: {
        userId: session!.user.id,
        date: yesterday,
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Log Today</h2>
      <DailyEntryForm 
        existingEntry={existingEntry} 
        yesterdayEntry={yesterdayEntry}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create entry form component (part 1: structure)**

```typescript
// components/daily/entry-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface DailyEntry {
  id: string;
  date: Date;
  energy_level: number | null;
  stress_level: number | null;
  physical_pain: boolean;
  pain_location: string | null;
  trained_today: boolean;
  deep_work_hours: number | null;
  clean_today: boolean;
  quick_note: string | null;
}

interface Props {
  existingEntry: DailyEntry | null;
  yesterdayEntry: DailyEntry | null;
}

export default function DailyEntryForm({ existingEntry, yesterdayEntry }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize with existing entry, or yesterday's values, or defaults
  const [energyLevel, setEnergyLevel] = useState<number>(
    existingEntry?.energy_level ?? yesterdayEntry?.energy_level ?? 5
  );
  const [stressLevel, setStressLevel] = useState<number>(
    existingEntry?.stress_level ?? yesterdayEntry?.stress_level ?? 5
  );
  const [physicalPain, setPhysicalPain] = useState(
    existingEntry?.physical_pain ?? false
  );
  const [painLocation, setPainLocation] = useState(
    existingEntry?.pain_location ?? ''
  );
  const [trainedToday, setTrainedToday] = useState(
    existingEntry?.trained_today ?? false
  );
  const [deepWorkHours, setDeepWorkHours] = useState(
    existingEntry?.deep_work_hours?.toString() ?? ''
  );
  const [cleanToday, setCleanToday] = useState(
    existingEntry?.clean_today ?? true
  );
  const [quickNote, setQuickNote] = useState(
    existingEntry?.quick_note ?? ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      date: new Date().toISOString().split('T')[0],
      energy_level: energyLevel,
      stress_level: stressLevel,
      physical_pain: physicalPain,
      pain_location: physicalPain ? painLocation : null,
      trained_today: trainedToday,
      deep_work_hours: deepWorkHours ? parseFloat(deepWorkHours) : null,
      clean_today: cleanToday,
      quick_note: quickNote || null,
    };

    const response = await fetch('/api/entries/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.refresh();
      // TODO: Add confetti animation if streak continues
      alert('✅ Day logged successfully!');
    } else {
      alert('❌ Failed to save entry');
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Energy Level */}
          <div className="space-y-2">
            <Label>Energy Level: {energyLevel}/10</Label>
            <Slider
              value={[energyLevel]}
              onValueChange={(value) => setEnergyLevel(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exhausted</span>
              <span>Optimal</span>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-2">
            <Label>Stress Level: {stressLevel}/10</Label>
            <Slider
              value={[stressLevel]}
              onValueChange={(value) => setStressLevel(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calm</span>
              <span>Overwhelmed</span>
            </div>
          </div>

          {/* Physical Pain */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pain"
                checked={physicalPain}
                onCheckedChange={(checked) => setPhysicalPain(checked as boolean)}
              />
              <Label htmlFor="pain">Physical pain today</Label>
            </div>
            {physicalPain && (
              <Input
                placeholder="Location (e.g., shoulder, neck, back)"
                value={painLocation}
                onChange={(e) => setPainLocation(e.target.value)}
              />
            )}
          </div>

          {/* Trained Today */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="trained"
              checked={trainedToday}
              onCheckedChange={(checked) => setTrainedToday(checked as boolean)}
            />
            <Label htmlFor="trained">Trained today</Label>
          </div>

          {/* Deep Work Hours */}
          <div className="space-y-2">
            <Label htmlFor="deep-work">Deep work hours</Label>
            <Input
              id="deep-work"
              type="number"
              min="0"
              max="12"
              step="0.5"
              placeholder="0-12"
              value={deepWorkHours}
              onChange={(e) => setDeepWorkHours(e.target.value)}
            />
          </div>

          {/* Clean Today */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clean"
              checked={cleanToday}
              onCheckedChange={(checked) => setCleanToday(checked as boolean)}
            />
            <Label htmlFor="clean">Clean today (no alcohol/porn/tobacco)</Label>
          </div>

          {/* Quick Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Quick note (optional)</Label>
            <Input
              id="note"
              placeholder="How was today?"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save Today\'s Log'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: create daily entry form with 7 core fields"
```

---

## Task 9: Daily Entry API Endpoint

**Files:**
- Create: `app/api/entries/daily/route.ts`

- [ ] **Step 1: Create API route**

```typescript
// app/api/entries/daily/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/client';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { date, ...entryData } = body;

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    // Upsert entry (create or update)
    const entry = await prisma.dailyEntry.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: parsedDate,
        },
      },
      update: {
        ...entryData,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        date: parsedDate,
        ...entryData,
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Error saving daily entry:', error);
    return NextResponse.json(
      { error: 'Failed to save entry' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: session.user.id,
        ...(from && to && {
          date: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Test API endpoint manually**

Create test file:

```typescript
// test-api.ts
async function testAPI() {
  const response = await fetch('http://localhost:3000/api/entries/daily', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Note: This won't work without session cookie
      // Test will be done through browser
    },
    body: JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      energy_level: 7,
      stress_level: 5,
      physical_pain: false,
      pain_location: null,
      trained_today: true,
      deep_work_hours: 4,
      clean_today: true,
      quick_note: 'Test entry',
    }),
  });

  console.log('Status:', response.status);
  console.log('Response:', await response.json());
}

testAPI();
```

Note: This will fail without auth cookie. Actual test will be through browser.

Delete test file:

```bash
rm test-api.ts
```

- [ ] **Step 3: Commit**

```bash
git add app/api/entries/
git commit -m "feat: create daily entry API endpoint with upsert logic"
```

---

## Task 10: End-to-End Test

**Manual Test Flow:**

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Login**

1. Visit http://localhost:3000
2. Should redirect to /login
3. Enter test user credentials
4. Click "Sign In"
5. Should redirect to /daily

- [ ] **Step 3: Test daily entry form**

1. Should see "Log Today" page with current date
2. Adjust sliders (Energy, Stress)
3. Check some checkboxes
4. Enter deep work hours (e.g., 4)
5. Add quick note (e.g., "First test entry")
6. Click "Save Today's Log"
7. Should see success alert

- [ ] **Step 4: Verify entry in database**

Go to Supabase dashboard → Table Editor → daily_entries
Expected: Should see 1 row with today's date and your data

- [ ] **Step 5: Test form pre-fill**

1. Refresh the page (/daily)
2. Form should now show the values you just saved
3. Change energy level from 5 to 8
4. Click "Save Today's Log"
5. Should update successfully

- [ ] **Step 6: Verify update in database**

Refresh Supabase table editor
Expected: Same row, energy_level now shows 8, updatedAt changed

- [ ] **Step 7: Test validation**

1. Try entering deep work hours as 15 (over max)
2. HTML5 validation should prevent it (max="12")

- [ ] **Step 8: Stop dev server**

```bash
# Press Ctrl+C
```

---

## Task 11: Vercel Deployment Setup

**Files:**
- Create: `vercel.json`
- Create: `.vercelignore`

- [ ] **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

- [ ] **Step 2: Login to Vercel**

```bash
vercel login
```

Follow prompts to authenticate

- [ ] **Step 3: Create vercel.json**

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

- [ ] **Step 4: Create .vercelignore**

```
.env.local
.env*.local
node_modules
.next
prisma/migrations
```

- [ ] **Step 5: Link project to Vercel**

```bash
vercel link
```

Follow prompts:
- Setup and deploy? No (we'll do this manually)
- Link to existing project? No
- Project name: life-update
- Directory: ./

- [ ] **Step 6: Add environment variables to Vercel**

```bash
vercel env add DATABASE_URL
# Paste your DATABASE_URL from .env.local

vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your NEXT_PUBLIC_SUPABASE_URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your NEXT_PUBLIC_SUPABASE_ANON_KEY

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your SUPABASE_SERVICE_ROLE_KEY

vercel env add NEXTAUTH_SECRET
# Generate with: openssl rand -base64 32
# Paste the generated secret

vercel env add NEXTAUTH_URL
# Enter: https://life-update.vercel.app (will update after first deploy)
```

- [ ] **Step 7: Commit Vercel config**

```bash
git add vercel.json .vercelignore
git commit -m "chore: configure Vercel deployment"
```

- [ ] **Step 8: Push to GitHub**

```bash
git push origin main
```

---

## Task 12: First Deployment

- [ ] **Step 1: Deploy to Vercel**

```bash
vercel --prod
```

Expected: Will build and deploy, output URL like https://life-update-xxx.vercel.app

- [ ] **Step 2: Update NEXTAUTH_URL**

```bash
vercel env add NEXTAUTH_URL production
# Enter the actual deployed URL from Step 1
```

- [ ] **Step 3: Redeploy with correct URL**

```bash
vercel --prod
```

- [ ] **Step 4: Test production deployment**

1. Visit your Vercel URL
2. Should redirect to /login
3. Login with test credentials
4. Should work exactly like local
5. Log an entry
6. Verify in Supabase (should see entry in database)

- [ ] **Step 5: Verify database connection**

Check Vercel logs:
```bash
vercel logs
```

Should not see any database connection errors

- [ ] **Step 6: Document deployment URL**

Add to repo README:

```bash
cat > README.md << 'EOF'
# Life Update

Life transformation tracking system.

## Deployed App
- Production: https://life-update-xxx.vercel.app

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env.local
# Fill in Supabase credentials
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Start dev server:
```bash
npm run dev
```

Visit http://localhost:3000

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Supabase (PostgreSQL + Auth)
- Prisma ORM
- Tailwind CSS + shadcn/ui
- Deployed on Vercel
EOF
```

- [ ] **Step 7: Final commit**

```bash
git add README.md
git commit -m "docs: add README with deployment info"
git push origin main
```

---

## Sprint 1 Complete! 🎉

**What we built:**
- ✅ Next.js 14 app with TypeScript
- ✅ Supabase PostgreSQL database with Prisma
- ✅ NextAuth authentication with Supabase
- ✅ Daily entry form (7 core fields, 20 second target)
- ✅ API endpoint for saving entries
- ✅ Deployed to Vercel (production-ready)

**What the user can do NOW:**
- Login to the app
- Log daily entries (energy, stress, pain, training, deep work, clean status, notes)
- Access from phone (mobile-optimized)
- Data persists in Supabase

**Next Steps (Sprint 2):**
- Mission Control page (daily win conditions)
- Dashboard with progress tracking
- Health Risk Score
- Plan parser (read .md files)

**Estimated Time:** 6-8 hours of focused work

---

## Troubleshooting

**Issue: Prisma migration fails**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually drop tables in Supabase dashboard and re-run migration
npx prisma migrate dev --name init
```

**Issue: NextAuth session not persisting**
- Check NEXTAUTH_SECRET is set correctly
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

**Issue: Supabase connection fails**
- Verify DATABASE_URL has correct password
- Check Supabase project is not paused (free tier)
- Test connection: `npx prisma db pull`

**Issue: Vercel build fails**
- Check environment variables are set in Vercel dashboard
- Verify `prisma generate` runs before build
- Check build logs: `vercel logs`

**Issue: TypeScript errors**
- Run: `npm install --save-dev @types/node`
- Verify tsconfig.json has correct paths
- Restart TypeScript server in VS Code
