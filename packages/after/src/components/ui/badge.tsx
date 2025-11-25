import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center font-[var(--font-weight-bold)] font-[var(--font-family-primary)] leading-[var(--line-height-tight)] whitespace-nowrap rounded-sm",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-badge-primary)] text-white",
        secondary: "bg-[var(--color-badge-secondary)] text-white",
        success: "bg-[var(--color-badge-success)] text-white",
        danger: "bg-[var(--color-badge-danger)] text-white",
        warning: "bg-[var(--color-badge-warning)] text-white",
        info: "bg-[var(--color-badge-info)] text-white",
      },
      size: {
        small: "h-[var(--badge-height-small)] px-[4px] text-[var(--font-size-xs)]",
        medium: "h-[var(--badge-height-medium)] px-[8px] text-[var(--font-size-sm)]",
        large: "h-[var(--badge-height-large)] px-[10px] text-[var(--font-size-base)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  pill?: boolean
}

function Badge({ className, variant, size, pill, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), pill && "rounded-[var(--radius-xl)]", className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

