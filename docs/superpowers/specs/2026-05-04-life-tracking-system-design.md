# Life Update - Life Transformation Tracking System

**Design Document**  
**Date:** May 4, 2026  
**Version:** 1.0  
**Target:** Full v1 Release

---

## Executive Summary

Life Update is a **brutally honest life transformation tracking system** that helps users execute ambitious 5-year plans through daily accountability and algorithmic progress tracking.

**Core Problem:** People have goals but fail to execute because they lack:
1. Daily accountability
2. Real-time feedback on whether they're on-track
3. Mathematical certainty about trajectory

**Solution:** A hybrid system where:
- **Static Plan** (`.md files in repo) = The map (5-year vision, 1-year goals, baseline)
- **Web App** (Next.js + Supabase) = The execution engine (daily tracking, progress calculation, brutal honesty)

**User Profile:**
- Name: Danilo
- Age: 30s
- Background: UX/UI Designer + Systems Engineer, 10+ years experience
- IQ: 120-128 (high intelligence, capable of intense work)
- Personality: Disciplined when given clear direction, needs "north star"
- Current State: Somewhat lost, stressed (7.5/10), moderately satisfied (5/10)
- Goal: 5-10x life improvement in 5 years (physical, financial, professional, mental, relationships)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       GITHUB REPOSITORY                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /plan (Source of Truth)                            │   │
│  │  ├── baseline.md          (Current state)           │   │
│  │  ├── goals-1year.md       (1-year targets)          │   │
│  │  ├── goals-5year.md       (5-year vision)           │   │
│  │  ├── tracking-config.md   (What to track daily)     │   │
│  │  └── dimensions/          (Deep dives per area)     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                 │
│                    Git Push triggers                         │
│                            ↓                                 │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (Deployment)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js 14 App                                     │   │
│  │  ├── Server Components (read /plan files)           │   │
│  │  ├── API Routes (CRUD + Analytics)                  │   │
│  │  ├── Client Components (UI + Interactions)          │   │
│  │  └── Middleware (Auth)                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE (Backend Services)                 │
│  ├── PostgreSQL (tracking data: daily/weekly/monthly)       │
│  ├── Auth (user authentication)                             │
│  └── Row-Level Security (data isolation)                    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**1. Plan Definition (One-time + Periodic Updates):**
```
User + Claude → Edit .md files → Git commit/push → Vercel redeploy → App re-reads plan
```

**2. Daily Tracking (Every day):**
```
User → Daily Entry Form → POST /api/entries/daily → Supabase PostgreSQL → Success
```

**3. Progress Calculation (On dashboard load):**
```
User → Dashboard → GET /api/analytics/progress → 
  Read /plan files + Query Supabase → 
  Run algorithms (projections, status, score) → 
  Return JSON → Render UI
```

**4. Analytics (On-demand):**
```
User → Analytics Page → GET /api/analytics/trends → 
  Query historical data → 
  Calculate trends/charts → 
  Return time-series data → 
  Render charts (Recharts)
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Backend
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** Supabase Auth + NextAuth.js
- **API:** Next.js API Routes (serverless functions)

### Deployment & Infra
- **Hosting:** Vercel (frontend + API routes)
- **Database:** Supabase (managed PostgreSQL)
- **CI/CD:** Vercel Git integration (auto-deploy on push)
- **Domain:** TBD (will use Vercel subdomain initially)

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint + Prettier
- **Git:** GitHub
- **Editor:** VS Code + Claude Code

---

## Database Schema

See `prisma/schema.prisma` for complete schema. Key tables:

**1. users** - User accounts (prepared for multi-user future)

**2. daily_entries** - Daily tracking data
- Physical: weight, sleep, exercise
- Habits: alcohol, porn, tobacco, meditation
- Emotional: stress, energy, satisfaction
- Unique constraint: one entry per user per day

**3. weekly_entries** - Weekly measurements
- Body composition: body fat %, measurements
- Professional: productive hours, projects

**4. monthly_entries** - Monthly reviews
- Financial: income, expenses, savings, debt
- Professional: new skills, certifications
- Relationships: quality scores

**5. plan_snapshots** - Historical versions of plan files
- Tracks when user updates goals
- Allows "time travel" to see how plans evolved

---

## Core Features

### 1. Daily Logging (Mobile-First)

**Purpose:** Quick entry of daily metrics before bed.

**UX Flow:**
1. User opens `/daily` (bookmark on phone home screen)
2. Form is pre-filled with yesterday's values
3. User adjusts what changed today (weight, sleep, habits, etc.)
4. Tap "Save" → Confetti if streak continues → Redirect to dashboard

**Design Principles:**
- **Fast:** < 60 seconds to complete
- **Forgiving:** All fields optional except date
- **Visual:** Large touch targets, clear yes/no for habits
- **Motivating:** Streak counter prominent, celebration on save

**Technical:**
- Client-side form state (React useState)
- Optimistic UI updates
- POST /api/entries/daily with upsert logic
- Validation: basic (date required, numbers in range)

### 2. Dashboard (Desktop + Mobile)

**Purpose:** Truth at a glance. Where am I vs where I should be?

**Layout (Desktop):**
```
┌────────────────────────────────────────────────────────┐
│  OVERALL PROGRESS: 78% ON TRACK                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░                     │
│  🔥 32 day clean streak                                │
└────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 💰 INCOME    │ │ 🏋️ WEIGHT    │ │ 🎯 HABITS    │ │ 🧠 MENTAL    │
│ $5,200/mo    │ │ 82 kg        │ │ 28/30 clean  │ │ Stress 4/10  │
│ ↑ $1,000     │ │ ↓ 3 kg       │ │ 🟢 93%       │ │ 🔵 On track  │
│ 🟢 38% ahead │ │ 🔵 On track  │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

Recent Activity:
• Logged today ✓
• 7-day weight trend: ↓
• Income up 24% vs baseline

[LOG TODAY]  [VIEW ANALYTICS]
```

**Key Metrics Shown:**
- Overall progress score (0-100%)
- Current streaks (habits)
- Top 4-6 priority metrics with status colors
- Recent activity feed
- Quick actions (Log Today, View Analytics)

**Status Colors:**
- 🟢 Green: 10%+ ahead of plan
- 🔵 Blue: ±10% of plan (on track)
- 🟡 Yellow: 10-20% behind (warning)
- 🔴 Red: 20%+ behind (danger)

**Technical:**
- Server Component (fast initial load)
- Data fetched from `/api/analytics/progress`
- Client Components for interactive cards
- Real-time calculations on each page load

### 3. Progress Algorithms

**Three Projection Models:**

**A) Linear Projection** (default for most metrics)
```
Expected Value = Baseline + (Goal - Baseline) × (Days Elapsed / Total Days)
```
Use for: Weight loss, savings accumulation, habit consistency

