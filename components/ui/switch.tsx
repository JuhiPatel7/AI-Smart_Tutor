// Toggle switch component for boolean state management
// Accessible checkbox-like UI element using button role
// Supports theme-based styling with primary and muted colors
// Provides smooth animation transitions for toggle state

"use client"
import { cn } from "@/lib/utils"

/**
 * Props for the Switch component
 * @interface SwitchProps
 * @property {string} [id] - Optional HTML id for accessibility and label association
 * @property {boolean} checked - Current state of the switch
 * @property {(checked: boolean) => void} onCheckedChange - Callback fired when toggle state changes
 * @property {string} [className] - Optional CSS classes for customization
 */
interface SwitchProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

/**
 * Switch component - accessible toggle button
 * Renders as a button with switch role and ARIA attributes
 * Animated track and indicator with smooth transitions
 * Colors change based on checked state (primary when on, muted when off)
 * @param {SwitchProps} props - Switch component props
 * @returns {React.ReactElement} Accessible switch toggle component
 */
export function Switch({ id, checked, onCheckedChange, className }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
        className,
      )}
    >
      {/* Toggle indicator - slides horizontally based on state */}
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  )
}
