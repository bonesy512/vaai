import { createClient } from '@/lib/supabase/server';
import type { UserProfile, UserRole } from './types';

/**
 * Server-side user retrieval with cookie context
 */
export async function getServerAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Server-side user profile retrieval with role validation
 */
export async function getServerUserProfile(): Promise<UserProfile | null> {
  const user = await getServerAuthUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profile) {
    return profile as UserProfile;
  }

  // Fallback to app_metadata / user_metadata
  const role = (user.app_metadata?.role || user.user_metadata?.role || 'student') as UserRole;

  return {
    id: user.id,
    email: user.email || '',
    full_name: (user.user_metadata?.full_name as string) || (user.email?.split('@')[0] || 'User'),
    role,
    military_branch: user.user_metadata?.military_branch,
    military_mos: user.user_metadata?.military_mos,
    clearance_level: user.user_metadata?.clearance_level,
    target_track: user.user_metadata?.target_track,
  };
}

/**
 * Check if the server-authenticated session has the administrator role
 */
export async function isServerAdmin(): Promise<boolean> {
  const profile = await getServerUserProfile();
  return profile?.role === 'admin';
}

/**
 * Guard utility for server components
 */
export async function requireAuthUser() {
  const user = await getServerAuthUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Guard utility requiring admin role
 */
export async function requireAdminRole() {
  const profile = await getServerUserProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('FORBIDDEN_NOT_ADMIN');
  }
  return profile;
}
