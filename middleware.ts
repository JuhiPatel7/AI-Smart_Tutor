// Import the updateSession function from the Supabase middleware utility
// This function handles session updates (likely authentication/session management)
import { updateSession } from "@/lib/supabase/middleware"

// Import the NextRequest type from Next.js server utilities
// NextRequest is used to type the incoming HTTP request object in middleware
import type { NextRequest } from "next/server"

// Export an async middleware function that processes incoming requests
// This function intercepts requests and performs session management operations
// The async keyword allows us to use await for the updateSession function
export async function middleware(request: NextRequest) {
  // Call updateSession to handle session updates and return the processed response
  // This maintains user authentication state across requests
  return await updateSession(request)
}

// Export a config object that specifies which routes the middleware applies to
// This configuration determines which requests will trigger the middleware function
export const config = {
  // matcher is a regex pattern that defines which routes should use this middleware
  // The negative lookahead pattern excludes Next.js internals, images, and static assets
  // ((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)
  // This means: match all routes EXCEPT static files, images, and favicons
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
