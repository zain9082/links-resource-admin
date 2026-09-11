"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { Download } from "lucide-react";
import { ActivityItem } from "@/components/admin/ui/ActivityItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ActivityRow = {
  id: string;
  action: string;
  entity: string;
  detail: string | null;
  createdAt: Date;
  admin: { id: string; name: string | null; email: string };
};

export function ActivityLogClient({ rows }: { rows: ActivityRow[] }) {
  const [entityFilter, setEntityFilter] = useState("");
  const [adminFilter, setAdminFilter] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (entityFilter && !row.entity.toLowerCase().includes(entityFilter.toLowerCase())) {
          return false;
        }
        if (adminFilter) {
          const key = `${row.admin.name ?? ""} ${row.admin.email}`.toLowerCase();
          if (!key.includes(adminFilter.toLowerCase())) return false;
        }
        return true;
      }),
    [rows, adminFilter, entityFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Filter by entity"
          value={entityFilter}
          onChange={(event) => setEntityFilter(event.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by admin"
          value={adminFilter}
          onChange={(event) => setAdminFilter(event.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="secondary"
          onClick={() => {
            const escapeCsv = (value: string) =>
              /^[=+\-@]/.test(value) ? `'${value}` : value;
            const csv = Papa.unparse(
              filtered.map((row) => ({
                timestamp: row.createdAt.toISOString(),
                admin: escapeCsv(row.admin.name ?? row.admin.email),
                action: escapeCsv(row.action),
                entity: escapeCsv(row.entity),
                detail: escapeCsv(row.detail ?? ""),
              }))
            );
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "activity-log.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="space-y-2">
        {filtered.map((entry) => (
          <ActivityItem
            key={entry.id}
            action={entry.action}
            entity={entry.entity}
            detail={entry.detail}
            createdAt={entry.createdAt}
            adminName={entry.admin.name ?? entry.admin.email}
          />
        ))}
        {filtered.length === 0 ? (
          <div className="admin-empty-state rounded-xl border-dashed p-6 text-sm text-[var(--color-muted)]">
            No activity entries match current filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}
