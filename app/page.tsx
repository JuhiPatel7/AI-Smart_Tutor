// Import Next.js Link component for client-side navigation
import Link from "next/link"
// Import Button component from the UI component library
import { Button } from "@/components/ui/button"
// Import icons from lucide-react icon library
import { BookOpen, Brain, Upload, MessageSquare } from "lucide-react"

/**
 * HomePage Component
 * This is the landing page of the AI Tutor application
 * Displays the main features and call-to-action buttons
 * @returns JSX element with the landing page layout
 */
export default function HomePage() {
  return (
    // Main container with gradient background
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header - sticky navigation bar at the top */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo section on the left */}
          <div className="flex items-center gap-2">
            {/* Brain icon for the logo */}
            <Brain className="h-6 w-6 text-primary" />
            {/* Application name */}
            <span className="text-xl font-bold">AI Tutor</span>
          </div>
          {/* Navigation buttons on the right */}
          <div className="flex items-center gap-4">
            {/* Login button - ghost variant (transparent) */}
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            {/* Sign up button - primary variant */}
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1">
        {/* Hero section with headline and features */}
        <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center">
          {/* Hero content */}
          <div className="flex flex-col items-center gap-4 max-w-3xl">
            {/* Main headline - large bold text */}
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Learn Smarter with AI-Powered Study Assistance
            </h1>
            {/* Subheading - explanation of the product */}
            <p className="text-xl text-muted-foreground text-balance max-w-2xl">
              Upload your study materials and chat with an AI tutor that understands your documents. Get instant
              answers, explanations, and study help.
            </p>
            {/* Call-to-action buttons */}
            <div className="flex gap-4 mt-4">
              {/* Primary CTA - Start Learning */}
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Start Learning Free</Link>
              </Button>
              {/* Secondary CTA - Sign In */}
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Feature cards grid - 4 columns on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full max-w-5xl">
            {/* Feature 1: Upload PDFs */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Upload PDFs</h3>
              <p className="text-sm text-muted-foreground text-center">
                Upload your study materials, textbooks, and notes
              </p>
            </div>

            {/* Feature 2: View Documents */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">View Documents</h3>
              <p className="text-sm text-muted-foreground text-center">Read your PDFs with an intuitive viewer</p>
            </div>

            {/* Feature 3: Ask Questions */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Ask Questions</h3>
              <p className="text-sm text-muted-foreground text-center">Chat with AI about your study materials</p>
            </div>

            {/* Feature 4: Get Answers */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Get Answers</h3>
              <p className="text-sm text-muted-foreground text-center">Receive instant, context-aware explanations</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer section */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          {/* Footer text describing the tech stack */}
          <p className="text-sm text-muted-foreground">Built with Next.js, Supabase, and OpenAI</p>
        </div>
      </footer>
    </div>
  )
}
