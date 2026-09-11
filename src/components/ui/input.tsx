import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30",
        className
      )}
      {...props}
    />
  );
});
