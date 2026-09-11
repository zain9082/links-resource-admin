"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteCategory,
  deleteTag,
  upsertCategory,
  upsertTag,
} from "@/app/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  gradient?: string;
  _count: { resources: number };
};

type TagRow = {
  id: string;
  name: string;
  slug: string;
  _count: { resources: number };
};

export function CategoryTable({ rows }: { rows: CategoryRow[] }) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Add category name" />
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await upsertCategory({ name });
              if ("error" in result) {
                toast.error(`✗ Failed to add category: ${result.error}`);
                return;
              }
              toast.success("✓ Category added");
              setName("");
            })
          }
        >
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between admin-panel p-3">
            <div>
              <p className="text-sm text-[var(--color-foreground)]">{row.name}</p>
              <p className="text-xs text-[var(--color-muted)]">{row.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-[var(--color-muted)]">{row._count.resources} resources</p>
              <button
                type="button"
                className="text-xs text-red-300 disabled:opacity-50"
                disabled={row._count.resources > 0}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteCategory(row.id);
                    if ("error" in result) {
                      toast.error(`✗ Failed to delete category: ${result.error}`);
                      return;
                    }
                    toast.success("✓ Category deleted");
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TagTable({ rows }: { rows: TagRow[] }) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Add tag name" />
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await upsertTag({ name });
              if ("error" in result) {
                toast.error(`✗ Failed to add tag: ${result.error}`);
                return;
              }
              toast.success("✓ Tag added");
              setName("");
            })
          }
        >
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between admin-panel p-3">
            <div>
              <p className="text-sm text-[var(--color-foreground)]">{row.name}</p>
              <p className="text-xs text-[var(--color-muted)]">{row.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-[var(--color-muted)]">{row._count.resources} resources</p>
              <button
                type="button"
                className="text-xs text-red-300 disabled:opacity-50"
                disabled={row._count.resources > 0}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteTag(row.id);
                    if ("error" in result) {
                      toast.error(`✗ Failed to delete tag: ${result.error}`);
                      return;
                    }
                    toast.success("✓ Tag deleted");
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
