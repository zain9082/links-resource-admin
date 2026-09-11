import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  error?: string;
  dirty?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  error,
  dirty,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--color-foreground)]">{label}</label>
        {dirty ? <span className="h-2 w-2 rounded-full bg-orange-400" /> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-red-500 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
