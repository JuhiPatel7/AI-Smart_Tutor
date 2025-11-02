// Label component from Radix UI
// Client-side form label for associating text with form inputs
// Includes accessibility features and support for disabled state styling

'use client'
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

/**
 * Label component - accessible form label
 * Associates with form inputs via htmlFor attribute
 * Supports disabled state styling via peer-disabled or group-data attributes
 * @param {React.ComponentProps<typeof LabelPrimitive.Root>} props - Radix UI Label.Root props
 * @returns {React.ReactElement} Styled accessible label element
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
