// Import React type definitions for type safety
import type React from "react"
// Import Metadata type from Next.js for SEO and page metadata
import type { Metadata } from "next"
// Import custom Google fonts - Geist for general UI and Geist Mono for code
import { Geist, Geist_Mono } from "next/font/google"
// Import Analytics component from Vercel for tracking page views and events
import { Analytics } from "@vercel/analytics/next"
// Import Toaster component from Sonner library for toast notifications
import { Toaster } from "@/components/ui/sonner"
// Import global CSS file with theme variables and base styles
import "./globals.css"

// Initialize Geist font with Latin subset for optimal performance
const _geist = Geist({ subsets: ["latin"] })
// Initialize Geist Mono font for monospaced text (code, etc.)
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Export metadata object for SEO and browser tab information
// This metadata is used by Next.js to generate HTML head tags
export const metadata: Metadata = {
  // Page title shown in browser tab and search results
  title: "AI Tutor - Learn Smarter",
  // Page description for search engine results and social sharing
  description: "AI-powered study assistant for your documents",
  // Tool used to generate this component (v0)
  generator: "v0.app",
}

/**
 * RootLayout Component
 * This is the main layout wrapper for the entire application
 * All pages and routes will be rendered within the children prop
 * @param children - React nodes to render inside the layout
 * @returns JSX element wrapping the entire application
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Head is implicitly included - metadata is applied here by Next.js */}
      <body className={`font-sans antialiased`}>
        {/* Render child pages and components */}
        {children}
        {/* Toaster component enables toast notifications throughout the app */}
        <Toaster />
        {/* Analytics component tracks user interactions and page views */}
        <Analytics />
      </body>
    </html>
  )
}
