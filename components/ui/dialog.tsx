// Dialog modal component system from Radix UI
// Client-side component for managing modal dialogs
// Provides composable dialog structure with trigger, content, overlay, title, and close components

'use client'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Root Dialog component - manages dialog state
 * @param {React.ComponentProps<typeof DialogPrimitive.Root>} props - Radix UI Dialog.Root props
 * @returns {React.ReactElement} Dialog root wrapper
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Dialog trigger component - button or element that opens the dialog
 * @param {React.ComponentProps<typeof DialogPrimitive.Trigger>} props - Radix UI Dialog.Trigger props
 * @returns {React.ReactElement} Dialog trigger element
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Dialog portal component - renders dialog content outside DOM hierarchy
 * @param {React.ComponentProps<typeof DialogPrimitive.Portal>} props - Radix UI Dialog.Portal props
 * @returns {React.ReactElement} Dialog portal wrapper
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Dialog close component - button or trigger to close the dialog
 * @param {React.ComponentProps<typeof DialogPrimitive.Close>} props - Radix UI Dialog.Close props
 * @returns {React.ReactElement} Dialog close element
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Dialog overlay component - semi-transparent backdrop behind dialog
 * @param {React.ComponentProps<typeof DialogPrimitive.Overlay>} props - Radix UI Dialog.Overlay props
 * @returns {React.ReactElement} Styled dialog overlay
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Dialog content component - main content container
 * Includes optional close button and handles overlay
 * @param {React.ComponentProps<typeof DialogPrimitive.Content> & {showCloseButton?: boolean}} props
 * @param {boolean} [props.showCloseButton=true] - Show close button in top-right
 * @returns {React.ReactElement} Complete dialog with content
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Dialog header component - top section for title and description
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled dialog header
 */
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

/**
 * Dialog footer component - bottom section typically for action buttons
 * @param {React.ComponentProps<'div'>} props - Standard div HTML attributes
 * @returns {React.ReactElement} Styled dialog footer
 */
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Dialog title component - prominent heading for dialog
 * @param {React.ComponentProps<typeof DialogPrimitive.Title>} props - Radix UI Dialog.Title props
 * @returns {React.ReactElement} Styled dialog title
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

/**
 * Dialog description component - secondary text in dialog
 * @param {React.ComponentProps<typeof DialogPrimitive.Description>} props - Radix UI Dialog.Description props
 * @returns {React.ReactElement} Styled dialog description
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
