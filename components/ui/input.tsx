// Input field component for text and file input
// Provides styled input element with support for file uploads and various input types
// Includes focus states, disabled states, validation states, and dark mode support

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input component - flexible form input field
 * Supports all standard HTML input types
 * Includes built-in styling for focus, disabled, and error states
 * Has special file input styling with accessible file picker appearance
 * @param {React.ComponentProps<'input'>} props - Standard HTML input attributes
 * @param {string} [props.type='text'] - HTML input type (text, email, password, file, etc.)
 * @returns {React.ReactElement} Styled input element
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
