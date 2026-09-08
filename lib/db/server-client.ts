/**
 * Server-Side Supabase Client Factory
 * Safely initializes SupabaseClient<Database> for service_role and anon contexts
 * with graceful null fallback when credentials are absent or in mock environments.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './schema';

/**
 * Returns a privileged Supabase client authenticated via SUPABASE_SERVICE_ROLE_KEY.
 * Used for administrative persistence (employer_agreements, wioa_placements, audit_events).
 * Returns null if credentials are not configured or set to mock.
 */
export function getServiceRoleClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl.includes('mock') ||
    serviceRoleKey.includes('mock')
  ) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Returns a standard anon Supabase client.
 * Returns null if credentials are not configured or set to mock.
 */
export function getAnonymousClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey || supabaseUrl.includes('mock') || anonKey.includes('mock')) {
    return null;
  }

  return createClient<Database>(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}
