import { formatDate } from "@/lib/utils";

type ActivityItemProps = {
  action: string;
  entity: string;
  detail?: string | null;
  createdAt: Date;
  adminName?: string | null;
};

const COLOR: Record<string, string> = {
  CREATED: "bg-emerald-400",
  UPDATED: "bg-blue-400",
  DELETED: "bg-red-400",
  APPROVED: "bg-emerald-400",
  REJECTED: "bg-red-400",
};

export function ActivityItem({
  action,
  entity,
  detail,
  createdAt,
  adminName,
}: ActivityItemProps) {
  return (
    <div className="flex gap-3 admin-panel p-3">
      <div className="mt-1">
        <span
          className={`block h-2.5 w-2.5 rounded-full ${COLOR[action] ?? "bg-slate-400"}`}
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[var(--color-foreground)]">
          <span className="font-medium">{action}</span> {entity}
        </p>
        {detail ? <p className="text-xs text-[var(--color-muted)]">{detail}</p> : null}
        <p className="text-xs text-[var(--color-muted)]">
          {formatDate(createdAt)} {adminName ? `by ${adminName}` : ""}
        </p>
      </div>
    </div>
  );
}
