-- =====================================================================================
-- Migration: 20260908010000_user_profiles_and_roles.sql
-- Description: Core User Lifecycle, Veteran Profiles, Role-Based Access Control,
--              and RLS Security for Students, Employers, and LMS Administrators.
-- Compliance: NIST SP 800-171 Rev. 3 AC-2/AC-3, CMMC 2.0 Level 2, WIOA Title I
-- =====================================================================================

-- 1. Ensure public.profiles table exists and contains all required veteran fields
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::TEXT, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::TEXT, now())
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'employer', 'admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS military_branch TEXT CHECK (military_branch IS NULL OR military_branch IN ('Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force', 'Other'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS military_mos TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clearance_level TEXT CHECK (clearance_level IS NULL OR clearance_level IN ('None', 'Secret', 'TS/SCI', 'Public Trust'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_track TEXT CHECK (target_track IS NULL OR target_track IN ('engineering', 'security', 'operations'));

-- Create indexing for performant role & track queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_clearance_level ON public.profiles (clearance_level);
CREATE INDEX IF NOT EXISTS idx_profiles_target_track ON public.profiles (target_track);

-- 2. Enable Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Policy: Authenticated users can view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy: Authenticated users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Policy: Authenticated users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Admins have unrestricted access to all profiles
CREATE POLICY "profiles_admin_all" ON public.profiles
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    );

-- 3. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        military_branch,
        military_mos,
        clearance_level,
        target_track
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NEW.raw_user_meta_data->>'military_branch',
        NEW.raw_user_meta_data->>'military_mos',
        NEW.raw_user_meta_data->>'clearance_level',
        NEW.raw_user_meta_data->>'target_track'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        role = COALESCE(EXCLUDED.role, public.profiles.role),
        military_branch = COALESCE(EXCLUDED.military_branch, public.profiles.military_branch),
        military_mos = COALESCE(EXCLUDED.military_mos, public.profiles.military_mos),
        clearance_level = COALESCE(EXCLUDED.clearance_level, public.profiles.clearance_level),
        target_track = COALESCE(EXCLUDED.target_track, public.profiles.target_track),
        updated_at = timezone('utc'::TEXT, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
