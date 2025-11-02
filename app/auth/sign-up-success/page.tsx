// Import Card components for page layout
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// Import Link component for navigation
import Link from "next/link"
// Import Button component for user actions
import { Button } from "@/components/ui/button"

/**
 * SignUpSuccessPage Component - Confirmation page after successful registration
 * Displays a message instructing the user to confirm their email address
 * and provides a link to return to the login page
 * 
 * @returns JSX element with success confirmation UI
 */
export default function SignUpSuccessPage() {
  return (
    // Main container - full viewport height with gradient background
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Card wrapper - limits max width for better UX */}
      <div className="w-full max-w-sm">
        {/* Flex column container for content spacing */}
        <div className="flex flex-col gap-6">
          {/* Card component - displays success message */}
          <Card>
            {/* Card header with title and description */}
            <CardHeader>
              {/* Main heading - instructs user to check email */}
              <CardTitle className="text-2xl">
                Check your email
              </CardTitle>
              {/* Subtitle describing the next step */}
              <CardDescription>
                Confirm your account to continue
              </CardDescription>
            </CardHeader>

            {/* Card body content */}
            <CardContent className="space-y-4">
              {/* Detailed instruction text for user */}
              <p className="text-sm text-muted-foreground">
                We've sent you an email with a confirmation link. Please check your inbox and click the link to
                activate your account.
              </p>
              {/* Button linking back to login page */}
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
