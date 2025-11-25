import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-sm border p-[12px] pr-[10px] mb-4 font-[var(--font-family-primary)] flex gap-2 items-start",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-alert-default-bg)] border-[var(--color-alert-default-border)] text-[var(--color-alert-default-text)]",
        info: "bg-[var(--color-info-bg)] border-[var(--color-info-border)] text-[var(--color-info-text)]",
        success: "bg-[var(--color-alert-success-bg)] border-[var(--color-alert-success-border)] text-[var(--color-alert-success-text)]",
        warning: "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning-text)]",
        error: "bg-[var(--color-alert-error-bg)] border-[var(--color-alert-error-border)] text-[var(--color-alert-error-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-[var(--font-weight-bold)] text-[var(--font-size-lg)]", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[var(--font-size-md)] leading-[var(--line-height-relaxed)] flex-1", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[20px] flex-shrink-0", className)}
    {...props}
  />
))
AlertIcon.displayName = "AlertIcon"

const AlertClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-0 top-0 bg-transparent border-none cursor-pointer text-[20px] p-1 ml-auto flex-shrink-0",
      className
    )}
    {...props}
  />
))
AlertClose.displayName = "AlertClose"

export { Alert, AlertTitle, AlertDescription, AlertIcon, AlertClose }

