// Mark this component as a Client Component
// Necessary for next-themes which requires browser APIs like localStorage
'use client'

// Import React namespace for type definitions
import * as React from 'react'

// Import ThemeProvider from next-themes library for dark mode support
// ThemeProviderProps is the type definition for the component props
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * ThemeProvider Component
 * Wraps the next-themes ThemeProvider to provide dark mode and theme switching
 * This component enables system theme detection and manual theme switching
 * 
 * @param children - React components to be wrapped with theme provider
 * @param props - Additional configuration props passed to NextThemesProvider
 * @returns JSX element providing theme context to the application
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Render the NextThemesProvider component from next-themes
  // It enables theme switching capabilities throughout the app
  return <NextThemesProvider {...props}>
    {children}
  </NextThemesProvider>
}
