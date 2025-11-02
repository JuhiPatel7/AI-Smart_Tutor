// Supabase middleware for authentication and session management
// This middleware handles cookie management and authentication state during server-side requests
// It ensures that authenticated users are properly routed and unauthorized users are redirected to login

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Updates the session for the current request
 * Manages Supabase client initialization with cookie handling
 * Redirects unauthenticated users to login page (except for auth and root pages)
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response with updated session/cookies
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // Redirect unauthenticated users to login page
  // Exception: Allow access to auth pages and home page
  if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }
  return supabaseResponse
}
