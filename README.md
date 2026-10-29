# WAYFARER AI 🧭
### An AI-Powered Travel Planning Platform

**WAYFARER AI** transforms travel ideas into thoughtful, personalized, human-paced journeys. Inspired by premium travel-editorial publications, it balances celebrated sights with authentic hidden gems, dynamic day regeneration, smart budget tracking, and interactive maps.

---

## 🌟 Features Implemented

1. **Travel-Editorial Brand Identity**
   - Color palette: Midnight Navy (`#101827`), Warm Off-white (`#F8F7F3`), Forest Green (`#176B52`), Soft Sage (`#DCE9DF`), and Muted Gold (`#D6AD60`).
   - Clean visual hierarchy, typography, and card consistency.
2. **First-Class Indian Rupee (INR ₹) Default Currency**
   - Indian numbering system formatting (e.g. ₹1,25,000, ₹2,60,000) using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`.
   - Multi-currency architecture supporting USD, EUR, GBP, and JPY while defaulting strictly to INR.
   - Realistic market pricing in INR for destinations, activities, and budget brackets rather than naive 1:1 conversions.
   - Strict separation of numeric amounts from formatted presentation strings.
2. **Interactive Hero & Search Bar**
   - Destination presets (Kyoto, Amalfi Coast, Swiss Alps, Oaxaca, Banff).
   - Instant search with departure city, duration, travelers, and budget style.
3. **7-Step AI Trip Planning Wizard**
   - **Step 1:** Destination & Optional Departure Airport.
   - **Step 2:** Travel Dates, Trip Duration (2–14 days), and flexible-dates toggle.
   - **Step 3:** Party composition (Solo, Couple, Family, Group) with adult & child counts.
   - **Step 4:** Budget Style (Economy, Comfortable, Luxury) & total amount.
   - **Step 5:** Travel Interests (Food, Culture, Nature, Adventure, Art, Relaxation, Photography).
   - **Step 6:** Preferences (Pace: Relaxed, Balanced, Fast; Dietary; Accommodation; Transit).
   - **Step 7:** Review Summary & animated generation with status feedback.
4. **Interactive Itinerary Workspace**
   - Destination cover photography & metadata banner.
   - Interactive Day Selector tabs with daily themes and costs.
   - Categorized timeline (Morning, Afternoon, Evening).
   - Complete Activity controls:
     - Mark as Completed (checkbox with strikethrough).
     - Inline Edit Activity modal (name, time, category, duration, cost, tip).
     - Add Custom Activity to any day.
     - Move activities Up and Down in schedule order.
     - Delete activity with confirmation.
   - **Regenerate Day**: Refresh any single day's schedule without wiping the trip.
   - Inclement weather alternatives & practical local tips.
5. **Interactive Route Map**
   - Geo-coordinates for itinerary destinations.
   - Interactive pins for scheduled activities.
   - One-click navigation link to Google Maps / OpenStreetMap directions.
6. **Smart Budget & Expense Planner**
   - Itemized budget allocation (Flights, Lodging, Food, Local Transit, Activities, Shopping, Buffer).
   - Visual progress bars showing percentage allocations.
   - Tracked Actual Expense log with real spending comparisons.
7. **Curated Destination Discovery**
   - Search by city, country, or tag.
   - Filter chips by Region (Asia, Europe, Americas) and Travel Style.
   - 1-click "Plan This Journey" button pre-populating the wizard.
8. **Persistence & Saved Trips**
   - Saved trips modal/drawer allowing users to switch, duplicate, or delete trips.
   - Instant local storage persistence (persists across page reloads).
9. **Sharing & Clean Export**
   - Shareable link generator with copy button.
   - Print stylesheet (`@media print`) for clean PDF export without buttons or navigation bars.
   - Structured JSON dataset download.
10. **Authentication & Local Demo Mode**
    - Sign In / Sign Up modal with email/password.
    - 1-click **Continue in Local Demo Mode** for testing without credentials.
    - Supabase RLS schema included for PostgreSQL cloud sync.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

The application is configured to run at **[http://localhost:3001](http://localhost:3001)** (leaving port 3000 free for existing local services).

To run on a specific port:
```bash
npx next dev -p 3000
# or
npx next dev -p 3001
```

### 3. Run Quality, Type & Unit Test Checks
```bash
# Run unit test suite (currency, validation, budget arithmetic, AI schema)
npm test

# Check TypeScript types (strict mode)
npx tsc --noEmit

# Run ESLint
npm run lint

# Build production bundle
npm run build
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` to configure live external providers:

```bash
cp .env.example .env.local
```

| Variable | Description | Default / Fallback |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Site root URL | `http://localhost:3001` |
| `GEMINI_API_KEY` | Google Gemini API key for live generation | Local generative engine |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Local storage demo |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous API key | Local storage demo |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server role key | — |

---

## 🗄️ Database Setup (Supabase)

When deploying to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy your project URL and Anon key into `.env.local`.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add any environment variables (`GEMINI_API_KEY`, Supabase keys if using live cloud sync).
4. Click **Deploy**.
