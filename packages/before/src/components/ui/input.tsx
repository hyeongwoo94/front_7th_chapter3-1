import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-[10px] py-[8px] text-[var(--font-size-md)] font-[var(--font-family-primary)] text-[var(--color-text-primary)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-secondary)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

