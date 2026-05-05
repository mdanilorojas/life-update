# Simple Authentication System - Design Specification

**Date:** 2026-05-05  
**Project:** life-update  
**Purpose:** Replace NextAuth with simple password-based authentication for personal use, while maintaining multi-user architecture for future commercialization

---

## 1. Architecture Overview

The application maintains a complete multi-user database architecture but operates with a single hardcoded user for personal use.

### System Flow

```
Browser → Password Prompt → Middleware (validate cookie) → App Pages
                                ↓
                          Prisma Client → Supabase PostgreSQL
                                ↓
                     All queries use CURRENT_USER_ID constant
```

### Key Components

1. **Authentication Middleware** (`middleware.ts`)
   - Validates session cookie on every request
   - Protects all routes except `/login`
   - Redirects unauthenticated users to `/login`

2. **Login Page** (`/app/login/page.tsx`)
   - Simple form: password input + submit button
   - POST to `/api/auth/login` for validation
   - Stores session cookie on success

3. **Login API** (`/app/api/auth/login/route.ts`)
   - Compares submitted password with hardcoded constant
   - Creates httpOnly session cookie (30-day expiration)
   - Returns success/error response

4. **User Constants** (`/lib/constants.ts`)
   - `CURRENT_USER_ID = "danilo-main-user"`
   - `APP_PASSWORD` (from environment variable)

5. **Prisma Schema**
   - Keep `User` table and all relationships intact
   - Seed script creates hardcoded user in database

---

## 2. Authentication Flow

### User Journey

