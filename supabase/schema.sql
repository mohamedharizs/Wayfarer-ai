-- WAYFARER AI — PostgreSQL Database Schema & Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  cover_image TEXT,
  summary TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  budget_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  preferences_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  practical_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  weather_alternatives TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_shared BOOLEAN DEFAULT FALSE,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(9), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trips"
  ON public.trips FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared trips"
  ON public.trips FOR SELECT
  USING (is_shared = TRUE);

-- 3. Itinerary Days Table
CREATE TABLE IF NOT EXISTS public.itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES public.trips ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  weather_recommendation TEXT,
  daily_estimated_cost NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access days of their trips"
  ON public.itinerary_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = itinerary_days.trip_id
      AND (trips.user_id = auth.uid() OR trips.is_shared = TRUE)
    )
  );

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id UUID REFERENCES public.itinerary_days ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  period TEXT CHECK (period IN ('morning', 'afternoon', 'evening')),
  category TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  location_name TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  insider_tip TEXT,
  booking_required BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access activities of their trips"
  ON public.activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.itinerary_days
      JOIN public.trips ON trips.id = itinerary_days.trip_id
      WHERE itinerary_days.id = activities.day_id
      AND (trips.user_id = auth.uid() OR trips.is_shared = TRUE)
    )
  );

-- 5. Actual Expenses Table
CREATE TABLE IF NOT EXISTS public.trip_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES public.trips ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage expenses of their own trips"
  ON public.trip_expenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_expenses.trip_id
      AND trips.user_id = auth.uid()
    )
  );
