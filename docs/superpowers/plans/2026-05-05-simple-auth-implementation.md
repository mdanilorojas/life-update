# Simple Authentication System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace NextAuth with a simple password-based authentication system that uses a single hardcoded user while maintaining multi-user database architecture.

**Architecture:** Cookie-based session management with password validation. All database queries use a constant `CURRENT_USER_ID`. Middleware protects routes. Simple login page with single password field.

**Tech Stack:** Next.js 16, Prisma, Supabase PostgreSQL, TypeScript, crypto (Node.js built-in)

---

## File Structure

**Files to CREATE:**
- `/lib/constants.ts` - User ID and auth constants
- `/lib/session.ts` - Session cookie management utilities
- `/app/login/page.tsx` - New simple login page (replaces existing)
- `/app/api/auth/login/route.ts` - Password validation endpoint
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/prisma/seed.ts` - Database seed script

**Files to MODIFY:**
- `/middleware.ts` - Replace NextAuth with cookie validation
- `/app/api/daily-entry/route.ts` - Use CURRENT_USER_ID instead of session
- `/app/(dashboard)/layout.tsx` - Remove SessionProvider, add logout button
- `/app/layout.tsx` - Remove NextAuth imports
- `/package.json` - Remove NextAuth dependencies
- `/.env` - Add APP_PASSWORD, remove NextAuth vars

**Files to DELETE:**
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `/lib/auth.ts` - NextAuth configuration

---

## Task 1: Create Constants and Session Utilities

**Files:**
- Create: `/lib/constants.ts`
- Create: `/lib/session.ts`

- [ ] **Step 1: Create constants file**

```typescript
// /lib/constants.ts
export const CURRENT_USER_ID = "danilo-main-user";

