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
// Import Link for navigation to sign-up page
import Link from "next/link"
// Import router for programmatic navigation after successful login
import { useRouter } from "next/navigation"
// Import useState hook for managing form state
import { useState } from "react"

/**
 * LoginPage Component - Handles user authentication
 * This component manages the login form, validates credentials,
 * and authenticates users with Supabase
 * 
 * @returns JSX element with login form UI
 */
export default function LoginPage() {
  // State for email input value
  const [email, setEmail] = useState("")
  // State for password input value
  const [password, setPassword] = useState("")
  // State for storing error messages from login attempt
  const [error, setError] = useState<string | null>(null)
  // State for tracking loading state during login process
  const [isLoading, setIsLoading] = useState(false)
  // Router instance for navigation after successful login
  const router = useRouter()

  /**
   * Handle login form submission
   * Validates credentials with Supabase Auth
   * On success, redirects to dashboard
   * On failure, displays error message
   * 
   * @param e - Form submission event
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Attempt to sign in with email and password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      // If Supabase returns an error, throw it
      if (error) throw error
      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (error: unknown) {
      // Handle errors - extract message if Error instance
      setError(
        error instanceof Error ? error.message : "An error occurred"
      )
    } finally {
      // Reset loading state after login attempt completes
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

          {/* Card component containing login form */}
          <Card>
            {/* Card header with title and description */}
            <CardHeader>
              {/* Main heading for the form */}
              <CardTitle className="text-2xl">Login</CardTitle>
              {/* Descriptive text for user guidance */}
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            {/* Card body containing the form */}
            <CardContent>
              {/* Form element with login handler */}
              <form onSubmit={handleLogin}>
                {/* Main form fields container */}
                <div className="flex flex-col gap-6">
                  {/* Email input field group */}
                  <div className="grid gap-2">
                    {/* Email field label */}
                    <Label htmlFor="email">Email</Label>
                    {/* Email input with error state styling */}
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
                    {/* Password field label with forgot password link */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    {/* Password input field */}
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Error message display - shown only if error exists */}
                  {error && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Login button - disabled during loading state */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sign up prompt - directs new users to registration */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