1. **Initial Access** (http://localhost:3000)
   - Middleware detects missing session cookie
   - Automatic redirect to `/login`

2. **Login Page** (`/login`)
   - Single password field
   - "Enter" button
   - User submits password → POST `/api/auth/login`

3. **API Validation**
   ```typescript
   if (password === APP_PASSWORD) {
     // Create session cookie with random ID or simple JWT
     // Return success
   } else {
     // Return 401 error
   }
   ```

4. **Successful Authentication**
   - HttpOnly cookie stored (30-day expiration, secure flag in production)
   - Redirect to `/daily`
   - Middleware allows future requests

5. **Protected Pages**
   - All database queries use `CURRENT_USER_ID`
   - Example: `prisma.dailyEntry.findMany({ where: { userId: CURRENT_USER_ID } })`

### Session Management

- Simple cookie with random session ID or basic JWT
- No refresh tokens (unnecessary for personal use)
- Optional logout button clears cookie
- No session expiration on close (persistent for 30 days)

---

## 3. Database Configuration

### Current State Verification

1. Check if tables exist in Supabase (created from Vercel integration)
2. If tables missing: run `npx prisma db push`
3. Create seed script to initialize hardcoded user

### User Seed Script (`/prisma/seed.ts`)

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { id: 'danilo-main-user' },
    update: {},
    create: {
      id: 'danilo-main-user',
      email: 'danilo@personal.com',
      name: 'Danilo',
    },
  })
  console.log('✅ User seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Execute: `npx prisma db seed`

### Environment Variables (`.env`)

**Keep:**
- `DATABASE_URL` (pointing to Supabase PostgreSQL)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Add:**
- `APP_PASSWORD="your-secret-password"`

**Remove:**
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### Dependencies

**Remove:**
```bash
npm uninstall next-auth @auth/prisma-adapter
```

**Keep:**
- `@prisma/client`, `prisma` (database ORM)
- `@supabase/supabase-js` (for future features)
- `bcryptjs` (not used now, useful for future multi-user)

---

## 4. File Changes

### Files to CREATE

1. **`/lib/constants.ts`**
   - Export `CURRENT_USER_ID` constant
   - Export auth helper functions

2. **`/lib/auth.ts`**
   - Session validation functions
   - Cookie creation/verification
   - `getCurrentUserId()` helper → always returns `CURRENT_USER_ID`

3. **`/app/login/page.tsx`** (new version)
   - Simple password form
   - No NextAuth dependencies

4. **`/app/api/auth/login/route.ts`**
   - POST endpoint for password validation
   - Creates session cookie

5. **`/app/api/auth/logout/route.ts`**
   - POST endpoint to clear cookie
   - Redirects to `/login`

6. **`/prisma/seed.ts`**
   - User initialization script

### Files to MODIFY

1. **`/middleware.ts`**
   - Remove NextAuth logic
   - Add simple cookie validation
   - Protect all routes except `/login`

2. **`/app/api/daily-entry/route.ts`**
   - Remove `getServerSession` from NextAuth
   - Use `CURRENT_USER_ID` directly

3. **`/app/(dashboard)/layout.tsx`**
   - Remove NextAuth SessionProvider
   - Add simple logout button

4. **`/app/layout.tsx`**
   - Remove NextAuth imports

5. **`/package.json`**
   - Update scripts
   - Remove NextAuth dependencies

### Files to DELETE

1. **`/app/api/auth/[...nextauth]/route.ts`**
   - NextAuth handler no longer needed

2. **`/app/(auth)/login/page.tsx`** (existing)
   - Replace with new simplified version

---

## 5. Testing Plan

### Pre-Implementation

1. **Verify database state:**
   ```bash
   npx prisma db push  # Create tables if missing
   npx prisma db seed  # Create initial user
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

### Manual Testing Checklist

- [ ] Open `http://localhost:3000` → redirects to `/login`
- [ ] Enter incorrect password → shows error message
- [ ] Enter correct password → redirects to `/daily`
- [ ] Fill daily entry form → submits successfully
- [ ] Refresh page → remains authenticated (cookie persists)
- [ ] Click logout → redirects to `/login`, cookie cleared
- [ ] Try accessing `/daily` without auth → redirects to `/login`

### Database Verification

- [ ] Check `daily_entries` table → contains records with `userId = "danilo-main-user"`
- [ ] Check `users` table → contains exactly 1 record

### Production Deployment (Vercel)

1. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `APP_PASSWORD`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Push to git → triggers auto-deploy
3. Verify production app works correctly

### Success Criteria

- ✅ App opens without errors
- ✅ Login with password works
- ✅ Can create daily entries
- ✅ Data saves to Supabase correctly
- ✅ Session persists across page refreshes
- ✅ Logout functionality works

---

## 6. Future Migration Path (Commercialization)

When ready to commercialize, the migration will be straightforward:

1. **Activate Supabase Auth:**
   - Install `@supabase/auth-helpers-nextjs`
   - Add signup/login pages using Supabase Auth UI
   - Replace hardcoded `CURRENT_USER_ID` with `auth.user.id`

2. **Enable Row Level Security (RLS):**
   - Add RLS policies in Supabase
   - Each user sees only their own data

3. **No Schema Changes Needed:**
   - Database already has proper `userId` foreign keys
   - All relationships are in place

4. **Gradual Rollout:**
   - Keep password auth as fallback initially
   - Test with beta users
   - Fully switch to Supabase Auth when stable

---

## 7. Security Considerations

### For Personal Use (Current)

- Password stored in environment variable (not in code)
- HttpOnly cookies prevent XSS attacks
- Secure flag enabled in production
- No public signup endpoint

### Limitations (Acceptable for Personal Use)

- Single password means no per-user access control
- Password stored in plaintext in environment (acceptable since only admin has access)
- No password reset flow (not needed for single user)
- No rate limiting on login attempts (low risk for personal use)

### For Future Commercial Use

- Migrate to Supabase Auth (proper password hashing)
- Implement rate limiting
- Add CSRF protection
- Enable RLS for data isolation
- Add email verification
- Implement password reset flow

---

## Implementation Priority

1. **Phase 1: Core Authentication** (30-45 minutes)
   - Create auth utilities and constants
   - Build login page and API
   - Update middleware

2. **Phase 2: Remove NextAuth** (15 minutes)
   - Delete NextAuth files
   - Remove dependencies
   - Update existing pages

3. **Phase 3: Database Setup** (10 minutes)
   - Create seed script
   - Run migrations and seed

4. **Phase 4: Testing** (20 minutes)
   - Manual testing
   - Fix any issues
   - Verify in browser

**Total Estimated Time:** ~90 minutes