**B) Exponential Projection** (for products/income)
```
Expected Value = Baseline × (Goal / Baseline) ^ (Days Elapsed / Total Days)
```
Use for: Income (products grow exponentially)

**C) Adaptive Projection** (learns from actual velocity)
```
1. Calculate recent velocity: slope of last 30 days
2. Project final value: Current + (Velocity × Days Remaining)
3. Compare to goal
4. Generate recommendation
```
Use for: Everything after 30+ days of data

**Status Calculation:**
```typescript
percentageVsExpected = ((Actual - Expected) / Expected) × 100

if (percentageVsExpected >= 20)  → CRUSHING (neon green)
if (percentageVsExpected >= 10)  → AHEAD (green)
if (percentageVsExpected >= -10) → ON TRACK (blue)
if (percentageVsExpected >= -20) → WARNING (yellow)
if (percentageVsExpected >= -30) → DANGER (red)
else                             → CRITICAL (dark red)
```

**Overall Progress Score:**
```typescript
weights = {
  physical: 0.15,
  financial: 0.30,    // Highest weight (user priority)
  professional: 0.25,
  mental: 0.15,
  habits: 0.15
}

overallScore = Σ (categoryScore × weight)
```

### 4. Analytics & Visualizations

**Purpose:** Deep dive into trends, patterns, correlations.

