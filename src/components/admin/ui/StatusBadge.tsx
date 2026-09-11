import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300",
  DRAFT: "bg-[var(--color-accent-soft)] text-[var(--color-muted)] border-[var(--color-border)]",
  PENDING: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300",
  APPROVED: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300",
  REJECTED: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-300",
  NEW: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-300",
  READ: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
  ARCHIVED: "bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-slate-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-[var(--color-accent-soft)] text-[var(--color-muted)] border-[var(--color-border)]"
      )}
    >
      {status}
    </span>
  );
}
