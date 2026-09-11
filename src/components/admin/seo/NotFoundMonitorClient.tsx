"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createRedirectFromNotFound,
  markNotFoundGone,
  markNotFoundResolved,
} from "@/app/actions/seo";
import { FormField } from "@/components/admin/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NotFoundRow = {
  id: string;
  path: string;
  hitCount: number;
  referrer: string | null;
  firstSeen: string;
  lastSeen: string;
  resolved: boolean;
};

export function NotFoundMonitorClient({ logs }: { logs: NotFoundRow[] }) {
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(logs);
  const [destinations, setDestinations] = useState<Record<string, string>>({});

  function removeRow(path: string) {
    setRows((prev) => prev.filter((row) => row.path !== path));
  }

  function createRedirect(path: string) {
    const destination = destinations[path]?.trim() ?? "";
    if (!destination) {
      toast.error("Enter a destination path first");
      return;
    }
    startTransition(async () => {
      const result = await createRedirectFromNotFound(path, destination, 301);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`Redirect created for ${path}`);
      removeRow(path);
    });
  }

  function markGone(path: string) {
    startTransition(async () => {
      const result = await markNotFoundGone(path);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`${path} marked as gone (410)`);
      removeRow(path);
    });
  }

  function markResolved(path: string) {
    startTransition(async () => {
      const result = await markNotFoundResolved(path);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`${path} marked resolved`);
      removeRow(path);
    });
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="admin-panel space-y-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mono text-sm text-[var(--color-foreground)]">{row.path}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {row.hitCount} hits · first {new Date(row.firstSeen).toLocaleString()} ·
                last {new Date(row.lastSeen).toLocaleString()}
                {row.referrer ? ` · referrer ${row.referrer}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={pending}
                onClick={() => createRedirect(row.path)}
              >
                Create redirect
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={pending}
                onClick={() => markGone(row.path)}
              >
                Mark 410
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => markResolved(row.path)}
              >
                Mark resolved
              </Button>
            </div>
          </div>
          <FormField label="Redirect destination">
            <Input
              value={destinations[row.path] ?? ""}
              onChange={(event) =>
                setDestinations((prev) => ({
                  ...prev,
                  [row.path]: event.target.value,
                }))
              }
              placeholder="/new-path"
            />
          </FormField>
        </div>
      ))}
      {rows.length === 0 ? (
        <div className="admin-empty-state rounded-xl border-dashed p-6 text-sm text-[var(--color-muted)]">
          No unresolved 404 paths right now.
        </div>
      ) : null}
    </div>
  );
}