export function getAppPassword(): string {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    throw new Error("APP_PASSWORD environment variable is required");
  }
  return password;
}
```

- [ ] **Step 2: Create session management utilities**

```typescript
// /lib/session.ts
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "life-update-session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export async function createSession(): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  
  return sessionId;
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
```

- [ ] **Step 3: Commit constants and session utilities**

```bash
git add lib/constants.ts lib/session.ts
git commit -m "feat: add auth constants and session management utilities"
```

---

## Task 2: Create Login API Endpoints

**Files:**
- Create: `/app/api/auth/login/route.ts`
- Create: `/app/api/auth/logout/route.ts`

- [ ] **Step 1: Create login endpoint**

```typescript
// /app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { getAppPassword } from "@/lib/constants";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const appPassword = getAppPassword();

    if (password !== appPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Create session
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create logout endpoint**

```typescript
// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit login endpoints**

```bash
git add app/api/auth/login/route.ts app/api/auth/logout/route.ts
git commit -m "feat: add login and logout API endpoints"
```

---

## Task 3: Create New Login Page

**Files:**
- Create: `/app/login/page.tsx` (replaces `/app/(auth)/login/page.tsx`)

- [ ] **Step 1: Create simplified login page**

```typescript
// /app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid password");
        setIsLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/daily");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800 shadow-xl">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
              Life Update
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Track your transformation. No bullshit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-950 border border-red-900 rounded-md">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-200"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
                className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-medium disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Enter"}
            </Button>
          </form>

          <p className="text-xs text-zinc-500 text-center mt-6">
            Single user. One mission. No compromises.
          </p>
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit new login page**

```bash
git add app/login/page.tsx
git commit -m "feat: create simplified login page with password-only auth"
```

---

## Task 4: Update Middleware

**Files:**
- Modify: `/middleware.ts`

- [ ] **Step 1: Replace NextAuth middleware with cookie validation**

```typescript
// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("life-update-session");
  const isAuthenticated = !!sessionCookie;

  // Public routes that don't require authentication
  const isLoginPage = pathname === "/login";
  const isApiAuth = pathname.startsWith("/api/auth");
  const isPublicRoute = pathname === "/" || pathname.startsWith("/public") || pathname.startsWith("/_next");

  // Allow public routes
  if (isPublicRoute || isApiAuth) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && isLoginPage) {
    const dailyUrl = new URL("/daily", request.url);
    return NextResponse.redirect(dailyUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

- [ ] **Step 2: Commit middleware update**

```bash
git add middleware.ts
git commit -m "feat: replace NextAuth middleware with cookie-based auth"
```

---

## Task 5: Update Daily Entry API

**Files:**
- Modify: `/app/api/daily-entry/route.ts`

- [ ] **Step 1: Read current daily entry API**

```bash
cat app/api/daily-entry/route.ts
```

Expected: See NextAuth session usage

- [ ] **Step 2: Replace session with CURRENT_USER_ID**

Find and replace:
- Remove: `import { getServerSession } from "next-auth"`
- Remove: `import { auth } from "@/lib/auth"`
- Add: `import { CURRENT_USER_ID } from "@/lib/constants"`
- Add: `import { isAuthenticated } from "@/lib/session"`

Replace session check:
```typescript
// OLD:
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = session.user.id;

// NEW:
const authenticated = await isAuthenticated();
if (!authenticated) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = CURRENT_USER_ID;
```

- [ ] **Step 3: Verify the change compiles**

```bash
npm run build
```

Expected: Build succeeds without NextAuth errors

- [ ] **Step 4: Commit daily entry API update**

```bash
git add app/api/daily-entry/route.ts
git commit -m "feat: update daily entry API to use CURRENT_USER_ID"
```

---

## Task 6: Update Dashboard Layout

**Files:**
- Modify: `/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Read current dashboard layout**

```bash
cat app/(dashboard)/layout.tsx
```

Expected: See SessionProvider wrapping

- [ ] **Step 2: Remove SessionProvider and add logout button**

Complete replacement:

```typescript
// /app/(dashboard)/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-50">Life Update</h1>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
          >
            Logout
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Commit dashboard layout update**

```bash
git add app/(dashboard)/layout.tsx
git commit -m "feat: remove SessionProvider and add logout button"
```

---

## Task 7: Update Root Layout

**Files:**
- Modify: `/app/layout.tsx`

- [ ] **Step 1: Read current root layout**

```bash
cat app/layout.tsx
```

Expected: See NextAuth SessionProvider import

- [ ] **Step 2: Remove NextAuth imports**

Remove these lines if present:
```typescript
import { SessionProvider } from "next-auth/react"
```

Remove SessionProvider wrapper if present around children

- [ ] **Step 3: Commit root layout update**

```bash
git add app/layout.tsx
git commit -m "chore: remove NextAuth imports from root layout"
```

---

## Task 8: Create Database Seed Script

**Files:**
- Create: `/prisma/seed.ts`
- Modify: `/package.json`

- [ ] **Step 1: Create seed script**

```typescript
// /prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create the hardcoded user
  const user = await prisma.user.upsert({
    where: { id: "danilo-main-user" },
    update: {},
    create: {
      id: "danilo-main-user",
      email: "danilo@personal.com",
      name: "Danilo",
      password: null, // No password needed in DB
    },
  });

  console.log("✅ User created:", user);
  console.log("🌱 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Add seed command to package.json**

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Also ensure `tsx` is installed:

```bash
npm install --save-dev tsx
```

- [ ] **Step 3: Run database push and seed**

```bash
npx prisma db push
npx prisma db seed
```

Expected output:
```
🌱 Seeding database...
✅ User created: { id: 'danilo-main-user', email: 'danilo@personal.com', ... }
🌱 Seed completed successfully
```

- [ ] **Step 4: Commit seed script and package.json**

```bash
git add prisma/seed.ts package.json package-lock.json
git commit -m "feat: add database seed script for initial user"
```

---

## Task 9: Update Environment Variables

**Files:**
- Modify: `/.env`

- [ ] **Step 1: Add APP_PASSWORD to .env**

```bash
echo 'APP_PASSWORD="your-secure-password-here"' >> .env
```

Replace `your-secure-password-here` with actual password

- [ ] **Step 2: Remove NextAuth variables from .env**

Remove or comment out:
```bash
# NEXTAUTH_URL (no longer needed)
# NEXTAUTH_SECRET (no longer needed)
```

- [ ] **Step 3: Verify .env has required variables**

Required variables:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
APP_PASSWORD=...
```

- [ ] **Step 4: Do NOT commit .env file**

Verify .env is in .gitignore:

```bash
grep "^\.env$" .gitignore || echo ".env" >> .gitignore
```

---

## Task 10: Remove NextAuth Dependencies

**Files:**
- Modify: `/package.json`
- Delete: `/app/api/auth/[...nextauth]/route.ts`
- Delete: `/lib/auth.ts`
- Delete: `/app/(auth)/login/page.tsx`

- [ ] **Step 1: Delete NextAuth files**

```bash
rm -rf app/api/auth/\[...nextauth\]
rm -f lib/auth.ts
rm -rf app/\(auth\)
```

- [ ] **Step 2: Uninstall NextAuth packages**

```bash
npm uninstall next-auth @auth/prisma-adapter
```

- [ ] **Step 3: Verify removal**

```bash
grep -r "next-auth" package.json || echo "✅ NextAuth removed from package.json"
```

Expected: No matches found

- [ ] **Step 4: Clean up node_modules**

```bash
rm -rf node_modules package-lock.json
npm install
```

- [ ] **Step 5: Commit NextAuth removal**

```bash
git add -A
git commit -m "chore: remove NextAuth and related files"
```

---

## Task 11: Manual Testing

**Files:** None (testing only)

- [ ] **Step 1: Start development server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000

- [ ] **Step 2: Test unauthenticated redirect**

Open http://localhost:3000 in browser

Expected: Redirects to /login

- [ ] **Step 3: Test invalid password**

Enter wrong password → click "Enter"

Expected: Error message "Invalid password" appears

- [ ] **Step 4: Test valid password**

Enter correct password from APP_PASSWORD → click "Enter"

Expected: Redirects to /daily

- [ ] **Step 5: Test session persistence**

Refresh the page at /daily

Expected: Remains on /daily (not redirected to login)

- [ ] **Step 6: Test daily entry creation**

Fill out daily entry form → submit

Expected: Entry saves successfully

- [ ] **Step 7: Verify data in database**

```bash
npx prisma studio
```

Check:
- `users` table has 1 record with id="danilo-main-user"
- `daily_entries` table has record with userId="danilo-main-user"

- [ ] **Step 8: Test logout**

Click "Logout" button in header

Expected: Redirects to /login, cookie cleared

- [ ] **Step 9: Test protected route without auth**

After logout, try to access http://localhost:3000/daily

Expected: Redirects to /login

---

## Task 12: Final Verification and Commit

**Files:** None (verification only)

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds without errors

- [ ] **Step 3: Test production build**

```bash
npm run start
```

Open http://localhost:3000

Expected: App works in production mode

- [ ] **Step 4: Stop production server**

```bash
# Press Ctrl+C
```

- [ ] **Step 5: Create final commit if any loose changes**

```bash
git status
```

If unstaged changes exist:

```bash
git add -A
git commit -m "chore: final cleanup after auth migration"
```

- [ ] **Step 6: Verify git history**

```bash
git log --oneline -15
```

Expected: Clean commit history with descriptive messages

---

## Success Criteria Checklist

- [ ] App opens without errors at http://localhost:3000
- [ ] Unauthenticated users redirected to /login
- [ ] Invalid password shows error message
- [ ] Valid password grants access to /daily
- [ ] Session persists across page refreshes
- [ ] Daily entries can be created and saved
- [ ] Database has exactly 1 user record with correct ID
- [ ] Logout button clears session and redirects to login
- [ ] Protected routes redirect to login when unauthenticated
- [ ] TypeScript compiles without errors
- [ ] Production build succeeds
- [ ] No NextAuth dependencies remain in package.json
- [ ] All NextAuth files deleted

---

## Next Steps (After Implementation)

1. **Test on Vercel:**
   - Add `APP_PASSWORD` to Vercel environment variables
   - Push to git → auto-deploy
   - Verify production deployment works

2. **Future Enhancements:**
   - Add rate limiting to login endpoint
   - Implement CSRF protection
   - Add session expiration warnings
   - Create admin UI for changing password

3. **Migration to Multi-User (Future):**
   - Install `@supabase/auth-helpers-nextjs`
   - Replace hardcoded auth with Supabase Auth
   - Enable RLS policies in database
   - Update queries to use `auth.user.id` instead of `CURRENT_USER_ID`
