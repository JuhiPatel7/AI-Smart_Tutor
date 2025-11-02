// Toast notification component from Sonner
// Client-side wrapper for Sonner toast notifications
// Integrates with next-themes for theme-aware styling
// Configures toast appearance using CSS variables for theme colors

'use client'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

/**
 * Toaster component - displays toast notifications
 * Uses next-themes to get current theme (light/dark/system)
 * Applies theme-specific CSS variables for consistent styling
 * @param {ToasterProps} props - Sonner Toaster configuration props
 * @returns {React.ReactElement} Configured toast notification container
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
