// Import redirect function from Next.js for authentication checks
import { redirect } from "next/navigation"
// Import Supabase server-side client for database operations
import { createClient } from "@/lib/supabase/server"
// Import the dashboard client component that handles interactive features
import DashboardClient from "@/components/dashboard-client"

/**
 * DashboardPage - Server component for the main dashboard
 * This is an async Server Component that handles:
 * - Authentication verification (redirects to login if not authenticated)
 * - Fetching user data from Supabase
 * - Fetching user's uploaded PDF files from the database
 * - Passing data to the interactive client component
 * 
 * @returns JSX element with dashboard content rendered from DashboardClient
 */
export default async function DashboardPage() {
  // Initialize Supabase server client for authenticated requests
  const supabase = await createClient()
  
  // Fetch the currently authenticated user
  // getUser() retrieves the session user if one exists
  const {
    data: {
      user,
    },
    error,
  } = await supabase.auth.getUser()
  
  // Check if user is authenticated
  // If no user or error occurred, redirect to login page
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's PDF files from the database
  // Query the pdf_files table for all files belonging to this user
  // Results are ordered by creation date (newest first)
  const {
    data: pdfFiles,
  } = await supabase
    .from("pdf_files")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })

  // Return the interactive dashboard client component
  // Pass user data and initial PDF files to enable client-side interactivity
  return (
    <DashboardClient
      user={user}
      initialPdfFiles={pdfFiles || []}
    />
  )
}
