// Supabase browser client configuration
// This module creates and exports a Supabase client instance for client-side operations
// It uses environment variables for secure URL and anonymous key configuration

import { createBrowserClient } from "@supabase/ssr"

/**
 * Creates a Supabase client instance for browser-side authentication and data access
 * @returns {SupabaseClient} A configured Supabase client using browser-safe credentials
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