**Pages:**

**4a. Physical Analytics (`/analytics/physical`)**
- Weight line chart (baseline → goal → actual)
- Body fat % over time
- Sleep hours bar chart (with 7.5h target line)
- Exercise frequency heatmap

**4b. Financial Analytics (`/analytics/financial`)**
- Income line chart with projections
- Savings accumulation area chart
- Debt paydown progress bar
- Net worth over time

**4c. Habits Analytics (`/analytics/habits`)**
- GitHub-style heatmap (90 days, green = clean, red = relapse)
- Streak history
- Success rate by day of week
- Correlation: "When you exercise, alcohol consumption drops 40%"

**4d. Emotional/Mental (`/analytics/emotional`)**
- Stress level line chart
- Energy level over time
- Day satisfaction trend
- Correlation with other metrics

**Chart Library:** Recharts (React wrapper for D3)

**Design:**
- Dark theme with accent colors
- Tooltips on hover
- Date range selector (7d, 30d, 90d, 1yr, All)
- Export data button (CSV download)

### 5. Plan Viewer

**Purpose:** See your plan rendered beautifully, with live comparison.

**Pages:**

**5a. Plan Overview (`/plan`)**
- Three cards: Baseline | Year 1 Goals | Year 5 Vision
- Click any card → Full view

**5b. Baseline View (`/plan/baseline`)**
- Renders `baseline.md` with styling
- Shows current values next to baseline
- Color coding: green if improved, red if worse

**5c. Goals View (`/plan/year-1`, `/plan/year-5`)**
- Renders goals file
- Shows progress bars next to each goal
- Color coding: on-track vs behind

**Technical:**
- Markdown rendering with `react-markdown`
- Custom components for metrics (extract numbers, compare)
- Server Component (reads file system directly)

### 6. Weekly & Monthly Entry Forms

**Weekly Form (`/weekly`):**
- Body fat % (requires measurement tool)
- Circumferences (waist, chest, arms)
- Productive hours this week
- Projects advanced

**Triggered:** Every Sunday (reminder notification)

**Monthly Form (`/monthly`):**
- Income (last month)
- Expenses (last month)
- Savings (net)
- Total savings balance
- Debt remaining
- New skills learned
- Certifications earned
- Relationship quality scores (family, romantic, social)

**Triggered:** Day 1 of each month (reminder notification)

### 7. Mobile Optimization

**PWA Setup:**
- `manifest.json` for install prompt
- Service worker for offline support (cache UI, queue entries)
- Home screen icon with badge (streak counter)

**Mobile Navigation:**
- Bottom tab bar (5 tabs: Home, Log, Analytics, Plan, Settings)
- Swipeable metric cards
- Touch-optimized inputs (large buttons, sliders for 1-10 scales)

**Responsive Breakpoints:**
- Mobile: < 640px (single column, bottom nav)
- Tablet: 640-1024px (2 columns, still bottom nav)
- Desktop: > 1024px (sidebar nav, 3-4 columns)

---

## UI/UX Design System

### Color Palette

```css
/* Base */
--bg-primary: #0a0a0a;
--bg-secondary: #141414;
--bg-tertiary: #1f1f1f;

/* Text */
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--text-tertiary: #666666;

/* Status */
--status-crushing: #00ff88;   /* Neon green */
--status-ahead: #10b981;
--status-on-track: #3b82f6;
--status-warning: #f59e0b;
--status-danger: #ef4444;
--status-critical: #dc2626;

/* Accent */
--accent-primary: #8b5cf6;    /* Purple - CTAs */
--accent-secondary: #06b6d4;  /* Cyan - info */
```

