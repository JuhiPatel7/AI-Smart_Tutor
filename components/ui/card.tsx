// Card component system for layout and content organization
// Provides composable card structure with header, title, description, content, action, and footer sections
// All components are div-based with flexible styling through Tailwind CSS and class composition

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Root Card component - main container for card content
 * Provides card background, border, shadow, and gap between sections
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card container
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

/**
 * CardHeader component - header section of the card
 * Uses CSS container queries for responsive behavior
 * Supports grid layout with automatic row sizing
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card header container
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

/**
 * CardTitle component - display prominent title within the card
 * Typically placed in CardHeader for consistent layout
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card title
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

/**
 * CardDescription component - display secondary text or descriptive content
 * Typically used in CardHeader for supplementary information
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card description text
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/**
 * CardAction component - action container positioned in the header
 * Auto-positions to top-right via grid layout in CardHeader
 * Ideal for action buttons or icons
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card action container
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

/**
 * CardContent component - main content area of the card
 * Provides standard horizontal padding
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card content container
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

/**
 * CardFooter component - footer section at the bottom of the card
 * Typically used for actions, buttons, or additional information
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled card footer container
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
