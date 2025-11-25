import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
      aria-hidden="true"
    />
  </div>
))
NativeSelect.displayName = "NativeSelect"

const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  React.ComponentProps<"option">
>(({ className, children, ...props }, ref) => (
  <option
    className={cn("", className)}
    ref={ref}
    {...props}
  >
    {children}
  </option>
))
NativeSelectOption.displayName = "NativeSelectOption"

const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  React.ComponentProps<"optgroup">
>(({ className, children, ...props }, ref) => (
  <optgroup
    className={cn("", className)}
    ref={ref}
    {...props}
  >
    {children}
  </optgroup>
))
NativeSelectOptGroup.displayName = "NativeSelectOptGroup"

export {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
}