### Typography

- **Font:** Inter (clean, modern, excellent readability)
- **Display:** Bold, large (48px+) for hero numbers
- **Body:** Regular, 16px base
- **Mono:** JetBrains Mono for data tables, numbers

### Animation Principles

**Framer Motion variants:**
- Page transitions: Fade + slide up
- Number counters: Animate from 0 to value on mount
- Progress bars: Animate width from 0% to target
- Cards: Subtle lift on hover (2px translateY)
- Confetti: On streak milestones (canvas-confetti)

**Performance:**
- Animations under 400ms
- Use CSS transforms (GPU-accelerated)
- Disable animations on slow devices

### Component Library

**shadcn/ui components used:**
- Button, Card, Input, Select, Dialog, Dropdown Menu
- Tabs, Progress, Badge, Tooltip, Calendar
- All styled with dark theme by default

**Custom components:**
- MetricCard (status-aware card with number, delta, status)
- ProgressRing (circular progress indicator)
- StreakCounter (flame emoji + number)
- HabitHeatmap (calendar grid, GitHub-style)
- StatCard (big number + label + trend arrow)

---

## API Design

### Authentication

**Flow:**
1. User visits `/login`
2. Enter email/password
3. Supabase Auth validates
4. NextAuth creates session
5. Middleware protects dashboard routes

**Session:**
- JWT stored in httpOnly cookie
- 7-day expiry
- Refresh token for silent renewal

### Endpoints

**Plan:**
- `GET /api/plan/baseline` - Returns parsed baseline.md
- `GET /api/plan/goals/1-year` - Returns parsed goals-1year.md
- `GET /api/plan/goals/5-year` - Returns parsed goals-5year.md
- `POST /api/plan/snapshot` - Save a version of current plan

**Entries:**
- `GET /api/entries/daily?from=YYYY-MM-DD&to=YYYY-MM-DD` - Range query
- `POST /api/entries/daily` - Create or update today's entry
- `GET /api/entries/daily/[date]` - Get specific date
- `PUT /api/entries/daily/[date]` - Update specific date
- Similar for `/weekly` and `/monthly`

