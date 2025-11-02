// Import UI components from the Card component library
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// Import Link component from Next.js for client-side navigation
import Link from "next/link"
// Import Button UI component
import { Button } from "@/components/ui/button"

/**
 * Error Page Component - Displays error messages to users
 * This is an async Server Component that handles authentication errors
 * It receives error information via search parameters
 * 
 * @param searchParams - Promise containing query parameters including the error message
 * @returns JSX element displaying the error page UI
 */
export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{
    error: string
  }>
}) {
  // Await the searchParams promise to extract the error message
  const params = await searchParams

  return (
    // Main container - full viewport height with centered content
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Card container wrapper - limits max width for better UX */}
      <div className="w-full max-w-sm">
        {/* Flex column for spacing between card and other elements */}
        <div className="flex flex-col gap-6">
          {/* Card component to display the error message */}
          <Card>
            {/* Card header section */}
            <CardHeader>
              {/* Card title - displays primary error text */}
              <CardTitle className="text-2xl">
                Sorry, something went wrong
              </CardTitle>
            </CardHeader>
            {/* Card body content */}
            <CardContent className="space-y-4">
              {/* Conditional rendering: displays specific error or generic message */}
              {params?.error ? (
                // Display the specific error message from query params
                <p className="text-sm text-muted-foreground">
                  Error: {params.error}
                </p>
              ) : (
                // Display generic error message if no specific error provided
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
              {/* Button component as Link - navigates back to login page */}
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Back to Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
