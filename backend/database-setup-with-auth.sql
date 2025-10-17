-- Updated Database Schema with User Authentication
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medicines table with user_id
CREATE TABLE IF NOT EXISTS medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  current_stock INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  morning_qty INTEGER NOT NULL DEFAULT 0,
  afternoon_qty INTEGER NOT NULL DEFAULT 0,
  night_qty INTEGER NOT NULL DEFAULT 0,
  threshold INTEGER NOT NULL DEFAULT 5,
  next_due TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_timing_settings table for global reminder times
CREATE TABLE IF NOT EXISTS user_timing_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  morning_time TIME DEFAULT '08:00:00',
  afternoon_time TIME DEFAULT '14:00:00',
  night_time TIME DEFAULT '20:00:00',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create intakes table for tracking medicine consumption
CREATE TABLE IF NOT EXISTS intakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_time TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('scheduled', 'taken', 'missed', 'skipped')) NOT NULL DEFAULT 'scheduled',
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  stock_adjusted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_metrics table with user_id
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  systolic INTEGER,
  diastolic INTEGER,
  heartbeat INTEGER,
  sugar_context TEXT,
  sugar_value NUMERIC,
  notes TEXT,
  trend TEXT DEFAULT 'stable',
  status TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_timing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Medicines policies
CREATE POLICY "Users can view own medicines" ON medicines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medicines" ON medicines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medicines" ON medicines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medicines" ON medicines FOR DELETE USING (auth.uid() = user_id);

-- Health metrics policies
CREATE POLICY "Users can view own health metrics" ON health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health metrics" ON health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User timing settings policies
CREATE POLICY "Users can view own timing settings" ON user_timing_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own timing settings" ON user_timing_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own timing settings" ON user_timing_settings FOR UPDATE USING (auth.uid() = user_id);

-- Intakes policies
CREATE POLICY "Users can view own intakes" ON intakes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own intakes" ON intakes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own intakes" ON intakes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own intakes" ON intakes FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicines_user_id ON medicines(user_id);
CREATE INDEX IF NOT EXISTS idx_medicines_created_at ON medicines(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_created_at ON health_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON health_metrics(type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_timing_settings_user_id ON user_timing_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_intakes_user_id ON intakes(user_id);
CREATE INDEX IF NOT EXISTS idx_intakes_medicine_id ON intakes(medicine_id);
CREATE INDEX IF NOT EXISTS idx_intakes_scheduled_time ON intakes(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_intakes_status ON intakes(status);