**Analytics:**
- `GET /api/analytics/progress` - Overall progress score + breakdown
- `GET /api/analytics/projections?metric=income` - Projection calculations
- `GET /api/analytics/trends?category=physical&period=90d` - Time-series data
- `GET /api/analytics/habits?habit=alcohol&days=90` - Habit stats + heatmap

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-05-04T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Weight must be between 40-200 kg",
    "field": "weight_kg"
  }
}
```

---

## Implementation Plan

### Sprint 1: Foundation (Days 1-7)
**Goal:** Basic login + daily logging works

Tasks:
- [ ] Initialize Next.js project with TypeScript + Tailwind
- [ ] Setup Prisma + Supabase connection
- [ ] Run initial migration (create tables)
- [ ] Implement Supabase Auth + NextAuth
- [ ] Create daily entry form (all fields)
- [ ] Create POST /api/entries/daily endpoint
- [ ] Deploy to Vercel
- [ ] Test: Can log a day from phone

### Sprint 2: Dashboard (Days 8-14)
**Goal:** Dashboard shows progress vs plan

Tasks:
- [ ] Implement plan parser (read .md files, extract metrics)
- [ ] Create GET /api/plan/* endpoints
- [ ] Create GET /api/analytics/progress endpoint
- [ ] Implement projection algorithms (linear, exponential, adaptive)
- [ ] Build dashboard page with MetricCards
- [ ] Build OverallScore component
- [ ] Build StreakCounter component
- [ ] Deploy + test

### Sprint 3: Analytics (Days 15-21)
**Goal:** Charts show trends over time

Tasks:
- [ ] Install Recharts
- [ ] Build WeightChart component
- [ ] Build IncomeChart component
- [ ] Build HabitHeatmap component
- [ ] Create /analytics/* pages
- [ ] Create GET /api/analytics/trends endpoint
- [ ] Create GET /api/analytics/habits endpoint
- [ ] Deploy + test

### Sprint 4: Polish (Days 22-30)
**Goal:** Full v1 feature-complete

Tasks:
- [ ] Weekly entry form + API
- [ ] Monthly entry form + API
- [ ] Plan viewer pages (/plan/baseline, /plan/year-1, /plan/year-5)
- [ ] Mobile navigation (bottom tabs)
- [ ] PWA setup (manifest, service worker)
- [ ] Settings page (profile, notifications, data export)
- [ ] Animations (Framer Motion transitions)
- [ ] Error handling + loading states
- [ ] Final polish + bug fixes
- [ ] Production deployment

---

## Success Metrics

**For the App:**
- [ ] User can log daily entry in < 60 seconds
- [ ] Dashboard loads in < 2 seconds
- [ ] Charts render smoothly (60fps)
- [ ] Mobile PWA install rate > 50%
- [ ] Zero data loss (all entries saved)

**For the User (Danilo):**
- [ ] Uses app daily for 30+ days straight
- [ ] Sees measurable progress in 3+ metrics after 30 days
- [ ] Reports feeling "more in control" and "less stressed"
- [ ] Continues using for 6+ months (true success)

---

## Future Enhancements (v2+)

**Not in v1, but planned:**

1. **AI Insights**
   - "Based on your pattern, you're likely to hit goal 2 months early"
   - "Your stress is highest on Mondays. Try meditation before work."
   - "When you exercise, your productivity increases 30%"

2. **Social Accountability**
   - Share progress with accountability partner
   - Weekly email report to trusted friend
   - Public dashboard (optional)

3. **Gamification**
   - Achievements (badges for milestones)
   - Levels (Beginner → Advanced → Legend)
   - Leaderboard (if multi-user)

4. **Advanced Analytics**
   - Correlation matrix (which habits affect which outcomes)
   - Predictive modeling (ML-based projections)
   - Cohort analysis (how you compare to similar users)

5. **Integrations**
   - Fitbit/Apple Health (auto-import weight, sleep)
   - Bank APIs (auto-import transactions)
   - Notion (sync notes)

6. **Export & Reporting**
   - PDF monthly reports
   - Annual review document
   - CSV data export

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User abandons app after 2 weeks | HIGH | MEDIUM | Make daily logging FAST (<60s). Celebrate streaks. |
| Goals feel too ambitious, demotivating | HIGH | MEDIUM | Adaptive projections show realistic path. Can adjust goals anytime. |
| Technical complexity delays launch | MEDIUM | LOW | Strict MVP scope. Use proven tools (Next.js, Supabase). |
| Data loss / bugs | HIGH | LOW | Prisma migrations, Supabase backups, careful testing. |
| User doesn't understand how to use | MEDIUM | MEDIUM | Onboarding flow, tooltips, simple UI. |

---

## Conclusion

Life Update is a **ruthlessly honest execution system** for ambitious life transformation. 

It works because:
1. **Clear north star** (5-year vision in .md files)
2. **Daily accountability** (log every day, see streaks)
3. **Mathematical truth** (algorithms tell you if you're on-track)
4. **Brutal honesty** (no sugarcoating, colors show reality)
5. **Fast feedback loop** (see progress instantly)

The system assumes the user (Danilo) is:
- Capable of intense work
- Disciplined when given structure
- Motivated by seeing progress
- Honest with himself

If those assumptions hold, this system will work.

**Next Steps:**
1. Review this spec
2. Get user approval
3. Invoke writing-plans skill
4. Build Sprint 1
5. Deploy and iterate

---

**Document Version:** 1.0  
**Last Updated:** May 4, 2026  
**Author:** Claude Sonnet 4.5  
**Status:** Ready for Implementation
