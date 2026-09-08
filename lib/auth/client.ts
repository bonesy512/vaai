import { createClient } from '@/lib/supabase/client';
import type { SignUpVeteranInput, SignInInput, UserProfile } from './types';

export function getAuthClient() {
  return createClient();
}

/**
 * Register a transitioning military veteran with service telemetry
 */
export async function signUpVeteran(input: SignUpVeteranInput) {
  const supabase = getAuthClient();

  const metadata = {
    full_name: input.fullName,
    role: 'student' as const,
    military_branch: input.militaryBranch,
    military_mos: input.militaryMos,
    clearance_level: input.clearanceLevel,
    target_track: input.targetTrack,
  };

  if (input.isMagicLink) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: input.email,
      options: {
        data: metadata,
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/courses` : undefined,
      },
    });

    if (error) throw error;
    return { user: null, session: null, message: 'Magic link sent. Please verify via email.' };
  }

  if (!input.password) {
    throw new Error('Password is required when not using magic link.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;

  // Best effort direct profile write if user session is active immediately
  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: input.email,
        full_name: input.fullName,
        role: 'student',
        military_branch: input.militaryBranch,
        military_mos: input.militaryMos,
        clearance_level: input.clearanceLevel,
        target_track: input.targetTrack,
      });
    } catch {
      // Ignored if RLS or database trigger already populated it
    }
  }

  return { user: data.user, session: data.session, message: 'Registration successful.' };
}

/**
 * Sign in existing user (Password or Magic Link)
 */
export async function signIn(input: SignInInput) {
  const supabase = getAuthClient();

  if (input.isMagicLink) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: input.email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/courses` : undefined,
      },
    });

    if (error) throw error;
    return { user: null, session: null, isMagicLink: true };
  }

  if (!input.password) {
    throw new Error('Password is required.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) throw error;
  return { user: data.user, session: data.session, isMagicLink: false };
}

/**
 * Sign out current session
 */
export async function signOut() {
  const supabase = getAuthClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Retrieve current client-side authenticated user profile
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = getAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    return profile as UserProfile;
  }

  // Fallback to user metadata
  return {
    id: user.id,
    email: user.email || '',
    full_name: (user.user_metadata?.full_name as string) || (user.email?.split('@')[0] || 'User'),
    role: (user.app_metadata?.role || user.user_metadata?.role || 'student') as UserProfile['role'],
    military_branch: user.user_metadata?.military_branch,
    military_mos: user.user_metadata?.military_mos,
    clearance_level: user.user_metadata?.clearance_level,
    target_track: user.user_metadata?.target_track,
  };
}
