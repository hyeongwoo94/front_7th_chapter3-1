import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-normal border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-white border-[var(--color-primary-border)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-border)] focus-visible:ring-[var(--color-primary)]",
        secondary:
          "bg-[var(--color-secondary)] text-[var(--color-secondary-text)] border-[var(--color-secondary-border)] hover:bg-[var(--color-secondary-hover)] hover:border-[var(--color-secondary-border)] focus-visible:ring-[var(--color-primary)]",
        danger:
          "bg-[var(--color-danger)] text-white border-[var(--color-danger-border)] hover:bg-[var(--color-danger-hover)] hover:border-[var(--color-danger-border)] focus-visible:ring-[var(--color-danger)]",
        success:
          "bg-[var(--color-success)] text-white border-[var(--color-success-border)] hover:bg-[var(--color-success-hover)] hover:border-[var(--color-success-border)] focus-visible:ring-[var(--color-success)]",
      },
      size: {
        default: "h-10",
        sm: "h-9 rounded-sm",
        lg: "h-11 rounded-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "default",
      asChild = false,
      style,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // 디자인 토큰의 button padding 값 적용
    const paddingMap: Record<string, string | undefined> = {
      sm: "var(--button-padding-sm)",
      default: "var(--button-padding-md)",
      lg: "var(--button-padding-lg)",
      icon: undefined,
    };

    const paddingStyle =
      size && paddingMap[size]
        ? { padding: paddingMap[size], ...style }
        : style;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full"
        )}
        style={paddingStyle}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
