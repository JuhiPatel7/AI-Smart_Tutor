// Import clsx utility for conditional CSS class composition
// ClassValue type ensures type safety for className combinations
import { clsx, type ClassValue } from 'clsx'
// Import twMerge to intelligently merge Tailwind CSS classes
// Resolves conflicts when classes have conflicting utilities
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to combine and merge CSS class names
 * This combines clsx for conditional classes with twMerge for Tailwind CSS conflict resolution
 * 
 * Example usage:
 * cn('px-2 py-1', 'px-4') => 'py-1 px-4' (px-4 wins over px-2 due to twMerge)
 * cn('text-red-500', isActive && 'bg-blue-500') => combines both classes correctly
 * 
 * @param inputs - Variable number of class names (strings, arrays, objects)
 * @returns Merged and deduplicated CSS class string
 */
export function cn(...inputs: ClassValue[]) {
  // First use clsx to combine all inputs into a single class string
  // Then use twMerge to resolve any Tailwind CSS class conflicts
  // Returns the final optimized class string
  return twMerge(clsx(inputs))
}
