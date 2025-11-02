// This is a client-side component - enables browser-based interactivity
"use client"

// Import React type for form event handling
import type React from "react"
// Import Supabase client creation function for authentication
import { createClient } from "@/lib/supabase/client"
// Import Button UI component for form submission
import { Button } from "@/components/ui/button"
// Import Card components for page layout structure
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// Import Input component for email/password fields
import { Input } from "@/components/ui/input"
// Import Label component for form field labels
import { Label } from "@/components/ui/label"
// Import Link for navigation to login page
import Link from "next/link"
// Import router for programmatic navigation after successful sign-up
import { useRouter } from "next/navigation"
// Import useState hook for managing form state
import { useState } from "react"

/**
 * SignUpPage Component - Handles user registration
 * This component manages the sign-up form, validates credentials,
 * and registers new users with Supabase
 * 
 * @returns JSX element with sign-up form UI
 */
export default function SignUpPage() {
  // State for email input value
  const [email, setEmail] = useState("")
  // State for password input value
  const [password, setPassword] = useState("")
  // State for password confirmation input
  const [repeatPassword, setRepeatPassword] = useState("")
  // State for storing error messages from sign-up attempt
  const [error, setError] = useState<string | null>(null)
  // State for tracking loading state during sign-up process
  const [isLoading, setIsLoading] = useState(false)
  // Router instance for navigation after successful sign-up
  const router = useRouter()

  /**
   * Handle sign-up form submission
   * Validates that passwords match
   * Creates a new user account with Supabase Auth
   * On success, redirects to email confirmation page
   * On failure, displays error message
   * 
   * @param e - Form submission event
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // Validate that both password fields match
    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Attempt to create new user account with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set redirect URL for email confirmation - uses environment variable if available
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      })
      // If Supabase returns an error, throw it
      if (error) throw error
      // Redirect to success page for email confirmation
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      // Handle errors - extract message if Error instance
      setError(
        error instanceof Error ? error.message : "An error occurred"
      )
    } finally {
      // Reset loading state after sign-up attempt completes
      setIsLoading(false)
    }
  }

  return (
    // Main container - full viewport height with gradient background
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Responsive card wrapper - limits max width */}
      <div className="w-full max-w-sm">
        {/* Flex column container for spacing elements */}
        <div className="flex flex-col gap-6">
          {/* Header section with app branding */}
          <div className="flex flex-col items-center gap-2 text-center">
            {/* Application title */}
            <h1 className="text-3xl font-bold text-foreground">
              AI Tutor
            </h1>
            {/* Application tagline */}
            <p className="text-sm text-muted-foreground">
              Learn smarter with AI-powered study assistance
            </p>
          </div>

          {/* Card component containing sign-up form */}
          <Card>
            {/* Card header with title and description */}
            <CardHeader>
              {/* Main heading for the form */}
              <CardTitle className="text-2xl">Sign up</CardTitle>
              {/* Descriptive text for user guidance */}
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>

            {/* Card body containing the form */}
            <CardContent>
              {/* Form element with sign-up handler */}
              <form onSubmit={handleSignUp}>
                {/* Main form fields container */}
                <div className="flex flex-col gap-6">
                  {/* Email input field group */}
                  <div className="grid gap-2">
                    {/* Email field label */}
                    <Label htmlFor="email">Email</Label>
                    {/* Email input field */}
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password input field group */}
                  <div className="grid gap-2">
                    {/* Password field label */}
                    <Label htmlFor="password">Password</Label>
                    {/* Password input field */}
                    <Input
                      id="password"
                      type="password"
                      placeholder="•••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password confirmation input field group */}
                  <div className="grid gap-2">
                    {/* Password confirmation field label */}
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    {/* Password confirmation input field */}
                    <Input
                      id="repeat-password"
                      type="password"
                      placeholder="•••••••••"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Error message display - shown only if error exists */}
                  {error && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Sign-up button - disabled during loading state */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Login prompt - directs existing users to login page */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
