import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[6em] w-full rounded-md border border-[var(--color-border-input)] bg-[var(--color-bg-primary)] px-[14px] py-[16.5px] text-[var(--font-size-xl)] font-[var(--font-family-secondary)] font-[var(--font-weight-normal)] leading-[var(--line-height-textarea)] text-[var(--color-text-muted)] ring-offset-background placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:border-[var(--color-primary)] focus-visible:border-2 focus-visible:px-[13px] focus-visible:py-[15.5px] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-disabled)] resize-y transition-[var(--transition-normal)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

