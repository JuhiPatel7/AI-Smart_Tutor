// Supabase server-side client factory
// This module creates a Supabase client instance for server-side operations
// It handles cookie management for authentication state persistence across requests
// Handles errors gracefully when called from Server Components

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Creates a Supabase client instance for server-side authentication and data access
 * Manages cookies for session persistence while handling Server Component limitations
 * @async
 * @returns {Promise<SupabaseClient>} A configured Supabase client using server-side credentials
 */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
